import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

interface ListParams {
  page?: number | string;
  limit?: number | string;
  query?: string;
}

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  private parsePagination(params: ListParams) {
    const page = Math.max(1, parseInt(String(params.page ?? 1), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(params.limit ?? 20), 10) || 20));
    return { page, limit, skip: (page - 1) * limit, take: limit };
  }

  private toBigInt(value: any): bigint | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    try {
      return BigInt(Math.round(Number(value)));
    } catch {
      return undefined;
    }
  }

  private async audit(organizationId: string, entityType: string, entityId: string, action: string, userId?: string, changes?: any) {
    try {
      await this.prisma.auditLog.create({
        data: { organizationId, entityType, entityId, action, userId: userId ?? null, changes: changes ?? undefined },
      });
    } catch {
      // auditing must never break the main operation
    }
  }

  // ============================================
  // CONTACTS
  // ============================================
  async findContacts(organizationId: string, params: ListParams & { type?: string } = {}) {
    const { page, limit, skip, take } = this.parsePagination(params);
    const where = {
      organizationId,
      deletedAt: null,
      ...(params.type ? { type: params.type } : {}),
      ...(params.query
        ? {
            OR: [
              { firstName: { contains: params.query, mode: 'insensitive' as const } },
              { lastName: { contains: params.query, mode: 'insensitive' as const } },
              { email: { contains: params.query, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.crmContact.findMany({ where, include: { company: true }, orderBy: { createdAt: 'desc' }, skip, take }),
      this.prisma.crmContact.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findContactById(id: string) {
    const contact = await this.prisma.crmContact.findUnique({
      where: { id },
      include: { company: true, crmLeads: true, salesQuotations: true, salesOrders: true, salesInvoices: true },
    });
    if (!contact) throw new NotFoundException('Contacto no encontrado');
    return contact;
  }

  async createContact(data: { organizationId: string; firstName: string; lastName?: string; email?: string; phone?: string; position?: string; companyId?: string; type?: string; tags?: string[]; createdById?: string }) {
    const contact = await this.prisma.crmContact.create({
      data: {
        organizationId: data.organizationId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        companyId: data.companyId || undefined,
        type: data.type || 'lead',
        tags: data.tags,
      },
    });
    await this.audit(data.organizationId, 'crm.contact', contact.id, 'create', data.createdById);
    return contact;
  }

  async updateContact(id: string, data: Record<string, any>, userId?: string) {
    const existing = await this.findContactById(id);
    const updated = await this.prisma.crmContact.update({ where: { id }, data });
    await this.audit(existing.organizationId, 'crm.contact', id, 'update', userId, data);
    return updated;
  }

  async deleteContact(id: string, userId?: string) {
    const existing = await this.findContactById(id);
    const hasTransactions =
      (existing.salesInvoices?.length ?? 0) > 0 ||
      (existing.salesOrders?.length ?? 0) > 0 ||
      (existing.salesQuotations?.length ?? 0) > 0;
    if (hasTransactions) {
      throw new ConflictException('CONTACT_HAS_TRANSACTIONS: el contacto tiene transacciones y solo puede archivarse');
    }
    const deleted = await this.prisma.crmContact.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit(existing.organizationId, 'crm.contact', id, 'delete', userId);
    return deleted;
  }

  // ============================================
  // COMPANIES
  // ============================================
  async findCompanies(organizationId: string, params: ListParams = {}) {
    const { page, limit, skip, take } = this.parsePagination(params);
    const where = {
      organizationId,
      deletedAt: null,
      ...(params.query ? { name: { contains: params.query, mode: 'insensitive' as const } } : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.crmCompany.findMany({ where, include: { _count: { select: { contacts: true } } }, orderBy: { createdAt: 'desc' }, skip, take }),
      this.prisma.crmCompany.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findCompanyById(id: string) {
    const company = await this.prisma.crmCompany.findUnique({ where: { id }, include: { contacts: true } });
    if (!company) throw new NotFoundException('Empresa no encontrada');
    return company;
  }

  async createCompany(data: { organizationId: string; name: string; industry?: string; website?: string; address?: Record<string, any>; taxId?: string; notes?: string; createdById?: string }) {
    const company = await this.prisma.crmCompany.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        industry: data.industry,
        website: data.website,
        address: data.address,
        taxId: data.taxId,
        notes: data.notes,
      },
    });
    await this.audit(data.organizationId, 'crm.company', company.id, 'create', data.createdById);
    return company;
  }

  async updateCompany(id: string, data: Record<string, any>, userId?: string) {
    const existing = await this.findCompanyById(id);
    const updated = await this.prisma.crmCompany.update({ where: { id }, data });
    await this.audit(existing.organizationId, 'crm.company', id, 'update', userId, data);
    return updated;
  }

  async deleteCompany(id: string, userId?: string) {
    const existing = await this.findCompanyById(id);
    const deleted = await this.prisma.crmCompany.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit(existing.organizationId, 'crm.company', id, 'delete', userId);
    return deleted;
  }

  // ============================================
  // LEADS
  // ============================================
  async findLeads(organizationId: string, params: ListParams & { pipelineId?: string; stage?: string; status?: string } = {}) {
    const { page, limit, skip, take } = this.parsePagination(params);
    const where = {
      organizationId,
      deletedAt: null,
      ...(params.pipelineId ? { pipelineId: params.pipelineId } : {}),
      ...(params.stage ? { stage: params.stage } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.query
        ? {
            OR: [
              { title: { contains: params.query, mode: 'insensitive' as const } },
              { contact: { firstName: { contains: params.query, mode: 'insensitive' as const } } },
              { contact: { lastName: { contains: params.query, mode: 'insensitive' as const } } },
              { contact: { email: { contains: params.query, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.crmLead.findMany({ where, include: { contact: { include: { company: true } }, pipeline: true }, orderBy: { createdAt: 'desc' }, skip, take }),
      this.prisma.crmLead.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findLeadById(id: string) {
    const lead = await this.prisma.crmLead.findUnique({
      where: { id },
      include: { contact: { include: { company: true } }, pipeline: true, activities: { orderBy: { occurredAt: 'desc' } } },
    });
    if (!lead) throw new NotFoundException('Lead no encontrado');
    return lead;
  }

  private stageNames(stages: any): string[] {
    if (!Array.isArray(stages)) return [];
    return stages.map((s: any) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
  }

  async createLead(data: {
    organizationId: string;
    pipelineId?: string;
    stage?: string;
    contactId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    title?: string;
    notes?: string;
    source?: string;
    score?: number;
    assignedToId?: string;
    estimatedValue?: any;
    expectedCloseDate?: string | Date;
    createdById?: string;
  }) {
    // Resolve pipeline (use default if none given)
    let pipeline = data.pipelineId
      ? await this.prisma.crmPipeline.findFirst({ where: { id: data.pipelineId, organizationId: data.organizationId, deletedAt: null } })
      : await this.prisma.crmPipeline.findFirst({ where: { organizationId: data.organizationId, deletedAt: null }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }] });
    if (!pipeline) throw new BadRequestException('No existe un pipeline para la organización. Crea uno primero.');

    // Resolve stage (first stage if not provided or invalid)
    const stages = this.stageNames(pipeline.stages);
    let stage = data.stage;
    if (!stage || (stages.length > 0 && !stages.includes(stage))) {
      stage = stages[0] || 'Nuevo';
    }

    // Resolve / create contact
    let contactId = data.contactId;
    if (!contactId && (data.firstName || data.email)) {
      const contact = await this.createContact({
        organizationId: data.organizationId,
        firstName: data.firstName || data.email!.split('@')[0],
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        type: 'lead',
        createdById: data.createdById,
      });
      contactId = contact.id;
    }

    const lead = await this.prisma.crmLead.create({
      data: {
        organizationId: data.organizationId,
        pipelineId: pipeline.id,
        stage,
        status: 'active',
        title: data.title,
        notes: data.notes,
        contactId: contactId || undefined,
        source: data.source,
        score: data.score,
        assignedToId: data.assignedToId || undefined,
        estimatedValue: this.toBigInt(data.estimatedValue),
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
      },
      include: { contact: true, pipeline: true },
    });
    await this.audit(data.organizationId, 'crm.lead', lead.id, 'create', data.createdById, { stage, contactId });
    return lead;
  }

  async updateLead(id: string, data: Record<string, any>, userId?: string) {
    const existing = await this.findLeadById(id);
    const patch: Record<string, any> = { ...data };
    if ('estimatedValue' in patch) patch.estimatedValue = this.toBigInt(patch.estimatedValue);
    if ('expectedCloseDate' in patch && patch.expectedCloseDate) patch.expectedCloseDate = new Date(patch.expectedCloseDate);
    const updated = await this.prisma.crmLead.update({ where: { id }, data: patch, include: { contact: true, pipeline: true } });
    await this.audit(existing.organizationId, 'crm.lead', id, 'update', userId, data);
    return updated;
  }

  async moveLeadStage(id: string, stage: string, userId?: string) {
    const existing = await this.findLeadById(id);
    if (!stage) throw new BadRequestException('stage requerido');
    const updated = await this.prisma.crmLead.update({ where: { id }, data: { stage }, include: { contact: true, pipeline: true } });
    await this.audit(existing.organizationId, 'crm.lead', id, 'move_stage', userId, { fromStage: existing.stage, toStage: stage });
    return updated;
  }

  async convertLead(id: string, userId?: string) {
    const lead = await this.findLeadById(id);
    if (lead.status === 'converted') {
      throw new ConflictException('LEAD_ALREADY_CONVERTED: el lead ya fue convertido');
    }
    if (!lead.contactId) {
      throw new BadRequestException('El lead no tiene un contacto asociado para convertir');
    }
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.crmContact.update({ where: { id: lead.contactId! }, data: { type: 'client' } });
      return tx.crmLead.update({
        where: { id },
        data: { status: 'converted', convertedAt: new Date() },
        include: { contact: true, pipeline: true },
      });
    });
    await this.audit(lead.organizationId, 'crm.lead', id, 'convert', userId, { contactId: lead.contactId });
    return result;
  }

  async markLeadLost(id: string, reason: string | undefined, userId?: string) {
    const lead = await this.findLeadById(id);
    if (lead.status === 'converted') {
      throw new ConflictException('No se puede marcar como perdido un lead ya convertido');
    }
    const updated = await this.prisma.crmLead.update({
      where: { id },
      data: { status: 'lost', lostReason: reason },
      include: { contact: true, pipeline: true },
    });
    await this.audit(lead.organizationId, 'crm.lead', id, 'lost', userId, { reason });
    return updated;
  }

  async deleteLead(id: string, userId?: string) {
    const existing = await this.findLeadById(id);
    const deleted = await this.prisma.crmLead.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit(existing.organizationId, 'crm.lead', id, 'delete', userId);
    return deleted;
  }

  // ============================================
  // LEAD ACTIVITIES
  // ============================================
  async findLeadActivities(leadId: string) {
    await this.findLeadById(leadId);
    return this.prisma.crmLeadActivity.findMany({ where: { leadId }, orderBy: { occurredAt: 'desc' } });
  }

  async createLeadActivity(leadId: string, data: { type: string; content: string; occurredAt?: string | Date }, userId?: string) {
    const lead = await this.findLeadById(leadId);
    const activity = await this.prisma.crmLeadActivity.create({
      data: {
        leadId,
        type: data.type,
        content: data.content,
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
        createdById: userId ?? null,
      },
    });
    await this.audit(lead.organizationId, 'crm.lead_activity', activity.id, 'create', userId, { leadId, type: data.type });
    return activity;
  }

  // ============================================
  // PIPELINES
  // ============================================
  async findPipelines(organizationId: string) {
    const data = await this.prisma.crmPipeline.findMany({
      where: { organizationId, deletedAt: null },
      include: { _count: { select: { leads: true } } },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    return { data, total: data.length };
  }

  async findPipelineById(id: string) {
    const pipeline = await this.prisma.crmPipeline.findUnique({ where: { id }, include: { _count: { select: { leads: true } } } });
    if (!pipeline) throw new NotFoundException('Pipeline no encontrado');
    return pipeline;
  }

  async createPipeline(data: { organizationId: string; name: string; stages?: any; isDefault?: boolean }) {
    return this.prisma.crmPipeline.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        stages: data.stages ?? [],
        isDefault: data.isDefault ?? false,
      },
    });
  }

  async updatePipeline(id: string, data: Record<string, any>) {
    await this.findPipelineById(id);
    return this.prisma.crmPipeline.update({ where: { id }, data });
  }

  async deletePipeline(id: string) {
    const pipeline = await this.findPipelineById(id);
    if ((pipeline as any)._count?.leads > 0) {
      throw new ConflictException('No se puede eliminar un pipeline con leads asociados');
    }
    return this.prisma.crmPipeline.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
