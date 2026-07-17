import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nyvora/database';
import { PermissionsService } from '../../auth/permissions.service';

@Injectable()
export class ContextBuilderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService
  ) {}

  async build(userId: string, conversationId: string): Promise<any> {
    const membership = await this.prisma.membership.findFirst({
      where: { userId },
      include: { organization: true },
    });

    const role = membership?.role;
    const resolvedPermissions = role
      ? this.permissions.getRolePermissions(role)
      : [];

    return {
      userId,
      conversationId,
      organizationId: membership?.organizationId,
      branchId: null,
      permissions: resolvedPermissions,
      user: null,
      organization: membership?.organization || null,
    };
  }
}
