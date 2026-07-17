import { Controller, Get, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { SessionsService } from './sessions.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('sessions')
@UseGuards(JwtAccessGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener sesiones del usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de sesiones' })
  async findUserSessions(@CurrentUser('sub') userId: string) {
    return this.sessionsService.findUserSessions(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sesion' })
  @ApiResponse({ status: 200, description: 'Sesion eliminada' })
  async deleteSession(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.sessionsService.deleteSession(id, userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar todas las sesiones excepto la actual' })
  @ApiResponse({ status: 200, description: 'Sesiones eliminadas' })
  async deleteAllSessions(@CurrentUser('sub') userId: string, @Req() req: Request) {
    const sessionId = (req.user as any)?.sessionId;
    return this.sessionsService.deleteAllUserSessions(userId, sessionId);
  }
}
