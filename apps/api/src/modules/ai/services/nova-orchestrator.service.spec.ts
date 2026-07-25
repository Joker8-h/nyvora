import { Test, TestingModule } from '@nestjs/testing';
import { NovaOrchestratorService } from './nova-orchestrator.service';
import { PlannerService } from './planner.service';
import { ReasonerService } from './reasoner.service';
import { ToolSelectorService } from './tool-selector.service';
import { ExecutorService } from './executor.service';
import { ContextBuilderService } from './context-builder.service';
import { MemoryService } from './memory.service';
import { OpenAIService } from './openai.service';

describe('NovaOrchestratorService', () => {
  let service: NovaOrchestratorService;
  let planner: Record<string, any>;
  let reasoner: Record<string, any>;
  let toolSelector: Record<string, any>;
  let executor: Record<string, any>;
  let contextBuilder: Record<string, any>;
  let memory: Record<string, any>;
  let openai: Record<string, any>;

  const mockUserId = 'usr-123';
  const mockOrgId = 'org-123';

  beforeEach(async () => {
    planner = {
      plan: jest.fn().mockResolvedValue({ goal: 'Crear un nuevo proyecto de ventas' }),
    };
    reasoner = {
      reason: jest.fn().mockResolvedValue({ step: 'Ejecutar createProject con los parámetros indicados' }),
    };
    toolSelector = {
      select: jest.fn().mockResolvedValue([
        { name: 'createProject', arguments: { name: 'Proyecto Q4 2026', status: 'activo' } },
      ]),
    };
    executor = {
      execute: jest.fn().mockResolvedValue({ id: 'proj-999', name: 'Proyecto Q4 2026', status: 'activo' }),
    };
    contextBuilder = {
      build: jest.fn().mockResolvedValue({ organizationId: mockOrgId, userId: mockUserId }),
    };
    memory = {
      getHistory: jest.fn().mockResolvedValue([]),
      addMessage: jest.fn().mockResolvedValue({ id: 'msg-1' }),
    };
    openai = {
      isConfigured: false,
      chat: jest.fn().mockResolvedValue('Hola, he creado exitosamente tu proyecto Q4 2026.'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NovaOrchestratorService,
        { provide: PlannerService, useValue: planner },
        { provide: ReasonerService, useValue: reasoner },
        { provide: ToolSelectorService, useValue: toolSelector },
        { provide: ExecutorService, useValue: executor },
        { provide: ContextBuilderService, useValue: contextBuilder },
        { provide: MemoryService, useValue: memory },
        { provide: OpenAIService, useValue: openai },
      ],
    }).compile();

    service = module.get<NovaOrchestratorService>(NovaOrchestratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should stream conversation chunks and execute selected tools', async () => {
    const generator = service.chat('Crea el proyecto Q4 2026', mockUserId, 'conv-123');
    const chunks: any[] = [];

    for await (const chunk of generator) {
      chunks.push(chunk);
    }

    expect(contextBuilder.build).toHaveBeenCalledWith(mockUserId, 'conv-123');
    expect(memory.addMessage).toHaveBeenCalled();
    expect(planner.plan).toHaveBeenCalled();
    expect(reasoner.reason).toHaveBeenCalled();
    expect(toolSelector.select).toHaveBeenCalled();
    expect(executor.execute).toHaveBeenCalledWith(
      { name: 'createProject', arguments: { name: 'Proyecto Q4 2026', status: 'activo' } },
      mockUserId,
      expect.objectContaining({ organizationId: mockOrgId })
    );

    expect(chunks.some((c) => c.type === 'conversation_id')).toBe(true);
    expect(chunks.some((c) => c.type === 'tool_call' && c.name === 'createProject')).toBe(true);
    expect(chunks.some((c) => c.type === 'tool_result' && c.success === true)).toBe(true);
    expect(chunks.some((c) => c.type === 'text')).toBe(true);
  });

  it('should return natural language response when OpenAI is configured', async () => {
    openai.isConfigured = true;
    const generator = service.chat('Crea el proyecto Q4 2026', mockUserId, 'conv-123');
    const chunks: any[] = [];

    for await (const chunk of generator) {
      chunks.push(chunk);
    }

    expect(openai.chat).toHaveBeenCalled();
    const textChunk = chunks.find((c) => c.type === 'text');
    expect(textChunk.content).toBe('Hola, he creado exitosamente tu proyecto Q4 2026.');
  });
});
