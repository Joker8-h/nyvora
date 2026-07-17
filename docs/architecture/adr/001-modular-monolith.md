# ADR-001: Modular Monolith Architecture

## Status

Accepted

## Context

Nexora is a Business Operating System that needs to support:
- Multiple business domains (CRM, Sales, Inventory, Finance, HR, etc.)
- Multi-tenant architecture
- AI-powered features (Nova)
- Event-driven communication
- Future scalability to microservices

We need to decide on the overall architecture that balances:
- Development velocity (MVP in weeks, not months)
- Code organization and maintainability
- Team scalability (from 1 to 10+ developers)
- Deployment simplicity
- Future extractability of services

## Decision

We will use a **Modular Monolith** architecture with the following characteristics:

1. **Single Deployable Unit**: One application (NestJS API) that contains all business modules
2. **Module Boundaries**: Each business domain is a separate NestJS module with clear boundaries
3. **Shared Kernel**: Common utilities, auth, and infrastructure are shared packages
4. **Database per Module**: Logical separation using Prisma schemas (physical separation later)
5. **Event Bus**: In-process event bus (EventEmitter2) for module communication
6. **Extractable**: Designed so modules can be extracted to microservices later

### Module Structure

```
apps/api/src/modules/
├── auth/           # Authentication & Authorization
├── users/          # User management
├── workspaces/     # Multi-tenant workspaces
├── organizations/  # Organization hierarchy
├── branches/       # Branch management
├── departments/    # Department management
├── roles/          # Role management
├── permissions/    # Permission management
├── ai/             # Nova AI Orchestrator
├── crm/            # Customer Relationship Management
├── sales/          # Sales & Invoicing
├── inventory/      # Inventory Management
├── finance/        # Financial Management
├── hr/             # Human Resources
└── health/         # Health checks
```

### Inter-Module Communication

```typescript
// Event-driven communication (not direct imports)
@EventPublisher('customer.created')
async onCustomerCreated(event: DomainEvent) {
  // Update analytics, send notifications, etc.
}
```

## Consequences

### Positive
- **Fast Development**: Single codebase, shared types, easy refactoring
- **Simple Deployment**: One container, one database connection pool
- **Shared Context**: All modules share the same type system and utilities
- **Easy Testing**: Integration tests across modules are straightforward
- **Team Friendly**: Clear module boundaries prevent merge conflicts

### Negative
- **Scaling Limitations**: Single process, shared resources
- **Database Bottleneck**: All modules share the same database server
- **Deployment Risk**: A bug in one module can affect all modules
- **Resource Contention**: Heavy computation in one module affects others

### Mitigations
- **Vertical Scaling**: Start with a larger instance, optimize later
- **Module Isolation**: Strict module boundaries enforced by NestJS
- **Feature Flags**: Disable problematic modules without full rollback
- **Event Bus**: Async communication reduces coupling
- **Future Extraction**: Module structure allows easy extraction to services

## Alternatives Considered

### 1. Full Microservices
- **Pros**: Independent scaling, deployment, technology diversity
- **Cons**: Complex infrastructure, distributed debugging, team overhead
- **Verdict**: Too complex for MVP stage, revisit at 100+ customers

### 2. Serverless (AWS Lambda)
- **Pros**: Auto-scaling, pay-per-use, no server management
- **Cons**: Cold starts, vendor lock-in, complex debugging
- **Verdict**: Not suitable for real-time features and complex state

### 3. Simple Monolith
- **Pros**: Simplest possible architecture
- **Cons**: Hard to extract services later, poor module boundaries
- **Verdict**: We need module boundaries from day one

## Migration Path

When Nexora reaches 1000+ customers or 50+ developers:

1. **Phase 1**: Extract AI service (highest resource needs)
2. **Phase 2**: Extract Billing service (regulatory isolation)
3. **Phase 3**: Extract Analytics service (read-heavy workload)
4. **Phase 4**: Extract remaining services as needed

Each extraction follows the Strangler Fig pattern:
1. Create new service
2. Sync data from monolith
3. Route traffic to new service
4. Remove module from monolith

## References

- [Modular Monolith Patterns](https://wwwถน-patterns.com/monolith/modular.html)
- [NestJS Modules](https://docs.nestjs.com/modules)
- [Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)