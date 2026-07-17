import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { InvitationsService } from './invitations.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '@nyvora/types';

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('users:create')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear invitacion' })
  @ApiResponse({ status: 201, description: 'Invitacion creada' })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: { email: string; role?: string }
  ) {
    return this.invitationsService.create(
      user.organizationId!,
      user.id,
      body.email,
      body.role || 'employee'
    );
  }

  @Get()
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('users:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar invitaciones pendientes' })
  @ApiResponse({ status: 200, description: 'Lista de invitaciones' })
  async findAll(@CurrentUser('organizationId') organizationId: string) {
    return this.invitationsService.findByOrganization(organizationId);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('users:delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revocar invitacion' })
  @ApiResponse({ status: 200, description: 'Invitacion revocada' })
  async revoke(
    @CurrentUser('organizationId') organizationId: string,
    @Param('id') id: string
  ) {
    return this.invitationsService.revoke(organizationId, id);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verificar token de invitacion (publico)' })
  @ApiResponse({ status: 200, description: 'Invitacion valida' })
  async verify(@Param('token') token: string) {
    return this.invitationsService.verify(token);
  }

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceptar invitacion (publico)' })
  @ApiResponse({ status: 200, description: 'Invitacion aceptada' })
  async accept(
    @Body()
    body: {
      token: string;
      firstName?: string;
      lastName?: string;
      password?: string;
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.invitationsService.accept(
      body.token,
      body.firstName || '',
      body.lastName || '',
      body.password || '',
      req.ip,
      req.headers['user-agent']
    );

    res.cookie('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }
}
