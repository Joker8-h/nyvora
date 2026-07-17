import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // PRODUCTS
  // ============================================
  async findProducts(organizationId: string, opts: { query?: string; categoryId?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 10));
    const where: any = {
      organizationId,
      deletedAt: null,
      ...(opts.query ? { OR: [{ name: { contains: opts.query, mode: 'insensitive' } }, { sku: { contains: opts.query, mode: 'insensitive' } }] } : {}),
      ...(opts.categoryId ? { categoryId: opts.categoryId } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true, stockLevels: { include: { warehouse: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);
    const data = rows.map((p) => ({ ...p, totalStock: p.stockLevels.reduce((s, sl) => s + sl.quantity, 0) }));
    return { data, total, page, limit };
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, stockLevels: { include: { warehouse: true } } },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async createProduct(data: { organizationId: string; sku: string; name: string; description?: string; categoryId?: string; unitPrice: bigint; currency?: string; hasBatches?: boolean; allowNegativeStock?: boolean; createdById?: string }) {
    return this.prisma.product.create({
      data: {
        organizationId: data.organizationId,
        sku: data.sku,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        unitPrice: data.unitPrice,
        currency: data.currency,
        hasBatches: data.hasBatches,
        allowNegativeStock: data.allowNegativeStock,
        createdById: data.createdById,
      },
    });
  }

  async updateProduct(id: string, data: Record<string, any>) {
    await this.findProductById(id);
    return this.prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: string) {
    await this.findProductById(id);
    return this.prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============================================
  // CATEGORIES
  // ============================================
  async findCategories(organizationId: string) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.productCategory.findMany({
        where: { organizationId },
        include: { parent: true, _count: { select: { products: true, children: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.productCategory.count({ where: { organizationId } }),
    ]);
    return { data, total };
  }

  async findCategoryById(id: string) {
    const cat = await this.prisma.productCategory.findUnique({
      where: { id },
      include: { children: true, parent: true, products: true },
    });
    if (!cat) throw new NotFoundException('Categoria no encontrada');
    return cat;
  }

  async createCategory(data: { organizationId: string; name: string; parentId?: string }) {
    return this.prisma.productCategory.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        parentId: data.parentId,
      },
    });
  }

  async updateCategory(id: string, data: Record<string, any>) {
    await this.findCategoryById(id);
    return this.prisma.productCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    await this.findCategoryById(id);
    return this.prisma.productCategory.delete({ where: { id } });
  }

  // ============================================
  // WAREHOUSES
  // ============================================
  async findWarehouses(organizationId: string) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.warehouse.findMany({
        where: { organizationId },
        include: { stockLevels: true, _count: { select: { stockLevels: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.warehouse.count({ where: { organizationId } }),
    ]);
    const data = rows.map((w) => ({
      ...w,
      totalUnits: w.stockLevels.reduce((s, sl) => s + sl.quantity, 0),
    }));
    return { data, total };
  }

  async findWarehouseById(id: string) {
    const wh = await this.prisma.warehouse.findUnique({
      where: { id },
      include: { stockLevels: { include: { product: true } } },
    });
    if (!wh) throw new NotFoundException('Almacen no encontrado');
    return wh;
  }

  async createWarehouse(data: { organizationId: string; name: string; branchId?: string; address?: Record<string, any> }) {
    return this.prisma.warehouse.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        branchId: data.branchId,
        address: data.address,
      },
    });
  }

  async updateWarehouse(id: string, data: Record<string, any>) {
    await this.findWarehouseById(id);
    return this.prisma.warehouse.update({ where: { id }, data });
  }

  async deleteWarehouse(id: string) {
    await this.findWarehouseById(id);
    return this.prisma.warehouse.delete({ where: { id } });
  }

  // ============================================
  // STOCK MOVEMENTS
  // ============================================
  async findStockLevels(organizationId: string, warehouseId?: string) {
    return this.prisma.stockLevel.findMany({
      where: { organizationId, ...(warehouseId ? { warehouseId } : {}) },
      include: { product: true, warehouse: true },
    });
  }

  async findStockByProduct(organizationId: string, productId: string) {
    return this.prisma.stockLevel.findMany({
      where: { organizationId, productId },
      include: { warehouse: true, product: true },
    });
  }

  async findLowStock(organizationId: string) {
    const rows = await this.prisma.stockLevel.findMany({
      where: { organizationId, minimumQuantity: { gt: 0 } },
      include: { product: true, warehouse: true },
    });
    const data = rows.filter((sl) => sl.quantity <= sl.minimumQuantity);
    return { data, total: data.length };
  }

  async createStockMovement(data: { organizationId: string; productId: string; warehouseId: string; type: string; quantity: number; unitCost?: bigint; reason?: string; createdById?: string }) {
    const type = data.type;
    if (!['in', 'out', 'adjustment'].includes(type)) throw new BadRequestException('Tipo de movimiento invalido');
    const quantity = Number(data.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) throw new BadRequestException('Cantidad invalida');

    const product = await this.prisma.product.findFirst({
      where: { id: data.productId, organizationId: data.organizationId, deletedAt: null },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id: data.warehouseId, organizationId: data.organizationId },
    });
    if (!warehouse) throw new NotFoundException('Almacen no encontrado');

    const stockLevel = await this.prisma.stockLevel.findUnique({
      where: { organizationId_productId_warehouseId: { organizationId: data.organizationId, productId: data.productId, warehouseId: data.warehouseId } },
    });
    const currentQty = stockLevel?.quantity || 0;
    let newQty: number;
    if (type === 'in') newQty = currentQty + quantity;
    else if (type === 'out') newQty = currentQty - quantity;
    else newQty = quantity;

    if (newQty < 0 && !product.allowNegativeStock) {
      throw new BadRequestException('Stock insuficiente');
    }

    return this.prisma.$transaction(async (tx) => {
      if (stockLevel) {
        await tx.stockLevel.update({ where: { id: stockLevel.id }, data: { quantity: newQty } });
      } else {
        await tx.stockLevel.create({ data: { organizationId: data.organizationId, productId: data.productId, warehouseId: data.warehouseId, quantity: newQty } });
      }
      return tx.stockMovement.create({
        data: {
          organizationId: data.organizationId,
          productId: data.productId,
          warehouseId: data.warehouseId,
          type,
          quantity,
          unitCost: data.unitCost,
          reason: data.reason,
          createdById: data.createdById,
        },
      });
    });
  }
}
