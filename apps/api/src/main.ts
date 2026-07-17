import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // BigInt serialization fix for JSON responses
  const bigIntPrototype = BigInt.prototype as any;
  bigIntPrototype.toJSON = function () {
    return Number(this);
  };

  // Security
  app.use(helmet());

  const isProd = process.env.NODE_ENV === 'production';
  const corsOrigins = isProd
    ? [process.env.APP_URL || 'https://nyvora.com']
    : [
        process.env.APP_URL || 'http://localhost:3000',
        'http://localhost:3006',
        'http://localhost:3001',
      ];
  app.enableCors({ origin: corsOrigins, credentials: true });

  // Cookie Parser
  app.use(cookieParser());

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Rate Limiting
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Nexora API')
    .setDescription('Nexora Business Operating System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Port
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Nexora API running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
