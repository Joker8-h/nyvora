import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '@nyvora/database';

describe('CRM Import (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let organizationId: string;
  const email = `import-e2e-${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.$connect();

    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email,
        password: 'Test123!',
        firstName: 'Import',
        lastName: 'E2E',
        organizationName: `Import E2E Org ${Date.now()}`,
      })
      .expect(201);
    accessToken = reg.body.tokens.accessToken;
    organizationId = reg.body.organization.id;
  }, 30000);

  afterAll(async () => {
    if (organizationId) {
      await prisma.crmContact.deleteMany({ where: { organizationId } }).catch(() => {});
      await prisma.employee.deleteMany({ where: { organizationId } }).catch(() => {});
      await prisma.crmCompany.deleteMany({ where: { organizationId } }).catch(() => {});
      await prisma.organization.delete({ where: { id: organizationId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  const auth = () => ({ Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' });

  it('imports contacts and auto-creates company', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/crm/import/contacts')
      .set(auth())
      .send({
        rows: [
          { firstName: 'Juan', lastName: 'Perez', email: 'juan@import.com', companyName: 'Acme' },
          { firstName: 'Maria', lastName: 'Lopez', email: 'maria@import.com', type: 'client' },
        ],
      })
      .expect(200);

    expect(res.body.created).toBe(2);
    expect(res.body.errors).toHaveLength(0);

    const company = await prisma.crmCompany.findFirst({
      where: { organizationId, name: 'Acme' },
    });
    expect(company).toBeDefined();
    const juan = await prisma.crmContact.findFirst({
      where: { organizationId, email: 'juan@import.com' },
    });
    expect(juan?.companyId).toBe(company?.id);
  });

  it('skips duplicate contacts by email', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/crm/import/contacts')
      .set(auth())
      .send({ rows: [{ firstName: 'Juan', lastName: 'Perez', email: 'juan@import.com' }] })
      .expect(200);

    expect(res.body.created).toBe(0);
    expect(res.body.skipped).toBe(1);
  });

  it('imports employees and auto-creates department + position', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/crm/import/employees')
      .set(auth())
      .send({
        rows: [
          {
            firstName: 'Carlos',
            lastName: 'Gomez',
            email: 'carlos@import.com',
            departmentName: 'Ventas',
            positionName: 'Vendedor',
            salary: 1500,
            hireDate: '2024-01-15',
          },
        ],
      })
      .expect(200);

    expect(res.body.created).toBe(1);
    const emp = await prisma.employee.findFirst({
      where: { organizationId, email: 'carlos@import.com' },
      include: { department: true, position: true },
    });
    expect(emp?.department?.name).toBe('Ventas');
    expect(emp?.position?.name).toBe('Vendedor');
    expect(emp?.salary?.toString()).toBe('1500');
  });

  it('rejects employees with missing required fields', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/crm/import/employees')
      .set(auth())
      .send({ rows: [{ firstName: 'Sin', lastName: 'Email' }] })
      .expect(200);

    expect(res.body.created).toBe(0);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('imports companies with deduplication', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/crm/import/companies')
      .set(auth())
      .send({
        rows: [
          { name: 'Empresa Uno', industry: 'Tech' },
          { name: 'Empresa Uno', industry: 'Tech' },
        ],
      })
      .expect(200);

    expect(res.body.created).toBe(1);
    expect(res.body.skipped).toBe(1);
  });
});
