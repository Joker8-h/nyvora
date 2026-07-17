# ADR-003: RBAC + ABAC Authorization

## Status

Accepted

## Context

Nexora needs a flexible authorization system that supports:
- Role-based access control (RBAC) for simple permissions
- Attribute-based access control (ABAC) for complex conditions
- Multi-tenant scoping
- Fine-grained permissions across all resources

## Decision

We will implement a **hybrid RBAC + ABAC authorization system**:

### RBAC (Role-Based Access Control)

Roles define what actions a user can perform:

```typescript
// System roles
const SYSTEM_ROLES = {
  OWNER: 'owner',      // Full access
  ADMIN: 'admin',      // Administrative access
  MEMBER: 'member',    // Standard access
  VIEWER: 'viewer',    // Read-only access
};

// Permission format: resource:action:scope
const permissions = [
  'crm:customers:create',
  'crm:customers:read',
  'crm:customers:update',
  'crm:customers:delete',
  'finance:invoices:approve',
];
```

### ABAC (Attribute-Based Access Control)

Conditions add context-aware rules:

```typescript
// ABAC condition example
const permission = {
  name: 'finance:invoices:approve',
  resource: 'invoices',
  action: 'approve',
  scope: 'BRANCH',
  conditions: {
    amount: { lt: 5000000 },  // Can only approve invoices < 5M COP
    branchId: { eq: 'user.branchId' },  // Only in user's branch
  },
};
```

### Permission Scopes

| Scope | Description | Use Case |
|-------|-------------|----------|
| **OWN** | Only own records | User can edit their own profile |
| **DEPARTMENT** | Department-wide | Manager sees all department data |
| **BRANCH** | Branch-wide | Branch manager sees all branch data |
| **ORGANIZATION** | Organization-wide | Org admin sees all org data |
| **WORKSPACE** | Workspace-wide | Workspace admin sees all workspace data |
| **GLOBAL** | Cross-workspace | Super admin access |

### Evaluation Logic

```typescript
async function checkPermission(
  userId: string,
  resource: string,
  action: string,
  context?: Record<string, any>
): Promise<boolean> {
  // 1. Get user's roles and direct permissions
  const roles = await getUserRoles(userId);
  const directPermissions = await getUserPermissions(userId);

  // 2. Collect all applicable permissions
  const allPermissions = [...directPermissions];
  for (const role of roles) {
    allPermissions.push(...role.permissions);
  }

  // 3. Find matching permission
  const matchingPermission = allPermissions.find(
    p => p.resource === resource && p.action === action
  );

  if (!matchingPermission) return false;

  // 4. Check scope
  const hasScope = await checkScope(userId, matchingPermission.scope, context);
  if (!hasScope) return false;

  // 5. Check ABAC conditions
  if (matchingPermission.conditions) {
    const conditionsMet = evaluateConditions(matchingPermission.conditions, context);
    if (!conditionsMet) return false;
  }

  return true;
}
```

## Consequences

### Positive
- **Flexible**: Supports simple RBAC and complex ABAC
- **Granular**: Permissions at field level possible
- **Auditable**: Clear permission decisions
- **Extensible**: Easy to add new resources and actions
- **Multi-tenant**: Scoping works across tenant hierarchy

### Negative
- **Complexity**: More complex than pure RBAC
- **Performance**: Condition evaluation adds overhead
- **Debugging**: Permission decisions can be hard to trace
- **Maintenance**: Many permissions to manage

### Mitigations
- **Permission Caching**: Cache effective permissions per user
- **Decision Logging**: Log all permission decisions for debugging
- **Admin UI**: Visual permission management interface
- **Bulk Operations**: Allow bulk permission assignments

## Alternatives Considered

### 1. Pure RBAC
- **Pros**: Simpler, easier to understand
- **Cons**: Can't handle complex conditions
- **Verdict**: Too limiting for enterprise use cases

### 2. Pure ABAC
- **Pros**: Maximum flexibility
- **Cons**: Very complex, hard to manage
- **Verdict**: Over-engineered for most use cases

### 3. OPA (Open Policy Agent)
- **Pros**: Industry standard, powerful policy language
- **Cons**: Additional infrastructure, learning curve
- **Verdict**: Consider for future when complexity warrants it

## References

- [RBAC vs ABAC](https://www.keycloak.org/authorization-services)
- [Casbin](https://casbin.org/)
- [AWS Cedar](https://www.cedarpolicy.com/)