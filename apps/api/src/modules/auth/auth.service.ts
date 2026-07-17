import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '@nyvora/database';
import { PermissionsService } from './permissions.service';
import type {
  AuthUser,
  AuthTokens,
  AuthResponse,
  TokenPayload,
} from '@nyvora/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly permissions: PermissionsService
  ) {}

  async login(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Email no verificado');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    // Create session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        lastActiveAt: new Date(),
      },
    });

    // Get user's default organization
    const membership = await this.prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    return {
      user: this.mapUser(user),
      tokens,
      organization: membership ? {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        plan: membership.organization.plan,
      } : undefined,
    };
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    organizationName?: string
  ): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya esta registrado');
    }

    const passwordHash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        emailVerifiedAt: new Date(),
      },
    });

    // Create organization if provided
    if (organizationName) {
      let slug = organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Handle slug collision by appending random suffix
      const existingOrg = await this.prisma.organization.findUnique({
        where: { slug },
      });
      if (existingOrg) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      const organization = await this.prisma.organization.create({
        data: {
          name: organizationName,
          slug,
          memberships: {
            create: {
              userId: user.id,
              role: 'owner',
              acceptedAt: new Date(),
            },
          },
        },
      });

      const tokens = await this.generateTokens(user.id, user.email);

      return {
        user: this.mapUser(user),
        tokens,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          plan: organization.plan,
        },
      };
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: this.mapUser(user),
      tokens,
    };
  }

  async createSessionResponse(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        lastActiveAt: new Date(),
      },
    });

    const membership = await this.prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    return {
      user: this.mapUser(user),
      tokens,
      organization: membership ? {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        plan: membership.organization.plan,
      } : undefined,
    };
  }

  async refreshTokens(
    refreshToken: string
  ): Promise<AuthTokens> {
    // Verify the refresh token
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return this.generateTokens(user.id, user.email);
  }

  async logout(userId: string): Promise<void> {
    // Delete all sessions for the user
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async validateUser(payload: TokenPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const mappedUser = this.mapUser(user);

    // Load permissions from role
    const membership = user.memberships?.[0];
    if (membership) {
      mappedUser.permissions = this.getRolePermissions(membership.role);
      mappedUser.organizationId = membership.organizationId;
    } else {
      mappedUser.permissions = [];
    }

    return mappedUser;
  }

  private async generateTokens(
    userId: string,
    email: string
  ): Promise<AuthTokens> {
    const payload: TokenPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '2h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 2 * 60 * 60,
      tokenType: 'Bearer',
    };
  }

  private mapUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isActive: user.isActive,
      emailVerified: user.emailVerifiedAt,
      permissions: [],
      organizationId: undefined,
    };
  }

  private getRolePermissions(role: string): string[] {
    return this.permissions.getRolePermissions(role);
  }
}
