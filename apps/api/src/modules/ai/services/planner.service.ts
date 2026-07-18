import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlannerService {
  private readonly logger = new Logger(PlannerService.name);
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('OPENAI_API_KEY') || '';
    this.model = this.configService.get('OPENAI_MODEL') || 'gpt-4o';
  }

  async plan(userMessage: string, context: any, history: any[]): Promise<any> {
    if (!this.apiKey) {
      return this.fallbackPlan(userMessage);
    }

    try {
      const systemPrompt = `Eres el planificador de Nexora, un Business Operating System AI-First.
Tu trabajo es analizar la solicitud del usuario y crear un plan de accion con pasos concretos.

Responde SOLO con un JSON valido con esta estructura:
{
  "objective": "objetivo principal",
  "steps": [
    { "action": "nombre_de_la_accion", "description": "descripcion del paso", "tool": "nombre_del_tool_o_null" }
  ],
  "requiredEntities": ["entidades necesarias"],
  "estimatedComplexity": "low|medium|high"
}

Tools disponibles: createCustomer, findCustomer, updateCustomer, createInvoice, createQuote, findProduct, updateProduct, createEmployee, findEmployee, getSalesReport, getInventoryReport, scheduleMeeting, createTask

Contexto del usuario:
- Organization ID: ${context?.organizationId || 'unknown'}
- Permisos: ${context?.permissions?.join(', ') || 'none'}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-5).map((m: any) => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
            { role: 'user', content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`OpenAI HTTP ${response.status}: ${errText.slice(0, 200)}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      this.logger.error('Planner OpenAI error:', error);
    }

    return this.fallbackPlan(userMessage);
  }

  private fallbackPlan(userMessage: string) {
    return {
      objective: userMessage,
      steps: [
        { action: 'analyze', description: 'Analizar la solicitud del usuario', tool: null },
        { action: 'execute', description: 'Ejecutar las acciones necesarias', tool: null },
        { action: 'respond', description: 'Generar respuesta al usuario', tool: null },
      ],
      requiredEntities: [],
      estimatedComplexity: 'low',
    };
  }
}
