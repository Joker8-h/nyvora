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
- createInvoice: { contactId, items: [{description, quantity, unitPrice}], dueDate }
- createQuote: { contactId, items: [{description, quantity, unitPrice}], validUntil, notes }
- findProduct: { query }
- updateProduct: { productId, name, sku, unitPrice, description }
- createEmployee: { firstName, lastName, email, departmentId, hireDate }
- findEmployee: { query, departmentId }
- getSalesReport: { period }
- getInventoryReport: { lowStock }
- scheduleMeeting: { title, date, notes }
- createTask: { projectId, title, description, assigneeId, priority, dueDate }
- listProjects: { status, query }
- listTasks: { projectId, status, query }

Plan a evaluar: ${JSON.stringify(plan)}
Contexto: Organization ID: ${context?.organizationId || 'unknown'}`;

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
