# ADR-002: Multi-tenant Hierarchy

## Status

Accepted

## Context

Nexora needs to support multiple organizations from solo freelancers to multinational corporations with thousands of branches. The multi-tenant hierarchy needs to:

- Support unlimited nesting depth
- Isolate data between tenants
- Allow flexible organization structures
- Support different currencies, timezones, and locales per branch
- Enable granular permissions at different levels

## Decision

We will implement a **6-level multi-tenant hierarchy**:

```
Tenant
└── Workspace
    └── Organization
        └── Branch
            └── Department
                └── User
```

### Level Definitions

| Level | Description | Use Case |
|-------|-------------|----------|
| **Tenant** | Top-level entity (company/account) | Represents the billing entity |
| **Workspace** | Collaboration space | Teams, projects, or divisions |
| **Organization** | Business unit | Companies, subsidiaries, departments |
| **Branch** | Physical location | Offices, stores, warehouses |
| **Department** | Functional unit | Sales, Marketing, HR, Finance |
| **User** | Individual person | Employees, contractors, partners |

### Example: Multinational Corporation

```
Tenant: Global Corp S.A.
└── Workspace: "Global Corp"
    ├── Organization: "Global Corp Colombia"
    │   ├── Branch: "Bogotá HQ" (HQ)
    │   │   ├── Department: "Sales"
    │   │   ├── Department: "Marketing"
    │   │   └── Department: "Engineering"
    │   └── Branch: "Medellín Office"
    │       ├── Department: "Sales"
    │       └── Department: "Support"
    ├── Organization: "Global Corp México"
    │   ├── Branch: "CDMX Office" (HQ)
    │   │   ├── Department: "Sales"
    │   │   └── Department: "Marketing"
    │   └── Branch: "Guadalajara Office"
    └── Organization: "Global Corp España"
        ├── Branch: "Madrid Office" (HQ)
        └── Branch: "Barcelona Office"
```

### Example: Small Business

```
Tenant: Barbería Express
└── Workspace: "Barbería Express"
    └── Organization: "Barbería Express S.A.S"
        └── Branch: "Sede Principal" (HQ)
            ├── Department: "Atención al Cliente"
            └── Department: "Administración"
```

### Example: Freelancer

```
Tenant: Juan Pérez
└── Workspace: "Juan Pérez Freelance"
    └── Organization: "Juan Pérez Consultoría"
        └── Branch: "Oficina Virtual" (HQ)
```

### Database Schema

```prisma
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  domains   String[]
  settings  Json     @default("{}")
  workspaces Workspace[]
}

model Workspace {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  name      String
  slug      String
  organizations Organization[]
  memberships Membership[]
  @@unique([tenantId, slug])
}

model Organization {
  id          String   @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  name        String
  slug        String
  type        OrgType  @default(COMPANY)
  parentId    String?
  parent      Organization? @relation("OrgHierarchy", fields: [parentId], references: [id])
  children    Organization[] @relation("OrgHierarchy")
  branches    Branch[]
  @@unique([workspaceId, slug])
}

model Branch {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  name           String
  code           String
  timezone       String   @default("America/Bogota")
  currency       String   @default("COP")
  isHeadquarter  Boolean  @default(false)
  departments    Department[]
  users          User[]
  @@unique([organizationId, code])
}

model Department {
  id        String   @id @default(cuid())
  branchId  String
  branch    Branch   @relation(fields: [branchId], references: [id])
  name      String
  code      String
  parentId  String?
  parent    Department? @relation("DeptHierarchy", fields: [parentId], references: [id])
  children  Department[] @relation("DeptHierarchy")
  users     User[]
  @@unique([branchId, code])
}
```

## Consequences

### Positive
- **Unlimited Nesting**: Organizations and Departments can be nested arbitrarily
- **Flexible Structure**: Supports any business structure
- **Granular Scoping**: Permissions can be scoped to any level
- **Multi-currency**: Each branch can have its own currency
- **Multi-timezone**: Each branch can have its own timezone
- **Easy Migration**: Users can be moved between branches/departments

### Negative
- **Query Complexity**: Hierarchical queries can be expensive
- **Data Duplication**: Some data (currency, timezone) is denormalized
- **Migration Complexity**: Moving data between levels requires careful planning
- **Permission Complexity**: Inheritance across levels adds complexity

### Mitigations
- **Materialized Path**: Use materialized path for efficient hierarchical queries
- **Caching**: Cache hierarchy paths and permissions
- **Database Indexes**: Composite indexes on foreign keys
- **Permission Inheritance**: Explicit rules for permission inheritance

## Alternatives Considered

### 1. Flat Multi-tenant (Tenant → User)
- **Pros**: Simplest possible structure
- **Cons**: No hierarchy, no branch support, limited for large organizations
- **Verdict**: Too simple for enterprise customers

### 2. 3-Level Hierarchy (Tenant → Organization → User)
- **Pros**: Simpler, covers most use cases
- **Cons**: No branch support, no department support
- **Verdict**: Doesn't meet multinational requirements

### 3. Graph-based Hierarchy
- **Pros**: Maximum flexibility, arbitrary relationships
- **Cons**: Complex queries, hard to reason about, performance issues
- **Verdict**: Over-engineered for our needs

## References

- [Multi-tenant SaaS Patterns](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/overview)
- [PostgreSQL Hierarchical Queries](https://www.postgresql.org/docs/current/ltree.html)
- [NestJS Guards](https://docs.nestjs.com/guards)