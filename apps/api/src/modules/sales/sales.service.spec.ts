import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { PrismaService } from '@nyvora/database';

describe('SalesService', () => {
  let service: SalesService;
  let prisma: Record<string, any>;

  const mockOrgId = 'org-123';

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn((promises) => Promise.all(promises)),
      salesQuotation: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'q-1', ...data, items: data.items?.create || [] })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      salesOrder: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'o-1', ...data, items: data.items?.create || [] })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      salesInvoice: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'inv-1', ...data, items: data.items?.create || [] })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      salesPayment: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'pay-1', ...data })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  // QUOTATIONS
  describe('Quotations', () => {
    it('should find quotations', async () => {
      const result = await service.findQuotations(mockOrgId);
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });

    it('should find quotation by id', async () => {
      prisma.salesQuotation.findUnique.mockResolvedValue({ id: 'q-1', number: 'Q-2026-00001' });
      const result = await service.findQuotationById('q-1');
      expect(result.number).toBe('Q-2026-00001');
    });

    it('should throw for missing quotation', async () => {
      await expect(service.findQuotationById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create quotation with calculated totals', async () => {
      prisma.salesQuotation.count.mockResolvedValue(0);
      const data = {
        organizationId: mockOrgId,
        items: [
          { description: 'Item 1', quantity: 2, unitPrice: BigInt(1000) },
          { description: 'Item 2', quantity: 1, unitPrice: BigInt(500) },
        ],
        taxRate: 16,
      };
      const result = await service.createQuotation(data);
      expect(prisma.salesQuotation.create).toHaveBeenCalled();
    });

    it('should soft-delete quotation', async () => {
      prisma.salesQuotation.findUnique.mockResolvedValue({ id: 'q-1' });
      await service.deleteQuotation('q-1');
      expect(prisma.salesQuotation.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) }),
      );
    });
  });

  // ORDERS
  describe('Orders', () => {
    it('should find orders', async () => {
      const result = await service.findOrders(mockOrgId);
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });

    it('should find order by id', async () => {
      prisma.salesOrder.findUnique.mockResolvedValue({ id: 'o-1' });
      const result = await service.findOrderById('o-1');
      expect(result.id).toBe('o-1');
    });

    it('should throw for missing order', async () => {
      await expect(service.findOrderById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create order', async () => {
      prisma.salesOrder.count.mockResolvedValue(0);
      const data = {
        organizationId: mockOrgId,
        items: [{ description: 'Widget', quantity: 3, unitPrice: BigInt(2000) }],
      };
      const result = await service.createOrder(data);
      expect(prisma.salesOrder.create).toHaveBeenCalled();
    });

    it('should soft-delete order', async () => {
      prisma.salesOrder.findUnique.mockResolvedValue({ id: 'o-1' });
      await service.deleteOrder('o-1');
      expect(prisma.salesOrder.update).toHaveBeenCalled();
    });
  });

  // INVOICES
  describe('Invoices', () => {
    it('should find invoices', async () => {
      const result = await service.findInvoices(mockOrgId);
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });

    it('should find invoice by id', async () => {
      prisma.salesInvoice.findUnique.mockResolvedValue({ id: 'inv-1', paidAmount: BigInt(0) });
      const result = await service.findInvoiceById('inv-1');
      expect(result.id).toBe('inv-1');
    });

    it('should throw for missing invoice', async () => {
      await expect(service.findInvoiceById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create invoice', async () => {
      prisma.salesInvoice.count.mockResolvedValue(0);
      const data = {
        organizationId: mockOrgId,
        contactId: 'c-1',
        items: [{ description: 'Service', quantity: 1, unitPrice: BigInt(10000) }],
      };
      const result = await service.createInvoice(data);
      expect(prisma.salesInvoice.create).toHaveBeenCalled();
    });

    it('should soft-delete invoice', async () => {
      prisma.salesInvoice.findUnique.mockResolvedValue({ id: 'inv-1' });
      await service.deleteInvoice('inv-1');
      expect(prisma.salesInvoice.update).toHaveBeenCalled();
    });
  });

  // PAYMENTS
  describe('Payments', () => {
    it('should find payments', async () => {
      const result = await service.findPayments(mockOrgId);
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });

    it('should create payment', async () => {
      prisma.salesInvoice.findUnique.mockResolvedValue({
        id: 'inv-1',
        paidAmount: BigInt(0),
        total: BigInt(10000),
      });
      const data = {
        organizationId: mockOrgId,
        invoiceId: 'inv-1',
        amount: BigInt(5000),
        method: 'transfer',
      };
      const result = await service.createPayment(data);
      expect(prisma.salesPayment.create).toHaveBeenCalled();
      expect(prisma.salesInvoice.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ paidAmount: BigInt(5000), status: 'partial' }) }),
      );
    });

    it('should mark invoice as paid when full amount', async () => {
      prisma.salesInvoice.findUnique.mockResolvedValue({
        id: 'inv-1',
        paidAmount: BigInt(0),
        total: BigInt(10000),
      });
      await service.createPayment({
        organizationId: mockOrgId,
        invoiceId: 'inv-1',
        amount: BigInt(10000),
        method: 'cash',
      });
      expect(prisma.salesInvoice.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'paid' }) }),
      );
    });

    it('should reject overpayment', async () => {
      prisma.salesInvoice.findUnique.mockResolvedValue({
        id: 'inv-1',
        paidAmount: BigInt(8000),
        total: BigInt(10000),
      });
      await expect(
        service.createPayment({
          organizationId: mockOrgId,
          invoiceId: 'inv-1',
          amount: BigInt(5000),
          method: 'cash',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
