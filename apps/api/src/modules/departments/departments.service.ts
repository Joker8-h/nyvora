import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        organization: true,
        employees: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Departamento no encontrado');
    }

    return department;
  }

  async findByOrganization(organizationId: string) {
    return this.prisma.department.findMany({
      where: { organizationId },
      include: {
        employees: true,
      },
    });
  }

  async create(data: {
    organizationId: string;
    name: string;
    managerId?: string;
  }) {
    return this.prisma.department.create({
      data,
    });
  }

  async update(id: string, data: Record<string, any>) {
    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
