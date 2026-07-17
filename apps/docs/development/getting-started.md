# Primeros Pasos para Desarrolladores

## Requisitos Previos

- Node.js 20+
- pnpm 9+
- Docker Desktop
- Git
- VS Code (recomendado)

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

# Generar cliente Prisma
pnpm --filter @nyvora/database db:generate

# Iniciar desarrollo
pnpm dev
```

## URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Web (Next.js) | http://localhost:3000 |
| API (NestJS) | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Iniciar todos los servicios
pnpm dev:web                # Solo frontend
pnpm dev:api                # Solo backend

# Base de datos
pnpm --filter @nyvora/database db:push      # Aplicar schema
pnpm --filter @nyvora/database db:generate  # Generar cliente
pnpm --filter @nyvora/database db:migrate   # Crear migración
pnpm --filter @nyvora/database db:seed      # Sembrar datos
pnpm --filter @nyvora/database db:studio    # Abrir Prisma Studio

# Calidad de código
pnpm lint                   # Ejecutar ESLint
pnpm format                 # Formatear con Prettier
pnpm typecheck              # Verificar tipos

# Build
pnpm build                  # Build completo
pnpm build:web              # Solo frontend
pnpm build:api              # Solo backend
```

## Estructura de un Módulo

```
apps/api/src/modules/[module]/
├── [module].module.ts       # Definición del módulo
├── [module].service.ts      # Lógica de negocio
├── [module].controller.ts   # Endpoints REST
├── dto/                     # Data Transfer Objects
│   ├── create-[entity].dto.ts
│   ├── update-[entity].dto.ts
│   └── query-[entity].dto.ts
└── entities/                # Entidades (si aplica)
```

## Convenciones de Código

1. **Nombres**: camelCase para variables, PascalCase para clases
2. **Archivos**: kebab-case para archivos
3. **Imports**: Agrupados (externos, internos, relativas)
4. **DTOs**: Usar class-validator y class-transformer
5. **Excepciones**: Usar excepciones HTTP de NestJS

## Git Workflow

1. Crear branch desde `main`: `feat/nyvora-feature-name`
2. Hacer commits con convención: `feat: add customer CRUD`
3. Crear PR hacia `main`
4. Esperar review y CI passing
5. Merge con squash
