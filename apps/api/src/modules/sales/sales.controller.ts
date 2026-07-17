import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Sales')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  // ============================================
  // QUOTATIONS
  // ============================================
  @Get('quotations')
  @Permissions('sales:quotes:read')
  @ApiOperation({ summary: 'Obtener cotizaciones' })
  @ApiQuery({ name: 'status', required: false })
  async findQuotations(
    @CurrentUser('organizationId') organizationId: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.salesService.findQuotations(organizationId, { status, search, page: Number(page), limit: Number(limit) });
  }

  @Get('quotations/:id')
  @Permissions('sales:quotes:read')
  @ApiOperation({ summary: 'Obtener cotizacion por ID' })
  async findQuotationById(@Param('id') id: string) {
    return this.salesService.findQuotationById(id);
  }

  @Post('quotations')
  @Permissions('sales:quotes:create')
  @ApiOperation({ summary: 'Crear cotizacion' })
  @ApiResponse({ status: 201, description: 'Cotizacion creada' })
  async createQuotation(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.salesService.createQuotation({ ...body, organizationId, createdById: userId });
  }

  @Put('quotations/:id')
  @Permissions('sales:quotes:update')
  @ApiOperation({ summary: 'Actualizar cotizacion' })
  async updateQuotation(@Param('id') id: string, @Body() data: any) {
    return this.salesService.updateQuotation(id, this.pick(data, ['contactId', 'validUntil', 'taxRate', 'notes', 'status']));
  }

  @Delete('quotations/:id')
  @Permissions('sales:quotes:delete')
  @ApiOperation({ summary: 'Eliminar cotizacion' })
  async deleteQuotation(@Param('id') id: string) {
    return this.salesService.deleteQuotation(id);
  }

  // ============================================
  // ORDERS
  // ============================================
  @Get('orders')
  @Permissions('sales:orders:read')
  @ApiOperation({ summary: 'Obtener ordenes de venta' })
  @ApiQuery({ name: 'status', required: false })
  async findOrders(
    @CurrentUser('organizationId') organizationId: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.salesService.findOrders(organizationId, { status, search, page: Number(page), limit: Number(limit) });
  }

  @Get('orders/:id')
  @Permissions('sales:orders:read')
  @ApiOperation({ summary: 'Obtener orden por ID' })
  async findOrderById(@Param('id') id: string) {
    return this.salesService.findOrderById(id);
  }

  @Post('orders')
  @Permissions('sales:orders:create')
  @ApiOperation({ summary: 'Crear orden de venta' })
  @ApiResponse({ status: 201, description: 'Orden creada' })
  async createOrder(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.salesService.createOrder({ ...body, organizationId, createdById: userId });
  }

  @Put('orders/:id')
  @Permissions('sales:orders:update')
  @ApiOperation({ summary: 'Actualizar orden' })
  async updateOrder(@Param('id') id: string, @Body() data: any) {
    return this.salesService.updateOrder(id, this.pick(data, ['contactId', 'notes', 'status']));
  }

  @Delete('orders/:id')
  @Permissions('sales:orders:delete')
  @ApiOperation({ summary: 'Eliminar orden' })
  async deleteOrder(@Param('id') id: string) {
    return this.salesService.deleteOrder(id);
  }

  // ============================================
  // INVOICES
  // ============================================
  @Get('invoices')
  @Permissions('sales:invoices:read')
  @ApiOperation({ summary: 'Obtener facturas' })
  @ApiQuery({ name: 'status', required: false })
  async findInvoices(
    @CurrentUser('organizationId') organizationId: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.salesService.findInvoices(organizationId, { status, search, page: Number(page), limit: Number(limit) });
  }

  @Get('invoices/:id')
  @Permissions('sales:invoices:read')
  @ApiOperation({ summary: 'Obtener factura por ID' })
  async findInvoiceById(@Param('id') id: string) {
    return this.salesService.findInvoiceById(id);
  }

  @Post('invoices')
  @Permissions('sales:invoices:create')
  @ApiOperation({ summary: 'Crear factura' })
  @ApiResponse({ status: 201, description: 'Factura creada' })
  async createInvoice(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.salesService.createInvoice({ ...body, organizationId, createdById: userId });
  }

  @Put('invoices/:id')
  @Permissions('sales:invoices:update')
  @ApiOperation({ summary: 'Actualizar factura' })
  async updateInvoice(@Param('id') id: string, @Body() data: any) {
    return this.salesService.updateInvoice(id, this.pick(data, ['contactId', 'dueDate', 'taxAmount', 'notes', 'status']));
  }

  @Delete('invoices/:id')
  @Permissions('sales:invoices:delete')
  @ApiOperation({ summary: 'Eliminar factura' })
  async deleteInvoice(@Param('id') id: string) {
    return this.salesService.deleteInvoice(id);
  }

  // ============================================
  // PAYMENTS
  // ============================================
  @Get('payments')
  @Permissions('sales:payments:read')
  @ApiOperation({ summary: 'Obtener pagos' })
  @ApiQuery({ name: 'invoiceId', required: false })
  async findPayments(
    @CurrentUser('organizationId') organizationId: string,
    @Query('invoiceId') invoiceId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.salesService.findPayments(organizationId, { invoiceId, page: Number(page), limit: Number(limit) });
  }

  @Post('payments')
  @Permissions('sales:payments:create')
  @ApiOperation({ summary: 'Registrar pago' })
  @ApiResponse({ status: 201, description: 'Pago registrado' })
  async createPayment(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.salesService.createPayment({ ...body, organizationId, createdById: userId });
  }

  @Delete('payments/:id')
  @Permissions('sales:payments:delete')
  @ApiOperation({ summary: 'Eliminar pago' })
  async deletePayment(@Param('id') id: string) {
    return this.salesService.deletePayment(id);
  }
}
