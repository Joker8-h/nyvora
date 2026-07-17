const { PrismaClient } = require('/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const creds = await prisma.integrationCredential.findMany({ where: { organizationId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' } });
  console.log('CREDS COUNT:', creds.length);
  creds.forEach((c) => console.log(' -', c.provider, 'active=', c.isActive, 'dataPrefix=', c.data.substring(0, 20)));
  await prisma.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
