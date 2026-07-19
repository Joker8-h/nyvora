import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async findMeetings(organizationId: string) {
    return this.prisma.meeting.findMany({
      where: { organizationId },
      orderBy: { date: 'asc' },
    });
  }

  async createMeeting(data: { organizationId: string; title: string; date: Date; organizerId?: string }) {
    return this.prisma.meeting.create({
      data: {
        organizationId: data.organizationId,
        title: data.title,
        date: data.date,
        organizerId: data.organizerId || null,
        attendees: [],
        status: 'scheduled',
      },
    });
  }

  async deleteMeeting(id: string) {
    await this.prisma.meeting.delete({ where: { id } });
    return { ok: true };
  }
}
