import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';
import type { NovaToolImplementation, NovaToolContext } from '@nyvora/types';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';

@Injectable()
export class ToolRegistryService {
  private tools: Map<string, NovaToolImplementation> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly campaignsService: CampaignsService,
    private readonly marketplaceService: MarketplaceService,
  ) {
    this.registerDefaultTools();
  }

  private normalizePriority(value: string | undefined): string {
    if (!value) return 'medium';
    const v = value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const map: Record<string, string> = {
      baja: 'low',
      low: 'low',
      media: 'medium',
      medio: 'medium',
      medium: 'medium',
      alta: 'high',
      alto: 'high',
      high: 'high',
      urgente: 'urgent',
      urgent: 'urgent',
    };
    return map[v] || 'medium';
  }

  private normalizeProjectStatus(value: string | undefined): string {
    if (!value) return 'planning';
    const v = value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const map: Record<string, string> = {
      planificacion: 'planning',
      planning: 'planning',
      activo: 'active',
      activa: 'active',
      active: 'active',
      enpausa: 'on_hold',
      pausa: 'on_hold',
      onhold: 'on_hold',
      completado: 'completed',
      completada: 'completed',
      completed: 'completed',
      cancelado: 'cancelled',
      cancelada: 'cancelled',
      cancelled: 'cancelled',
    };
    return map[v] || 'planning';
  }

  register(tool: NovaToolImplementation): void {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): NovaToolImplementation | undefined {
    return this.tools.get(name);
  }

  getAllTools(): NovaToolImplementation[] {
    return Array.from(this.tools.values());
  }

  private registerDefaultTools(): void {
    // CRM - createCustomer
    this.register({
      name: 'createCustomer',
      description: 'Crear un nuevo contacto en el CRM',
      inputSchema: {
        type: 'object',
        properties: {
          firstName: { type: 'string', description: 'Nombre del contacto' },
          lastName: { type: 'string', description: 'Apellido del contacto' },
          email: { type: 'string', description: 'Email del contacto' },
          phone: { type: 'string', description: 'Telefono del contacto' },
          position: { type: 'string', description: 'Cargo del contacto' },
        },
        required: ['firstName'],
      },
      execute: async (input, context) => {
        return this.prisma.crmContact.create({
          data: {
            organizationId: context.organizationId!,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            position: input.position,
          },
        });
      },
      requiredPermissions: ['crm:contacts:create'],
    });

    // CRM - findCustomer
    this.register({
      name: 'findCustomer',
      description: 'Buscar contactos en el CRM',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Termino de busqueda' },
        },
        required: ['query'],
      },
      execute: async (input, context) => {
        return this.prisma.crmContact.findMany({
          where: {
            organizationId: context.organizationId!,
            deletedAt: null,
            OR: [
              { firstName: { contains: input.query, mode: 'insensitive' } },
              { lastName: { contains: input.query, mode: 'insensitive' } },
              { email: { contains: input.query, mode: 'insensitive' } },
            ],
          },
          take: 20,
        });
      },
      requiredPermissions: ['crm:contacts:read'],
    });

    // CRM - updateCustomer
    this.register({
      name: 'updateCustomer',
      description: 'Actualizar informacion de un contacto existente',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'ID del contacto' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
        },
        required: ['contactId'],
      },
      execute: async (input, context) => {
        const { contactId, ...data } = input;
        return this.prisma.crmContact.update({ where: { id: contactId }, data });
      },
      requiredPermissions: ['crm:contacts:update'],
    });

    // Sales - createInvoice
    this.register({
      name: 'createInvoice',
      description: 'Crear una nueva factura',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'ID del cliente' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                quantity: { type: 'number' },
                unitPrice: { type: 'number' },
              },
            },
          },
          dueDate: { type: 'string', description: 'Fecha de vencimiento (ISO)' },
        },
        required: ['contactId', 'items'],
      },
      execute: async (input, context) => {
        const subtotal = input.items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.unitPrice, 0
        );
        const year = new Date().getFullYear();
        const count = await this.prisma.salesInvoice.count({
          where: { organizationId: context.organizationId!, number: { startsWith: `INV-${year}` } },
        });
        const number = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
        return this.prisma.salesInvoice.create({
          data: {
            organizationId: context.organizationId!,
            number,
            contactId: input.contactId,
            subtotal: BigInt(Math.round(subtotal * 100)),
            total: BigInt(Math.round(subtotal * 100)),
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            items: {
              create: input.items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: BigInt(Math.round(item.unitPrice * 100)),
                subtotal: BigInt(Math.round(item.quantity * item.unitPrice * 100)),
              })),
            },
          },
          include: { items: true },
        });
      },
      requiredPermissions: ['sales:invoices:create'],
    });

    // Sales - createQuote
    this.register({
      name: 'createQuote',
      description: 'Crear una nueva cotizacion para un cliente',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                quantity: { type: 'number' },
                unitPrice: { type: 'number' },
              },
            },
          },
          validUntil: { type: 'string' },
          notes: { type: 'string' },
        },
        required: ['contactId', 'items'],
      },
      execute: async (input, context) => {
        const subtotal = input.items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.unitPrice, 0
        );
        const year = new Date().getFullYear();
        const count = await this.prisma.salesQuotation.count({
          where: { organizationId: context.organizationId!, number: { startsWith: `Q-${year}` } },
        });
        const number = `Q-${year}-${String(count + 1).padStart(5, '0')}`;
        return this.prisma.salesQuotation.create({
          data: {
            organizationId: context.organizationId!,
            number,
            contactId: input.contactId,
            subtotal: BigInt(Math.round(subtotal * 100)),
            total: BigInt(Math.round(subtotal * 100)),
            validUntil: input.validUntil ? new Date(input.validUntil) : null,
            notes: input.notes,
            items: {
              create: input.items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: BigInt(Math.round(item.unitPrice * 100)),
                subtotal: BigInt(Math.round(item.quantity * item.unitPrice * 100)),
              })),
            },
          },
          include: { items: true },
        });
      },
      requiredPermissions: ['sales:quotes:create'],
    });

    // Inventory - findProduct
    this.register({
      name: 'findProduct',
      description: 'Buscar productos en el inventario',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Termino de busqueda' },
        },
        required: ['query'],
      },
      execute: async (input, context) => {
        return this.prisma.product.findMany({
          where: {
            organizationId: context.organizationId!,
            deletedAt: null,
            OR: [
              { name: { contains: input.query, mode: 'insensitive' } },
              { sku: { contains: input.query, mode: 'insensitive' } },
            ],
          },
          include: { category: true, stockLevels: true },
          take: 20,
        });
      },
      requiredPermissions: ['inventory:products:read'],
    });

    // Inventory - updateProduct
    this.register({
      name: 'updateProduct',
      description: 'Actualizar informacion de un producto',
      inputSchema: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          name: { type: 'string' },
          sku: { type: 'string' },
          unitPrice: { type: 'number' },
          description: { type: 'string' },
        },
        required: ['productId'],
      },
      execute: async (input, context) => {
        const { productId, unitPrice, ...data } = input;
        return this.prisma.product.update({
          where: { id: productId },
          data: { ...data, ...(unitPrice ? { unitPrice: BigInt(Math.round(unitPrice * 100)) } : {}) },
        });
      },
      requiredPermissions: ['inventory:products:update'],
    });

    // HR - createEmployee
    this.register({
      name: 'createEmployee',
      description: 'Crear un nuevo empleado en el sistema RRHH',
      inputSchema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          departmentId: { type: 'string' },
          hireDate: { type: 'string', description: 'Fecha de inicio (ISO)' },
        },
        required: ['firstName', 'lastName', 'email', 'hireDate'],
      },
      execute: async (input, context) => {
        return this.prisma.employee.create({
          data: {
            organizationId: context.organizationId!,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            departmentId: input.departmentId,
            hireDate: new Date(input.hireDate),
          },
        });
      },
      requiredPermissions: ['hr:employees:create'],
    });

    // HR - findEmployee
    this.register({
      name: 'findEmployee',
      description: 'Buscar empleados en el sistema RRHH',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          departmentId: { type: 'string' },
        },
        required: ['query'],
      },
      execute: async (input, context) => {
        return this.prisma.employee.findMany({
          where: {
            organizationId: context.organizationId!,
            deletedAt: null,
            ...(input.departmentId ? { departmentId: input.departmentId } : {}),
            OR: [
              { firstName: { contains: input.query, mode: 'insensitive' } },
              { lastName: { contains: input.query, mode: 'insensitive' } },
              { email: { contains: input.query, mode: 'insensitive' } },
            ],
          },
          include: { department: true, position: true },
          take: 20,
        });
      },
      requiredPermissions: ['hr:employees:read'],
    });

    // Analytics - getSalesReport
    this.register({
      name: 'getSalesReport',
      description: 'Obtener reporte de ventas',
      inputSchema: {
        type: 'object',
        properties: {
          period: { type: 'string', description: 'week, month, quarter, year' },
        },
        required: ['period'],
      },
      execute: async (input, context) => {
        const now = new Date();
        let from: Date;
        switch (input.period) {
          case 'week': from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
          case 'quarter': from = new Date(now.getFullYear(), now.getMonth() - 3, 1); break;
          case 'year': from = new Date(now.getFullYear(), 0, 1); break;
          default: from = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        const invoices = await this.prisma.salesInvoice.findMany({
          where: { organizationId: context.organizationId!, createdAt: { gte: from }, deletedAt: null },
        });
        const total = invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
        const paid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + Number(inv.paidAmount), 0);
        return { period: input.period, totalInvoices: invoices.length, totalRevenue: total, totalPaid: paid, totalPending: total - paid };
      },
      requiredPermissions: ['reports:sales:read'],
    });

    // Analytics - getInventoryReport
    this.register({
      name: 'getInventoryReport',
      description: 'Obtener reporte de inventario',
      inputSchema: {
        type: 'object',
        properties: {
          lowStock: { type: 'boolean', description: 'Solo productos con stock bajo' },
        },
        required: [],
      },
      execute: async (input, context) => {
        const levels = await this.prisma.stockLevel.findMany({
          where: { organizationId: context.organizationId!, ...(input.lowStock ? { quantity: { lte: 10 } } : {}) },
          include: { product: true, warehouse: true },
        });
        const totalProducts = levels.length;
        const lowStockCount = levels.filter(l => l.quantity <= (l as any).minimumQuantity || l.quantity <= 10).length;
        return { totalProducts, lowStockCount, levels };
      },
      requiredPermissions: ['inventory:products:read'],
    });

    // Scheduling - scheduleMeeting
    this.register({
      name: 'scheduleMeeting',
      description: 'Programar una reunion persistente (crea un evento en el calendario de la organizacion). Acepta titulo, fecha ISO, descripcion, ubicacion, asistentes y organizador.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          date: { type: 'string', description: 'Fecha ISO de inicio' },
          endDate: { type: 'string', description: 'Fecha ISO de fin (opcional)' },
          description: { type: 'string' },
          location: { type: 'string', description: 'Lugar o enlace de la reunion' },
          attendees: { type: 'array', items: { type: 'string' }, description: 'Emails o nombres de asistentes' },
        },
        required: ['title', 'date'],
      },
      execute: async (input, context) => {
        const meeting = await this.prisma.meeting.create({
          data: {
            organizationId: context.organizationId!,
            title: input.title,
            description: input.description || null,
            date: new Date(input.date),
            endDate: input.endDate ? new Date(input.endDate) : null,
            location: input.location || null,
            organizerId: context.userId,
            attendees: Array.isArray(input.attendees) ? input.attendees.map(String) : [],
            status: 'scheduled',
          },
        });
        return {
          id: meeting.id,
          title: meeting.title,
          date: meeting.date,
          endDate: meeting.endDate,
          location: meeting.location,
          attendees: meeting.attendees,
          status: meeting.status,
          message: `Reunion "${meeting.title}" programada para ${meeting.date.toISOString()}.`,
        };
      },
      requiredPermissions: ['calendar:meetings:create'],
    });

    // Projects - createProject
    this.register({
      name: 'createProject',
      description: 'Crear un nuevo proyecto',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', description: 'planning, active, on_hold, completed, cancelled' },
          clientId: { type: 'string', description: 'ID de contacto del CRM (opcional)' },
          startDate: { type: 'string', description: 'Fecha ISO (opcional)' },
          endDate: { type: 'string', description: 'Fecha ISO (opcional)' },
          budgetHours: { type: 'number', description: 'Horas presupuestadas (opcional)' },
        },
        required: ['name'],
      },
      execute: async (input, context) => {
        const data: any = {
          organizationId: context.organizationId!,
          name: input.name,
          description: input.description,
          status: this.normalizeProjectStatus(input.status),
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          budgetHours: input.budgetHours,
        };

        if (input.clientId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.clientId)) {
          data.clientId = input.clientId;
        }

        return this.prisma.project.create({ data });
      },
      requiredPermissions: ['projects:create'],
    });

    // Tasks - createTask
    this.register({
      name: 'createTask',
      description: 'Crear una nueva tarea',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          assigneeId: { type: 'string' },
          priority: { type: 'string', description: 'low, medium, high, urgent' },
          dueDate: { type: 'string', description: 'Fecha ISO' },
        },
        required: ['projectId', 'title'],
      },
      execute: async (input, context) => {
        const data: any = {
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          priority: this.normalizePriority(input.priority),
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        };

        if (input.assigneeId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.assigneeId)) {
          data.assigneeId = input.assigneeId;
        }

        return this.prisma.task.create({ data });
      },
      requiredPermissions: ['tasks:create'],
    });

    // Tasks - listTasks
    this.register({
      name: 'listTasks',
      description: 'Listar tareas de un proyecto (o todas las del usuario). Usa esto para encontrar el ID de una tarea por su nombre.',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'ID del proyecto (opcional)' },
          status: { type: 'string', description: 'todo, in_progress, done, blocked (opcional)' },
          query: { type: 'string', description: 'Filtrar por texto en el título (opcional)' },
        },
      },
      execute: async (input, context) => {
        let orgId = context.organizationId;
        if (!orgId && context.userId) {
          const m = await this.prisma.membership.findFirst({ where: { userId: context.userId } });
          orgId = m?.organizationId;
        }
        const where: any = { project: { organizationId: orgId } };
        if (input.projectId) where.projectId = input.projectId;
        if (input.status) where.status = input.status;
        if (input.query) where.title = { contains: input.query, mode: 'insensitive' };

        return this.prisma.task.findMany({
          where,
          include: { project: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
      },
      requiredPermissions: ['tasks:read'],
    });

    // Projects - listProjects
    this.register({
      name: 'listProjects',
      description: 'Listar los proyectos de la organización. Usa esto para encontrar el ID de un proyecto por su nombre.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', description: 'planning, active, on_hold, completed, cancelled (opcional)' },
          query: { type: 'string', description: 'Filtrar por texto en el nombre (opcional)' },
        },
      },
      execute: async (input, context) => {
        let orgId = context.organizationId;
        if (!orgId && context.userId) {
          const m = await this.prisma.membership.findFirst({ where: { userId: context.userId } });
          orgId = m?.organizationId;
        }
        const where: any = { organizationId: orgId, deletedAt: null };
        if (input.status) where.status = input.status;
        if (input.query) where.name = { contains: input.query, mode: 'insensitive' };

        return this.prisma.project.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
      },
      requiredPermissions: ['projects:read'],
    });

    // Campaigns - sendCampaign
    this.register({
      name: 'sendCampaign',
      description: 'Crear y enviar una campana de mensajes masivos (email, whatsapp, sms o slack) a los contactos del CRM o a una lista personalizada. Usa {{name}} para personalizar el mensaje.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nombre de la campana' },
          channel: { type: 'string', description: 'email, whatsapp, sms o slack' },
          subject: { type: 'string', description: 'Asunto (solo para email)' },
          body: { type: 'string', description: 'Cuerpo del mensaje. Usa {{name}} para personalizar' },
          delaySeconds: { type: 'number', description: 'Retraso entre envios en segundos (minimo 4)' },
          audience: { type: 'string', description: 'crm (todos los contactos del CRM) o custom (lista propia)' },
          recipients: {
            type: 'array',
            description: 'Solo si audience=custom. Cada item: { to: destino, name?: nombre }',
            items: {
              type: 'object',
              properties: {
                to: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
        required: ['name', 'channel', 'body'],
      },
      execute: async (input, context) => {
        const channel = input.channel || 'email';
        const delayMs = Math.max(4000, (input.delaySeconds ?? 5) * 1000);
        const campaign = await this.campaignsService.create(context.organizationId!, {
          name: input.name,
          channel,
          subject: channel === 'email' ? input.subject : undefined,
          body: input.body,
          delayMs,
        });

        const useCustom = input.audience === 'custom' && Array.isArray(input.recipients) && input.recipients.length > 0;
        const result = await this.campaignsService.start(context.organizationId!, campaign.id, {
          recipients: useCustom ? input.recipients : undefined,
        });

        return {
          ok: true,
          campaignId: campaign.id,
          channel,
          total: result.total,
          delayMs: result.delayMs,
          estimatedDurationMs: result.estimatedDurationMs,
          message: `Campana "${input.name}" iniciada. ${result.total} mensajes en cola con ${result.delayMs}ms de retraso.`,
        };
      },
      requiredPermissions: ['campaigns:send'],
    });

    // Marketplace - listApps
    this.register({
      name: 'listApps',
      description: 'Listar las aplicaciones e integraciones disponibles en el Marketplace de Nyvora y su estado de instalacion.',
      inputSchema: {
        type: 'object',
        properties: {
          installedOnly: { type: 'boolean', description: 'Mostrar solo las apps instaladas' },
        },
      },
      execute: async (input, context) => {
        if (input.installedOnly) {
          return this.marketplaceService.findInstalledApps(context.organizationId!);
        }
        return this.marketplaceService.findCatalog(context.organizationId!);
      },
      requiredPermissions: ['marketplace:read'],
    });

    // Marketplace - installApp
    this.register({
      name: 'installApp',
      description: 'Instalar una aplicacion o integracion del Marketplace (whatsapp, stripe, sendgrid, slack, trello, google-sheets, zapier, dropbox, twilio, jira, google-calendar, hubspot).',
      inputSchema: {
        type: 'object',
        properties: {
          appId: { type: 'string', description: 'ID de la app (ej: whatsapp, stripe, sendgrid, slack, trello, google-calendar)' },
          config: { type: 'object', description: 'Parametros de configuracion (opcional)' },
        },
        required: ['appId'],
      },
      execute: async (input, context) => {
        return this.marketplaceService.installApp(context.organizationId!, input.appId, input.config);
      },
      requiredPermissions: ['marketplace:write'],
    });

    // Marketplace - uninstallApp
    this.register({
      name: 'uninstallApp',
      description: 'Desinstalar o desactivar una aplicacion o integracion del Marketplace.',
      inputSchema: {
        type: 'object',
        properties: {
          installationId: { type: 'string', description: 'ID de la instalacion de la app' },
        },
        required: ['installationId'],
      },
      execute: async (input, context) => {
        return this.marketplaceService.uninstallApp(input.installationId);
      },
      requiredPermissions: ['marketplace:write'],
    });

    // Marketplace - configureApp
    this.register({
      name: 'configureApp',
      description: 'Actualizar la configuracion o credenciales de una aplicacion instalada (API keys, webhooks, tokens).',
      inputSchema: {
        type: 'object',
        properties: {
          installationId: { type: 'string', description: 'ID de la instalacion' },
          config: { type: 'object', description: 'Objeto con la configuracion' },
        },
        required: ['installationId', 'config'],
      },
      execute: async (input, context) => {
        return this.marketplaceService.updateAppConfig(input.installationId, input.config);
      },
      requiredPermissions: ['marketplace:write'],
    });
  }
}
