import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '@nyvora/database';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: Record<string, any>;

  const mockOrgId = 'org-123';

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'prod-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      productCategory: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cat-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
      warehouse: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'wh-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
        delete: jest.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id })),
      },
      stockLevel: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'sl-1', ...data })),
        update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      },
      stockMovement: {
        create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'sm-1', ...data })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  // PRODUCTS
  describe('Products', () => {
    it('should find products', async () => {
      const result = await service.findProducts(mockOrgId);
      expect(result).toEqual([]);
    });

    it('should find product by id', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1', name: 'Widget' });
      const result = await service.findProductById('prod-1');
      expect(result.name).toBe('Widget');
    });

    it('should throw for missing product', async () => {
      await expect(service.findProductById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create product', async () => {
      const result = await service.createProduct({
        organizationId: mockOrgId,
        sku: 'WGT-001',
        name: 'Widget',
        unitPrice: BigInt(1500),
      });
      expect(result.sku).toBe('WGT-001');
    });

    it('should soft-delete product', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1' });
      await service.deleteProduct('prod-1');
      expect(prisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) }),
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
      prisma.productCategory.findUnique.mockResolvedValue({ id: 'cat-1', name: 'Electronics' });
      const result = await service.findCategoryById('cat-1');
      expect(result.name).toBe('Electronics');
    });

    it('should throw for missing category', async () => {
      await expect(service.findCategoryById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create category', async () => {
      const result = await service.createCategory({ organizationId: mockOrgId, name: 'Books' });
      expect(result.name).toBe('Books');
    });

    it('should hard-delete category', async () => {
      prisma.productCategory.findUnique.mockResolvedValue({ id: 'cat-1' });
      await service.deleteCategory('cat-1');
      expect(prisma.productCategory.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
    });
  });

  // WAREHOUSES
  describe('Warehouses', () => {
    it('should find warehouses', async () => {
      const result = await service.findWarehouses(mockOrgId);
      expect(result).toEqual([]);
    });

    it('should find warehouse by id', async () => {
      prisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1', name: 'Main' });
      const result = await service.findWarehouseById('wh-1');
      expect(result.name).toBe('Main');
    });

    it('should throw for missing warehouse', async () => {
      await expect(service.findWarehouseById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should create warehouse', async () => {
      const result = await service.createWarehouse({ organizationId: mockOrgId, name: 'Warehouse A' });
      expect(result.name).toBe('Warehouse A');
    });

    it('should hard-delete warehouse', async () => {
      prisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1' });
      await service.deleteWarehouse('wh-1');
      expect(prisma.warehouse.delete).toHaveBeenCalledWith({ where: { id: 'wh-1' } });
    });
  });

  // STOCK MOVEMENTS
  describe('Stock Movements', () => {
    it('should find stock levels', async () => {
      const result = await service.findStockLevels(mockOrgId);
      expect(result).toEqual([]);
    });

    it('should create stock movement (in)', async () => {
      prisma.stockLevel.findUnique.mockResolvedValue(null);
      const data = {
        organizationId: mockOrgId,
        productId: 'prod-1',
        warehouseId: 'wh-1',
        type: 'in',
        quantity: 100,
      };
      const result = await service.createStockMovement(data);
      expect(prisma.stockLevel.create).toHaveBeenCalled();
      expect(prisma.stockMovement.create).toHaveBeenCalled();
    });

    it('should update existing stock level on movement', async () => {
      prisma.stockLevel.findUnique.mockResolvedValue({ id: 'sl-1', quantity: 50 });
      await service.createStockMovement({
        organizationId: mockOrgId,
        productId: 'prod-1',
        warehouseId: 'wh-1',
        type: 'in',
        quantity: 25,
      });
      expect(prisma.stockLevel.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { quantity: 75 } }),
      );
    });

    it('should reject negative stock', async () => {
      prisma.stockLevel.findUnique.mockResolvedValue({ id: 'sl-1', quantity: 10 });
      await expect(
        service.createStockMovement({
          organizationId: mockOrgId,
          productId: 'prod-1',
          warehouseId: 'wh-1',
          type: 'out',
          quantity: 20,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
