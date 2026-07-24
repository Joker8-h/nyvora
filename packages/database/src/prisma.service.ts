import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { execSync } from 'child_process';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    this.logger.log('Pushing database schema...');
    const dbRoot = path.join(__dirname, '..');
    const schemaPath = path.join(dbRoot, 'prisma', 'schema.prisma');
    try {
      execSync(
        `npx prisma db push --accept-data-loss --skip-generate --schema="${schemaPath}"`,
        { stdio: 'inherit', timeout: 60000, cwd: dbRoot },
      );
      this.logger.log('Database schema pushed successfully');
    } catch (error) {
      this.logger.error('Failed to push database schema', error);
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    const models = Reflect.ownKeys(this)
      .map((key) => String(key))
      .filter((k) => !k.startsWith('$') && !k.startsWith('_'));
    return Promise.all(
      models.map((modelKey) => {
        const model = (this as Record<string, any>)[modelKey];
        if (model && typeof model === 'object' && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
        return Promise.resolve();
      })
    );
  }
}
