import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        branches: true,
        departments: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organizacion no encontrada');
    }

    return organization;
  }

  async findByUserId(userId: string) {
    return this.prisma.organization.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      include: {
        branches: true,
        departments: true,
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    plan?: string;
    settings?: Record<string, any>;
  }) {
    const organization = await this.prisma.organization.create({
      data,
    });

    await this.prisma.crmPipeline.create({
      data: {
        organizationId: organization.id,
        name: 'Ventas',
        isDefault: true,
        stages: JSON.stringify([
          { name: 'Nuevo', probability: 10 },
          { name: 'Contactado', probability: 30 },
          { name: 'Calificado', probability: 50 },
          { name: 'Propuesta', probability: 75 },
          { name: 'Ganado', probability: 100 },
          { name: 'Perdido', probability: 0 },
        ]),
      },
    });

    return organization;
  }

  async update(id: string, data: Record<string, any>) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
