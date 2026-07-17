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
import { UsersService } from './users.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAccessGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
  }

  @Get()
  @Permissions('users:read')
  @ApiOperation({ summary: 'Obtener lista de usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAll(@CurrentUser('organizationId') organizationId: string) {
    if (organizationId) {
      return this.usersService.findByOrganization(organizationId);
    }
    return [];
  }

  @Get(':id')
  @Permissions('users:read')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Permissions('users:update')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  async update(@Param('id') id: string, @Body() data: any) {
    const membership =
      data.membership && data.membership.organizationId
        ? { organizationId: data.membership.organizationId, role: data.membership.role }
        : data.organizationId
          ? { organizationId: data.organizationId, role: data.role }
          : undefined;

    return this.usersService.update(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      avatar: data.avatar,
      isActive: data.isActive,
      membership,
    });
  }

  @Delete(':id')
  @Permissions('users:delete')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
