import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Finance')
@ApiBearerAuth()
@Controller('finance')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  // ============================================
  // ACCOUNTS
  // ============================================
  @Get('accounts')
  @Permissions('finance:accounts:read')
  @ApiOperation({ summary: 'Obtener cuentas financieras' })
  @ApiQuery({ name: 'type', required: false })
  async findAccounts(@CurrentUser('organizationId') organizationId: string, @Query('type') type?: string) {
    return this.financeService.findAccounts(organizationId, type);
  }

  @Get('accounts/:id')
  @Permissions('finance:accounts:read')
  @ApiOperation({ summary: 'Obtener cuenta por ID' })
  async findAccountById(@Param('id') id: string) {
    return this.financeService.findAccountById(id);
  }

  @Post('accounts')
  @Permissions('finance:accounts:create')
  @ApiOperation({ summary: 'Crear cuenta' })
  @ApiResponse({ status: 201, description: 'Cuenta creada' })
  async createAccount(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.financeService.createAccount({ ...body, organizationId });
  }

  @Put('accounts/:id')
  @Permissions('finance:accounts:update')
  @ApiOperation({ summary: 'Actualizar cuenta' })
  async updateAccount(@Param('id') id: string, @Body() data: any) {
    return this.financeService.updateAccount(id, this.pick(data, ['name', 'type', 'currency']));
  }

  @Delete('accounts/:id')
  @Permissions('finance:accounts:delete')
  @ApiOperation({ summary: 'Eliminar cuenta' })
  async deleteAccount(@Param('id') id: string) {
    return this.financeService.deleteAccount(id);
  }

  // ============================================
  // CATEGORIES
  // ============================================
  @Get('categories')
  @Permissions('finance:categories:read')
  @ApiOperation({ summary: 'Obtener categorias financieras' })
  @ApiQuery({ name: 'type', required: false })
  async findCategories(@CurrentUser('organizationId') organizationId: string, @Query('type') type?: string) {
    return this.financeService.findCategories(organizationId, type);
  }

  @Get('categories/:id')
  @Permissions('finance:categories:read')
  @ApiOperation({ summary: 'Obtener categoria por ID' })
  async findCategoryById(@Param('id') id: string) {
    return this.financeService.findCategoryById(id);
  }

  @Post('categories')
  @Permissions('finance:categories:create')
  @ApiOperation({ summary: 'Crear categoria' })
  async createCategory(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.financeService.createCategory({ ...body, organizationId });
  }

  @Put('categories/:id')
  @Permissions('finance:categories:update')
  @ApiOperation({ summary: 'Actualizar categoria' })
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.financeService.updateCategory(id, this.pick(data, ['name', 'type', 'parentId']));
  }

  @Delete('categories/:id')
  @Permissions('finance:categories:delete')
  @ApiOperation({ summary: 'Eliminar categoria' })
  async deleteCategory(@Param('id') id: string) {
    return this.financeService.deleteCategory(id);
  }

  // ============================================
  // TRANSACTIONS
  // ============================================
  @Get('transactions')
  @Permissions('finance:transactions:read')
  @ApiOperation({ summary: 'Obtener transacciones' })
  @ApiQuery({ name: 'accountId', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findTransactions(@CurrentUser('organizationId') organizationId: string, @Query('accountId') accountId?: string, @Query('type') type?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.financeService.findTransactions(organizationId, { accountId, type, from, to, page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
  }

  @Get('transactions/:id')
  @Permissions('finance:transactions:read')
  @ApiOperation({ summary: 'Obtener transaccion por ID' })
  async findTransactionById(@Param('id') id: string) {
    return this.financeService.findTransactionById(id);
  }

  @Post('transactions')
  @Permissions('finance:transactions:create')
  @ApiOperation({ summary: 'Crear transaccion' })
  @ApiResponse({ status: 201, description: 'Transaccion creada' })
  async createTransaction(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, date, transactionDate, categoryId, amount, ...body } = data;
    const resolvedDate = transactionDate || date;
    return this.financeService.createTransaction({
      ...body,
      organizationId,
      createdById: userId,
      categoryId: categoryId || undefined,
      amount: Number(amount),
      transactionDate: resolvedDate ? new Date(resolvedDate) : new Date(),
    });
  }

  @Put('transactions/:id')
  @Permissions('finance:transactions:update')
  @ApiOperation({ summary: 'Actualizar transaccion' })
  async updateTransaction(@Param('id') id: string, @Body() data: any) {
    const patch = this.pick(data, ['accountId', 'categoryId', 'type', 'amount', 'description', 'transactionDate']);
    if (data.date && !patch.transactionDate) patch.transactionDate = data.date;
    if (patch.transactionDate) patch.transactionDate = new Date(patch.transactionDate);
    if (patch.amount !== undefined) patch.amount = Number(patch.amount);
    if (patch.categoryId === '') patch.categoryId = null;
    return this.financeService.updateTransaction(id, patch);
  }

  @Delete('transactions/:id')
  @Permissions('finance:transactions:delete')
  @ApiOperation({ summary: 'Eliminar transaccion' })
  async deleteTransaction(@Param('id') id: string) {
    return this.financeService.deleteTransaction(id);
  }

  // ============================================
  // REPORTS
  // ============================================
  @Get('reports/profit-loss')
  @Permissions('reports:finance:read')
  @ApiOperation({ summary: 'Reporte de perdidas y ganancias' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  async getProfitLoss(@CurrentUser('organizationId') organizationId: string, @Query('from') from?: string, @Query('to') to?: string) {
    const fromDate = from || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
    const toDate = to || new Date().toISOString().split('T')[0];
    return this.financeService.getProfitLoss(organizationId, fromDate, toDate);
  }

  @Get('reports/balance-sheet')
  @Permissions('reports:finance:read')
  @ApiOperation({ summary: 'Reporte de balance general' })
  async getBalanceSheet(@CurrentUser('organizationId') organizationId: string) {
    return this.financeService.getBalanceSheet(organizationId);
  }
}
