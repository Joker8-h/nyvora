import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  @Permissions('tasks:read')
  @ApiOperation({ summary: 'Listar tareas' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'assigneeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query('projectId') projectId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tasks.findAll(organizationId, { projectId, assigneeId, status, priority, query, page, limit });
  }

  @Get('stats')
  @Permissions('tasks:read')
  @ApiOperation({ summary: 'Estadisticas de tareas' })
  async stats(@CurrentUser('organizationId') organizationId: string) {
    return this.tasks.getStats(organizationId);
  }

  @Get(':id')
  @Permissions('tasks:read')
  @ApiOperation({ summary: 'Obtener tarea por ID' })
  async findById(@CurrentUser('organizationId') organizationId: string, @Param('id') id: string) {
    return this.tasks.findById(organizationId, id);
  }

  @Post()
  @Permissions('tasks:create')
  @ApiOperation({ summary: 'Crear tarea' })
  async create(@Body() data: any, @CurrentUser('organizationId') organizationId: string, @CurrentUser('id') userId: string) {
    const { organizationId: _, ...body } = data;
    return this.tasks.create(organizationId, userId, body);
  }

  @Put(':id')
  @Permissions('tasks:update')
  @ApiOperation({ summary: 'Actualizar tarea' })
  async update(@Param('id') id: string, @Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, id: __, ...body } = data;
    return this.tasks.update(organizationId, id, body);
  }

  @Delete(':id')
  @Permissions('tasks:delete')
  @ApiOperation({ summary: 'Eliminar tarea' })
  async remove(@Param('id') id: string, @CurrentUser('organizationId') organizationId: string) {
    return this.tasks.remove(organizationId, id);
  }
}
