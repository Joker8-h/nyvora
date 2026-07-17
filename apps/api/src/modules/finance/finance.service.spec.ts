import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { PrismaService } from '@nyvora/database';

describe('FinanceService', () => {
  let service: FinanceService;
  let prisma: Record<string, any>;

  const mockOrgId = 'org-123';

  beforeEach(async () => {
    prisma = {
      financeAccount: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'acc-1', ...data, balance: BigInt(0) })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      financeCategory: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'fc-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
      financeTransaction: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'tx-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
  });

  // ACCOUNTS
  describe('Accounts', () => {
    it('should find accounts', async () => {
      const result = await service.findAccounts(mockOrgId);
      expect(result).toEqual([]);
    });

    it('should find account by id', async () => {
      prisma.financeAccount.findUnique.mockResolvedValue({ id: 'acc-1', name: 'Bank' });
      const result = await service.findAccountById('acc-1');
      expect(result.name).toBe('Bank');
    });

    it('should throw for missing account', async () => {
      await expect(service.findAccountById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create account', async () => {
      const result = await service.createAccount({ organizationId: mockOrgId, name: 'Savings', type: 'asset' });
      expect(result.name).toBe('Savings');
    });

    it('should soft-disable account on delete', async () => {
      prisma.financeAccount.findUnique.mockResolvedValue({ id: 'acc-1' });
      await service.deleteAccount('acc-1');
      expect(prisma.financeAccount.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isActive: false } }),
      );
    });
  });

  // CATEGORIES
  describe('Categories', () => {
    it('should find categories', async () => {
      const result = await service.findCategories(mockOrgId);
      expect(result).toEqual([]);
    });

    it('should find category by id', async () => {
      prisma.financeCategory.findUnique.mockResolvedValue({ id: 'fc-1', name: 'Office Supplies' });
      const result = await service.findCategoryById('fc-1');
      expect(result.name).toBe('Office Supplies');
    });

    it('should throw for missing category', async () => {
      await expect(service.findCategoryById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create category', async () => {
      const result = await service.createCategory({ organizationId: mockOrgId, name: 'Travel', type: 'expense' });
      expect(result.name).toBe('Travel');
    });

    it('should hard-delete category', async () => {
      prisma.financeCategory.findUnique.mockResolvedValue({ id: 'fc-1' });
      await service.deleteCategory('fc-1');
      expect(prisma.financeCategory.delete).toHaveBeenCalledWith({ where: { id: 'fc-1' } });
    });
  });

  // TRANSACTIONS
  describe('Transactions', () => {
    it('should find transactions', async () => {
      const result = await service.findTransactions(mockOrgId);
      expect(result).toEqual([]);
    });

    it('should find transaction by id', async () => {
      prisma.financeTransaction.findUnique.mockResolvedValue({ id: 'tx-1', type: 'income' });
      const result = await service.findTransactionById('tx-1');
      expect(result.type).toBe('income');
    });

    it('should throw for missing transaction', async () => {
      await expect(service.findTransactionById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create income transaction and update balance', async () => {
      prisma.financeAccount.findUnique.mockResolvedValue({ id: 'acc-1', balance: BigInt(5000) });
      await service.createTransaction({
        organizationId: mockOrgId,
        accountId: 'acc-1',
        type: 'income',
        amount: BigInt(2000),
        transactionDate: new Date(),
      });
      expect(prisma.financeAccount.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { balance: BigInt(7000) } }),
      );
    });

    it('should create expense transaction and deduct balance', async () => {
      prisma.financeAccount.findUnique.mockResolvedValue({ id: 'acc-1', balance: BigInt(5000) });
      await service.createTransaction({
        organizationId: mockOrgId,
        accountId: 'acc-1',
        type: 'expense',
        amount: BigInt(1500),
        transactionDate: new Date(),
      });
      expect(prisma.financeAccount.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { balance: BigInt(3500) } }),
      );
    });

    it('should reverse balance on delete', async () => {
      prisma.financeTransaction.findUnique.mockResolvedValue({
        id: 'tx-1',
        type: 'income',
        amount: BigInt(2000),
        accountId: 'acc-1',
      });
      prisma.financeAccount.findUnique.mockResolvedValue({ id: 'acc-1', balance: BigInt(7000) });
      await service.deleteTransaction('tx-1');
      expect(prisma.financeAccount.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { balance: BigInt(5000) } }),
      );
      expect(prisma.financeTransaction.delete).toHaveBeenCalled();
    });
  });

  // REPORTS
  describe('Reports', () => {
    it('should calculate profit & loss', async () => {
      prisma.financeTransaction.findMany.mockResolvedValue([
        { type: 'income', amount: BigInt(10000) },
        { type: 'income', amount: BigInt(5000) },
        { type: 'expense', amount: BigInt(3000) },
      ]);
      const result = await service.getProfitLoss(mockOrgId, '2026-01-01', '2026-12-31');
      expect(result.income).toBe(BigInt(15000));
      expect(result.expenses).toBe(BigInt(3000));
      expect(result.netIncome).toBe(BigInt(12000));
    });

    it('should return balance sheet grouped by type', async () => {
      prisma.financeAccount.findMany.mockResolvedValue([
        { type: 'asset', name: 'Cash' },
        { type: 'liability', name: 'Loan' },
        { type: 'asset', name: 'Equipment' },
        { type: 'equity', name: 'Capital' },
      ]);
      const result = await service.getBalanceSheet(mockOrgId);
      expect(result.assets).toHaveLength(2);
      expect(result.liabilities).toHaveLength(1);
      expect(result.equity).toHaveLength(1);
    });
  });
});
