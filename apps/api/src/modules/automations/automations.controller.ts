import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Automations')
@ApiBearerAuth()
@Controller('automations')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  @Permissions('automations:read')
  @ApiOperation({ summary: 'Obtener automatizaciones' })
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiQuery({ name: 'status', required: false })
  async findAutomations(@Query('organizationId') organizationId: string, @Query('status') status?: string) {
    return this.automationsService.findAutomations(organizationId, status);
  }

  @Get(':id')
  @Permissions('automations:read')
  @ApiOperation({ summary: 'Obtener automatizacion por ID' })
  async findAutomationById(@Param('id') id: string) {
    return this.automationsService.findAutomationById(id);
  }

  @Post()
  @Permissions('automations:create')
  @ApiOperation({ summary: 'Crear automatizacion' })
  @ApiResponse({ status: 201, description: 'Automatizacion creada' })
  async createAutomation(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    return this.automationsService.createAutomation({ ...data, organizationId });
  }

  @Put(':id')
  @Permissions('automations:update')
  @ApiOperation({ summary: 'Actualizar automatizacion' })
  async updateAutomation(@Param('id') id: string, @Body() data: any) {
    return this.automationsService.updateAutomation(id, data);
  }

  @Delete(':id')
  @Permissions('automations:delete')
  @ApiOperation({ summary: 'Eliminar automatizacion' })
  async deleteAutomation(@Param('id') id: string) {
    return this.automationsService.deleteAutomation(id);
  }

  @Post(':id/toggle')
  @HttpCode(200)
  @Permissions('automations:update')
  @ApiOperation({ summary: 'Activar/desactivar automatizacion' })
  async toggleAutomation(@Param('id') id: string) {
    return this.automationsService.toggleAutomation(id);
  }

  @Post(':id/execute')
  @HttpCode(200)
  @Permissions('automations:execute')
  @ApiOperation({ summary: 'Ejecutar automatizacion' })
  @ApiResponse({ status: 200, description: 'Automatizacion ejecutada' })
  async executeAutomation(@Param('id') id: string) {
    return this.automationsService.executeAutomation(id);
  }
}
