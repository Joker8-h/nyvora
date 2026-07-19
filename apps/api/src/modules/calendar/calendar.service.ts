import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async findMeetings(organizationId: string, params: { status?: string; from?: string; to?: string; search?: string } = {}) {
    const { status, from, to, search } = params;
    const where: any = {
      organizationId,
      ...(status ? { status } : {}),
      ...(from || to ? {
        date: {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        },
      } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    };
    return this.prisma.meeting.findMany({
      where,
      include: { organization: { select: { name: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async findMeetingById(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: { organization: { select: { name: true } } },
    });
    if (!meeting) throw new NotFoundException('Reunión no encontrada');
    return meeting;
  }

  async createMeeting(data: { organizationId: string; title: string; description?: string; date: Date; endDate?: Date; location?: string; organizerId?: string; attendees?: string[] }) {
    return this.prisma.meeting.create({
      data: {
        organizationId: data.organizationId,
        title: data.title,
        description: data.description || null,
        date: data.date,
        endDate: data.endDate || null,
        location: data.location || null,
        organizerId: data.organizerId || null,
        attendees: data.attendees || [],
        status: 'scheduled',
      },
    });
  }

  async updateMeeting(id: string, data: { title?: string; description?: string; date?: Date; endDate?: Date; location?: string; status?: string; attendees?: string[] }) {
    const existing = await this.prisma.meeting.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Reunión no encontrada');
    return this.prisma.meeting.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.date !== undefined ? { date: data.date } : {}),
        ...(data.endDate !== undefined ? { endDate: data.endDate } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.attendees !== undefined ? { attendees: data.attendees } : {}),
      },
    });
  }

  async deleteMeeting(id: string) {
    const existing = await this.prisma.meeting.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Reunión no encontrada');
    await this.prisma.meeting.delete({ where: { id } });
    return { ok: true };
  }
}
