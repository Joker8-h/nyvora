import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { passwordHash, ...rest } = user as any;
    return rest;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    const { passwordHash, ...rest } = user as any;
    return rest;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('El email ya esta registrado');
    }

    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Record<string, any>) {
    const userData: Record<string, any> = {};
    for (const key of ['firstName', 'lastName', 'phone', 'avatar', 'isActive']) {
      if (data[key] !== undefined) userData[key] = data[key];
    }

    const result = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    if (data.membership && data.membership.organizationId) {
      const role = data.membership.role || 'employee';
      await this.prisma.membership.upsert({
        where: {
          userId_organizationId: {
            userId: id,
            organizationId: data.membership.organizationId,
          },
        },
        create: {
          userId: id,
          organizationId: data.membership.organizationId,
          role,
          acceptedAt: new Date(),
        },
        update: { role },
      });
    }

    const updated = await this.prisma.user.findUnique({
      where: { id },
      include: { memberships: { include: { organization: true } } },
    });
    const { passwordHash, ...rest } = updated as any;
    return rest;
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByOrganization(organizationId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        memberships: {
          some: { organizationId },
        },
      },
      include: {
        memberships: {
          where: { organizationId },
        },
      },
    });
    return users.map(({ passwordHash, ...rest }: any) => rest);
  }
}
