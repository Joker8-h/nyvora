const { PrismaClient } = require('/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@nexora.com' },
    include: { memberships: { include: { organization: true } } },
  });
  console.log('ROLE:', user.memberships[0]?.role);
  console.log('ORG:', user.memberships[0]?.organizationId);
  const meeting = await prisma.meeting.findMany({ where: { organizationId: user.memberships[0]?.organizationId } });
  console.log('EXISTING MEETINGS:', meeting.length);
  await prisma.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
