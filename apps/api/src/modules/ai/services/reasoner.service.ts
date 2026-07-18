import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReasonerService {
  private readonly logger = new Logger(ReasonerService.name);
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('OPENAI_API_KEY') || '';
    this.model = this.configService.get('OPENAI_MODEL') || 'gpt-4o';
  }

  async reason(plan: any, context: any, history: any[]): Promise<any> {
    if (!this.apiKey) {
      return this.fallbackReason(plan);
    }

    try {
      const systemPrompt = `Eres el razonador de Nexora, un Business Operating System AI-First.
Tu trabajo es evaluar el plan generado y decidir que tools usar con que parametros.

Responde SOLO con un JSON valido con esta estructura:
{
  "intent": "create|read|update|delete|analyze|schedule",
  "entities": ["entidades detectadas"],
  "parameters": { "param": "valor" },
  "confidence": 0.0-1.0,
  "requiresConfirmation": false,
  "selectedTools": [
    { "name": "tool_name", "arguments": { "arg": "value" } }
  ]
}

Tools disponibles con sus parametros:
- createCustomer: { firstName, lastName, email, phone, position }
- findCustomer: { query }
- updateCustomer: { contactId, firstName, lastName, email, phone }
- createInvoice: { contactId, items: [{description, quantity, unitPrice}], dueDate (ISO string) }
- createQuote: { contactId, items: [{description, quantity, unitPrice}], validUntil (ISO string), notes }
- findProduct: { query }
- updateProduct: { productId, name, sku, unitPrice, description }
- createEmployee: { firstName, lastName, email, departmentId, hireDate (ISO string) }
- findEmployee: { query, departmentId }
- getSalesReport: { period (week|month|quarter|year) }
- getInventoryReport: { lowStock (boolean) }
- scheduleMeeting: { title, date (ISO datetime string, ex: "2026-07-24T15:00:00"), notes }
- createTask: { projectId, title, description, assigneeId, priority (low|medium|high|urgent), dueDate (ISO string) }
- listProjects: { status (planning|active|on_hold|completed|cancelled), query }
- listTasks: { projectId, status (todo|in_progress|done|blocked), query }

REGLAS IMPORTANTES:
- Las fechas DEBEN ser strings ISO 8601 (ej: "2026-07-24T15:00:00"). NUNCA uses fechas relativas como "viernes" o "próximo lunes".
- Si el usuario dice "el viernes a las 3pm", calcula la fecha ISO exacta basándote en la fecha actual.
- Los items de facturas/cotizaciones deben tener unitPrice en centavos multiplicados por 100 (ej: $25.50 = 2550).

Plan a evaluar: ${JSON.stringify(plan)}
Contexto: Organization ID: ${context?.organizationId || 'unknown'}
Fecha y hora actual: ${new Date().toISOString()}`;

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
            { role: 'user', content: `Evalua este plan: ${JSON.stringify(plan)}` },
          ],
          temperature: 0.2,
          max_tokens: 1500,
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
      this.logger.error('Reasoner OpenAI error:', error);
    }

    return this.fallbackReason(plan);
  }

  private fallbackReason(plan: any) {
    return {
      intent: 'analyze',
      entities: [],
      parameters: {},
      confidence: 0.5,
      requiresConfirmation: false,
      selectedTools: [],
    };
  }
}
