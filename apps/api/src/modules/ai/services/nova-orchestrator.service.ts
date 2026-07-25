import { Injectable, Logger } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { ReasonerService } from './reasoner.service';
import { ToolSelectorService } from './tool-selector.service';
import { ExecutorService } from './executor.service';
import { ContextBuilderService } from './context-builder.service';
import { MemoryService } from './memory.service';
import { OpenAIService } from './openai.service';
import type { NovaMessage } from '@nyvora/types';

@Injectable()
export class NovaOrchestratorService {
  private readonly logger = new Logger(NovaOrchestratorService.name);

  constructor(
    private readonly planner: PlannerService,
    private readonly reasoner: ReasonerService,
    private readonly toolSelector: ToolSelectorService,
    private readonly executor: ExecutorService,
    private readonly contextBuilder: ContextBuilderService,
    private readonly memory: MemoryService,
    private readonly openai: OpenAIService
  ) {}

  async *chat(
    message: string,
    userId: string,
    conversationId?: string
  ): AsyncGenerator<any> {
    const convId = conversationId || `conv_${Date.now()}`;
    const context = await this.contextBuilder.build(userId, convId);
    const history = await this.memory.getHistory(convId);

    await this.memory.addMessage(
      convId,
      {
        id: `msg_${Date.now()}`,
        type: 'user',
        content: message,
        createdAt: new Date(),
      },
      { organizationId: context.organizationId, userId },
    );

    yield { type: 'conversation_id', conversationId: convId };

    const plan = await this.planner.plan(message, context, history);
    const reasoning = await this.reasoner.reason(plan, context, history);
    const tools = await this.toolSelector.select(reasoning, context);

    const toolResults: any[] = [];

    let toolIndex = 0;
    for (const tool of tools) {
      const toolCallId = `tc_${Date.now()}_${toolIndex++}`;
      yield {
        type: 'tool_call',
        id: toolCallId,
        name: tool.name,
        arguments: tool.arguments,
      };

      try {
        const result = await this.executor.execute(tool, userId, context);
        toolResults.push({ toolName: tool.name, result, success: true });

        yield {
          type: 'tool_result',
          toolCallId,
          success: true,
          result,
        };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        toolResults.push({
          toolName: tool.name,
          error: message,
          success: false,
        });

        yield {
          type: 'tool_result',
          toolCallId,
          success: false,
          error: message,
        };
      }
    }

    const response = await this.generateResponse(
      message,
      plan,
      reasoning,
      toolResults,
      context
    );

    await this.memory.addMessage(
      convId,
      {
        id: `msg_${Date.now() + 1}`,
        type: 'assistant',
        content: response,
        toolCalls: toolResults,
        createdAt: new Date(),
      },
      { organizationId: context.organizationId, userId },
    );

    yield { type: 'text', content: response };
  }

  private async generateResponse(
    userMessage: string,
    _plan: any,
    _reasoning: any,
    toolResults: any[],
    _context: any
  ): Promise<string> {
    const successfulTools = toolResults.filter((t: any) => t.success);
    const failedTools = toolResults.filter((t: any) => !t.success);

    if (successfulTools.length === 0 && failedTools.length === 0) {
      return 'He procesado tu solicitud. ¿Hay algo más en lo que pueda ayudarte?';
    }

    if (this.openai.isConfigured) {
      try {
        const systemPrompt = `Eres Nova, el asistente conversacional de Nyvora (un Business Operating System AI-First).
Tu objetivo es responder al usuario de forma NATURAL, cercana y en lenguaje cotidiano, como lo haría un asistente humano competente.

REGLAS ESTRICTAS:
- NUNCA muestres JSON, corchetes, llaves ni estructuras técnicas al usuario.
- Escribe en español, de forma clara y breve (2-4 frases).
- Si ejecutaste acciones, confirma qué se hizo y da detalles útiles y legibles (nombres, cantidades, fechas) en lugar de identificadores técnicos.
- Si algo falló, explícalo con自然idad y sugiere cómo solucionarlo, sin mostrar errores crudos.
- No repitas el JSON de los resultados. Resume con palabras.`;

        const resultsSummary = toolResults
          .map((t: any) => {
            if (t.success) {
              return `Acción exitosa (${t.toolName}): ${JSON.stringify(t.result)}`;
            }
            return `Acción fallida (${t.toolName}): ${t.error}`;
          })
          .join('\n');

        const userPrompt = `Mensaje del usuario: "${userMessage}"

Resultados de las acciones ejecutadas por las herramientas (úsalo solo como base, NO lo repitas tal cual):
${resultsSummary}

Redacta la respuesta final para el usuario en lenguaje natural.`;

        return await this.openai.chat(systemPrompt, userPrompt, { temperature: 0.6, maxTokens: 500 });
      } catch (error) {
        this.logger?.error?.('Nova natural response error, usando fallback:', error);
      }
    }

    return this.fallbackResponse(successfulTools, failedTools);
  }

  private fallbackResponse(successfulTools: any[], failedTools: any[]): string {
    const parts: string[] = [];
    if (successfulTools.length > 0) {
      const labels = successfulTools
        .map((t: any) => {
          const r = t.result ?? {};
          const name = r.name || r.title || r.id || t.toolName;
          return `• ${t.toolName} (${name})`;
        })
        .join('\n');
      parts.push(`Listo, completé lo siguiente:\n${labels}`);
    }
    if (failedTools.length > 0) {
      const errs = failedTools.map((t: any) => `• ${t.toolName}: ${t.error}`).join('\n');
      parts.push(`No pude realizar algunas acciones:\n${errs}`);
    }
    if (parts.length === 0) parts.push('He procesado tu solicitud. ¿Hay algo más en lo que pueda ayudarte?');
    return parts.join('\n\n');
  }
}
