import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Marketplace')
@ApiBearerAuth()
@Controller('marketplace')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('apps/catalog')
  @Permissions('marketplace:read')
  @ApiOperation({ summary: 'Obtener catalogo completo de apps disponibles' })
  async findCatalog(@CurrentUser('organizationId') organizationId: string) {
    return this.marketplaceService.findCatalog(organizationId);
  }

  @Get('apps')
  @Permissions('marketplace:read')
  @ApiOperation({ summary: 'Obtener apps instaladas' })
  async findInstalledApps(@CurrentUser('organizationId') organizationId: string) {
    return this.marketplaceService.findInstalledApps(organizationId);
  }

  @Get('apps/:id')
  @Permissions('marketplace:read')
  @ApiOperation({ summary: 'Obtener instalacion por ID' })
  async findInstallationById(@Param('id') id: string) {
    return this.marketplaceService.findInstallationById(id);
  }

  @Post('apps/install')
  @Permissions('marketplace:install')
  @ApiOperation({ summary: 'Instalar app' })
  @ApiResponse({ status: 201, description: 'App instalada' })
  async installApp(
    @CurrentUser('organizationId') organizationId: string,
    @Body() body: { appId: string; config?: Record<string, any> },
  ) {
    return this.marketplaceService.installApp(organizationId, body.appId, body.config);
  }

  @Delete('apps/:id/uninstall')
  @Permissions('marketplace:uninstall')
  @ApiOperation({ summary: 'Desinstalar app' })
  async uninstallApp(@Param('id') id: string) {
    return this.marketplaceService.uninstallApp(id);
  }

  @Put('apps/:id/config')
  @Permissions('marketplace:update')
  @ApiOperation({ summary: 'Actualizar configuracion de app' })
  async updateAppConfig(@Param('id') id: string, @Body() body: { config: Record<string, any> }) {
    return this.marketplaceService.updateAppConfig(id, body.config);
  }
}
