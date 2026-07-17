import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

export interface WhatsappWebResult {
  ok: boolean;
  error?: string;
  data?: any;
}

@Injectable()
export class WhatsappWebService implements OnModuleDestroy {
  private readonly logger = new Logger(WhatsappWebService.name);
  private readonly clients = new Map<string, any>();
  private readonly starting = new Set<string>();

  constructor(private readonly prisma: PrismaService) {}

  private get dataPath(): string {
    return process.env.WHATSAPP_SESSION_PATH || '/app/.wwebjs_auth';
  }

  private async setSession(organizationId: string, data: Record<string, any>) {
    await this.prisma.whatsappSession.upsert({
      where: { organizationId },
      create: { organizationId, status: 'disconnected', ...data },
      update: data,
    });
  }

  async getStatus(organizationId: string) {
    const session = await this.prisma.whatsappSession.findUnique({ where: { organizationId } });
    return (
      session || {
        organizationId,
        status: 'disconnected',
        qr: null,
        phoneNumber: null,
      }
    );
  }

  async startSession(organizationId: string): Promise<WhatsappWebResult> {
    if (this.clients.has(organizationId)) {
      const status = await this.getStatus(organizationId);
      return { ok: true, data: { status: status.status } };
    }
    if (this.starting.has(organizationId)) {
      return { ok: true, data: { status: 'connecting' } };
    }

    let wweb: any;
    let qrcode: any;
    try {
      wweb = require('whatsapp-web.js');
      qrcode = require('qrcode');
    } catch (e: any) {
      this.logger.error(`whatsapp-web.js no disponible: ${e?.message}`);
      return { ok: false, error: 'WhatsApp Web no esta disponible en este entorno' };
    }

    this.starting.add(organizationId);
    await this.setSession(organizationId, { status: 'connecting', qr: null });

    try {
      const { Client, LocalAuth } = wweb;
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: organizationId, dataPath: this.dataPath }),
        puppeteer: {
          headless: true,
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        },
      });

      client.on('qr', async (qr: string) => {
        try {
          const dataUrl = await qrcode.toDataURL(qr);
          await this.setSession(organizationId, { status: 'qr', qr: dataUrl });
          this.logger.log(`QR generado para org ${organizationId}`);
        } catch (e: any) {
          this.logger.error(`Error generando QR: ${e?.message}`);
        }
      });

      client.on('ready', async () => {
        const phoneNumber = client?.info?.wid?.user || null;
        await this.setSession(organizationId, {
          status: 'connected',
          qr: null,
          phoneNumber,
          lastConnectedAt: new Date(),
        });
        this.logger.log(`WhatsApp Web conectado para org ${organizationId}`);
      });

      client.on('authenticated', async () => {
        await this.setSession(organizationId, { status: 'connecting', qr: null });
      });

      client.on('auth_failure', async (msg: string) => {
        await this.setSession(organizationId, { status: 'disconnected', qr: null });
        this.logger.warn(`Fallo de autenticacion WhatsApp org ${organizationId}: ${msg}`);
      });

      client.on('disconnected', async () => {
        this.clients.delete(organizationId);
        await this.setSession(organizationId, { status: 'disconnected', qr: null });
        this.logger.warn(`WhatsApp Web desconectado para org ${organizationId}`);
      });

      this.clients.set(organizationId, client);
      client.initialize().catch(async (e: any) => {
        this.logger.error(`Error inicializando WhatsApp Web org ${organizationId}: ${e?.message}`);
        this.clients.delete(organizationId);
        await this.setSession(organizationId, { status: 'disconnected', qr: null });
      });

      return { ok: true, data: { status: 'connecting' } };
    } catch (e: any) {
      this.clients.delete(organizationId);
      await this.setSession(organizationId, { status: 'disconnected', qr: null });
      return { ok: false, error: e?.message || 'Error iniciando WhatsApp Web' };
    } finally {
      this.starting.delete(organizationId);
    }
  }

  async logout(organizationId: string): Promise<WhatsappWebResult> {
    const client = this.clients.get(organizationId);
    if (client) {
      try {
        await client.logout();
      } catch {
        /* ignore */
      }
      try {
        await client.destroy();
      } catch {
        /* ignore */
      }
      this.clients.delete(organizationId);
    }
    await this.setSession(organizationId, { status: 'disconnected', qr: null, phoneNumber: null });
    return { ok: true };
  }

  async sendMessage(organizationId: string, to: string, body: string): Promise<WhatsappWebResult> {
    const client = this.clients.get(organizationId);
    if (!client) {
      return { ok: false, error: 'Sesion de WhatsApp Web no iniciada' };
    }
    const session = await this.getStatus(organizationId);
    if (session.status !== 'connected') {
      return { ok: false, error: `WhatsApp Web no esta conectado (estado: ${session.status})` };
    }
    const number = to.replace(/[^0-9]/g, '');
    try {
      const chatId = `${number}@c.us`;
      const sent = await client.sendMessage(chatId, body);
      return { ok: true, data: { id: sent?.id?._serialized } };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Error enviando mensaje' };
    }
  }

  isConnected(organizationId: string): boolean {
    return this.clients.has(organizationId);
  }

  async onModuleDestroy() {
    for (const [, client] of this.clients) {
      try {
        await client.destroy();
      } catch {
        /* ignore */
      }
    }
    this.clients.clear();
  }
}
