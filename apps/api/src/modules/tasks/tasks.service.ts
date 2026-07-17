import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

export interface TaskFilter {
  projectId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  query?: string;
  page?: string;
  limit?: string;
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, filter: TaskFilter = {}) {
    const page = Math.max(1, parseInt(filter.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(filter.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where: any = { project: { organizationId, deletedAt: null } };
    if (filter.projectId) where.projectId = filter.projectId;
    if (filter.assigneeId) where.assigneeId = filter.assigneeId;
    if (filter.status) where.status = filter.status;
    if (filter.priority) where.priority = filter.priority;
    if (filter.query) {
      where.OR = [
        { title: { contains: filter.query, mode: 'insensitive' } },
        { description: { contains: filter.query, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true, email: true } },
          project: { select: { id: true, name: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data: items, total, page, limit };
  }

  async findById(organizationId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, project: { organizationId, deletedAt: null } },
      include: { assignee: true, project: true },
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return task;
  }

  async create(organizationId: string, userId: string, data: any) {
    await this.ensureProject(organizationId, data.projectId);
    const { organizationId: _o, id: _i, createdAt: _c, completedAt: _co, assignee: _a, project: _p, timeEntries: _te, ...clean } = data;
    return this.prisma.task.create({
      data: {
        ...clean,
        createdById: userId,
        dueDate: clean.dueDate ? new Date(clean.dueDate) : null,
      },
    });
  }

  async update(organizationId: string, id: string, data: any) {
    const existing = await this.findById(organizationId, id);
    const { organizationId: _o, id: _i, createdAt: _c, completedAt: _co, assignee: _a, project: _p, timeEntries: _te, ...clean } = data;
    const updateData: any = { ...clean };
    if (clean.dueDate !== undefined) updateData.dueDate = clean.dueDate ? new Date(clean.dueDate) : null;
    if (clean.status === 'done' && existing.status !== 'done') updateData.completedAt = new Date();
    if (clean.status && clean.status !== 'done') updateData.completedAt = null;
    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findById(organizationId, id);
    return this.prisma.task.delete({ where: { id } });
  }

  async getStats(organizationId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { project: { organizationId, deletedAt: null } },
      select: { status: true, priority: true },
    });
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    for (const t of tasks) {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
    }
    return { total: tasks.length, byStatus, byPriority };
  }

  private async ensureProject(organizationId: string, projectId?: string) {
    if (!projectId) return;
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Proyecto no encontrado');
  }
}
