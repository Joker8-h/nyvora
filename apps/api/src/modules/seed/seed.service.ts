import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';
import * as argon2 from 'argon2';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    this.logger.log('Starting database seed...');

    const existingUsers = await this.prisma.user.count();
    if (existingUsers > 0) {
      return { message: 'Database already seeded', skipped: true };
    }

    const password = 'Nexora2024!';
    const passwordHash = await argon2.hash(password);

    // 1. Organization
    const org = await this.prisma.organization.create({
      data: {
        name: 'Nexora Demo',
        slug: 'nexora-demo',
        plan: 'business',
        settings: {
          currency: 'USD',
          timezone: 'America/Mexico_City',
          language: 'es',
        },
      },
    });
    this.logger.log(`Created organization: ${org.name}`);

    // 2. Admin User
    const admin = await this.prisma.user.create({
      data: {
        email: 'admin@nexora.demo',
        passwordHash,
        firstName: 'Carlos',
        lastName: 'Mendoza',
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });
    this.logger.log(`Created admin user: ${admin.email}`);

    // 3. Membership
    await this.prisma.membership.create({
      data: {
        userId: admin.id,
        organizationId: org.id,
        role: 'owner',
        acceptedAt: new Date(),
      },
    });

    // 4. Second user (employee)
    const employee1 = await this.prisma.user.create({
      data: {
        email: 'maria@nexora.demo',
        passwordHash,
        firstName: 'Maria',
        lastName: 'Garcia',
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });
    await this.prisma.membership.create({
      data: {
        userId: employee1.id,
        organizationId: org.id,
        role: 'employee',
        acceptedAt: new Date(),
      },
    });

    const employee2 = await this.prisma.user.create({
      data: {
        email: 'juan@nexora.demo',
        passwordHash,
        firstName: 'Juan',
        lastName: 'Lopez',
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    });
    await this.prisma.membership.create({
      data: {
        userId: employee2.id,
        organizationId: org.id,
        role: 'manager',
        acceptedAt: new Date(),
      },
    });
    this.logger.log('Created 3 users (admin + 2 employees)');

    // 5. Branch
    const branch = await this.prisma.branch.create({
      data: {
        organizationId: org.id,
        name: 'Sede Principal',
        address: { city: 'Ciudad de Mexico', country: 'Mexico', zip: '06600' },
        phone: '+52 55 1234 5678',
        isHeadquarters: true,
      },
    });

    // 6. Departments
    const salesDept = await this.prisma.department.create({
      data: { organizationId: org.id, name: 'Ventas' },
    });
    const techDept = await this.prisma.department.create({
      data: { organizationId: org.id, name: 'Tecnologia' },
    });
    const hrDept = await this.prisma.department.create({
      data: { organizationId: org.id, name: 'Recursos Humanos' },
    });

    // 7. Positions
    const salesPos = await this.prisma.position.create({
      data: { organizationId: org.id, name: 'Ejecutivo de Ventas', departmentId: salesDept.id },
    });
    const devPos = await this.prisma.position.create({
      data: { organizationId: org.id, name: 'Desarrollador Senior', departmentId: techDept.id },
    });

    // 8. Employees
    const emp1 = await this.prisma.employee.create({
      data: {
        organizationId: org.id,
        userId: employee1.id,
        branchId: branch.id,
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria@nexora.demo',
        phone: '+52 55 2345 6789',
        departmentId: salesDept.id,
        positionId: salesPos.id,
        hireDate: new Date('2024-01-15'),
        salary: 3500000,
        contractType: 'permanent',
      },
    });
    await this.prisma.employee.create({
      data: {
        organizationId: org.id,
        userId: employee2.id,
        branchId: branch.id,
        firstName: 'Juan',
        lastName: 'Lopez',
        email: 'juan@nexora.demo',
        phone: '+52 55 3456 7890',
        departmentId: techDept.id,
        positionId: devPos.id,
        hireDate: new Date('2024-03-01'),
        salary: 5000000,
        contractType: 'permanent',
      },
    });
    this.logger.log('Created departments, positions, and employees');

    // 9. Warehouse
    const warehouse = await this.prisma.warehouse.create({
      data: {
        organizationId: org.id,
        branchId: branch.id,
        name: 'Almacen Central',
        address: { city: 'Ciudad de Mexico', address: 'Av. Reforma 123' },
      },
    });

    // 10. Product Categories
    const catElectronics = await this.prisma.productCategory.create({
      data: { organizationId: org.id, name: 'Electronica' },
    });
    const catOffice = await this.prisma.productCategory.create({
      data: { organizationId: org.id, name: 'Oficina' },
    });
    const catSoftware = await this.prisma.productCategory.create({
      data: { organizationId: org.id, name: 'Software' },
    });

    // 11. Products
    const products = await Promise.all([
      this.prisma.product.create({
        data: {
          organizationId: org.id,
          sku: 'LAP-001',
          name: 'Laptop Pro 15"',
          description: 'Laptop profesional 15 pulgadas, 16GB RAM, 512GB SSD',
          categoryId: catElectronics.id,
          unitPrice: 2500000,
          hasBatches: false,
        },
      }),
      this.prisma.product.create({
        data: {
          organizationId: org.id,
          sku: 'MON-001',
          name: 'Monitor 27" 4K',
          description: 'Monitor IPS 27 pulgadas resolucion 4K',
          categoryId: catElectronics.id,
          unitPrice: 850000,
        },
      }),
      this.prisma.product.create({
        data: {
          organizationId: org.id,
          sku: 'KEY-001',
          name: 'Teclado Mecanico RGB',
          description: 'Teclado mecanico con retroiluminacion RGB',
          categoryId: catElectronics.id,
          unitPrice: 180000,
        },
      }),
      this.prisma.product.create({
        data: {
          organizationId: org.id,
          sku: 'SFT-CRM',
          name: 'Licencia CRM Nexora',
          description: 'Licencia anual del modulo CRM',
          categoryId: catSoftware.id,
          unitPrice: 1200000,
        },
      }),
      this.prisma.product.create({
        data: {
          organizationId: org.id,
          sku: 'OFI-001',
          name: 'Silla Ergonomica',
          description: 'Silla ergonomica de oficina con soporte lumbar',
          categoryId: catOffice.id,
          unitPrice: 450000,
        },
      }),
      this.prisma.product.create({
        data: {
          organizationId: org.id,
          sku: 'SFT-INV',
          name: 'Licencia Inventario',
          description: 'Licencia anual del modulo de Inventario',
          categoryId: catSoftware.id,
          unitPrice: 800000,
        },
      }),
    ]);
    this.logger.log(`Created ${products.length} products`);

    // 12. Stock Levels
    for (const product of products) {
      await this.prisma.stockLevel.create({
        data: {
          organizationId: org.id,
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: Math.floor(Math.random() * 50) + 10,
          minimumQuantity: 5,
        },
      });
    }

    // 13. Suppliers
    const supplier1 = await this.prisma.supplier.create({
      data: {
        organizationId: org.id,
        name: 'Tech Distribuciones SA',
        taxId: 'TDI850101AB1',
        email: 'ventas@techdist.com',
        phone: '+52 55 9876 5432',
        address: { city: 'Monterrey', country: 'Mexico' },
        paymentTerms: 30,
      },
    });
    const supplier2 = await this.prisma.supplier.create({
      data: {
        organizationId: org.id,
        name: 'Office Plus MX',
        taxId: 'OPM900202CD3',
        email: 'contacto@officeplus.mx',
        phone: '+52 33 4567 8901',
        paymentTerms: 15,
      },
    });
    this.logger.log('Created 2 suppliers');

    // 14. CRM Companies
    const companies = await Promise.all([
      this.prisma.crmCompany.create({
        data: {
          organizationId: org.id,
          name: 'Grupo Mexicano de Tecnologia',
          industry: 'Tecnologia',
          website: 'https://gmt.com.mx',
          taxId: 'GMT780305EF4',
        },
      }),
      this.prisma.crmCompany.create({
        data: {
          organizationId: org.id,
          name: 'Constructora del Valle',
          industry: 'Construccion',
          website: 'https://consvalle.com.mx',
          taxId: 'CVL820612GH5',
        },
      }),
      this.prisma.crmCompany.create({
        data: {
          organizationId: org.id,
          name: 'Distribuidora Nacional',
          industry: 'Distribucion',
          taxId: 'DN910723IJ6',
        },
      }),
    ]);

    // 15. CRM Contacts
    const contacts = await Promise.all([
      this.prisma.crmContact.create({
        data: {
          organizationId: org.id,
          companyId: companies[0].id,
          firstName: 'Roberto',
          lastName: 'Hernandez',
          email: 'roberto@gmt.com.mx',
          phone: '+52 55 1111 2222',
          position: 'Director de TI',
          type: 'customer',
          tags: ['vip', 'enterprise'],
        },
      }),
      this.prisma.crmContact.create({
        data: {
          organizationId: org.id,
          companyId: companies[1].id,
          firstName: 'Ana',
          lastName: 'Martinez',
          email: 'ana@consvalle.com.mx',
          phone: '+52 33 3333 4444',
          position: 'Gerente de Compras',
          type: 'customer',
          tags: ['construction'],
        },
      }),
      this.prisma.crmContact.create({
        data: {
          organizationId: org.id,
          companyId: companies[2].id,
          firstName: 'Pedro',
          lastName: 'Sanchez',
          email: 'pedro@distnacional.com',
          phone: '+52 81 5555 6666',
          position: 'CEO',
          type: 'lead',
          tags: ['prospect', 'large-account'],
        },
      }),
      this.prisma.crmContact.create({
        data: {
          organizationId: org.id,
          firstName: 'Laura',
          lastName: 'Diaz',
          email: 'laura.diaz@gmail.com',
          phone: '+52 55 7777 8888',
          type: 'lead',
          tags: ['individual'],
        },
      }),
    ]);
    this.logger.log(`Created ${companies.length} companies and ${contacts.length} contacts`);

    // 16. CRM Pipeline
    const pipeline = await this.prisma.crmPipeline.create({
      data: {
        organizationId: org.id,
        name: 'Pipeline de Ventas',
        stages: [
          { id: 'lead', name: 'Lead', order: 0, color: '#3B82F6' },
          { id: 'qualified', name: 'Calificado', order: 1, color: '#8B5CF6' },
          { id: 'proposal', name: 'Propuesta', order: 2, color: '#F59E0B' },
          { id: 'negotiation', name: 'Negociacion', order: 3, color: '#EF4444' },
          { id: 'closed_won', name: 'Cerrado Ganado', order: 4, color: '#10B981' },
          { id: 'closed_lost', name: 'Cerrado Perdido', order: 5, color: '#6B7280' },
        ],
        isDefault: true,
      },
    });

    // 17. CRM Leads
    const leads = await Promise.all([
      this.prisma.crmLead.create({
        data: {
          organizationId: org.id,
          contactId: contacts[2].id,
          pipelineId: pipeline.id,
          stage: 'lead',
          status: 'active',
          title: 'Proyecto de Distribucion Nacional',
          source: 'Referido',
          score: 75,
          estimatedValue: 50000000,
          expectedCloseDate: new Date('2026-09-30'),
        },
      }),
      this.prisma.crmLead.create({
        data: {
          organizationId: org.id,
          contactId: contacts[3].id,
          pipelineId: pipeline.id,
          stage: 'qualified',
          status: 'active',
          title: 'Consultoria Individual',
          source: 'Sitio Web',
          score: 45,
          estimatedValue: 500000,
        },
      }),
      this.prisma.crmLead.create({
        data: {
          organizationId: org.id,
          pipelineId: pipeline.id,
          stage: 'proposal',
          status: 'active',
          title: 'Implementacion CRM Constructora',
          source: 'LinkedIn',
          score: 85,
          estimatedValue: 12000000,
          expectedCloseDate: new Date('2026-08-15'),
        },
      }),
    ]);
    this.logger.log(`Created ${leads.length} leads`);

    // 18. Finance Accounts
    const bankAccount = await this.prisma.financeAccount.create({
      data: {
        organizationId: org.id,
        name: 'Banco Nacional - Cuenta Corriente',
        type: 'bank',
        currency: 'USD',
        balance: 15000000,
        reconciledBalance: 15000000,
      },
    });
    await this.prisma.financeAccount.create({
      data: {
        organizationId: org.id,
        name: 'Caja Chica',
        type: 'cash',
        currency: 'USD',
        balance: 250000,
      },
    });

    // 19. Finance Categories
    const finCats = await Promise.all([
      this.prisma.financeCategory.create({
        data: { organizationId: org.id, name: 'Ventas', type: 'income' },
      }),
      this.prisma.financeCategory.create({
        data: { organizationId: org.id, name: 'Servicios', type: 'income' },
      }),
      this.prisma.financeCategory.create({
        data: { organizationId: org.id, name: 'Salarios', type: 'expense' },
      }),
      this.prisma.financeCategory.create({
        data: { organizationId: org.id, name: 'Alquiler', type: 'expense' },
      }),
      this.prisma.financeCategory.create({
        data: { organizationId: org.id, name: 'Marketing', type: 'expense' },
      }),
    ]);

    // 20. Sales Quotation
    const quotation = await this.prisma.salesQuotation.create({
      data: {
        organizationId: org.id,
        number: 'QT-0001',
        contactId: contacts[0].id,
        status: 'sent',
        validUntil: new Date('2026-08-31'),
        subtotal: 5850000,
        taxRate: 16,
        taxAmount: 936000,
        total: 6786000,
        notes: 'Entrega en 2 semanas',
        createdById: admin.id,
      },
    });
    await this.prisma.salesQuotationItem.create({
      data: {
        quotationId: quotation.id,
        productId: products[0].id,
        description: 'Laptop Pro 15"',
        quantity: 2,
        unitPrice: 2500000,
        subtotal: 5000000,
      },
    });
    await this.prisma.salesQuotationItem.create({
      data: {
        quotationId: quotation.id,
        productId: products[1].id,
        description: 'Monitor 27" 4K',
        quantity: 1,
        unitPrice: 850000,
        subtotal: 850000,
      },
    });

    // 21. Sales Invoice
    const invoice = await this.prisma.salesInvoice.create({
      data: {
        organizationId: org.id,
        number: 'INV-0001',
        contactId: contacts[1].id,
        status: 'sent',
        dueDate: new Date('2026-08-15'),
        subtotal: 450000,
        taxAmount: 72000,
        total: 522000,
        createdById: admin.id,
      },
    });
    await this.prisma.salesInvoiceItem.create({
      data: {
        invoiceId: invoice.id,
        productId: products[4].id,
        description: 'Silla Ergonomica',
        quantity: 1,
        unitPrice: 450000,
        subtotal: 450000,
      },
    });

    // 22. Projects
    const project = await this.prisma.project.create({
      data: {
        organizationId: org.id,
        clientId: contacts[0].id,
        name: 'Implementacion CRM GMT',
        description: 'Proyecto de implementacion del sistema CRM para Grupo Mexicano de Tecnologia',
        status: 'in_progress',
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-09-30'),
        budgetHours: 200,
        createdById: admin.id,
      },
    });

    // 23. Tasks
    await Promise.all([
      this.prisma.task.create({
        data: {
          projectId: project.id,
          title: 'Configurar entorno de produccion',
          description: 'Instalar y configurar todos los servidores necesarios',
          assigneeId: employee2.id,
          createdById: admin.id,
          priority: 'high',
          status: 'in_progress',
          estimatedHours: 16,
        },
      }),
      this.prisma.task.create({
        data: {
          projectId: project.id,
          title: 'Migrar datos del cliente',
          description: 'Migrar datos existentes del CRM antiguo al nuevo sistema',
          assigneeId: employee2.id,
          createdById: admin.id,
          priority: 'medium',
          status: 'todo',
          estimatedHours: 24,
        },
      }),
      this.prisma.task.create({
        data: {
          projectId: project.id,
          title: 'Capacitacion al equipo',
          description: 'Sesion de capacitacion para el equipo de ventas',
          assigneeId: employee1.id,
          createdById: admin.id,
          priority: 'medium',
          status: 'todo',
          estimatedHours: 8,
        },
      }),
    ]);

    // 24. Meeting
    await this.prisma.meeting.create({
      data: {
        organizationId: org.id,
        title: 'Revision de Proyecto GMT',
        description: 'Reunion de seguimiento del proyecto de implementacion',
        date: new Date('2026-07-25T10:00:00Z'),
        endDate: new Date('2026-07-25T11:00:00Z'),
        location: 'Sala de Reuniones Principal',
        organizerId: admin.id,
        attendees: [admin.email, employee1.email, employee2.email],
        status: 'scheduled',
      },
    });

    // 25. Nova Skills
    const novaSkills = [
      { name: 'crm.manage', description: 'Gestionar contactos, empresas y leads en el CRM', requiredPermissions: ['crm:contacts:read', 'crm:contacts:write'], promptTemplate: 'Eres un asistente experto en CRM.', isSystem: true },
      { name: 'sales.manage', description: 'Crear y gestionar cotizaciones, ordenes y facturas', requiredPermissions: ['sales:quotes:read', 'sales:invoices:write'], promptTemplate: 'Eres un asistente experto en ventas.', isSystem: true },
      { name: 'inventory.manage', description: 'Gestionar productos, stock y almacenes', requiredPermissions: ['inventory:products:read', 'inventory:products:write'], promptTemplate: 'Eres un asistente experto en inventario.', isSystem: true },
      { name: 'finance.manage', description: 'Gestionar cuentas, categorias y transacciones', requiredPermissions: ['finance:accounts:read', 'finance:transactions:write'], promptTemplate: 'Eres un asistente experto en finanzas.', isSystem: true },
      { name: 'hr.manage', description: 'Gestionar empleados, ausencias y evaluaciones', requiredPermissions: ['hr:employees:read', 'hr:employees:write'], promptTemplate: 'Eres un asistente experto en recursos humanos.', isSystem: true },
      { name: 'reports.generate', description: 'Generar reportes de ventas, inventario y finanzas', requiredPermissions: ['reports:sales:read'], promptTemplate: 'Eres un asistente experto en reportes.', isSystem: true },
    ];
    for (const skill of novaSkills) {
      await this.prisma.novaSkill.upsert({
        where: { name: skill.name },
        update: skill,
        create: skill,
      });
    }

    this.logger.log('Seed completed successfully!');

    return {
      message: 'Database seeded successfully',
      data: {
        organization: org.name,
        adminUser: admin.email,
        adminPassword: password,
        employees: [employee1.email, employee2.email],
        products: products.length,
        contacts: contacts.length,
        leads: leads.length,
        projects: 1,
      },
    };
  }
}
