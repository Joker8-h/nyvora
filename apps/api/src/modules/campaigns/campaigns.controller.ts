import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto, StartCampaignDto } from './dto/campaign.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Campaigns')
@ApiBearerAuth()
@Controller('campaigns')
@UseGuards(JwtAccessGuard, PermissionsGuard)
export class CampaignsController {
  constructor(private readonly campaigns: CampaignsService) {}

  @Get()
  @Permissions('campaigns:read')
  @ApiOperation({ summary: 'Listar campanas' })
  async findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.campaigns.findAll(organizationId, Number(page) || 1, Number(limit) || 20);
  }

  @Get(':id')
  @Permissions('campaigns:read')
  @ApiOperation({ summary: 'Obtener campana con mensajes' })
  async findOne(@CurrentUser('organizationId') organizationId: string, @Param('id') id: string) {
    return this.campaigns.findOne(organizationId, id);
  }

  @Post()
  @Permissions('campaigns:create')
  @ApiOperation({ summary: 'Crear campana' })
  async create(@CurrentUser('organizationId') organizationId: string, @Body() dto: CreateCampaignDto) {
    return this.campaigns.create(organizationId, dto);
  }

  @Put(':id')
  @Permissions('campaigns:update')
  @ApiOperation({ summary: 'Actualizar campana' })
  async update(
    @CurrentUser('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaigns.update(organizationId, id, dto);
  }

  @Post(':id/start')
  @Permissions('campaigns:send')
  @ApiOperation({ summary: 'Iniciar envio de la campana' })
  async start(
    @CurrentUser('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() dto: StartCampaignDto,
  ) {
    return this.campaigns.start(organizationId, id, dto);
  }

  @Delete(':id')
  @Permissions('campaigns:delete')
  @ApiOperation({ summary: 'Eliminar campana' })
  async remove(@CurrentUser('organizationId') organizationId: string, @Param('id') id: string) {
    return this.campaigns.remove(organizationId, id);
  }
}
