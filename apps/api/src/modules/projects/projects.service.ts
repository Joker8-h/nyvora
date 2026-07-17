import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

export interface ProjectFilter {
  status?: string;
  query?: string;
  page?: string;
  limit?: string;
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, filter: ProjectFilter = {}) {
    const page = Math.max(1, parseInt(filter.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(filter.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where: any = { organizationId, deletedAt: null };
    if (filter.status) where.status = filter.status;
    if (filter.query) {
      where.OR = [
        { name: { contains: filter.query, mode: 'insensitive' } },
        { description: { contains: filter.query, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { tasks: { select: { id: true, status: true } }, client: { select: { id: true, firstName: true, lastName: true, company: { select: { name: true } } } } },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data: items, total, page, limit };
  }

  async findById(organizationId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: { tasks: true, client: true },
    });
    if (!project) throw new NotFoundException('Proyecto no encontrado');
    return project;
  }

  async create(organizationId: string, userId: string, data: any) {
    const { organizationId: _o, id: _i, createdAt: _c, deletedAt: _d, tasks: _t, client: _cl, ...clean } = data;
    return this.prisma.project.create({
      data: {
        ...clean,
        organizationId,
        createdById: userId,
      },
    });
  }

  async update(organizationId: string, id: string, data: any) {
    await this.findById(organizationId, id);
    const { organizationId: _o, id: _i, createdAt: _c, deletedAt: _d, tasks: _t, client: _cl, ...clean } = data;
    return this.prisma.project.update({
      where: { id },
      data: clean,
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findById(organizationId, id);
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats(organizationId: string) {
    const projects = await this.prisma.project.findMany({
      where: { organizationId, deletedAt: null },
      select: { status: true },
    });
    const byStatus: Record<string, number> = {};
    for (const p of projects) byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    return { total: projects.length, byStatus };
  }
}
