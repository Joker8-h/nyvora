import { PrismaService } from '@nyvora/database';

const API = process.env.API_URL || 'http://127.0.0.1:3005/api/v1';

function prisma() {
  return new PrismaService();
}

describe('Nova E2E', () => {
  const email = `nova-e2e-${Date.now()}@example.com`;
  const password = 'Test123!';
  let accessToken: string;
  let organizationId: string;
  let conversationId: string;
  let createdProjectId: string;
  let createdTaskId: string;

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }

  it('registers a new organization and user', async () => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName: 'Nova',
        lastName: 'Test',
        organizationName: `Nova E2E Org ${Date.now()}`,
      }),
    });
    const data = await res.json();
    expect(res.status).toBe(201);
    accessToken = data.tokens.accessToken;
    organizationId = data.organization.id;
    expect(accessToken).toBeDefined();
    expect(organizationId).toBeDefined();
  });

  it('executes createProject + createTask via tool-execute with normalized priority', async () => {
    const projRes = await fetch(`${API}/ai/tool-execute`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        name: 'createProject',
        arguments: { name: `Proyecto E2E ${Date.now()}`, status: 'activo' },
      }),
    });
    const projData = await projRes.json();
    expect(projRes.status).toBe(200);
    expect(projData.result?.id).toBeDefined();
    createdProjectId = projData.result.id;

    const taskRes = await fetch(`${API}/ai/tool-execute`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        name: 'createTask',
        arguments: {
          projectId: createdProjectId,
          title: `Tarea E2E ${Date.now()}`,
          priority: 'alta',
        },
      }),
    });
    const taskData = await taskRes.json();
    expect(taskRes.status).toBe(200);
    expect(taskData.result?.id).toBeDefined();
    createdTaskId = taskData.result.id;

    const p = prisma();
    await p.$connect();
    const task = await p.task.findUnique({ where: { id: createdTaskId } });
    await p.$disconnect();
    expect(task).toBeDefined();
    expect(task!.priority).toBe('high');
    expect(task!.projectId).toBe(createdProjectId);
  });

  it('streams a Nova chat response in natural language', async () => {
    const res = await fetch(`${API}/ai/nova/chat`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        message: 'Hola Nova, ¿puedes saludarme y decirme qué módulos tengo disponibles?',
      }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let textChunks = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line);
        if (chunk.type === 'conversation_id') conversationId = chunk.conversationId;
        if (chunk.type === 'text') textChunks += chunk.content;
      }
    }

    expect(conversationId).toBeDefined();
    expect(textChunks.length).toBeGreaterThan(10);
    expect(textChunks).not.toContain('"toolResults"');
  });

  it('persists the conversation in the database', async () => {
    const p = prisma();
    await p.$connect();
    const messages = await p.novaMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
    await p.$disconnect();

    expect(messages.length).toBeGreaterThanOrEqual(2);
    expect(messages.some((m) => m.role === 'user')).toBe(true);
    expect(messages.some((m) => m.role === 'assistant')).toBe(true);
  });

  it('lists conversations via the history endpoint', async () => {
    const res = await fetch(`${API}/ai/nova/conversations`, { headers: authHeaders() });
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some((c: any) => c.conversationId === conversationId)).toBe(true);
  });

  it('retrieves a full conversation by id', async () => {
    const res = await fetch(`${API}/ai/nova/conversations/${conversationId}`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    expect(data.conversationId).toBe(conversationId);
    expect(Array.isArray(data.messages)).toBe(true);
    expect(data.messages.length).toBeGreaterThan(0);
  });

  it('lists projects by name via chat in natural language', async () => {
    const res = await fetch(`${API}/ai/nova/chat`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ message: 'Muéstrame mis proyectos' }),
    });
    expect(res.status).toBe(200);

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let toolCalls = 0;
    let textChunks = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line);
        if (chunk.type === 'tool_call') toolCalls++;
        if (chunk.type === 'text') textChunks += chunk.content;
      }
    }

    expect(toolCalls).toBeGreaterThan(0);
    expect(textChunks.toLowerCase()).toContain('proyecto');
    expect(textChunks).not.toContain('"organizationId"');
  });

  afterAll(async () => {
    const p = prisma();
    await p.$connect();
    if (createdTaskId) await p.task.delete({ where: { id: createdTaskId } }).catch(() => {});
    if (createdProjectId) await p.project.delete({ where: { id: createdProjectId } }).catch(() => {});
    if (organizationId) await p.organization.delete({ where: { id: organizationId } }).catch(() => {});
    await p.$disconnect();
  });
});
