import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // ACCOUNTS
  // ============================================
  async findAccounts(organizationId: string, type?: string) {
    const where = { organizationId, isActive: true, ...(type ? { type } : {}) };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.financeAccount.findMany({
        where,
        include: { _count: { select: { transactions: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.financeAccount.count({ where }),
    ]);
    return { data: rows, total };
  }

  async findAccountById(id: string) {
    const account = await this.prisma.financeAccount.findUnique({
      where: { id },
      include: { transactions: { orderBy: { transactionDate: 'desc' }, take: 50 } },
    });
    if (!account) throw new NotFoundException('Cuenta no encontrada');
    return account;
  }

  async createAccount(data: { organizationId: string; name: string; type: string; currency?: string }) {
    return this.prisma.financeAccount.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        type: data.type,
        currency: data.currency,
      },
    });
  }

  async updateAccount(id: string, data: Record<string, any>) {
    await this.findAccountById(id);
    return this.prisma.financeAccount.update({ where: { id }, data });
  }

  async deleteAccount(id: string) {
    await this.findAccountById(id);
    return this.prisma.financeAccount.update({ where: { id }, data: { isActive: false } });
  }

  // ============================================
  // CATEGORIES
  // ============================================
  async findCategories(organizationId: string, type?: string) {
    const where = { organizationId, ...(type ? { type } : {}) };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.financeCategory.findMany({
        where,
        include: { children: true, _count: { select: { transactions: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.financeCategory.count({ where }),
    ]);
    return { data: rows, total };
  }

  async findCategoryById(id: string) {
    const cat = await this.prisma.financeCategory.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
    if (!cat) throw new NotFoundException('Categoria no encontrada');
    return cat;
  }

  async createCategory(data: { organizationId: string; name: string; type: string; parentId?: string }) {
    return this.prisma.financeCategory.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        type: data.type,
        parentId: data.parentId,
      },
    });
  }

  async updateCategory(id: string, data: Record<string, any>) {
    await this.findCategoryById(id);
    return this.prisma.financeCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    await this.findCategoryById(id);
    return this.prisma.financeCategory.delete({ where: { id } });
  }

  // ============================================
  // TRANSACTIONS
  // ============================================
  async findTransactions(organizationId: string, params: { accountId?: string; type?: string; from?: string; to?: string; page?: number; limit?: number } = {}) {
    const { accountId, type, from, to } = params;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const where = {
      organizationId,
      ...(accountId ? { accountId } : {}),
      ...(type ? { type } : {}),
      ...(from || to ? {
        transactionDate: {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        },
      } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.financeTransaction.findMany({
        where,
        include: { account: true, category: true },
        orderBy: { transactionDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.financeTransaction.count({ where }),
    ]);
    return { data: rows, total, page, limit };
  }

  async findTransactionById(id: string) {
    const tx = await this.prisma.financeTransaction.findUnique({
      where: { id },
      include: { account: true, category: true },
    });
    if (!tx) throw new NotFoundException('Transaccion no encontrada');
    return tx;
  }

  async createTransaction(data: { organizationId: string; accountId: string; categoryId?: string; type: string; amount: bigint | number; description?: string; transactionDate: Date; referenceType?: string; referenceId?: string; createdById?: string }) {
    const amount = BigInt(data.amount);
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.financeAccount.findUnique({ where: { id: data.accountId } });
      if (!account) throw new NotFoundException('Cuenta no encontrada');
      const newBalance = data.type === 'income' ? account.balance + amount : account.balance - amount;
      await tx.financeAccount.update({ where: { id: data.accountId }, data: { balance: newBalance } });
      return tx.financeTransaction.create({
        data: {
          organizationId: data.organizationId,
          accountId: data.accountId,
          categoryId: data.categoryId,
          type: data.type,
          amount,
          description: data.description,
          transactionDate: data.transactionDate,
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          createdById: data.createdById,
        },
      });
    });
  }

  async updateTransaction(id: string, data: Record<string, any>) {
    await this.findTransactionById(id);
    return this.prisma.financeTransaction.update({ where: { id }, data });
  }

  async deleteTransaction(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const txRecord = await tx.financeTransaction.findUnique({ where: { id } });
      if (!txRecord) throw new NotFoundException('Transaccion no encontrada');
      const account = await tx.financeAccount.findUnique({ where: { id: txRecord.accountId } });
      if (!account) throw new NotFoundException('Cuenta no encontrada');
      const reverseBalance = txRecord.type === 'income' ? account.balance - txRecord.amount : account.balance + txRecord.amount;
      await tx.financeAccount.update({ where: { id: txRecord.accountId }, data: { balance: reverseBalance } });
      return tx.financeTransaction.delete({ where: { id } });
    });
  }

  // ============================================
  // REPORTS
  // ============================================
  async getProfitLoss(organizationId: string, from: string, to: string) {
    const transactions = await this.prisma.financeTransaction.findMany({
      where: {
        organizationId,
        transactionDate: { gte: new Date(from), lte: new Date(to) },
      },
      include: { category: true, account: true },
    });
    if (transactions.length === 0) {
      return { income: BigInt(0), expenses: BigInt(0), netIncome: BigInt(0), transactions: [] };
    }
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, BigInt(0));
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, BigInt(0));
    return { income, expenses, netIncome: income - expenses, transactions };
  }

  async getBalanceSheet(organizationId: string) {
    const accounts = await this.prisma.financeAccount.findMany({
      where: { organizationId, isActive: true },
      orderBy: { type: 'asc' },
    });
    const liabilityTypes = ['liability', 'credit', 'loan', 'payable'];
    const equityTypes = ['equity'];
    return {
      assets: accounts.filter(a => !liabilityTypes.includes(a.type) && !equityTypes.includes(a.type)),
      liabilities: accounts.filter(a => liabilityTypes.includes(a.type)),
      equity: accounts.filter(a => equityTypes.includes(a.type)),
    };
  }
}
