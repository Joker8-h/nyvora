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
import { OrganizationsService } from './organizations.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAccessGuard, PermissionsGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  @Get()
  @Permissions('organizations:read')
  @ApiOperation({ summary: 'Obtener organizaciones del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de organizaciones' })
  async findAll(@CurrentUser('organizationId') organizationId: string) {
    if (organizationId) {
      const org = await this.organizationsService.findById(organizationId);
      return org ? [org] : [];
    }
    return [];
  }

  @Get(':id')
  @Permissions('organizations:read')
  @ApiOperation({ summary: 'Obtener organizacion por ID' })
  @ApiResponse({ status: 200, description: 'Organizacion encontrada' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Post()
  @Permissions('organizations:create')
  @ApiOperation({ summary: 'Crear organizacion' })
  @ApiResponse({ status: 201, description: 'Organizacion creada' })
  async create(@Body() data: any) {
    return this.organizationsService.create(data);
  }

  @Put(':id')
  @Permissions('organizations:update')
  @ApiOperation({ summary: 'Actualizar organizacion' })
  @ApiResponse({ status: 200, description: 'Organizacion actualizada' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.organizationsService.update(id, this.pick(data, ['name', 'slug', 'settings']));
  }

  @Delete(':id')
  @Permissions('organizations:delete')
  @ApiOperation({ summary: 'Eliminar organizacion' })
  @ApiResponse({ status: 200, description: 'Organizacion eliminada' })
  async remove(@Param('id') id: string) {
    return this.organizationsService.delete(id);
  }
}
