# 0029 — Infrastructure y Deployment

---

## 1. Descripción y Alcance

Infraestructura completa: Monorepo structure, CI/CD, Docker, Railway deployment, Monitoring, Logging, Backup strategy, y Environment management.

---

## 2. Arquitectura

```mermaid
flowchart TD
    subgraph "Frontend"
        A[Next.js Web] --> B[VitePress Docs]
    end
    
    subgraph "Backend"
        C[NestJS API] --> D[Prisma ORM]
    end
    
    subgraph "Infrastructure"
        E[Railway] --> F[PostgreSQL]
        E --> G[Redis]
        E --> H[S3/R2]
    end
    
    A --> C
    D --> F
    C --> G
    C --> H
```

---

## 3. Monorepo Structure

```
nyvora/
├── apps/
│   ├── api/              # NestJS backend
│   ├── web/              # Next.js frontend
│   └── docs/             # VitePress docs
├── packages/
│   ├── database/         # Prisma schema + client
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configs (tsconfig, eslint)
├── pnpm-workspace.yaml
├── turbo.json
└── docker-compose.yml
```

---

## 4. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm build
      - uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 5. Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
RUN corepack enable
RUN corepack prepare pnpm@9.15.4 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/nyvora
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: nyvora
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

---

## 6. Environment Management

```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/nyvora

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
REFRESH_TOKEN_SECRET=your-secret

# OpenAI
OPENAI_API_KEY=sk-...

# SendGrid
SENDGRID_API_KEY=SG...

# S3/R2
S3_BUCKET=nyvora-files
S3_REGION=auto
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_ENDPOINT=https://...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
APP_URL=https://app.nyvora.com
API_URL=https://api.nyvora.com
```

---

## 7. Monitoring

```typescript
// Health check endpoint
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: {
        database: await this.prisma.$queryRaw`SELECT 1`,
        redis: await this.redis.ping(),
        uptime: process.uptime()
      }
    };
  }
}
```

### Metrics
- Request count & latency (Prometheus)
- Error rate
- Active users
- API usage per organization
- Job queue depth

---

## 8. Logging

```typescript
// Structured logging
const logger = new Logger({
  service: 'api',
  timestamp: true,
  JSON: true
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: Date.now() - start,
      userId: req.user?.sub,
      requestId: req.id
    });
  });
  next();
});
```

---

## 9. Backup Strategy

| Component | Method | Frequency | Retention |
|-----------|--------|-----------|-----------|
| PostgreSQL | pg_dump | Daily | 30 days |
| PostgreSQL WAL | Continuous | Real-time | 7 days |
| S3/R2 | Versioning | Continuous | 90 days |
| Redis | RDB + AOF | Every hour | 24 hours |

---

## 10. Security Checklist

- [ ] HTTPS everywhere
- [ ] CSP headers
- [ ] Rate limiting
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Input validation (Zod)
- [ ] Secrets in env vars only
- [ ] Dependencies audited (npm audit)
- [ ] RBAC + ABAC enforced

---

## 11. Performance Targets

| Metric | Target |
|--------|--------|
| API response time (p95) | < 200ms |
| Page load time (LCP) | < 2.5s |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| Uptime | 99.9% |
| Error rate | < 0.1% |

---

## 12. Checklist

- [ ] Monorepo structure
- [ ] Turbo build pipeline
- [ ] Docker setup
- [ ] Railway deployment
- [ ] CI/CD pipeline
- [ ] Environment management
- [ ] Health checks
- [ ] Structured logging
- [ ] Monitoring & metrics
- [ ] Backup strategy
- [ ] Security hardening
- [ ] Performance optimization
