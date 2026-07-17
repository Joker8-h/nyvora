import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';
import { IntegrationsService } from '../integrations/integrations.service';

@Injectable()
export class AutomationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrations: IntegrationsService,
  ) {}

  async findAutomations(organizationId: string, status?: string) {
    return this.prisma.automation.findMany({
      where: { organizationId, ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAutomationById(id: string) {
    const automation = await this.prisma.automation.findUnique({ where: { id } });
    if (!automation) throw new NotFoundException('Automatizacion no encontrada');
    return automation;
  }

  async createAutomation(data: { organizationId: string; name: string; description?: string; triggerType: string; triggerConfig: any; conditions?: any; actions: any }) {
    return this.prisma.automation.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig,
        conditions: data.conditions,
        actions: data.actions,
      },
    });
  }

  async updateAutomation(id: string, data: Record<string, any>) {
    await this.findAutomationById(id);
    return this.prisma.automation.update({ where: { id }, data });
  }

  async deleteAutomation(id: string) {
    await this.findAutomationById(id);
    return this.prisma.automation.delete({ where: { id } });
  }

  async toggleAutomation(id: string) {
    const automation = await this.findAutomationById(id);
    const newStatus = automation.status === 'active' ? 'paused' : 'active';
    return this.prisma.automation.update({ where: { id }, data: { status: newStatus } });
  }

  async executeAutomation(id: string, payload?: Record<string, any>) {
    const automation = await this.findAutomationById(id);
    const actions: Array<{ type: string; config?: Record<string, any> }> =
      (automation.actions as any) || [];
    const results: Array<Record<string, any>> = [];

    for (const action of actions) {
      try {
        const result = await this.runAction(action, automation.organizationId, payload);
        results.push({ type: action.type, success: true, result });
      } catch (err: any) {
        results.push({ type: action.type, success: false, error: err?.message || String(err) });
      }
    }

    const failed = results.filter((r) => !r.success).length;
    await this.prisma.automation.update({
      where: { id },
      data: { lastExecutedAt: new Date(), executionCount: { increment: 1 } },
    });

    return {
      success: failed === 0,
      automationId: id,
      executedAt: new Date(),
      results,
    };
  }

  private async runAction(
    action: { type: string; config?: Record<string, any> },
    organizationId: string,
    payload?: Record<string, any>,
  ): Promise<any> {
    const config = action.config || {};
    const ctx = { ...config, ...(payload || {}) };

    switch (action.type) {
      case 'email.send': {
        const merged = config.appId
          ? { ...(await this.resolveAppConfig(config.appId, organizationId)), ...config }
          : config;
        return this.integrations.sendEmail(merged, payload);
      }

      case 'notify': {
        const merged = config.appId
          ? { ...(await this.resolveAppConfig(config.appId, organizationId)), ...config }
          : config;
        return this.integrations.notifySlack(merged, payload);
      }

      case 'webhook.call':
        return this.integrations.callWebhook(config, payload);

      case 'lead.assign': {
        if (!config.leadId) throw new BadRequestException('lead.assign requiere leadId en config');
        let assignedToId = config.assigneeId;
        if (!assignedToId && config.assignee) {
          const user = await this.prisma.user.findFirst({
            where: { email: config.assignee },
          });
          assignedToId = user?.id;
        }
        if (!assignedToId) throw new BadRequestException('No se encontro un usuario para asignar el lead');
        return this.prisma.crmLead.update({
          where: { id: config.leadId },
          data: { assignedToId },
        });
      }

      case 'lead.update_stage': {
        if (!config.leadId) throw new BadRequestException('lead.update_stage requiere leadId en config');
        return this.prisma.crmLead.update({
          where: { id: config.leadId },
          data: { stage: config.stage },
        });
      }

      case 'invoice.create': {
        const contactId = config.contactId;
        if (!contactId) throw new BadRequestException('invoice.create requiere contactId en config');
        return this.prisma.salesInvoice.create({
          data: {
            organizationId,
            number: `INV-${Date.now()}`,
            contactId,
            status: 'draft',
            subtotal: BigInt(0),
            taxAmount: BigInt(0),
            total: BigInt(0),
            items: { create: [] },
          },
        });
      }

      case 'record.update': {
        const entity = config.entity;
        const recordId = config.recordId;
        if (!entity || !recordId) throw new BadRequestException('record.update requiere entity y recordId');
        const model = (this.prisma as any)[entity];
        if (!model) throw new BadRequestException(`Entidad no soportada: ${entity}`);
        return model.update({ where: { id: recordId }, data: { [config.field]: config.value } });
      }

      default:
        throw new BadRequestException(`Acción no soportada: ${action.type}`);
    }
  }

  private async resolveAppConfig(appId: string, organizationId: string): Promise<Record<string, any>> {
    const install = await this.prisma.appInstallation.findUnique({
      where: { appId_organizationId: { appId, organizationId } },
    });
    return (install?.config as Record<string, any>) || {};
  }
}
