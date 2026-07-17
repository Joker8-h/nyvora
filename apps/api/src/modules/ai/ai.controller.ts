import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { NovaOrchestratorService } from './services/nova-orchestrator.service';
import { ExecutorService } from './services/executor.service';
import { MemoryService } from './services/memory.service';
import { PermissionsService } from '../auth/permissions.service';
import { PrismaService } from '@nyvora/database';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '@nyvora/types';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(
    private readonly novaOrchestrator: NovaOrchestratorService,
    private readonly executor: ExecutorService,
    private readonly memory: MemoryService,
    private readonly permissions: PermissionsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('nova/chat')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat con Nova' })
  @ApiResponse({ status: 200, description: 'Respuesta de Nova' })
  async chat(
    @Body() body: { message: string; conversationId?: string },
    @CurrentUser() user: AuthUser,
    @Res() res: Response
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = await this.novaOrchestrator.chat(
        body.message,
        user.id,
        body.conversationId
      );

      for await (const chunk of stream) {
        res.write(JSON.stringify(chunk) + '\n');
      }

      res.end();
    } catch (error) {
      console.error('Nova chat error:', error);
      res.write(
        JSON.stringify({
          type: 'error',
          message: 'Error al procesar tu mensaje',
        }) + '\n'
      );
      res.end();
    }
  }

  @Post('tool-execute')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ejecutar una herramienta de Nova directamente (testing, requiere sesion)' })
  async toolExecute(
    @Body() body: { name: string; arguments?: Record<string, any> },
    @CurrentUser() user: AuthUser,
  ) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId: user.id },
    });
    const role = membership?.role ?? 'employee';

    const result = await this.executor.execute(
      { name: body.name, arguments: body.arguments ?? {} },
      user.id,
      {
        organizationId: user.organizationId ?? membership?.organizationId,
        permissions: this.permissions.getRolePermissions(role),
      },
    );
    return { result };
  }

  @Get('nova/conversations')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar conversaciones de Nova del usuario' })
  async listConversations(@CurrentUser() user: AuthUser) {
    return this.memory.listConversations(user.organizationId ?? '', user.id);
  }

  @Get('nova/conversations/:id')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener historial de una conversación' })
  async getConversation(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const messages = await this.memory.getHistory(id, 200);
    return { conversationId: id, messages };
  }

  @Delete('nova/conversations/:id')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar una conversación' })
  async deleteConversation(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.memory.clearHistory(id);
    return { ok: true };
  }
}