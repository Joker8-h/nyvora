import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasourceUrl: process.env.DATABASE_URL,
    });
  }

  async onModuleInit() {
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
