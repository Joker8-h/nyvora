import { Injectable, Logger } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { ReasonerService } from './reasoner.service';
import { ToolSelectorService } from './tool-selector.service';
import { ExecutorService } from './executor.service';
import { ContextBuilderService } from './context-builder.service';
import { MemoryService } from './memory.service';
import { OpenAIService } from './openai.service';

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

    if (this.openai.isConfigured) {
      try {
        const systemPrompt = `Eres Nova, el asistente e Inteligencia Artificial conversacional de Nyvora (un Business Operating System AI-First).
Tu objetivo es responder al usuario de forma CÁLIDA, NATURAL, cercana y muy útil en español, como el mejor co-piloto y gerente operativo de su empresa.

REGLAS ESTRICTAS:
- Si el usuario te saluda ("hola", "buenas", "hola nova"), salúdalo con calidez y explícale brevemente cómo puedes ayudarle (crear cotizaciones, facturas, clientes en el CRM, revisar inventario, agendar citas o instalar aplicaciones en el Marketplace).
- NUNCA muestres JSON, corchetes, llaves ni identificadores técnicos al usuario.
- Escribe en español impecable, con tono profesional y cercano (2-4 frases).
- Si ejecutaste acciones con herramientas, confirma claramente qué se logró con nombres y datos útiles.
- Si alguna herramienta falló, explícalo amablemente y ofrece sugerencias.`;

        let resultsSummary = 'No se requirieron acciones de base de datos.';
        if (toolResults.length > 0) {
          resultsSummary = toolResults
            .map((t: any) => {
              if (t.success) {
                return `Acción exitosa (${t.toolName}): ${JSON.stringify(t.result)}`;
              }
              return `Acción fallida (${t.toolName}): ${t.error}`;
            })
            .join('\n');
        }

        const userPrompt = `Mensaje del usuario: "${userMessage}"

Resultados de las acciones ejecutadas:
${resultsSummary}

Redacta la respuesta final para el usuario en lenguaje natural:`;

        return await this.openai.chat(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 600 });
      } catch (error) {
        this.logger?.error?.('Nova natural response error, usando fallback:', error);
      }
    }

    return this.fallbackResponse(userMessage, successfulTools, failedTools);
  }

  private fallbackResponse(userMessage: string, successfulTools: any[], failedTools: any[]): string {
    const parts: string[] = [];

    if (successfulTools.length > 0) {
      const labels = successfulTools
        .map((t: any) => {
          const r = t.result ?? {};
          const name = r.name || r.title || r.id || t.toolName;
          return `• ${t.toolName} (${name})`;
        })
        .join('\n');
      parts.push(`Listo, completé las siguientes acciones:\n${labels}`);
    }

    if (failedTools.length > 0) {
      const errs = failedTools.map((t: any) => `• ${t.toolName}: ${t.error}`).join('\n');
      parts.push(`No pude realizar algunas acciones:\n${errs}`);
    }

    if (parts.length === 0) {
      const msg = userMessage.toLowerCase();
      if (msg.includes('hola') || msg.includes('buen') || msg.includes('saludos') || msg.includes('nova')) {
        return '¡Hola! Soy Nova, tu asistente de Inteligencia Artificial en Nyvora. 🚀\n\nPuedo ayudarte a gestionar tu empresa: crear cotizaciones, facturas, clientes en el CRM, controlar tu inventario, agendar citas o instalar aplicaciones en el Marketplace.\n\n¿En qué te colaboro hoy?';
      }
      return `Entendido. He procesado tu mensaje: "${userMessage}". ¿Deseas que realice alguna acción específica en tu CRM, ventas, inventario, finanzas o marketplace?`;
    }

    return parts.join('\n\n');
  }
}
