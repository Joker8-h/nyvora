import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('CRM')
@ApiBearerAuth()
@Controller('crm')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  // ============================================
  // CONTACTS
  // ============================================
  @Get('contacts')
  @Permissions('crm:contacts:read')
  @ApiOperation({ summary: 'Obtener contactos' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false })
  async findContacts(
    @CurrentUser('organizationId') organizationId: string,
    @Query('query') query?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    return this.crmService.findContacts(organizationId, { query: query ?? search, page, limit, type });
  }

  @Get('contacts/:id')
  @Permissions('crm:contacts:read')
  @ApiOperation({ summary: 'Obtener contacto por ID' })
  async findContactById(@Param('id') id: string) {
    return this.crmService.findContactById(id);
  }

  @Post('contacts')
  @Permissions('crm:contacts:create')
  @ApiOperation({ summary: 'Crear contacto' })
  @ApiResponse({ status: 201, description: 'Contacto creado' })
  async createContact(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.crmService.createContact({ ...body, organizationId, createdById: userId });
  }

  @Put('contacts/:id')
  @Permissions('crm:contacts:update')
  @ApiOperation({ summary: 'Actualizar contacto' })
  async updateContact(@Param('id') id: string, @Body() data: any, @CurrentUser('id') userId: string) {
    return this.crmService.updateContact(id, this.pick(data, ['firstName', 'lastName', 'email', 'phone', 'position', 'companyId', 'type', 'tags']), userId);
  }

  @Delete('contacts/:id')
  @Permissions('crm:contacts:delete')
  @ApiOperation({ summary: 'Eliminar contacto' })
  async deleteContact(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.crmService.deleteContact(id, userId);
  }

  // ============================================
  // COMPANIES
  // ============================================
  @Get('companies')
  @Permissions('crm:companies:read')
  @ApiOperation({ summary: 'Obtener empresas' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findCompanies(
    @CurrentUser('organizationId') organizationId: string,
    @Query('query') query?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.findCompanies(organizationId, { query: query ?? search, page, limit });
  }

  @Get('companies/:id')
  @Permissions('crm:companies:read')
  @ApiOperation({ summary: 'Obtener empresa por ID' })
  async findCompanyById(@Param('id') id: string) {
    return this.crmService.findCompanyById(id);
  }

  @Post('companies')
  @Permissions('crm:companies:create')
  @ApiOperation({ summary: 'Crear empresa' })
  @ApiResponse({ status: 201, description: 'Empresa creada' })
  async createCompany(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.crmService.createCompany({ ...body, organizationId, createdById: userId });
  }

  @Put('companies/:id')
  @Permissions('crm:companies:update')
  @ApiOperation({ summary: 'Actualizar empresa' })
  async updateCompany(@Param('id') id: string, @Body() data: any, @CurrentUser('id') userId: string) {
    return this.crmService.updateCompany(id, this.pick(data, ['name', 'industry', 'website', 'address', 'taxId', 'notes']), userId);
  }

  @Delete('companies/:id')
  @Permissions('crm:companies:delete')
  @ApiOperation({ summary: 'Eliminar empresa' })
  async deleteCompany(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.crmService.deleteCompany(id, userId);
  }

  // ============================================
  // LEADS
  // ============================================
  @Get('leads')
  @Permissions('crm:leads:read')
  @ApiOperation({ summary: 'Obtener leads' })
  @ApiQuery({ name: 'pipelineId', required: false })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findLeads(
    @CurrentUser('organizationId') organizationId: string,
    @Query('pipelineId') pipelineId?: string,
    @Query('stage') stage?: string,
    @Query('status') status?: string,
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.findLeads(organizationId, { pipelineId, stage, status, query, page, limit });
  }

  @Get('leads/:id')
  @Permissions('crm:leads:read')
  @ApiOperation({ summary: 'Obtener lead por ID' })
  async findLeadById(@Param('id') id: string) {
    return this.crmService.findLeadById(id);
  }

  @Post('leads')
  @Permissions('crm:leads:create')
  @ApiOperation({ summary: 'Crear lead' })
  @ApiResponse({ status: 201, description: 'Lead creado' })
  async createLead(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.crmService.createLead({ ...body, organizationId, createdById: userId });
  }

  @Put('leads/:id')
  @Permissions('crm:leads:update')
  @ApiOperation({ summary: 'Actualizar lead' })
  async updateLead(@Param('id') id: string, @Body() data: any, @CurrentUser('id') userId: string) {
    return this.crmService.updateLead(id, this.pick(data, ['pipelineId', 'stage', 'title', 'notes', 'contactId', 'source', 'score', 'assignedToId', 'estimatedValue', 'expectedCloseDate']), userId);
  }

  @Patch('leads/:id/stage')
  @Permissions('crm:leads:update')
  @ApiOperation({ summary: 'Mover lead a otra etapa' })
  async moveLeadStage(@Param('id') id: string, @Body('stage') stage: string, @CurrentUser('id') userId: string) {
    return this.crmService.moveLeadStage(id, stage, userId);
  }

  @Post('leads/:id/convert')
  @Permissions('crm:leads:update')
  @ApiOperation({ summary: 'Convertir lead a cliente' })
  async convertLead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.crmService.convertLead(id, userId);
  }

  @Post('leads/:id/lost')
  @Permissions('crm:leads:update')
  @ApiOperation({ summary: 'Marcar lead como perdido' })
  async markLeadLost(@Param('id') id: string, @Body('reason') reason: string, @CurrentUser('id') userId: string) {
    return this.crmService.markLeadLost(id, reason, userId);
  }

  @Delete('leads/:id')
  @Permissions('crm:leads:delete')
  @ApiOperation({ summary: 'Eliminar lead' })
  async deleteLead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.crmService.deleteLead(id, userId);
  }

  // ============================================
  // LEAD ACTIVITIES
  // ============================================
  @Get('leads/:id/activities')
  @Permissions('crm:leads:read')
  @ApiOperation({ summary: 'Listar actividades del lead' })
  async findLeadActivities(@Param('id') id: string) {
    return this.crmService.findLeadActivities(id);
  }

  @Post('leads/:id/activities')
  @Permissions('crm:leads:update')
  @ApiOperation({ summary: 'Registrar actividad del lead' })
  async createLeadActivity(@Param('id') id: string, @Body() data: any, @CurrentUser('id') userId: string) {
    return this.crmService.createLeadActivity(id, this.pick(data, ['type', 'content', 'occurredAt']) as any, userId);
  }

  // ============================================
  // PIPELINES
  // ============================================
  @Get('pipelines')
  @Permissions('crm:pipelines:read')
  @ApiOperation({ summary: 'Obtener pipelines' })
  async findPipelines(@CurrentUser('organizationId') organizationId: string) {
    return this.crmService.findPipelines(organizationId);
  }

  @Get('pipelines/:id')
  @Permissions('crm:pipelines:read')
  @ApiOperation({ summary: 'Obtener pipeline por ID' })
  async findPipelineById(@Param('id') id: string) {
    return this.crmService.findPipelineById(id);
  }

  @Post('pipelines')
  @Permissions('crm:pipelines:create')
  @ApiOperation({ summary: 'Crear pipeline' })
  @ApiResponse({ status: 201, description: 'Pipeline creado' })
  async createPipeline(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.crmService.createPipeline({ ...body, organizationId });
  }

  @Put('pipelines/:id')
  @Permissions('crm:pipelines:update')
  @ApiOperation({ summary: 'Actualizar pipeline' })
  async updatePipeline(@Param('id') id: string, @Body() data: any) {
    return this.crmService.updatePipeline(id, this.pick(data, ['name', 'stages', 'isDefault']));
  }

  @Delete('pipelines/:id')
  @Permissions('crm:pipelines:delete')
  @ApiOperation({ summary: 'Eliminar pipeline' })
  async deletePipeline(@Param('id') id: string) {
    return this.crmService.deletePipeline(id);
  }
}
