import { Controller, Get, Put, Delete, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { WhatsappWebService } from './whatsapp-web.service';
import { UpsertCredentialDto } from './dto/credential.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class IntegrationsController {
  constructor(
    private readonly integrations: IntegrationsService,
    private readonly whatsappWeb: WhatsappWebService,
  ) {}

  @Get()
  @Permissions('integrations:read')
  @ApiOperation({ summary: 'Listar credenciales de integraciones (enmascaradas)' })
  async list(@CurrentUser('organizationId') organizationId: string) {
    return this.integrations.listCredentials(organizationId);
  }

  @Get('whatsapp/session')
  @Permissions('integrations:read')
  @ApiOperation({ summary: 'Estado de la sesion de WhatsApp Web' })
  async whatsappStatus(@CurrentUser('organizationId') organizationId: string) {
    return this.whatsappWeb.getStatus(organizationId);
  }

  @Post('whatsapp/session/start')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Iniciar sesion de WhatsApp Web (genera QR)' })
  async whatsappStart(@CurrentUser('organizationId') organizationId: string) {
    return this.whatsappWeb.startSession(organizationId);
  }

  @Post('whatsapp/session/logout')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Cerrar sesion de WhatsApp Web' })
  async whatsappLogout(@CurrentUser('organizationId') organizationId: string) {
    return this.whatsappWeb.logout(organizationId);
  }

  @Put(':provider')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Crear o actualizar credenciales de un proveedor' })
  async upsert(
    @CurrentUser('organizationId') organizationId: string,
    @Param('provider') provider: string,
    @Body() body: UpsertCredentialDto,
  ) {
    return this.integrations.upsertCredential(organizationId, provider, body.data);
  }

  @Post(':provider/test')
  @Permissions('integrations:test')
  @ApiOperation({ summary: 'Probar credenciales de un proveedor' })
  async test(
    @CurrentUser('organizationId') organizationId: string,
    @Param('provider') provider: string,
  ) {
    return this.integrations.testCredential(organizationId, provider);
  }

  @Delete(':provider')
  @Permissions('integrations:delete')
  @ApiOperation({ summary: 'Eliminar credenciales de un proveedor' })
  async remove(
    @CurrentUser('organizationId') organizationId: string,
    @Param('provider') provider: string,
  ) {
    return this.integrations.deleteCredential(organizationId, provider);
  }
}
