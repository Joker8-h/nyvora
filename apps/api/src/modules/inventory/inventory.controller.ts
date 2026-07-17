import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  // ============================================
  // PRODUCTS
  // ============================================
  @Get('products')
  @Permissions('inventory:products:read')
  @ApiOperation({ summary: 'Obtener productos' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async findProducts(
    @CurrentUser('organizationId') organizationId: string,
    @Query('query') query?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.findProducts(organizationId, { query, categoryId, page: Number(page), limit: Number(limit) });
  }

  @Get('products/:id')
  @Permissions('inventory:products:read')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  async findProductById(@Param('id') id: string) {
    return this.inventoryService.findProductById(id);
  }

  @Post('products')
  @Permissions('inventory:products:create')
  @ApiOperation({ summary: 'Crear producto' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  async createProduct(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.inventoryService.createProduct({ ...body, organizationId, createdById: userId });
  }

  @Put('products/:id')
  @Permissions('inventory:products:update')
  @ApiOperation({ summary: 'Actualizar producto' })
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.updateProduct(id, this.pick(data, ['sku', 'name', 'description', 'categoryId', 'unitPrice', 'currency', 'hasBatches', 'allowNegativeStock']));
  }

  @Delete('products/:id')
  @Permissions('inventory:products:delete')
  @ApiOperation({ summary: 'Eliminar producto' })
  async deleteProduct(@Param('id') id: string) {
    return this.inventoryService.deleteProduct(id);
  }

  // ============================================
  // CATEGORIES
  // ============================================
  @Get('categories')
  @Permissions('inventory:products:read')
  @ApiOperation({ summary: 'Obtener categorias de productos' })
  async findCategories(@CurrentUser('organizationId') organizationId: string) {
    return this.inventoryService.findCategories(organizationId);
  }

  @Get('categories/:id')
  @Permissions('inventory:products:read')
  @ApiOperation({ summary: 'Obtener categoria por ID' })
  async findCategoryById(@Param('id') id: string) {
    return this.inventoryService.findCategoryById(id);
  }

  @Post('categories')
  @Permissions('inventory:products:create')
  @ApiOperation({ summary: 'Crear categoria' })
  async createCategory(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.inventoryService.createCategory({ ...body, organizationId });
  }

  @Put('categories/:id')
  @Permissions('inventory:products:update')
  @ApiOperation({ summary: 'Actualizar categoria' })
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.updateCategory(id, this.pick(data, ['name', 'parentId']));
  }

  @Delete('categories/:id')
  @Permissions('inventory:products:delete')
  @ApiOperation({ summary: 'Eliminar categoria' })
  async deleteCategory(@Param('id') id: string) {
    return this.inventoryService.deleteCategory(id);
  }

  // ============================================
  // WAREHOUSES
  // ============================================
  @Get('warehouses')
  @Permissions('inventory:warehouses:read')
  @ApiOperation({ summary: 'Obtener almacenes' })
  async findWarehouses(@CurrentUser('organizationId') organizationId: string) {
    return this.inventoryService.findWarehouses(organizationId);
  }

  @Get('warehouses/:id')
  @Permissions('inventory:warehouses:read')
  @ApiOperation({ summary: 'Obtener almacen por ID' })
  async findWarehouseById(@Param('id') id: string) {
    return this.inventoryService.findWarehouseById(id);
  }

  @Post('warehouses')
  @Permissions('inventory:warehouses:create')
  @ApiOperation({ summary: 'Crear almacen' })
  async createWarehouse(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.inventoryService.createWarehouse({ ...body, organizationId });
  }

  @Put('warehouses/:id')
  @Permissions('inventory:warehouses:update')
  @ApiOperation({ summary: 'Actualizar almacen' })
  async updateWarehouse(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.updateWarehouse(id, this.pick(data, ['name', 'branchId', 'address']));
  }

  @Delete('warehouses/:id')
  @Permissions('inventory:warehouses:delete')
  @ApiOperation({ summary: 'Eliminar almacen' })
  async deleteWarehouse(@Param('id') id: string) {
    return this.inventoryService.deleteWarehouse(id);
  }

  // ============================================
  // STOCK
  // ============================================
  @Get('stock')
  @Permissions('inventory:stock:read')
  @ApiOperation({ summary: 'Obtener niveles de stock' })
  @ApiQuery({ name: 'warehouseId', required: false })
  async findStockLevels(@CurrentUser('organizationId') organizationId: string, @Query('warehouseId') warehouseId?: string) {
    return this.inventoryService.findStockLevels(organizationId, warehouseId);
  }

  @Get('stock/low')
  @Permissions('inventory:stock:read')
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  async findLowStock(@CurrentUser('organizationId') organizationId: string) {
    return this.inventoryService.findLowStock(organizationId);
  }

  @Get('stock/:productId')
  @Permissions('inventory:stock:read')
  @ApiOperation({ summary: 'Obtener niveles de stock por producto' })
  async findStockByProduct(@CurrentUser('organizationId') organizationId: string, @Param('productId') productId: string) {
    return this.inventoryService.findStockByProduct(organizationId, productId);
  }

  @Post('stock/movements')
  @Permissions('inventory:stock:create')
  @ApiOperation({ summary: 'Registrar movimiento de stock' })
  @ApiResponse({ status: 201, description: 'Movimiento registrado' })
  async createStockMovement(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.inventoryService.createStockMovement({ ...body, organizationId, createdById: userId });
  }
}
