import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@nyvora/database';
import { CreateCampaignDto, StartCampaignDto, UpdateCampaignDto, RecipientDto } from './dto/campaign.dto';

export const CAMPAIGN_QUEUE = 'campaigns';
const MIN_DELAY_MS = 4000;

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(CAMPAIGN_QUEUE) private readonly queue: Queue,
  ) {}

  async create(organizationId: string, dto: CreateCampaignDto) {
    const delayMs = Math.max(MIN_DELAY_MS, dto.delayMs ?? 5000);
    return this.prisma.marketingCampaign.create({
      data: {
        organizationId,
        name: dto.name,
        type: dto.type || dto.channel,
        channel: dto.channel,
        provider: dto.provider,
        subject: dto.subject,
        body: dto.body,
        delayMs,
        status: 'draft',
      },
    });
  }

  async findAll(organizationId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.marketingCampaign.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.marketingCampaign.count({ where: { organizationId } }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(organizationId: string, id: string) {
    const campaign = await this.prisma.marketingCampaign.findFirst({
      where: { id, organizationId },
    });
    if (!campaign) throw new NotFoundException('Campana no encontrada');
    const messages = await this.prisma.campaignMessage.findMany({
      where: { campaignId: id },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
    return { ...campaign, messages };
  }

  async update(organizationId: string, id: string, dto: UpdateCampaignDto) {
    await this.assertExists(organizationId, id);
    const data: any = { ...dto };
    if (dto.delayMs !== undefined) data.delayMs = Math.max(MIN_DELAY_MS, dto.delayMs);
    return this.prisma.marketingCampaign.update({ where: { id }, data });
  }

  async remove(organizationId: string, id: string) {
    const campaign = await this.assertExists(organizationId, id);
    if (campaign.status === 'sending') {
      throw new BadRequestException('No se puede eliminar una campana en envio');
    }
    await this.prisma.marketingCampaign.delete({ where: { id } });
    return { ok: true };
  }

  private async assertExists(organizationId: string, id: string) {
    const campaign = await this.prisma.marketingCampaign.findFirst({ where: { id, organizationId } });
    if (!campaign) throw new NotFoundException('Campana no encontrada');
    return campaign;
  }

  private async buildRecipientsFromCrm(organizationId: string, channel: string): Promise<RecipientDto[]> {
    const contacts = await this.prisma.crmContact.findMany({
      where: { organizationId },
      select: { firstName: true, lastName: true, email: true, phone: true },
    });
    const recipients: RecipientDto[] = [];
    for (const c of contacts) {
      const name = [c.firstName, c.lastName].filter(Boolean).join(' ').trim();
      if (channel === 'email' && c.email) recipients.push({ to: c.email, name });
      else if ((channel === 'whatsapp' || channel === 'sms') && c.phone) {
        recipients.push({ to: c.phone, name });
      }
    }
    return recipients;
  }

  async start(organizationId: string, id: string, dto: StartCampaignDto) {
    const campaign = await this.assertExists(organizationId, id);
    if (campaign.status === 'sending') {
      throw new BadRequestException('La campana ya esta en envio');
    }

    let recipients = dto.recipients?.length ? dto.recipients : await this.buildRecipientsFromCrm(organizationId, campaign.channel);

    const seen = new Set<string>();
    recipients = recipients.filter((r) => {
      const key = r.to.trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (recipients.length === 0) {
      throw new BadRequestException('No hay destinatarios validos para esta campana');
    }

    await this.prisma.campaignMessage.deleteMany({ where: { campaignId: id, status: 'pending' } });

    const created = await this.prisma.$transaction(
      recipients.map((r) =>
        this.prisma.campaignMessage.create({
          data: {
            campaignId: id,
            organizationId,
            recipient: r.to.trim(),
            name: r.name || null,
            status: 'pending',
          },
        }),
      ),
    );

    const delayMs = Math.max(MIN_DELAY_MS, campaign.delayMs);
    await this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        status: 'sending',
        totalCount: created.length,
        sentCount: 0,
        failedCount: 0,
        error: null,
        startedAt: new Date(),
        completedAt: null,
      },
    });

    await Promise.all(
      created.map((msg, index) =>
        this.queue.add(
          'send',
          {
            messageId: msg.id,
            campaignId: id,
            organizationId,
            channel: campaign.channel,
            provider: campaign.provider,
            subject: campaign.subject,
            body: campaign.body,
          },
          {
            delay: index * delayMs,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: true,
            removeOnFail: 500,
          },
        ),
      ),
    );

    return {
      ok: true,
      campaignId: id,
      total: created.length,
      delayMs,
      estimatedDurationMs: created.length * delayMs,
    };
  }
}
