import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@nyvora/database';
import { IntegrationsService, IntegrationResult } from '../integrations/integrations.service';
import { WhatsappWebService } from '../integrations/whatsapp-web.service';
import { CAMPAIGN_QUEUE } from './campaigns.service';

interface SendJobData {
  messageId: string;
  campaignId: string;
  organizationId: string;
  channel: string;
  provider?: string | null;
  subject?: string | null;
  body: string;
}

@Processor(CAMPAIGN_QUEUE, { concurrency: 1 })
export class CampaignsProcessor extends WorkerHost {
  private readonly logger = new Logger(CampaignsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly integrations: IntegrationsService,
    private readonly whatsappWeb: WhatsappWebService,
  ) {
    super();
  }

  async process(job: Job<SendJobData>): Promise<void> {
    const { messageId, campaignId, organizationId, channel, provider, subject, body } = job.data;

    const message = await this.prisma.campaignMessage.findUnique({ where: { id: messageId } });
    if (!message || message.status === 'sent') return;

    const personalized = this.personalize(body, message.name);
    let result: IntegrationResult;

    try {
      switch (channel) {
        case 'email':
          result = await this.integrations.sendEmailForOrg(organizationId, {
            to: message.recipient,
            subject: subject || 'Notificacion de Nyvora',
            body: personalized,
          });
          break;
        case 'sms':
          result = await this.integrations.sendSmsForOrg(organizationId, {
            to: message.recipient,
            body: personalized,
          });
          break;
        case 'slack':
          result = await this.integrations.sendSlackForOrg(organizationId, {
            message: personalized,
            channel: message.recipient,
          });
          break;
        case 'whatsapp':
          if (provider === 'web') {
            const r = await this.whatsappWeb.sendMessage(organizationId, message.recipient, personalized);
            result = { ok: r.ok, provider: 'whatsapp_web', data: r.data, error: r.error };
          } else {
            result = await this.integrations.sendWhatsappForOrg(organizationId, {
              to: message.recipient,
              body: personalized,
            });
          }
          break;
        default:
          result = { ok: false, error: `Canal no soportado: ${channel}` };
      }
    } catch (e: any) {
      result = { ok: false, error: e?.message || 'Error inesperado' };
    }

    await this.finalizeMessage(campaignId, messageId, result);

    if (!result.ok) {
      throw new Error(result.error || 'Fallo el envio');
    }
  }

  private personalize(body: string, name?: string | null): string {
    const safeName = (name || '').trim();
    return body
      .replace(/\{\{\s*name\s*\}\}/gi, safeName)
      .replace(/\{\{\s*nombre\s*\}\}/gi, safeName);
  }

  private async finalizeMessage(campaignId: string, messageId: string, result: IntegrationResult) {
    const current = await this.prisma.campaignMessage.findUnique({ where: { id: messageId } });
    const wasSent = current?.status === 'sent';
    const wasFailed = current?.status === 'failed';

    await this.prisma.campaignMessage.update({
      where: { id: messageId },
      data: {
        status: result.ok ? 'sent' : 'failed',
        error: result.ok ? null : result.error?.slice(0, 500),
        providerMessageId: result.data?.id || null,
        sentAt: result.ok ? new Date() : null,
      },
    });

    const inc: any = {};
    if (result.ok && !wasSent) inc.sentCount = { increment: 1 };
    if (!result.ok && !wasFailed) inc.failedCount = { increment: 1 };
    if (wasFailed && result.ok) inc.failedCount = { decrement: 1 };

    if (Object.keys(inc).length > 0) {
      await this.prisma.marketingCampaign.update({ where: { id: campaignId }, data: inc });
    }

    await this.checkCompletion(campaignId);
  }

  private async checkCompletion(campaignId: string) {
    const pending = await this.prisma.campaignMessage.count({
      where: { campaignId, status: 'pending' },
    });
    if (pending > 0) return;

    const campaign = await this.prisma.marketingCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status === 'completed' || campaign.status === 'completed_with_errors') return;

    await this.prisma.marketingCampaign.update({
      where: { id: campaignId },
      data: {
        status: campaign.failedCount > 0 ? 'completed_with_errors' : 'completed',
        completedAt: new Date(),
        sentAt: new Date(),
      },
    });
  }
}
