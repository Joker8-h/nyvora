import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '@nyvora/database';
import { IntegrationsService } from '../integrations/integrations.service';
import { AuthService } from '../auth/auth.service';

const VALID_ROLES = ['admin', 'manager', 'employee', 'viewer'];
const EXPIRY_DAYS = 7;

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly integrations: IntegrationsService,
    private readonly authService: AuthService
  ) {}

  async create(
    organizationId: string,
    createdById: string | undefined,
    email: string,
    role: string
  ) {
    if (!organizationId) {
      throw new BadRequestException('Organizacion no encontrada');
    }

    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new BadRequestException('Email invalido');
    }

    const normalizedRole = VALID_ROLES.includes(role) ? role : 'employee';

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { memberships: true },
    });

    if (existingUser?.memberships?.some((m) => m.organizationId === organizationId)) {
      throw new ConflictException('El usuario ya pertenece a la organizacion');
    }

    const pending = await this.prisma.invitation.findFirst({
      where: {
        organizationId,
        email: normalizedEmail,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (pending) {
      throw new ConflictException('Ya existe una invitacion pendiente para este email');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const invitation = await this.prisma.invitation.create({
      data: {
        organizationId,
        email: normalizedEmail,
        role: normalizedRole,
        token,
        expiresAt,
        createdById: createdById ?? null,
      },
    });

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    const appUrl = this.config.get('APP_URL') || 'http://localhost:3006';
    const acceptUrl = `${appUrl}/invitations/accept?token=${token}`;

    const emailResult = await this.integrations
      .sendEmail({
        to: normalizedEmail,
        subject: `Invitacion para unirte a ${organization?.name || 'Nyvora'}`,
        body: `Has sido invitado a unirte a ${organization?.name || 'la organizacion'} en Nyvora con el rol de ${normalizedRole}.\n\nAcepta la invitacion aqui:\n${acceptUrl}\n\nEste enlace expira en ${EXPIRY_DAYS} dias.`,
      })
      .catch((error: unknown) => ({
        ok: false,
        provider: 'email',
        error: error instanceof Error ? error.message : String(error),
      }));

    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      acceptUrl,
      emailSent: emailResult?.ok === true,
      emailError: emailResult?.ok ? undefined : (emailResult as any)?.error,
    };
  }

  async findByOrganization(organizationId: string) {
    if (!organizationId) return { data: [], total: 0 };

    const items = await this.prisma.invitation.findMany({
      where: {
        organizationId,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: items, total: items.length };
  }

  async revoke(organizationId: string, id: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { id } });
    if (!invitation || invitation.organizationId !== organizationId) {
      throw new NotFoundException('Invitacion no encontrada');
    }
    await this.prisma.invitation.delete({ where: { id } });
    return { success: true };
  }

  async verify(token: string) {
    const invitation = await this.getValidInvitation(token);
    const organization = await this.prisma.organization.findUnique({
      where: { id: invitation.organizationId },
    });
    const existingUser = await this.prisma.user.findUnique({
      where: { email: invitation.email },
    });

    return {
      valid: true,
      email: invitation.email,
      role: invitation.role,
      organizationName: organization?.name || 'Nyvora',
      requiresRegistration: !existingUser,
      expiresAt: invitation.expiresAt,
    };
  }

  async accept(
    token: string,
    firstName: string,
    lastName: string,
    password: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const invitation = await this.getValidInvitation(token);

    let user = await this.prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (!user) {
      if (!password || password.length < 8) {
        throw new BadRequestException('La contrasena debe tener al menos 8 caracteres');
      }
      const passwordHash = await argon2.hash(password);
      user = await this.prisma.user.create({
        data: {
          email: invitation.email,
          passwordHash,
          firstName: String(firstName || '').trim() || 'Usuario',
          lastName: String(lastName || '').trim() || '',
          emailVerifiedAt: new Date(),
        },
      });
    }

    const existingMembership = await this.prisma.membership.findFirst({
      where: { userId: user.id, organizationId: invitation.organizationId },
    });

    if (!existingMembership) {
      await this.prisma.membership.create({
        data: {
          userId: user.id,
          organizationId: invitation.organizationId,
          role: invitation.role,
          invitedById: invitation.createdById ?? null,
          invitedAt: invitation.createdAt,
          acceptedAt: new Date(),
        },
      });
    }

    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    return this.authService.createSessionResponse(user.id, ipAddress, userAgent);
  }

  private async getValidInvitation(token: string) {
    if (!token) {
      throw new BadRequestException('Token requerido');
    }
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });
    if (!invitation) {
      throw new NotFoundException('Invitacion no encontrada');
    }
    if (invitation.acceptedAt) {
      throw new BadRequestException('Esta invitacion ya fue aceptada');
    }
    if (invitation.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Esta invitacion ha expirado');
    }
    return invitation;
  }
}
