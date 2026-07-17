# Nexora

**Business Operating System AI-First**

Nexora es una plataforma empresarial inteligente que integra CRM, ventas, inventario, finanzas, RRHH y más, potenciada por una IA asistente llamada Nova.

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **AI**: OpenAI Responses API (Nova Orchestrator)
- **Hosting**: Railway
- **Email**: Resend
- **Storage**: Cloudflare R2 (Phase 2)

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 16+

### Installation

```bash
# Clone the repository
git clone https://github.com/Nexora/Nexora.git
cd Nexora

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate:dev

# Seed the database
pnpm db:seed

# Start development servers
pnpm dev
```

### Development

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm dev --filter=@Nexora/web
pnpm dev --filter=@Nexora/api

# Build all
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Type check
pnpm typecheck
```

## Project Structure

```
Nexora/
├── apps/
│   ├── web/                    # Next.js 15 Frontend
│   ├── api/                    # NestJS API
│   └── docs/                   # VitePress Documentation
├── packages/
│   ├── ui/                     # Design System (shadcn/ui)
│   ├── shared/                 # Utilities, constants, helpers
│   ├── database/               # Prisma Client + Schema
│   ├── types/                  # TypeScript types
│   └── config/                 # Shared configs (ESLint, Prettier, etc.)
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Features

- [ ] Multi-tenant architecture
- [ ] RBAC + ABAC permissions
- [ ] AI Assistant (Nova)
- [ ] CRM module
- [ ] Sales module
- [ ] Inventory module
- [ ] Finance module
- [ ] HR module
- [ ] Automations (Nexora Flow)
- [ ] Marketplace

## Documentation

```bash
# Start docs development server
pnpm docs:dev

# Build docs
pnpm docs:build
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.Nexora.com](https://docs.Nexora.com)
- GitHub Issues: [github.com/Nexora/Nexora/issues](https://github.com/Nexora/Nexora/issues)
- Email: support@Nexora.com