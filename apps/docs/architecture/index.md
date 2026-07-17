# Arquitectura de Nexora

## Visión General

Nexora utiliza una arquitectura de **Monolito Modular** que permite:

- Desarrollo independiente de módulos
- Comunicación vía eventos (EventBus)
- Extracción futura a microservicios si es necesario

## Principios de Diseño

### 1. Modularidad
Cada módulo es independiente y expone una API clara:
- CRM
- Sales
- Inventory
- Finance
- HR
- Automations (Nexora Flow)
- Marketplace (Nexora Marketplace)

### 2. Event-Driven
Los módulos se comunican mediante eventos:
```typescript
// Publicar evento
eventBus.publish(new InvoiceCreated(invoice));

// Suscribirse
eventBus.subscribe('InvoiceCreated', async (event) => {
  await updateInventory(event.items);
});
```

### 3. Multi-Tenant
Jerarquía completa de aislamiento:
```
Tenant → Workspace → Organization → Branch → Department → User
```

### 4. Seguridad
- RBAC + ABAC para control de acceso
- JWT RS256 con refresh tokens
- Auditoría completa vía AuditLog

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 15, React, Tailwind CSS, shadcn/ui |
| Backend | NestJS, Prisma, PostgreSQL |
| IA | OpenAI Responses API, Tool Calling |
| Infra | Railway, Docker, GitHub Actions |
| Docs | VitePress, Markdown, Mermaid |

## Diagrama de Arquitectura

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js 15)"]
        Web[Web App]
        UI[UI Components]
    end
    
    subgraph Backend["Backend (NestJS)"]
        API[API Gateway]
        Auth[Auth Module]
        AI[AI Module - Nova]
        CRM[CRM Module]
        Sales[Sales Module]
        Inventory[Inventory Module]
        Finance[Finance Module]
        HR[HR Module]
    end
    
    subgraph Database["Database"]
        Prisma[Prisma ORM]
        PG[(PostgreSQL)]
    end
    
    subgraph External["External Services"]
        OpenAI[OpenAI API]
        Email[Resend]
        Storage[Cloudflare R2]
    end
    
    Web --> API
    API --> Auth
    API --> AI
    API --> CRM
    API --> Sales
    API --> Inventory
    API --> Finance
    API --> HR
    
    Auth --> Prisma
    CRM --> Prisma
    Sales --> Prisma
    Inventory --> Prisma
    Finance --> Prisma
    HR --> Prisma
    
    Prisma --> PG
    
    AI --> OpenAI
    Auth --> Email
```

## Decisiones de Arquitectura

Ver [ADR](./adr/) para decisiones detalladas.
