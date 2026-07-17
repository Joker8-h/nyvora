# 0015 — Matriz de Permisos (RBAC + ABAC)

---

## 1. Descripción y Alcance

Definición completa del sistema de permisos: RBAC (Role-Based Access Control) con 5 roles predefinidos, ABAC (Attribute-Based) para reglas dinámicas, y permisos por módulo con acciones CRUD.

---

## 2. Roles Predefinidos

| Role | Descripción | Nivel |
|------|-------------|-------|
| `owner` | Dueño absoluto de la organización | 100 |
| `admin` | Administrador con acceso casi total | 80 |
| `manager` | Gerente con acceso a operaciones | 60 |
| `employee` | Empleado con acceso limitado | 40 |
| `viewer` | Solo lectura | 20 |

---

## 3. Matriz de Permisos por Módulo

### 3.1 Auth & Organization

| Recurso | Acción | owner | admin | manager | employee | viewer |
|---------|--------|-------|-------|---------|----------|--------|
| `auth` | login | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth` | register | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth` | verify_email | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth` | forgot_password | ✅ | ✅ | ✅ | ✅ | ✅ |
| `auth` | reset_password | ✅ | ✅ | ✅ | ✅ | ✅ |
| `organization` | create | ✅ | ✅ | ✅ | ✅ | ✅ |
| `organization` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `organization` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `organization` | delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| `organization` | transfer_ownership | ✅ | ❌ | ❌ | ❌ | ❌ |
| `branch` | create | ✅ | ✅ | ❌ | ❌ | ❌ |
| `branch` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `branch` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `branch` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `member` | invite | ✅ | ✅ | ❌ | ❌ | ❌ |
| `member` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `member` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `member` | remove | ✅ | ✅ | ❌ | ❌ | ❌ |

### 3.2 CRM

| Recurso | Acción | owner | admin | manager | employee | viewer |
|---------|--------|-------|-------|---------|----------|--------|
| `crm.lead` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `crm.lead` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `crm.lead` | update | ✅ | ✅ | ✅ | ✅ | ❌ |
| `crm.lead` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `crm.contact` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `crm.contact` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `crm.contact` | update | ✅ | ✅ | ✅ | ✅ | ❌ |
| `crm.contact` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `crm.company` | create | ✅ | ✅ | ✅ | ❌ | ❌ |
| `crm.company` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `crm.company` | update | ✅ | ✅ | ✅ | ❌ | ❌ |
| `crm.company` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `crm.pipeline` | create | ✅ | ✅ | ❌ | ❌ | ❌ |
| `crm.pipeline` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `crm.pipeline` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `crm.activity` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `crm.activity` | read | ✅ | ✅ | ✅ | ✅ | ✅ |

### 3.3 Sales

| Recurso | Acción | owner | admin | manager | employee | viewer |
|---------|--------|-------|-------|---------|----------|--------|
| `sales.quotation` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `sales.quotation` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sales.quotation` | update | ✅ | ✅ | ✅ | ✅ | ❌ |
| `sales.quotation` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `sales.quotation` | approve | ✅ | ✅ | ✅ | ❌ | ❌ |
| `sales.order` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `sales.order` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sales.order` | update | ✅ | ✅ | ✅ | ✅ | ❌ |
| `sales.order` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `sales.invoice` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `sales.invoice` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sales.invoice` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `sales.invoice` | void | ✅ | ✅ | ❌ | ❌ | ❌ |
| `sales.invoice` | send | ✅ | ✅ | ✅ | ❌ | ❌ |
| `sales.payment` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `sales.payment` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `sales.payment` | refund | ✅ | ✅ | ❌ | ❌ | ❌ |

### 3.4 Inventory

| Recurso | Acción | owner | admin | manager | employee | viewer |
|---------|--------|-------|-------|---------|----------|--------|
| `inventory.product` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `inventory.product` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `inventory.product` | update | ✅ | ✅ | ✅ | ✅ | ❌ |
| `inventory.product` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `inventory.stock` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `inventory.stock` | update | ✅ | ✅ | ✅ | ✅ | ❌ |
| `inventory.stock` | transfer | ✅ | ✅ | ✅ | ❌ | ❌ |
| `inventory.warehouse` | create | ✅ | ✅ | ❌ | ❌ | ❌ |
| `inventory.warehouse` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `inventory.warehouse` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `inventory.warehouse` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `inventory.category` | create | ✅ | ✅ | ✅ | ❌ | ❌ |
| `inventory.category` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `inventory.category` | update | ✅ | ✅ | ✅ | ❌ | ❌ |
| `inventory.category` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |

### 3.5 Finance

| Recurso | Acción | owner | admin | manager | employee | viewer |
|---------|--------|-------|-------|---------|----------|--------|
| `finance.account` | create | ✅ | ✅ | ❌ | ❌ | ❌ |
| `finance.account` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `finance.account` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `finance.transaction` | create | ✅ | ✅ | ✅ | ✅ | ❌ |
| `finance.transaction` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `finance.transaction` | update | ✅ | ✅ | ❌ | ❌ | ❌ |
| `finance.transaction` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `finance.category` | create | ✅ | ✅ | ✅ | ❌ | ❌ |
| `finance.category` | read | ✅ | ✅ | ✅ | ✅ | ✅ |

### 3.6 Dashboard & Analytics

| Recurso | Acción | owner | admin | manager | employee | viewer |
|---------|--------|-------|-------|---------|----------|--------|
| `dashboard` | read | ✅ | ✅ | ✅ | ✅ | ✅ |
| `dashboard.widget` | configure | ✅ | ✅ | ❌ | ❌ | ❌ |
| `analytics` | read | ✅ | ✅ | ✅ | ❌ | ✅ |
| `analytics.export` | create | ✅ | ✅ | ❌ | ❌ | ❌ |

### 3.7 Admin

| Recurso | Acción | owner | admin | manager | employee | viewer |
|---------|--------|-------|-------|---------|----------|--------|
| `admin.audit` | read | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin.audit` | export | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin.nova` | configure | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin.api_keys` | create | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin.api_keys` | read | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin.api_keys` | delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin.notifications` | configure | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 4. Backend

### 4.1 Guard de Permisos

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler()
    );
    
    if (!requiredPermission) return true; // Sin restricción
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Verificar permiso del rol
    const hasPermission = PermissionMatrix.check(
      user.role,
      requiredPermission
    );
    
    // ABAC: verificar reglas adicionales
    if (hasPermission && user.branchId) {
      return this.checkBranchAccess(user, requiredPermission);
    }
    
    return hasPermission;
  }
  
  private checkBranchAccess(user: any, permission: string): boolean {
    // ABAC: empleados solo ven su branch
    if (user.role === 'employee') {
      return user.branchId === permission.branchId;
    }
    return true;
  }
}
```

### 4.2 PermissionMatrix

```typescript
class PermissionMatrix {
  private static matrix: Record<string, Record<string, string[]>> = {
    owner: { '*': ['*'] },
    admin: {
      'organization': ['create', 'read', 'update'],
      'branch': ['create', 'read', 'update', 'delete'],
      'member': ['invite', 'read', 'update', 'remove'],
      'crm.lead': ['create', 'read', 'update', 'delete'],
      // ... todos los permisos de admin
    },
    manager: {
      'crm.lead': ['create', 'read', 'update'],
      'sales.quotation': ['create', 'read', 'update', 'approve'],
      // ... permisos de manager
    },
    employee: {
      'crm.lead': ['create', 'read', 'update'],
      'sales.invoice': ['create', 'read'],
      // ... permisos de employee
    },
    viewer: {
      '*': ['read'] // Solo lectura en todo
    }
  };
  
  static check(role: string, permission: string): boolean {
    const [resource, action] = permission.split('.');
    const rolePermissions = this.matrix[role];
    
    if (!rolePermissions) return false;
    if (rolePermissions['*']?.includes('*')) return true;
    if (rolePermissions['*']?.includes(action)) return true;
    if (rolePermissions[resource]?.includes(action)) return true;
    if (rolePermissions[resource]?.includes('*')) return true;
    
    return false;
  }
}
```

### 4.3 Decorator

```typescript
@SetMetadata('permission', 'crm.lead.create')
@Injectable()
export class CreateLeadController {
  // ...
}
```

---

## 5. Frontend

### 5.1 PermissionProvider

```typescript
const PermissionContext = createContext<PermissionContextType>({
  hasPermission: () => false,
  hasAnyPermission: () => false
});

export function PermissionProvider({ children }) {
  const { user } = useAuth();
  
  const hasPermission = (permission: string) => {
    return PermissionMatrix.check(user.role, permission);
  };
  
  return (
    <PermissionContext.Provider value={{ hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
}
```

### 5.2 usePermission Hook

```typescript
function usePermission(permission: string): boolean {
  const { hasPermission } = useContext(PermissionContext);
  return hasPermission(permission);
}

// Uso en componentes
function CreateLeadButton() {
  const canCreate = usePermission('crm.lead.create');
  
  if (!canCreate) return null;
  
  return <Button>Crear Lead</Button>;
}
```

### 5.3 withPermission HOC

```typescript
function withPermission(WrappedComponent, permission) {
  return function WithPermission(props) {
    const canAccess = usePermission(permission);
    
    if (!canAccess) {
      return <AccessDenied />;
    }
    
    return <WrappedComponent {...props} />;
  };
}
```

---

## 6. ABAC Rules

### 6.1 Reglas por Branch

```typescript
// Empleados solo ven datos de su branch
if (user.role === 'employee') {
  query.where.branchId = user.branchId;
}

// Managers ven datos de sus branches asignados
if (user.role === 'manager') {
  query.where.branchId = { in: user.assignedBranchIds };
}

// Admin y Owner ven todo
```

### 6.2 Reglas por Ownership

```typescript
// Employees solo pueden editar sus propios registros
if (user.role === 'employee') {
  query.where.createdBy = user.id;
}
```

---

## 7. Base de Datos

```sql
-- Ya existe en spec 0006: roles, permissions, role_permissions
-- Agregar: user_permissions (para permisos custom por usuario)
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  permission VARCHAR(100) NOT NULL,
  granted BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id, permission)
);
```

---

## 8. Eventos

```
PermissionUpdated { userId, organizationId, permission, granted }
RoleChanged { userId, organizationId, oldRole, newRole }
```

---

## 9. Permisos

La gestión de permisos requiere:
- `admin.member.update` para cambiar roles
- `admin.permissions.update` para permisos custom (Owner/Admin)

---

## 10. Validaciones

### Role Change
- No se puede asignar rol superior al propio
- No se puede degradar a Owner
- Owner solo puede ser transferido (no cambiado)

### Permission Grant
- Solo Owner/Admin pueden grantar permisos custom
- No se puede grantar permiso superior al propio

---

## 11. Nova Tools

| Tool | Descripción | Risk Flag | Permiso |
|------|-------------|-----------|---------|
| `check_permission` | Verificar permiso | - | público |
| `list_permissions` | Listar permisos de usuario | - | `admin.member.read` |

---

## 12. Notificaciones

```
RoleChanged → in-app al usuario afectado
PermissionUpdated → in-app al usuario afectado
```

---

## 13. Auditoría

Cambios de rol y permisos se auditan siempre.

---

## 14. Criterios de Aceptación

### US-PERM-01: RBAC básico
```
Given un usuario con rol 'manager'
When intenta acceder a 'admin.audit.read'
Then recibe error 403
```

### US-PERM-02: Owner bypass
```
Given un usuario con rol 'owner'
When accede a cualquier recurso
Then tiene acceso total
```

### US-PERM-03: ABAC branch
```
Given un empleado con branch_id = 'A'
When consulta leads
Then solo ve leads de branch A
```

---

## 15. Dependencias

| Módulo | Relación |
|--------|----------|
| Auth (004) | JWT payload incluye role, org, branch |
| Core (006) | Roles y permisos base |
| Todos | Usan PermissionsGuard |

---

## 16. Checklist

- [ ] PermissionMatrix implementada
- [ ] PermissionsGuard NestJS
- [ ] @Permission decorator
- [ ] PermissionProvider React
- [ ] usePermission hook
- [ ] withPermission HOC
- [ ] ABAC rules por branch
- [ ] ABAC rules por ownership
- [ ] user_permissions table
- [ ] Role change validation
- [ ] Audit logging
- [ ] Responsive mobile
