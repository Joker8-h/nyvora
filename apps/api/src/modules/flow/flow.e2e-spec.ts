import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '@nyvora/database';

process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nexora-access-secret-test-2024';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'nexora-refresh-secret-test-2024';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://nyvora:nyvoradev@localhost:5434/nyvora?schema=public';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-test';

const UUID = '00000000-0000-0000-0000-000000000000';

describe('Complete Business Flow (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let organizationId: string;

  let contactId: string;
  let companyId: string;
  let pipelineId: string;
  let leadId: string;
  let productId: string;
  let warehouseId: string;
  let quotationId: string;
  let orderId: string;
  let invoiceId: string;
  let financeAccountId: string;
  let positionId: string;
  let employeeId: string;
  let automationId: string;
  let installationId: string;
  let branchId: string;
  let departmentId: string;
  let categoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Truncate all tables for clean test state
    const prisma = app.get(PrismaService);
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE "Organization" CASCADE;
    `);
  }, 30000);

  afterAll(async () => { await app.close(); });

  const auth = () => ({ Authorization: `Bearer ${accessToken}` });

  // ========================================
  // 1. AUTH
  // ========================================
  describe('1. Authentication', () => {
    const testEmail = `flow-${Date.now()}@example.com`;

    it('POST /auth/register', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: 'Password123!', firstName: 'Flow', lastName: 'Tester', organizationName: 'Test Corp' })
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.tokens).toBeDefined();
          accessToken = res.body.tokens.accessToken;
          refreshToken = res.body.tokens.refreshToken;
          userId = res.body.user.id;
          organizationId = res.body.organization?.id;
        });
    });

    it('POST /auth/register duplicate email -> 409', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: testEmail, password: 'Password123!', firstName: 'Dup', lastName: 'Test' })
        .expect(409);
    });

    it('POST /auth/login wrong password -> 401', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'Wrong!' })
        .expect(401);
    });

    it('POST /auth/login non-existent email -> 401', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: `no-${Date.now()}@x.com`, password: 'Password123!' })
        .expect(401);
    });

    it('GET /auth/me', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set(auth())
        .expect(200)
        .expect((res) => { expect(res.body.user.permissions).toBeDefined(); });
    });

    it('POST /auth/refresh', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200)
        .expect((res) => {
          accessToken = res.body.accessToken;
          refreshToken = res.body.refreshToken;
        });
    });

    it('POST /auth/logout', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set(auth())
        .expect(200);
    });

    it('GET /auth/me after logout (JWT still valid until expiry)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('Re-login', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'Password123!' })
        .expect(200)
        .expect((res) => {
          accessToken = res.body.tokens.accessToken;
          refreshToken = res.body.tokens.refreshToken;
        });
    });
  });

  // ========================================
  // 2. ORGANIZATIONS
  // ========================================
  describe('2. Organizations', () => {
    it('GET /organizations?userId=X', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/organizations?userId=${userId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /organizations/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/organizations/${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.id).toBe(organizationId); });
    });

    it('PUT /organizations/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/organizations/${organizationId}`)
        .set(auth()).send({ name: 'Updated Corp' })
        .expect(200)
        .expect((res) => { expect(res.body.name).toBe('Updated Corp'); });
    });
  });

  // ========================================
  // 3. USERS
  // ========================================
  describe('3. Users', () => {
    it('GET /users?organizationId=X', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /users/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/${userId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.id).toBe(userId); });
    });
  });

  // ========================================
  // 4. BRANCHES
  // ========================================
  describe('4. Branches', () => {
    it('POST /branches', () => {
      return request(app.getHttpServer())
        .post('/api/v1/branches').set(auth())
        .send({ organizationId, name: 'Branch Madrid', isHeadquarters: true })
        .expect(201)
        .expect((res) => { branchId = res.body.id; });
    });

    it('GET /branches', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/branches?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /branches/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/branches/${branchId}`).set(auth()).expect(200);
    });

    it('PUT /branches/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/branches/${branchId}`).set(auth())
        .send({ name: 'Branch Updated' }).expect(200);
    });

    it('DELETE /branches/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/branches/${branchId}`).set(auth()).expect(200);
    });
  });

  // ========================================
  // 5. DEPARTMENTS
  // ========================================
  describe('5. Departments', () => {
    it('POST /departments', () => {
      return request(app.getHttpServer())
        .post('/api/v1/departments').set(auth())
        .send({ organizationId, name: 'Engineering' })
        .expect(201)
        .expect((res) => { departmentId = res.body.id; });
    });

    it('GET /departments', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/departments?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /departments/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/departments/${departmentId}`).set(auth()).expect(200);
    });

    it('PUT /departments/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/departments/${departmentId}`).set(auth())
        .send({ name: 'Engineering Updated' }).expect(200);
    });

    it('DELETE /departments/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/departments/${departmentId}`).set(auth()).expect(200);
    });
  });

  // ========================================
  // 6. SESSIONS
  // ========================================
  describe('6. Sessions', () => {
    it('GET /sessions', () => {
      return request(app.getHttpServer())
        .get('/api/v1/sessions').set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });
  });

  // ========================================
  // 7. CRM
  // ========================================
  describe('7. CRM', () => {
    it('POST /crm/companies', () => {
      return request(app.getHttpServer())
        .post('/api/v1/crm/companies').set(auth())
        .send({ name: 'Acme Corp', industry: 'Tech' })
        .expect(201)
        .expect((res) => { companyId = res.body.id; });
    });

    it('GET /crm/companies', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/companies?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /crm/companies/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/companies/${companyId}`).set(auth()).expect(200);
    });

    it('PUT /crm/companies/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/crm/companies/${companyId}`).set(auth())
        .send({ name: 'Acme Updated' }).expect(200);
    });

    it('GET /crm/companies/:id non-existent -> 404', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/companies/${UUID}`).set(auth()).expect(404);
    });

    it('POST /crm/contacts', () => {
      return request(app.getHttpServer())
        .post('/api/v1/crm/contacts').set(auth())
        .send({ firstName: 'John', lastName: 'Doe', email: 'john@acme.com', companyId })
        .expect(201)
        .expect((res) => { contactId = res.body.id; });
    });

    it('GET /crm/contacts', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/contacts?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /crm/contacts/:id (includes company)', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/contacts/${contactId}`).set(auth()).expect(200)
        .expect((res) => { expect(res.body.company).toBeDefined(); });
    });

    it('PUT /crm/contacts/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/crm/contacts/${contactId}`).set(auth())
        .send({ phone: '+1234567890' }).expect(200);
    });

    it('GET /crm/contacts/:id non-existent -> 404', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/contacts/${UUID}`).set(auth()).expect(404);
    });

    it('POST /crm/pipelines', () => {
      return request(app.getHttpServer())
        .post('/api/v1/crm/pipelines').set(auth())
        .send({ name: 'Sales Pipeline', stages: ['lead', 'proposal', 'closed'] })
        .expect(201)
        .expect((res) => { pipelineId = res.body.id; });
    });

    it('GET /crm/pipelines', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/pipelines?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('POST /crm/leads', () => {
      return request(app.getHttpServer())
        .post('/api/v1/crm/leads').set(auth())
        .send({ pipelineId, stage: 'lead', contactId, source: 'website', score: 80 })
        .expect(201)
        .expect((res) => { leadId = res.body.id; });
    });

    it('GET /crm/leads', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/crm/leads?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('DELETE /crm/leads/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/crm/leads/${leadId}`).set(auth()).expect(200);
    });

    it('DELETE /crm/pipelines/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/crm/pipelines/${pipelineId}`).set(auth()).expect(200);
    });

    it('DELETE /crm/contacts/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/crm/contacts/${contactId}`).set(auth()).expect(200);
    });

    it('DELETE /crm/companies/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/crm/companies/${companyId}`).set(auth()).expect(200);
    });
  });

  // ========================================
  // 8. INVENTORY
  // ========================================
  describe('8. Inventory', () => {
    it('POST /inventory/categories', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/categories').set(auth())
        .send({ organizationId, name: 'Electronics' })
        .expect(201)
        .expect((res) => { categoryId = res.body.id; });
    });

    it('GET /inventory/categories', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/inventory/categories?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('DELETE /inventory/categories/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/inventory/categories/${categoryId}`).set(auth()).expect(200);
    });

    it('POST /inventory/warehouses', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/warehouses').set(auth())
        .send({ organizationId, name: 'Main Warehouse' })
        .expect(201)
        .expect((res) => { warehouseId = res.body.id; });
    });

    it('GET /inventory/warehouses', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/inventory/warehouses?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /inventory/warehouses/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/inventory/warehouses/${warehouseId}`).set(auth()).expect(200);
    });

    it('PUT /inventory/warehouses/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/inventory/warehouses/${warehouseId}`).set(auth())
        .send({ name: 'Warehouse Updated' }).expect(200);
    });

    it('DELETE /inventory/warehouses/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/inventory/warehouses/${warehouseId}`).set(auth()).expect(200);
    });

    it('POST /inventory/warehouses (re-create for stock)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/warehouses').set(auth())
        .send({ organizationId, name: 'Stock WH' })
        .expect(201)
        .expect((res) => { warehouseId = res.body.id; });
    });

    it('POST /inventory/products', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/products').set(auth())
        .send({ organizationId, sku: 'WGT-001', name: 'Widget Pro', unitPrice: 2500, currency: 'USD' })
        .expect(201)
        .expect((res) => { productId = res.body.id; });
    });

    it('GET /inventory/products', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/inventory/products?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /inventory/products/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/inventory/products/${productId}`).set(auth()).expect(200);
    });

    it('PUT /inventory/products/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/inventory/products/${productId}`).set(auth())
        .send({ name: 'Widget Pro Updated' }).expect(200);
    });

    it('DELETE /inventory/products/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/inventory/products/${productId}`).set(auth()).expect(200);
    });

    it('POST /inventory/products (re-create for stock)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/products').set(auth())
        .send({ organizationId, sku: 'WGT-002', name: 'Widget V2', unitPrice: 3000, currency: 'USD' })
        .expect(201)
        .expect((res) => { productId = res.body.id; });
    });

    it('POST /inventory/stock/movements (in: 100)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/stock/movements').set(auth())
        .send({ productId, warehouseId, type: 'in', quantity: 100, reason: 'Initial' })
        .expect(201);
    });

    it('GET /inventory/stock - quantity should be 100', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/inventory/stock?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => {
          const stock = res.body.find((s: any) => s.productId === productId);
          expect(stock.quantity).toBe(100);
        });
    });

    it('POST /inventory/stock/movements (out: 30)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/stock/movements').set(auth())
        .send({ productId, warehouseId, type: 'out', quantity: 30, reason: 'Sale' })
        .expect(201);
    });

    it('POST /inventory/stock/movements (out: 999) -> 400', () => {
      return request(app.getHttpServer())
        .post('/api/v1/inventory/stock/movements').set(auth())
        .send({ productId, warehouseId, type: 'out', quantity: 999 })
        .expect(400);
    });
  });

  // ========================================
  // 9. SALES
  // ========================================
  describe('9. Sales', () => {
    it('POST /sales/quotations', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sales/quotations').set(auth())
        .send({ contactId, items: [{ productId, description: 'Widget', quantity: 10, unitPrice: 3000 }], taxRate: 16 })
        .expect(201)
        .expect((res) => {
          quotationId = res.body.id;
          expect(res.body.number).toMatch(/^Q-\d{4}-\d{5}$/);
        });
    });

    it('GET /sales/quotations', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/quotations?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /sales/quotations/:id (includes items)', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/quotations/${quotationId}`).set(auth()).expect(200)
        .expect((res) => { expect(res.body.items).toBeDefined(); });
    });

    it('POST /sales/orders', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sales/orders').set(auth())
        .send({ contactId, quotationId, items: [{ productId, description: 'Widget', quantity: 10, unitPrice: 3000 }] })
        .expect(201)
        .expect((res) => {
          orderId = res.body.id;
          expect(res.body.number).toMatch(/^SO-\d{4}-\d{5}$/);
        });
    });

    it('GET /sales/orders', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/orders?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /sales/orders/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/orders/${orderId}`).set(auth()).expect(200);
    });

    it('POST /sales/invoices', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sales/invoices').set(auth())
        .send({ contactId, orderId, items: [{ productId, description: 'Widget', quantity: 10, unitPrice: 3000 }] })
        .expect(201)
        .expect((res) => {
          invoiceId = res.body.id;
          expect(res.body.number).toMatch(/^INV-\d{4}-\d{5}$/);
          expect(res.body.status).toBe('draft');
        });
    });

    it('GET /sales/invoices', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/invoices?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /sales/invoices/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/invoices/${invoiceId}`).set(auth()).expect(200);
    });

    it('POST /sales/payments (partial: 15000)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sales/payments').set(auth())
        .send({ invoiceId, amount: 15000, method: 'transfer' })
        .expect(201);
    });

    it('GET /sales/invoices/:id - status should be partial', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/invoices/${invoiceId}`).set(auth()).expect(200)
        .expect((res) => {
          expect(res.body.paidAmount).toBe(15000);
          expect(res.body.status).toBe('partial');
        });
    });

    it('POST /sales/payments (remaining: 15000)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sales/payments').set(auth())
        .send({ invoiceId, amount: 15000, method: 'cash' })
        .expect(201);
    });

    it('GET /sales/invoices/:id - status should be paid', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/invoices/${invoiceId}`).set(auth()).expect(200)
        .expect((res) => {
          expect(res.body.paidAmount).toBe(30000);
          expect(res.body.status).toBe('paid');
        });
    });

    it('POST /sales/payments (overpay) -> 400', () => {
      return request(app.getHttpServer())
        .post('/api/v1/sales/payments').set(auth())
        .send({ invoiceId, amount: 1, method: 'cash' })
        .expect(400);
    });

    it('GET /sales/payments', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/sales/payments?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(2); });
    });
  });

  // ========================================
  // 10. FINANCE
  // ========================================
  describe('10. Finance', () => {
    it('POST /finance/accounts', () => {
      return request(app.getHttpServer())
        .post('/api/v1/finance/accounts').set(auth())
        .send({ organizationId, name: 'Business Bank', type: 'asset', currency: 'USD' })
        .expect(201)
        .expect((res) => {
          financeAccountId = res.body.id;
          expect(res.body.balance).toBe(0);
        });
    });

    it('GET /finance/accounts', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/finance/accounts?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /finance/accounts/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/finance/accounts/${financeAccountId}`).set(auth()).expect(200);
    });

    it('PUT /finance/accounts/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/finance/accounts/${financeAccountId}`).set(auth())
        .send({ name: 'Bank Updated' }).expect(200);
    });

    it('POST /finance/categories', () => {
      return request(app.getHttpServer())
        .post('/api/v1/finance/categories').set(auth())
        .send({ organizationId, name: 'Revenue', type: 'income' })
        .expect(201)
        .expect((res) => { expect(res.body.id).toBeDefined(); });
    });

    it('GET /finance/categories', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/finance/categories?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('POST /finance/transactions (income: 14000)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/finance/transactions').set(auth())
        .send({ accountId: financeAccountId, type: 'income', amount: 14000, description: 'Client payment', transactionDate: new Date().toISOString() })
        .expect(201)
        .expect((res) => { expect(res.body.id).toBeDefined(); });
    });

    it('GET /finance/accounts/:id - balance should be 14000', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/finance/accounts/${financeAccountId}`).set(auth()).expect(200)
        .expect((res) => { expect(res.body.balance).toBe(14000); });
    });

    it('POST /finance/transactions (expense: 3000)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/finance/transactions').set(auth())
        .send({ accountId: financeAccountId, type: 'expense', amount: 3000, description: 'Office supplies', transactionDate: new Date().toISOString() })
        .expect(201);
    });

    it('GET /finance/accounts/:id - balance should be 11000', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/finance/accounts/${financeAccountId}`).set(auth()).expect(200)
        .expect((res) => { expect(res.body.balance).toBe(11000); });
    });

    it('GET /finance/transactions', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/finance/transactions?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(2); });
    });

    it('GET /finance/reports/profit-loss', () => {
      const from = new Date(Date.now() - 86400000).toISOString();
      const to = new Date(Date.now() + 86400000).toISOString();
      return request(app.getHttpServer())
        .get(`/api/v1/finance/reports/profit-loss?from=${from}&to=${to}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.income).toBeDefined(); expect(res.body.expenses).toBeDefined(); });
    });

    it('GET /finance/reports/balance-sheet', () => {
      return request(app.getHttpServer())
        .get('/api/v1/finance/reports/balance-sheet')
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.assets).toBeDefined(); });
    });

    it('DELETE /finance/accounts/:id (soft delete)', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/finance/accounts/${financeAccountId}`).set(auth()).expect(200);
    });
  });

  // ========================================
  // 11. HR
  // ========================================
  describe('11. HR', () => {
    it('POST /hr/positions', () => {
      return request(app.getHttpServer())
        .post('/api/v1/hr/positions').set(auth())
        .send({ organizationId, name: 'Software Engineer' })
        .expect(201)
        .expect((res) => { positionId = res.body.id; });
    });

    it('GET /hr/positions', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/hr/positions?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /hr/positions/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/hr/positions/${positionId}`).set(auth()).expect(200);
    });

    it('DELETE /hr/positions/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/hr/positions/${positionId}`).set(auth()).expect(200);
    });

    it('POST /hr/employees', () => {
      return request(app.getHttpServer())
        .post('/api/v1/hr/employees').set(auth())
        .send({ organizationId, firstName: 'Maria', lastName: 'Garcia', email: 'maria@company.com', hireDate: new Date().toISOString(), salary: 45000, contractType: 'permanent' })
        .expect(201)
        .expect((res) => { employeeId = res.body.id; });
    });

    it('GET /hr/employees', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/hr/employees?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /hr/employees/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/hr/employees/${employeeId}`).set(auth()).expect(200);
    });

    it('PUT /hr/employees/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/hr/employees/${employeeId}`).set(auth())
        .send({ phone: '+987654321' }).expect(200);
    });

    it('GET /hr/employees/:id non-existent -> 404', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/hr/employees/${UUID}`).set(auth()).expect(404);
    });

    it('POST /hr/absences', () => {
      return request(app.getHttpServer())
        .post('/api/v1/hr/absences').set(auth())
        .send({ employeeId, type: 'vacation', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 5 * 86400000).toISOString() })
        .expect(201);
    });

    it('GET /hr/absences?employeeId=X', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/hr/absences?employeeId=${employeeId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('POST /hr/evaluations', () => {
      return request(app.getHttpServer())
        .post('/api/v1/hr/evaluations').set(auth())
        .send({ employeeId, period: '2024-Q1', selfScore: 85, managerScore: 90 })
        .expect(201);
    });

    it('GET /hr/evaluations?employeeId=X', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/hr/evaluations?employeeId=${employeeId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('DELETE /hr/employees/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/hr/employees/${employeeId}`).set(auth()).expect(200);
    });
  });

  // ========================================
  // 12. AUTOMATIONS
  // ========================================
  describe('12. Automations', () => {
    it('POST /automations', () => {
      return request(app.getHttpServer())
        .post('/api/v1/automations').set(auth())
        .send({ name: 'Lead Notification', triggerType: 'lead.created', triggerConfig: { type: 'lead.created' }, actions: [{ type: 'notify', config: { channel: 'email' } }] })
        .expect(201)
        .expect((res) => { automationId = res.body.id; expect(res.body.status).toBe('draft'); });
    });

    it('GET /automations', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/automations?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /automations/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/automations/${automationId}`).set(auth()).expect(200);
    });

    it('PUT /automations/:id', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/automations/${automationId}`).set(auth())
        .send({ name: 'Updated Automation' }).expect(200);
    });

    it('POST /automations/:id/toggle (draft -> active)', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/automations/${automationId}/toggle`).set(auth()).expect(200)
        .expect((res) => { expect(res.body.status).toBe('active'); });
    });

    it('POST /automations/:id/toggle (active -> paused)', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/automations/${automationId}/toggle`).set(auth()).expect(200)
        .expect((res) => { expect(res.body.status).toBe('paused'); });
    });

    it('POST /automations/:id/execute', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/automations/${automationId}/execute`).set(auth()).expect(200)
        .expect((res) => { expect(res.body.success).toBe(true); });
    });

    it('GET /automations/:id non-existent -> 404', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/automations/${UUID}`).set(auth()).expect(404);
    });

    it('DELETE /automations/:id', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/automations/${automationId}`).set(auth()).expect(200);
    });
  });

  // ========================================
  // 13. MARKETPLACE
  // ========================================
  describe('13. Marketplace', () => {
    it('POST /marketplace/apps/install', () => {
      return request(app.getHttpServer())
        .post('/api/v1/marketplace/apps/install').set(auth())
        .send({ organizationId, appId: 'whatsapp-business', config: { phone: '+123' } })
        .expect(201)
        .expect((res) => { installationId = res.body.id; expect(res.body.appId).toBe('whatsapp-business'); });
    });

    it('GET /marketplace/apps', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/marketplace/apps?organizationId=${organizationId}`)
        .set(auth()).expect(200)
        .expect((res) => { expect(res.body.length).toBeGreaterThanOrEqual(1); });
    });

    it('GET /marketplace/apps/:id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/marketplace/apps/${installationId}`).set(auth()).expect(200);
    });

    it('PUT /marketplace/apps/:id/config', () => {
      return request(app.getHttpServer())
        .put(`/api/v1/marketplace/apps/${installationId}/config`).set(auth())
        .send({ config: { phone: '+999' } }).expect(200);
    });

    it('POST /marketplace/apps/install duplicate -> 409', () => {
      return request(app.getHttpServer())
        .post('/api/v1/marketplace/apps/install').set(auth())
        .send({ organizationId, appId: 'whatsapp-business' }).expect(409);
    });

    it('DELETE /marketplace/apps/:id/uninstall', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/marketplace/apps/${installationId}/uninstall`).set(auth()).expect(200);
    });
  });

  // ========================================
  // 14. HEALTH
  // ========================================
  describe('14. Health', () => {
    it('GET /health', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health').expect(200)
        .expect((res) => { expect(res.body.status).toBe('ok'); });
    });
  });
});
