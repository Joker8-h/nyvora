import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const org = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Nexora Demo',
      slug: 'nexora-demo',
      currency: 'USD',
    },
  });

  console.log('  ✓ Organization:', org.name);

  const user = await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'admin@nexora.demo',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$placeholder$placeholder',
      status: 'active',
    },
  });

  console.log('  ✓ User:', user.email);

  await prisma.membership.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      userId: user.id,
      organizationId: org.id,
      role: 'owner',
    },
  });

  console.log('  ✓ Membership: owner');
  console.log('🌱 Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
