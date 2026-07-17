import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class HrService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // EMPLOYEES
  // ============================================
  async findEmployees(organizationId: string, params: { departmentId?: string; status?: string; page?: number; limit?: number; search?: string } = {}) {
    const { departmentId, status, search } = params;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const where: any = {
      organizationId,
      deletedAt: null,
      ...(departmentId ? { departmentId } : {}),
      ...(status ? { status } : {}),
      ...(search ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        include: { department: true, position: true, branch: true, user: true },
        orderBy: { firstName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.employee.count({ where }),
    ]);
    return { data: rows, total, page, limit };
  }

  async findEmployeeById(id: string) {
    const emp = await this.prisma.employee.findUnique({
      where: { id },
      include: { department: true, position: true, branch: true, user: true, absences: true, evaluations: true },
    });
    if (!emp) throw new NotFoundException('Empleado no encontrado');
    return emp;
  }

  async createEmployee(data: { organizationId: string; userId?: string; firstName: string; lastName: string; email: string; phone?: string; departmentId?: string; positionId?: string; branchId?: string; hireDate: Date; salary?: bigint; contractType?: string }) {
    return this.prisma.employee.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        departmentId: data.departmentId,
        positionId: data.positionId,
        branchId: data.branchId,
        hireDate: data.hireDate,
        salary: data.salary,
        contractType: data.contractType,
      },
    });
  }

  async updateEmployee(id: string, data: Record<string, any>) {
    await this.findEmployeeById(id);
    return this.prisma.employee.update({ where: { id }, data });
  }

  async deleteEmployee(id: string) {
    await this.findEmployeeById(id);
    return this.prisma.employee.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============================================
  // POSITIONS
  // ============================================
  async findPositions(organizationId: string) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.position.findMany({
        where: { organizationId },
        include: { _count: { select: { employees: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.position.count({ where: { organizationId } }),
    ]);
    return { data: rows, total };
  }

  async findPositionById(id: string) {
    const pos = await this.prisma.position.findUnique({
      where: { id },
      include: { employees: true },
    });
    if (!pos) throw new NotFoundException('Posicion no encontrada');
    return pos;
  }

  async createPosition(data: { organizationId: string; name: string; departmentId?: string }) {
    return this.prisma.position.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        departmentId: data.departmentId,
      },
    });
  }

  async updatePosition(id: string, data: Record<string, any>) {
    await this.findPositionById(id);
    return this.prisma.position.update({ where: { id }, data });
  }

  async deletePosition(id: string) {
    await this.findPositionById(id);
    return this.prisma.position.delete({ where: { id } });
  }

  // ============================================
  // ABSENCES
  // ============================================
  async findAbsences(organizationId: string, params: { employeeId?: string; status?: string; page?: number; limit?: number } = {}) {
    const { employeeId, status } = params;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const where: any = {
      ...(employeeId ? { employeeId } : {}),
      ...(status ? { status } : {}),
      ...(organizationId ? { employee: { organizationId } } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.absence.findMany({
        where,
        include: { employee: true },
        orderBy: { startDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.absence.count({ where }),
    ]);
    return { data: rows, total, page, limit };
  }

  async findAbsenceById(id: string) {
    const abs = await this.prisma.absence.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!abs) throw new NotFoundException('Ausencia no encontrada');
    return abs;
  }

  async createAbsence(data: { employeeId: string; type: string; startDate: Date; endDate: Date; notes?: string }) {
    return this.prisma.absence.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
      },
    });
  }

  async updateAbsence(id: string, data: Record<string, any>) {
    await this.findAbsenceById(id);
    return this.prisma.absence.update({ where: { id }, data });
  }

  async deleteAbsence(id: string) {
    await this.findAbsenceById(id);
    return this.prisma.absence.delete({ where: { id } });
  }

  // ============================================
  // EVALUATIONS
  // ============================================
  async findEvaluations(organizationId: string, params: { employeeId?: string; page?: number; limit?: number } = {}) {
    const { employeeId } = params;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const where: any = {
      ...(employeeId ? { employeeId } : {}),
      ...(organizationId ? { employee: { organizationId } } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.evaluation.findMany({
        where,
        include: { employee: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.evaluation.count({ where }),
    ]);
    return { data: rows, total, page, limit };
  }

  async findEvaluationById(id: string) {
    const ev = await this.prisma.evaluation.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!ev) throw new NotFoundException('Evaluacion no encontrada');
    return ev;
  }

  async createEvaluation(data: { employeeId: string; period: string; selfScore?: number; managerScore?: number; notes?: string }) {
    return this.prisma.evaluation.create({
      data: {
        employeeId: data.employeeId,
        period: data.period,
        selfScore: data.selfScore,
        managerScore: data.managerScore,
        notes: data.notes,
      },
    });
  }

  async updateEvaluation(id: string, data: Record<string, any>) {
    await this.findEvaluationById(id);
    return this.prisma.evaluation.update({ where: { id }, data });
  }

  async deleteEvaluation(id: string) {
    await this.findEvaluationById(id);
    return this.prisma.evaluation.delete({ where: { id } });
  }
}
