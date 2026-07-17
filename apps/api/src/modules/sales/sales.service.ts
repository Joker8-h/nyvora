import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // QUOTATIONS
  // ============================================
  async findQuotations(organizationId: string, opts: { status?: string; search?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 10));
    const where: any = {
      organizationId,
      deletedAt: null,
      ...(opts.status ? { status: opts.status } : {}),
      ...(opts.search ? { number: { contains: opts.search, mode: 'insensitive' } } : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.salesQuotation.findMany({
        where,
        include: { contact: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.salesQuotation.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findQuotationById(id: string) {
    const q = await this.prisma.salesQuotation.findUnique({
      where: { id },
      include: { contact: true, items: { include: { product: true } } },
    });
    if (!q) throw new NotFoundException('Cotizacion no encontrada');
    return q;
  }

  async createQuotation(data: { organizationId: string; contactId?: string; items: Array<{ productId?: string; description: string; quantity: number; unitPrice: bigint }>; validUntil?: Date; taxRate?: number; notes?: string; createdById?: string }) {
    const number = await this.generateNumber(data.organizationId, 'Q');
    const subtotal = data.items.reduce((sum, item) => sum + BigInt(item.unitPrice) * BigInt(item.quantity), BigInt(0));
    const taxAmount = BigInt(Math.round(Number(subtotal) * (data.taxRate || 0) / 100));
    return this.prisma.salesQuotation.create({
      data: {
        organizationId: data.organizationId,
        number,
        contactId: data.contactId,
        validUntil: data.validUntil,
        subtotal,
        taxRate: data.taxRate || 0,
        taxAmount,
        total: subtotal + taxAmount,
        notes: data.notes,
        createdById: data.createdById,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: BigInt(item.unitPrice),
            subtotal: BigInt(item.unitPrice) * BigInt(item.quantity),
          })),
        },
      },
      include: { items: true },
    });
  }

  async updateQuotation(id: string, data: Record<string, any>) {
    await this.findQuotationById(id);
    return this.prisma.salesQuotation.update({ where: { id }, data });
  }

  async deleteQuotation(id: string) {
    await this.findQuotationById(id);
    return this.prisma.salesQuotation.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============================================
  // ORDERS
  // ============================================
  async findOrders(organizationId: string, opts: { status?: string; search?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 10));
    const where: any = {
      organizationId,
      deletedAt: null,
      ...(opts.status ? { status: opts.status } : {}),
      ...(opts.search ? { number: { contains: opts.search, mode: 'insensitive' } } : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.salesOrder.findMany({
        where,
        include: { contact: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.salesOrder.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOrderById(id: string) {
    const order = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: { contact: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async createOrder(data: { organizationId: string; contactId?: string; quotationId?: string; items: Array<{ productId?: string; description: string; quantity: number; unitPrice: bigint }>; notes?: string; createdById?: string }) {
    const number = await this.generateNumber(data.organizationId, 'SO');
    const subtotal = data.items.reduce((sum, item) => sum + BigInt(item.unitPrice) * BigInt(item.quantity), BigInt(0));
    return this.prisma.salesOrder.create({
      data: {
        organizationId: data.organizationId,
        number,
        contactId: data.contactId,
        quotationId: data.quotationId,
        subtotal,
        total: subtotal,
        notes: data.notes,
        createdById: data.createdById,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: BigInt(item.unitPrice),
            subtotal: BigInt(item.unitPrice) * BigInt(item.quantity),
          })),
        },
      },
      include: { items: true },
    });
  }

  async updateOrder(id: string, data: Record<string, any>) {
    await this.findOrderById(id);
    return this.prisma.salesOrder.update({ where: { id }, data });
  }

  async deleteOrder(id: string) {
    await this.findOrderById(id);
    return this.prisma.salesOrder.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============================================
  // INVOICES
  // ============================================
  async findInvoices(organizationId: string, opts: { status?: string; search?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 10));
    const where: any = {
      organizationId,
      deletedAt: null,
      ...(opts.status ? { status: opts.status } : {}),
      ...(opts.search ? { number: { contains: opts.search, mode: 'insensitive' } } : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.salesInvoice.findMany({
        where,
        include: { contact: true, items: true, payments: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.salesInvoice.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findInvoiceById(id: string) {
    const invoice = await this.prisma.salesInvoice.findUnique({
      where: { id },
      include: { contact: true, items: { include: { product: true } }, payments: true },
    });
    if (!invoice) throw new NotFoundException('Factura no encontrada');
    return invoice;
  }

  async createInvoice(data: { organizationId: string; contactId: string; orderId?: string; items: Array<{ productId?: string; description: string; quantity: number; unitPrice: bigint }>; dueDate?: Date; taxAmount?: bigint; createdById?: string }) {
    const number = await this.generateNumber(data.organizationId, 'INV');
    const subtotal = data.items.reduce((sum, item) => sum + BigInt(item.unitPrice) * BigInt(item.quantity), BigInt(0));
    return this.prisma.salesInvoice.create({
      data: {
        organizationId: data.organizationId,
        number,
        contactId: data.contactId,
        orderId: data.orderId,
        subtotal,
        taxAmount: data.taxAmount || BigInt(0),
        total: subtotal + (data.taxAmount || BigInt(0)),
        dueDate: data.dueDate,
        createdById: data.createdById,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: BigInt(item.unitPrice),
            subtotal: BigInt(item.unitPrice) * BigInt(item.quantity),
          })),
        },
      },
      include: { items: true },
    });
  }

  async updateInvoice(id: string, data: Record<string, any>) {
    await this.findInvoiceById(id);
    return this.prisma.salesInvoice.update({ where: { id }, data });
  }

  async deleteInvoice(id: string) {
    await this.findInvoiceById(id);
    return this.prisma.salesInvoice.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============================================
  // PAYMENTS
  // ============================================
  async findPayments(organizationId: string, opts: { invoiceId?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 10));
    const where: any = { organizationId, ...(opts.invoiceId ? { invoiceId: opts.invoiceId } : {}) };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.salesPayment.findMany({
        where,
        include: { invoice: true },
        orderBy: { paidAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.salesPayment.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async createPayment(data: { organizationId: string; invoiceId: string; amount: bigint | number; method: string; reference?: string; notes?: string; createdById?: string }) {
    const invoice = await this.findInvoiceById(data.invoiceId);
    const amount = BigInt(data.amount);
    const newPaidAmount = invoice.paidAmount + amount;
    if (newPaidAmount > invoice.total) {
      throw new BadRequestException('El monto excede el saldo pendiente');
    }
    await this.prisma.salesInvoice.update({
      where: { id: data.invoiceId },
      data: { paidAmount: newPaidAmount, status: newPaidAmount >= invoice.total ? 'paid' : 'partial' },
    });
    return this.prisma.salesPayment.create({
      data: {
        organizationId: data.organizationId,
        invoiceId: data.invoiceId,
        amount: amount,
        method: data.method,
        reference: data.reference,
        notes: data.notes,
        createdById: data.createdById,
      },
    });
  }

  async deletePayment(id: string) {
    const payment = await this.prisma.salesPayment.findUnique({
      where: { id },
      include: { invoice: true },
    });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    if (payment.invoiceId && payment.invoice) {
      const newPaidAmount = payment.invoice.paidAmount - payment.amount;
      await this.prisma.salesInvoice.update({
        where: { id: payment.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          status: newPaidAmount <= BigInt(0) ? 'unpaid' : 'partial',
        },
      });
    }
    return this.prisma.salesPayment.delete({ where: { id } });
  }

  // ============================================
  // HELPER: Generate sequential number
  // ============================================
  private async generateNumber(organizationId: string, prefix: string): Promise<string> {
    const year = new Date().getFullYear();
    const where = { organizationId, number: { startsWith: `${prefix}-${year}` } };
    let count: number;
    switch (prefix) {
      case 'Q':
        count = await this.prisma.salesQuotation.count({ where });
        break;
      case 'SO':
        count = await this.prisma.salesOrder.count({ where });
        break;
      default:
        count = await this.prisma.salesInvoice.count({ where });
    }
    return `${prefix}-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
