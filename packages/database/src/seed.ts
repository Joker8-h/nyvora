import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ============================================
  // NOVA SKILLS
  // ============================================
  const novaSkills = [
    {
      name: 'crm.manage',
      description: 'Gestionar contactos, empresas y leads en el CRM',
      requiredPermissions: ['crm:contacts:read', 'crm:contacts:write'],
      promptTemplate: 'Eres un asistente experto en CRM. Ayuda a gestionar contactos, empresas y leads.',
      isSystem: true,
    },
    {
      name: 'sales.manage',
      description: 'Crear y gestionar cotizaciones, ordenes y facturas',
      requiredPermissions: ['sales:quotes:read', 'sales:invoices:write'],
      promptTemplate: 'Eres un asistente experto en ventas. Ayuda a crear cotizaciones, ordenes y facturas.',
      isSystem: true,
    },
    {
      name: 'inventory.manage',
      description: 'Gestionar productos, stock y almacenes',
      requiredPermissions: ['inventory:products:read', 'inventory:products:write'],
      promptTemplate: 'Eres un asistente experto en inventario. Ayuda a gestionar productos y stock.',
      isSystem: true,
    },
    {
      name: 'finance.manage',
      description: 'Gestionar cuentas, categorias y transacciones financieras',
      requiredPermissions: ['finance:accounts:read', 'finance:transactions:write'],
      promptTemplate: 'Eres un asistente experto en finanzas. Ayuda a gestionar cuentas y transacciones.',
      isSystem: true,
    },
    {
      name: 'hr.manage',
      description: 'Gestionar empleados, ausencias y evaluaciones',
      requiredPermissions: ['hr:employees:read', 'hr:employees:write'],
      promptTemplate: 'Eres un asistente experto en recursos humanos. Ayuda a gestionar empleados y nominas.',
      isSystem: true,
    },
    {
      name: 'reports.generate',
      description: 'Generar reportes de ventas, inventario y finanzas',
      requiredPermissions: ['reports:sales:read', 'reports:inventory:read'],
      promptTemplate: 'Eres un asistente experto en reportes. Genera reportes detallados de ventas, inventario y finanzas.',
      isSystem: true,
    },
    {
      name: 'scheduling.manage',
      description: 'Gestionar reuniones, tareas y calendario',
      requiredPermissions: ['calendar:meetings:read', 'tasks:read'],
      promptTemplate: 'Eres un asistente experto en calendario. Ayuda a gestionar reuniones y tareas.',
      isSystem: true,
    },
    {
      name: 'automations.manage',
      description: 'Crear y gestionar automatizaciones y workflows',
      requiredPermissions: ['automations:read', 'automations:write'],
      promptTemplate: 'Eres un asistente experto en automatizaciones. Ayuda a crear workflows y automatizaciones.',
      isSystem: true,
    },
  ];

  for (const skill of novaSkills) {
    await prisma.novaSkill.upsert({
      where: { name: skill.name },
      update: skill,
      create: skill,
    });
  }
  console.log(`Created ${novaSkills.length} Nova skills`);

  // ============================================
  // DEFAULT CRM PIPELINE
  // ============================================
  const defaultPipeline = await prisma.crmPipeline.upsert({
    where: { id: 'default-pipeline' },
    update: {},
    create: {
      id: 'default-pipeline',
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
  console.log(`Created default pipeline: ${defaultPipeline.name}`);

  // ============================================
  // DEFAULT FINANCE CATEGORIES
  // ============================================
  const financeCategories = [
    { name: 'Ventas', type: 'income', parentId: null },
    { name: 'Servicios', type: 'income', parentId: null },
    { name: 'Consultoria', type: 'income', parentId: null },
    { name: 'Salarios', type: 'expense', parentId: null },
    { name: 'Alquiler', type: 'expense', parentId: null },
    { name: 'Servicios Basicos', type: 'expense', parentId: null },
    { name: 'Marketing', type: 'expense', parentId: null },
    { name: 'Suministros', type: 'expense', parentId: null },
    { name: 'Impuestos', type: 'expense', parentId: null },
    { name: 'Bancarios', type: 'expense', parentId: null },
  ];

  for (const cat of financeCategories) {
    await prisma.financeCategory.upsert({
      where: { id: `cat-${cat.name.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: {
        id: `cat-${cat.name.toLowerCase().replace(/\s/g, '-')}`,
        organizationId: 'system',
        name: cat.name,
        type: cat.type,
        parentId: cat.parentId,
      },
    });
  }
  console.log(`Created ${financeCategories.length} finance categories`);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
