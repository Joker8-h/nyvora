# Getting Started

Welcome to Nexora development! This guide will help you set up your development environment.

## Prerequisites

- **Node.js**: 20.0.0 or higher
- **pnpm**: 8.0.0 or higher
- **PostgreSQL**: 16.0 or higher
- **Git**: Latest version

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nexora/Nexora.git
cd Nexora
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://Nexora:Nexora_dev@localhost:5432/Nexora"

# Auth
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# App
APP_URL="http://localhost:3000"
API_URL="http://localhost:3001"
```

### 4. Set up the database

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate:dev

# Seed the database
pnpm db:seed
```

### 5. Start development servers

```bash
# Start all apps
pnpm dev

# Or start individually
pnpm dev --filter=@Nexora/web
pnpm dev --filter=@Nexora/api
```

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm dev --filter=@Nexora/web    # Start only web app
pnpm dev --filter=@Nexora/api    # Start only API

# Building
pnpm build                  # Build all packages and apps
pnpm build --filter=@Nexora/web  # Build only web app

# Testing
pnpm test                   # Run all tests
pnpm test --filter=@Nexora/api   # Run API tests only

# Linting
pnpm lint                   # Lint all packages
pnpm format                 # Format code with Prettier
pnpm format:check           # Check formatting

# Type checking
pnpm typecheck              # Type check all packages

# Database
pnpm db:generate            # Generate Prisma Client
pnpm db:migrate:dev         # Run migrations in development
pnpm db:migrate:deploy      # Run migrations in production
pnpm db:studio              # Open Prisma Studio
pnpm db:seed                # Seed the database
```

### Project Structure

```
Nexora/
├── apps/
│   ├── web/                    # Next.js 15 Frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # React components
│   │   │   └── lib/            # Utilities
│   │   └── package.json
│   ├── api/                    # NestJS API
│   │   ├── src/
│   │   │   ├── modules/        # Business modules
│   │   │   │   ├── auth/       # Authentication
│   │   │   │   ├── users/      # User management
│   │   │   │   ├── ai/         # Nova AI
│   │   │   │   └── ...
│   │   │   └── main.ts         # Entry point
│   │   └── package.json
│   └── docs/                   # VitePress Documentation
├── packages/
│   ├── ui/                     # Design System
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── hooks/          # React hooks
│   │   │   └── lib/            # Utilities
│   │   └── package.json
│   ├── shared/                 # Shared utilities
│   │   ├── src/
│   │   │   ├── lib/            # Utils, validators, events
│   │   │   └── index.ts
│   │   └── package.json
│   ├── database/               # Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Seed script
│   │   └── package.json
│   ├── types/                  # TypeScript types
│   │   └── package.json
│   └── config/                 # Shared configs
│       ├── eslint/             # ESLint configs
│       ├── prettier/           # Prettier config
│       ├── tailwind/           # Tailwind config
│       └── typescript/         # TypeScript configs
├── docker-compose.yml          # Docker setup
├── turbo.json                  # Turborepo config
└── package.json                # Root package.json
```

### Coding Standards

#### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Use `const` by default, `let` when necessary
- Avoid `any` - use `unknown` and type assertions

#### React

- Use functional components with hooks
- Use TypeScript for all components
- Prefer composition over prop drilling
- Use React Query for server state

#### NestJS

- Use decorators for metadata
- Keep modules focused on single responsibility
- Use DTOs for request/response validation
- Use Guards for authentication/authorization

#### Git

- Use Conventional Commits
- Branch naming: `feat/`, `fix/`, `docs/`, `chore/`
- PR titles must follow Conventional Commits
- Require at least 1 review before merge

## IDE Setup

### VS Code

Install these extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript Vue Plugin (VitePress)

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Debugging

### API

```bash
# Start with debugging
pnpm dev --filter=@Nexora/api

# VS Code: Use launch.json configuration
```

### Web

```bash
# Start with debugging
pnpm dev --filter=@Nexora/web

# VS Code: Use launch.json configuration
```

### Database

```bash
# Open Prisma Studio
pnpm db:studio
```

## Common Issues

### Database Connection

```bash
# Check if PostgreSQL is running
pg_isready

# Reset database
pnpm db:migrate:reset
```

### Type Errors

```bash
# Regenerate Prisma Client
pnpm db:generate

# Clear Turbo cache
rm -rf .turbo
pnpm build
```

### Port Conflicts

```bash
# Check what's using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Next Steps

1. Read the [Architecture Overview](../architecture/README.md)
2. Explore the [API Documentation](../api/README.md)
3. Check out the [Component Library](../ui/README.md)
4. Review the [Contributing Guidelines](../../CONTRIBUTING.md)