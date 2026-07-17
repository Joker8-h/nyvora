import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  @Permissions('projects:read')
  @ApiOperation({ summary: 'Listar proyectos' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query('status') status?: string,
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.projects.findAll(organizationId, { status, query, page, limit });
  }

  @Get('stats')
  @Permissions('projects:read')
  @ApiOperation({ summary: 'Estadisticas de proyectos' })
  async stats(@CurrentUser('organizationId') organizationId: string) {
    return this.projects.getStats(organizationId);
  }

  @Get(':id')
  @Permissions('projects:read')
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  async findById(@CurrentUser('organizationId') organizationId: string, @Param('id') id: string) {
    return this.projects.findById(organizationId, id);
  }

  @Post()
  @Permissions('projects:create')
  @ApiOperation({ summary: 'Crear proyecto' })
  async create(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.projects.create(organizationId, userId, body);
  }

  @Put(':id')
  @Permissions('projects:update')
  @ApiOperation({ summary: 'Actualizar proyecto' })
  async update(@Param('id') id: string, @Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, id: __, ...body } = data;
    return this.projects.update(organizationId, id, body);
  }

  @Delete(':id')
  @Permissions('projects:delete')
  @ApiOperation({ summary: 'Eliminar proyecto (soft delete)' })
  async remove(@Param('id') id: string, @CurrentUser('organizationId') organizationId: string) {
    return this.projects.remove(organizationId, id);
  }
}
