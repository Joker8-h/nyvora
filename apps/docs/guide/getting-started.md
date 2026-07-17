# Inicio Rápido

## Prerrequisitos

- Node.js 20+
- pnpm 9+
- Docker Desktop
- Git

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/nyvora/nyvora.git
cd nyvora

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar infraestructura local
docker compose up -d

# Ejecutar migraciones
pnpm --filter @nyvora/database db:push

# Iniciar desarrollo
pnpm dev
```

## URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Web (Next.js) | http://localhost:3000 |
| API (NestJS) | http://localhost:4000 |
| API Docs | http://localhost:4000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Estructura del Proyecto

```
nyvora/
├── apps/
│   ├── web/          # Next.js 15 (Frontend)
│   ├── api/          # NestJS (Backend)
│   └── docs/         # VitePress (Documentación)
├── packages/
│   ├── database/     # Prisma Schema + Client
│   ├── types/        # Tipos compartidos
│   ├── shared/       # Utilidades, validadores, constantes
│   └── ui/           # Componentes shadcn/ui
├── docs/             # ADRs y documentación técnica
└── docker-compose.yml
```
