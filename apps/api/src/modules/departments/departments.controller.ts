import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(JwtAccessGuard, PermissionsGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  @Get()
  @Permissions('departments:read')
  @ApiOperation({ summary: 'Obtener departamentos' })
  @ApiResponse({ status: 200, description: 'Lista de departamentos' })
  async findAll(@CurrentUser('organizationId') organizationId: string) {
    if (organizationId) {
      return this.departmentsService.findByOrganization(organizationId);
    }
    return [];
  }

  @Get(':id')
  @Permissions('departments:read')
  @ApiOperation({ summary: 'Obtener departamento por ID' })
  @ApiResponse({ status: 200, description: 'Departamento encontrado' })
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findById(id);
  }

  @Post()
  @Permissions('departments:create')
  @ApiOperation({ summary: 'Crear departamento' })
  @ApiResponse({ status: 201, description: 'Departamento creado' })
  async create(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.departmentsService.create({ ...body, organizationId });
  }

  @Put(':id')
  @Permissions('departments:update')
  @ApiOperation({ summary: 'Actualizar departamento' })
  @ApiResponse({ status: 200, description: 'Departamento actualizado' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.departmentsService.update(id, this.pick(data, ['name', 'managerId']));
  }

  @Delete(':id')
  @Permissions('departments:delete')
  @ApiOperation({ summary: 'Eliminar departamento' })
  @ApiResponse({ status: 200, description: 'Departamento eliminado' })
  async remove(@Param('id') id: string) {
    return this.departmentsService.delete(id);
  }
}
