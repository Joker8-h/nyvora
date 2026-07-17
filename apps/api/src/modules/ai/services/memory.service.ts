import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';
import type { NovaMessage } from '@nyvora/types';

@Injectable()
export class MemoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(conversationId: string, limit = 50): Promise<NovaMessage[]> {
    const rows = await this.prisma.novaMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    return rows.map((r) => ({
      id: r.id,
      type: (r.role as NovaMessage['type']) ?? 'user',
      content: r.content,
      toolCalls: (r.toolCalls as unknown as NovaMessage['toolCalls']) ?? undefined,
      metadata: (r.metadata as unknown as NovaMessage['metadata']) ?? undefined,
      createdAt: r.createdAt,
    }));
  }

  async addMessage(
    conversationId: string,
    message: NovaMessage,
    context?: { organizationId?: string; userId?: string },
  ): Promise<void> {
    await this.prisma.novaMessage.create({
      data: {
        id: message.id,
        conversationId,
        organizationId: context?.organizationId ?? '',
        userId: context?.userId ?? '',
        role: message.type,
        content: message.content,
        toolCalls: (message.toolCalls as any) ?? undefined,
        metadata: (message.metadata as any) ?? undefined,
        createdAt: message.createdAt ?? new Date(),
      },
    });
  }

  async clearHistory(conversationId: string): Promise<void> {
    await this.prisma.novaMessage.deleteMany({ where: { conversationId } });
  }

  async listConversations(organizationId: string, userId: string): Promise<
    { conversationId: string; lastMessage: string; updatedAt: Date }[]
  > {
    const rows = await this.prisma.novaMessage.findMany({
      where: { organizationId, userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const map = new Map<string, { conversationId: string; lastMessage: string; updatedAt: Date }>();
    for (const r of rows) {
      if (!map.has(r.conversationId)) {
        map.set(r.conversationId, {
          conversationId: r.conversationId,
          lastMessage: r.content,
          updatedAt: r.createdAt,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}
