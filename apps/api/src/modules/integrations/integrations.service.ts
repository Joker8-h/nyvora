import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';
import { EncryptionService } from './encryption.service';

export interface IntegrationResult {
  ok: boolean;
  provider?: string;
  data?: any;
  error?: string;
}

const SECRET_FIELDS = new Set([
  'apiKey',
  'accessToken',
  'authToken',
  'secretKey',
  'publishableKey',
  'apiToken',
  'token',
  'secret',
  'clientSecret',
  'webhookUrl',
]);

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  // ============================================
  // PER-ORG CREDENTIAL STORE (AES-256-GCM at rest)
  // ============================================
  private buildMeta(data: Record<string, any>): Record<string, string> {
    const masked: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null || value === '') continue;
      const str = String(value);
      masked[key] = SECRET_FIELDS.has(key) ? this.encryption.mask(str) : str;
    }
    return masked;
  }

  async listCredentials(organizationId: string) {
    const creds = await this.prisma.integrationCredential.findMany({
      where: { organizationId },
      orderBy: { provider: 'asc' },
    });
    return creds.map((c) => ({
      id: c.id,
      provider: c.provider,
      isActive: c.isActive,
      fields: c.meta as Record<string, string>,
      lastTestedAt: c.lastTestedAt,
      lastTestOk: c.lastTestOk,
      updatedAt: c.updatedAt,
    }));
  }

  async getCredential(organizationId: string, provider: string): Promise<Record<string, any> | null> {
    const cred = await this.prisma.integrationCredential.findUnique({
      where: { organizationId_provider: { organizationId, provider } },
    });
    if (!cred || !cred.isActive) return null;
    try {
      return this.encryption.decryptObject(cred.data);
    } catch (e) {
      this.logger.error(`No se pudo descifrar credencial ${provider} de org ${organizationId}`);
      return null;
    }
  }

  async upsertCredential(organizationId: string, provider: string, data: Record<string, any>) {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    const encrypted = this.encryption.encryptObject(clean);
    const meta = this.buildMeta(clean);
    const cred = await this.prisma.integrationCredential.upsert({
      where: { organizationId_provider: { organizationId, provider } },
      create: { organizationId, provider, data: encrypted, meta, isActive: true },
      update: { data: encrypted, meta, isActive: true },
    });
    return { id: cred.id, provider: cred.provider, fields: meta, isActive: cred.isActive };
  }

  async deleteCredential(organizationId: string, provider: string) {
    const existing = await this.prisma.integrationCredential.findUnique({
      where: { organizationId_provider: { organizationId, provider } },
    });
    if (!existing) throw new NotFoundException('Credencial no encontrada');
    await this.prisma.integrationCredential.delete({ where: { id: existing.id } });
    return { ok: true };
  }

  async testCredential(organizationId: string, provider: string): Promise<IntegrationResult> {
    const creds = await this.getCredential(organizationId, provider);
    if (!creds) return { ok: false, provider, error: 'No hay credenciales configuradas' };

    let result: IntegrationResult;
    switch (provider) {
      case 'resend':
      case 'sendgrid':
        result = await this.testEmail(provider, creds);
        break;
      case 'slack':
        result = await this.testSlack(creds);
        break;
      case 'twilio':
        result = await this.testTwilio(creds);
        break;
      case 'whatsapp':
        result = await this.testWhatsappCloud(creds);
        break;
      default:
        result = { ok: true, provider, data: { note: 'Credenciales guardadas (sin prueba en vivo para este proveedor)' } };
    }

    await this.prisma.integrationCredential.update({
      where: { organizationId_provider: { organizationId, provider } },
      data: { lastTestedAt: new Date(), lastTestOk: result.ok },
    });
    return result;
  }

  private async testEmail(provider: string, creds: Record<string, any>): Promise<IntegrationResult> {
    const apiKey = creds.apiKey;
    if (!apiKey) return { ok: false, provider, error: 'Falta apiKey' };
    const url = provider === 'sendgrid' ? 'https://api.sendgrid.com/v3/scopes' : 'https://api.resend.com/domains';
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) return { ok: false, provider, error: `HTTP ${res.status}` };
      return { ok: true, provider };
    } catch (e: any) {
      return { ok: false, provider, error: e?.message || 'Error de red' };
    }
  }

  private async testSlack(creds: Record<string, any>): Promise<IntegrationResult> {
    if (creds.token) {
      try {
        const res = await fetch('https://slack.com/api/auth.test', {
          method: 'POST',
          headers: { Authorization: `Bearer ${creds.token}` },
          signal: AbortSignal.timeout(15000),
        });
        const data = await res.json().catch(() => ({}));
        if (!data.ok) return { ok: false, provider: 'slack', error: data.error || `HTTP ${res.status}` };
        return { ok: true, provider: 'slack', data };
      } catch (e: any) {
        return { ok: false, provider: 'slack', error: e?.message || 'Error de red' };
      }
    }
    if (creds.webhookUrl) return { ok: true, provider: 'slack', data: { note: 'Webhook guardado' } };
    return { ok: false, provider: 'slack', error: 'Falta token o webhookUrl' };
  }

  private async testTwilio(creds: Record<string, any>): Promise<IntegrationResult> {
    const { accountSid, authToken } = creds;
    if (!accountSid || !authToken) return { ok: false, provider: 'twilio', error: 'Faltan accountSid o authToken' };
    try {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
        headers: { Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64') },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) return { ok: false, provider: 'twilio', error: `HTTP ${res.status}` };
      return { ok: true, provider: 'twilio' };
    } catch (e: any) {
      return { ok: false, provider: 'twilio', error: e?.message || 'Error de red' };
    }
  }

  private async testWhatsappCloud(creds: Record<string, any>): Promise<IntegrationResult> {
    const { accessToken, phoneNumberId } = creds;
    if (!accessToken || !phoneNumberId) {
      return { ok: false, provider: 'whatsapp', error: 'Faltan accessToken o phoneNumberId' };
    }
    try {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${phoneNumberId}?access_token=${encodeURIComponent(accessToken)}`,
        { signal: AbortSignal.timeout(15000) },
      );
      if (!res.ok) return { ok: false, provider: 'whatsapp', error: `HTTP ${res.status}` };
      return { ok: true, provider: 'whatsapp' };
    } catch (e: any) {
      return { ok: false, provider: 'whatsapp', error: e?.message || 'Error de red' };
    }
  }

  // ============================================
  // PER-ORG SENDERS (resolve stored credentials)
  // ============================================
  async sendEmailForOrg(organizationId: string, payload: { to: string; subject?: string; body?: string }) {
    const creds = (await this.getCredential(organizationId, 'resend')) || (await this.getCredential(organizationId, 'sendgrid'));
    const config = { ...(creds || {}), from: creds?.fromEmail };
    return this.sendEmail(config, payload);
  }

  async sendSlackForOrg(organizationId: string, payload: { title?: string; message?: string; channel?: string }) {
    const creds = (await this.getCredential(organizationId, 'slack')) || {};
    return this.notifySlack({ ...creds, channel: payload.channel || creds.channel }, payload);
  }

  async sendSmsForOrg(organizationId: string, payload: { to: string; body?: string }) {
    const creds = (await this.getCredential(organizationId, 'twilio')) || {};
    return this.sendSms({ ...creds, from: creds.fromNumber }, payload);
  }

  async sendWhatsappForOrg(organizationId: string, payload: { to: string; body: string }): Promise<IntegrationResult> {
    const meta = await this.getCredential(organizationId, 'whatsapp');
    if (meta?.accessToken && meta?.phoneNumberId) {
      return this.sendWhatsappCloud(meta, payload);
    }
    const twilio = await this.getCredential(organizationId, 'twilio');
    if (twilio?.accountSid && twilio?.authToken && (twilio?.whatsappFrom || twilio?.fromNumber)) {
      return this.sendSms(
        { ...twilio, from: twilio.whatsappFrom || twilio.fromNumber, whatsapp: true },
        payload,
      );
    }
    return { ok: false, provider: 'whatsapp', error: 'No hay credenciales de WhatsApp Cloud ni Twilio. Usa WhatsApp Web o configura un proveedor.' };
  }

  async sendWhatsappCloud(creds: Record<string, any>, payload: { to: string; body: string }): Promise<IntegrationResult> {
    const { accessToken, phoneNumberId } = creds;
    if (!accessToken || !phoneNumberId) {
      return { ok: false, provider: 'whatsapp', error: 'Faltan accessToken o phoneNumberId' };
    }
    const to = payload.to.replace(/[^0-9]/g, '');
    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: payload.body },
        }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, provider: 'whatsapp', error: data?.error?.message || `HTTP ${res.status}` };
      return { ok: true, provider: 'whatsapp', data: { id: data?.messages?.[0]?.id } };
    } catch (e: any) {
      return { ok: false, provider: 'whatsapp', error: e?.message || 'Error de red' };
    }
  }

  // ============================================
  // EMAIL (Resend / SendGrid)
  // ============================================
  async sendEmail(config: Record<string, any>, payload?: Record<string, any>): Promise<IntegrationResult> {
    const to = config.to || payload?.to;
    const subject = config.subject || payload?.subject || 'Notificacion de Nyvora';
    const body = config.body || payload?.body || '';
    if (!to) return { ok: false, provider: 'email', error: 'Falta el destinatario (to)' };

    const apiKey = config.apiKey || process.env.RESEND_API_KEY;
    if (!apiKey) return { ok: false, provider: 'email', error: 'RESEND_API_KEY no configurada' };

    const from = config.from || process.env.EMAIL_FROM || 'Nyvora <onboarding@resend.dev>';
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject, html: body.replace(/\n/g, '<br/>'), text: body }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, provider: 'email', error: data?.message || `HTTP ${res.status}` };
      return { ok: true, provider: 'email', data };
    } catch (e: any) {
      return { ok: false, provider: 'email', error: e?.message || 'Error de red' };
    }
  }

  // ============================================
  // SLACK (incoming webhook o bot token)
  // ============================================
  async notifySlack(config: Record<string, any>, payload?: Record<string, any>): Promise<IntegrationResult> {
    const title = config.title || payload?.title || 'Notificacion de Nyvora';
    const message = config.message || payload?.message || '';
    const text = config.text || `*${title}*\n${message}`;

    const webhook = config.webhookUrl || process.env.SLACK_WEBHOOK_URL;
    const token = config.token || process.env.SLACK_BOT_TOKEN;
    const channel = config.channel || process.env.SLACK_CHANNEL || '#general';

    try {
      if (webhook) {
        const res = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return { ok: false, provider: 'slack', error: `HTTP ${res.status}` };
        return { ok: true, provider: 'slack', data: { method: 'webhook' } };
      }

      if (token) {
        const res = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ channel, text }),
          signal: AbortSignal.timeout(15000),
        });
        const data = await res.json().catch(() => ({}));
        if (!data.ok) return { ok: false, provider: 'slack', error: data.error || `HTTP ${res.status}` };
        return { ok: true, provider: 'slack', data };
      }
    } catch (e: any) {
      return { ok: false, provider: 'slack', error: e?.message || 'Error de red' };
    }

    return { ok: false, provider: 'slack', error: 'Falta SLACK_WEBHOOK_URL o SLACK_BOT_TOKEN' };
  }

  // ============================================
  // WEBHOOK (HTTP real)
  // ============================================
  async callWebhook(config: Record<string, any>, payload?: Record<string, any>): Promise<IntegrationResult> {
    const url = config.url || config.webhookUrl;
    if (!url) return { ok: false, provider: 'webhook', error: 'Falta la URL del webhook' };
    const method = (config.method || 'POST').toUpperCase();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.authHeader) headers['Authorization'] = config.authHeader;

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: method === 'GET' ? undefined : JSON.stringify(payload || config.body || {}),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.text().catch(() => '');
      return { ok: res.ok, provider: 'webhook', data: data.slice(0, 500) };
    } catch (e: any) {
      return { ok: false, provider: 'webhook', error: e?.message || 'Error de red' };
    }
  }

  // ============================================
  // TWILIO (SMS / WhatsApp)
  // ============================================
  async sendSms(config: Record<string, any>, payload?: Record<string, any>): Promise<IntegrationResult> {
    const to = config.to || payload?.to;
    const body = config.body || payload?.body || '';
    if (!to) return { ok: false, provider: 'twilio', error: 'Falta el numero (to)' };

    const accountSid = config.accountSid || process.env.TWILIO_ACCOUNT_SID;
    const authToken = config.authToken || process.env.TWILIO_AUTH_TOKEN;
    const from = config.from || process.env.TWILIO_FROM;
    if (!accountSid || !authToken || !from) {
      return { ok: false, provider: 'twilio', error: 'Faltan credenciales de Twilio' };
    }

    const base = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', config.whatsapp ? `whatsapp:${to}` : to);
    params.append('From', config.whatsapp ? `whatsapp:${from}` : from);
    params.append('Body', body);

    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, provider: 'twilio', error: data?.message || `HTTP ${res.status}` };
      return { ok: true, provider: 'twilio', data };
    } catch (e: any) {
      return { ok: false, provider: 'twilio', error: e?.message || 'Error de red' };
    }
  }
}
