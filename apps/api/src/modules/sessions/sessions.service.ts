import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: string; ipAddress?: string; userAgent?: string }) {
    return this.prisma.session.create({
      data: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        lastActiveAt: new Date(),
      },
    });
  }

  async findUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
    });
  }

  async findSessionById(id: string) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Sesion no encontrada');
    return session;
  }

  async deleteSession(id: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id, userId },
    });
    if (!session) throw new NotFoundException('Sesion no encontrada');
    return this.prisma.session.delete({ where: { id } });
  }

  async deleteAllUserSessions(userId: string, keepCurrent?: string) {
    return this.prisma.session.deleteMany({
      where: {
        userId,
        ...(keepCurrent ? { id: { not: keepCurrent } } : {}),
      },
    });
  }

  async deleteExpiredSessions() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return this.prisma.session.deleteMany({
      where: { lastActiveAt: { lt: thirtyDaysAgo } },
    });
  }

  async updateLastActive(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: { lastActiveAt: new Date() },
    });
  }
}
