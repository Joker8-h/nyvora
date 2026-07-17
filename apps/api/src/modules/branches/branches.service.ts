import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        organization: true,
        warehouses: true,
      },
    });

    if (!branch) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    return branch;
  }

  async findByOrganization(organizationId: string) {
    return this.prisma.branch.findMany({
      where: { organizationId },
      include: {
        warehouses: true,
      },
    });
  }

  async create(data: {
    organizationId: string;
    name: string;
    address?: Record<string, any>;
    phone?: string;
    isHeadquarters?: boolean;
  }) {
    return this.prisma.branch.create({
      data,
    });
  }

  async update(id: string, data: Record<string, any>) {
    return this.prisma.branch.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.branch.delete({
      where: { id },
    });
  }
}
