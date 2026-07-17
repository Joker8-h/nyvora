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
import { BranchesService } from './branches.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Branches')
@Controller('branches')
@UseGuards(JwtAccessGuard, PermissionsGuard)
@ApiBearerAuth()
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  @Get()
  @Permissions('branches:read')
  @ApiOperation({ summary: 'Obtener sucursales' })
  @ApiResponse({ status: 200, description: 'Lista de sucursales' })
  async findAll(@CurrentUser('organizationId') organizationId: string) {
    return this.branchesService.findByOrganization(organizationId);
  }

  @Get(':id')
  @Permissions('branches:read')
  @ApiOperation({ summary: 'Obtener sucursal por ID' })
  @ApiResponse({ status: 200, description: 'Sucursal encontrada' })
  async findOne(@Param('id') id: string) {
    return this.branchesService.findById(id);
  }

  @Post()
  @Permissions('branches:create')
  @ApiOperation({ summary: 'Crear sucursal' })
  @ApiResponse({ status: 201, description: 'Sucursal creada' })
  async create(@Body() data: any, @CurrentUser('organizationId') organizationId: string) {
    const { organizationId: _, ...body } = data;
    return this.branchesService.create({ ...body, organizationId });
  }

  @Put(':id')
  @Permissions('branches:update')
  @ApiOperation({ summary: 'Actualizar sucursal' })
  @ApiResponse({ status: 200, description: 'Sucursal actualizada' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.branchesService.update(id, this.pick(data, ['name', 'address', 'phone', 'isHeadquarters']));
  }

  @Delete(':id')
  @Permissions('branches:delete')
  @ApiOperation({ summary: 'Eliminar sucursal' })
  @ApiResponse({ status: 200, description: 'Sucursal eliminada' })
  async remove(@Param('id') id: string) {
    return this.branchesService.delete(id);
  }
}