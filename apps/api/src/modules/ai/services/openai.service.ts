import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly apiKey: string;
  readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('OPENAI_API_KEY') || '';
    this.model = this.configService.get('OPENAI_MODEL') || 'gpt-4o';
  }

  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  async chat(
    systemPrompt: string,
    userMessage: string,
    options: {
      history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'text' | 'json_object';
    } = {},
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY no configurada');
    }

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...(options.history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const body: any = {
      model: this.model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 800,
    };
    if (options.responseFormat === 'json_object') {
      body.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25000),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`OpenAI HTTP ${response.status}: ${errText.slice(0, 200)}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      this.logger.error('OpenAI chat error:', error);
      throw error;
    }
  }
}
