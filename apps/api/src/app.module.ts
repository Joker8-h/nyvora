import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma.module';
import { BigIntSerializerInterceptor } from './interceptors/bigint-serializer.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { BranchesModule } from './modules/branches/branches.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { CrmModule } from './modules/crm/crm.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SalesModule } from './modules/sales/sales.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HrModule } from './modules/hr/hr.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { SeedModule } from './modules/seed/seed.module';

function redisConnection() {
  const url = process.env.REDIS_URL || 'redis://redis:6379';
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: Number(u.port) || 6379,
      password: u.password || undefined,
    };
  } catch {
    return { host: 'redis', port: 6379 };
  }
}

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    BullModule.forRoot({
      connection: redisConnection(),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
        level: process.env.LOG_LEVEL || 'info',
        autoLogging: {
          ignore: (req) => req.url === '/api/v1/health',
        },
      },
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    BranchesModule,
    DepartmentsModule,
    SessionsModule,
    AiModule,
    HealthModule,
    CrmModule,
    ProjectsModule,
    TasksModule,
    SalesModule,
    InventoryModule,
    FinanceModule,
    HrModule,
    AutomationsModule,
    MarketplaceModule,
    IntegrationsModule,
    InvitationsModule,
    CampaignsModule,
    CalendarModule,
    SeedModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: BigIntSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
