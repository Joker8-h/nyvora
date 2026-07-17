# 0005 — Onboarding

---

## 1. Descripción y Alcance

Wizard de onboarding que guía al usuario desde la creación de su workspace hasta llegar al dashboard con todo configurado. El objetivo es que el usuario llegue a su primer valor (first value) en menos de 15 minutos.

### Objetivos
- **First Value < 15 min**: Desde registro hasta primera acción de negocio
- **3-4 pantallas máximo**: No saturar al usuario
- **Progressive disclosure**: Configurar lo esencial, el resto después
- **Skip option**: Usuario avanzado puede saltar pasos

---

## 2. Diagrama de Flujo

```mermaid
flowchart TD
    A[Post-verificación de email] --> B[Paso 1: Workspace]
    B --> C[Paso 2: Organización]
    C --> D[Paso 3: Configuración Nova]
    D --> E[Paso 4: Invitar equipo - opcional]
    E --> F[Dashboard con welcome tooltip]
    
    B -->|Skip| C
    C -->|Skip| D
    D -->|Skip| F
    E -->|Skip| F
    
    F --> G[Primer CTA: "Crear tu primer lead"]
    G --> H[Lead creado exitosamente]
    H --> I[CTA: "Convertir a cliente"]
    I --> J[CTA: "Crear cotización"]
```

---

## 3. Pantallas

### 3.1 Paso 1: Crear Workspace

**Qué ve el usuario**:
- Progress bar: 25%
- Título: "Bienvenido a Nexora"
- Subtítulo: "Primero, creemos tu espacio de trabajo"
- Campo: Nombre del workspace
- Hint: "Usa el nombre de tu empresa o equipo"
- Botón: "Siguiente"
- Link: "Omitir por ahora"

**Wireframe**:
```
┌─────────────────────────────────────┐
│  [████░░░░░░] 25%                   │
│                                     │
│  Bienvenido a Nexora                │
│  ─────────────────                  │
│                                     │
│  Primero, creemos tu espacio        │
│  de trabajo                         │
│                                     │
│  Nombre del espacio de trabajo      │
│  ┌───────────────────────────────┐  │
│  │ Mi Empresa                    │  │
│  └───────────────────────────────┘  │
│  Usa el nombre de tu empresa o      │
│  equipo                             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │         Siguiente →           │  │
│  └───────────────────────────────┘  │
│                                     │
│  Omitir por ahora                   │
└─────────────────────────────────────┘
```

**Backend**: 
(Ver PASO 4.1 en `0002-user-flow-complete.md`)

**Validaciones**:
- `name`: obligatorio, 2-100 chars, alfanumérico + espacios + guiones

---

### 3.2 Paso 2: Crear Organización

**Qué ve el usuario**:
- Progress bar: 50%
- Título: "Cuéntanos sobre tu empresa"
- Subtítulo: "Esto personaliza tu experiencia"
- Campos:
  - Nombre de la organización (obligatorio)
  - Industria (select obligatorio)
  - País (select obligatorio)
  - Moneda (select, default por país)
  - Zona horaria (select, default por país)
  - Cantidad de empleados (select)
  - Logo (upload, opcional)
- Botón: "Siguiente"
- Link: "Omitir por ahora"

**Industrias disponibles**:
```typescript
const industries = [
  { value: 'COMMERCE', label: 'Comercio / Retail' },
  { value: 'SERVICES', label: 'Servicios Profesionales' },
  { value: 'MANUFACTURING', label: 'Manufactura / Producción' },
  { value: 'HEALTHCARE', label: 'Salud' },
  { value: 'EDUCATION', label: 'Educación' },
  { value: 'HOSPITALITY', label: 'Hotelería / Restauración' },
  { value: 'CONSTRUCTION', label: 'Construcción' },
  { value: 'TECHNOLOGY', label: 'Tecnología' },
  { value: 'LOGISTICS', label: 'Logística / Transporte' },
  { value: 'AGRICULTURE', label: 'Agricultura / Ganadería' },
  { value: 'GOVERNMENT', label: 'Gobierno / Sector Público' },
  { value: 'NGO', label: 'ONG / Sin fines de lucro' },
  { value: 'OTHER', label: 'Otra' }
];
```

**Países y defaults**:
```typescript
const countryDefaults = {
  CO: { currency: 'COP', timezone: 'America/Bogota', name: 'Colombia' },
  MX: { currency: 'MXN', timezone: 'America/Mexico_City', name: 'México' },
  AR: { currency: 'ARS', timezone: 'America/Argentina/Buenos_Aires', name: 'Argentina' },
  CL: { currency: 'CLP', timezone: 'America/Santiago', name: 'Chile' },
  PE: { currency: 'PEN', timezone: 'America/Lima', name: 'Perú' },
  ES: { currency: 'EUR', timezone: 'Europe/Madrid', name: 'España' },
  US: { currency: 'USD', timezone: 'America/New_York', name: 'Estados Unidos' },
};
```

**Backend**:
(Ver PASO 4.2 en `0002-user-flow-complete.md`)

---

### 3.3 Paso 3: Configurar Nova

**Qué ve el usuario**:
- Progress bar: 75%
- Avatar de Nova (imagen amigable)
- Título: "Conoce a Nova"
- Subtítulo: "Tu asistente de IA que ejecuta acciones reales"
- Features de Nova:
  - "Pregúntale sobre tus ventas"
  - "Crea facturas por voz o texto"
  - "Controla tu inventario"
  - "Recibe alertas inteligentes"
- Toggle: "Habilitar Nova" (default: true)
- Select: "Nivel de asistencia"
  - Básico: Solo lectura y consultas
  - Intermedio: Lectura + escritura con confirmación
  - Avanzado: Lectura + escritura + automatizaciones
- Botón: "Continuar"
- Link: "Omitir por ahora"

**Backend**:
```typescript
// Save Nova config in organization settings
await this.settingsService.update(organizationId, {
  nova: {
    enabled: dto.enabled,
    assistanceLevel: dto.assistanceLevel, // 'basic' | 'intermediate' | 'advanced'
    enabledTools: dto.assistanceLevel === 'basic' 
      ? ['find_customer', 'find_product', 'get_sales_summary', 'get_inventory_report']
      : dto.assistanceLevel === 'intermediate'
      ? ['find_customer', 'find_product', 'get_sales_summary', 'get_inventory_report',
         'create_client', 'create_invoice', 'register_payment', 'create_task']
      : 'all' // All tools enabled
  }
});
```

---

### 3.4 Paso 4: Invitar Equipo (Opcional)

**Qué ve el usuario**:
- Progress bar: 100%
- Título: "Invita a tu equipo"
- Subtítulo: "Trabaja en equipo desde el primer día"
- Lista de invitaciones:
  - Campo: Email
  - Select: Rol
  - Botón: "+ Agregar"
- Lista de invitados agregados
- Botón: "Finalizar"
- Link: "Omitir, lo haré después"

**Backend**:
```typescript
// For each invitation
for (const invitation of dto.invitations) {
  await this.inviteUserUseCase.execute({
    email: invitation.email,
    roleId: invitation.roleId,
    organizationId: organizationId,
    invitedBy: userId
  });
}
```

---

### 3.5 Dashboard con Welcome Tooltip

**Qué ve el usuario**:
- Dashboard con datos de ejemplo
- Welcome tooltip:
  - "¡Bienvenido a Nexora!"
  - "Este es tu centro de control"
  - "Pregúntale a Nova: '¿Cómo van mis ventas?'"
- Quick actions:
  - "Crear tu primer lead"
  - "Agregar un producto"
  - "Hacer una cotización"

**Backend**:
```typescript
// Mark onboarding as completed
await this.membershipService.updateOnboardingStatus(userId, organizationId, {
  onboardingCompleted: true,
  onboardingCompletedAt: new Date()
});
```

---

## 4. Backend

### 4.1 Use Cases

#### CreateWorkspaceUseCase
```typescript
class CreateWorkspaceUseCase {
  async execute(dto: CreateWorkspaceDto, userId: string): Promise<Workspace> {
    // 1. Validar nombre
    const slug = this.slugService.generate(dto.name);
    
    // 2. Crear workspace
    const workspace = await this.workspaceRepository.create({
      name: dto.name,
      slug,
      ownerId: userId
    });
    
    // 3. Asignar usuario como OWNER
    await this.membershipRepository.create({
      userId,
      workspaceId: workspace.id,
      role: 'OWNER'
    });
    
    // 4. Audit log
    await this.auditService.log({
      action: 'create',
      module: 'core',
      entity: 'workspace',
      entityId: workspace.id,
      actorType: 'human',
      afterState: { name: dto.name, slug }
    });
    
    // 5. Event
    this.eventBus.emit('WorkspaceCreated', {
      workspaceId: workspace.id,
      name: dto.name,
      ownerId: userId
    });
    
    return workspace;
  }
}
```

#### CreateOrganizationUseCase
```typescript
class CreateOrganizationUseCase {
  async execute(dto: CreateOrganizationDto, userId: string): Promise<OrganizationResult> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear organización
      const org = await tx.organization.create({
        data: {
          workspaceId: dto.workspaceId,
          name: dto.name,
          industry: dto.industry,
          countryCode: dto.countryCode,
          defaultCurrency: dto.defaultCurrency,
          timezone: dto.timezone,
          employeeRange: dto.employeeRange
        }
      });
      
      // 2. Crear branch principal
      const branch = await tx.branch.create({
        data: {
          organizationId: org.id,
          name: 'Sede Principal',
          isHeadquarter: true,
          isActive: true,
          timezone: dto.timezone,
          currency: dto.defaultCurrency
        }
      });
      
      // 3. Crear roles predefinidos
      const roles = await this.roleService.createDefaultRoles(tx, org.id);
      
      // 4. Asignar OWNER al usuario
      const ownerRole = roles.find(r => r.name === 'Owner');
      await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId,
          roleId: ownerRole.id,
          status: 'active',
          joinedAt: new Date()
        }
      });
      
      // 5. Crear configuración de facturación por defecto
      await tx.invoiceNumberSequence.create({
        data: {
          organizationId: org.id,
          prefix: 'FAC',
          length: 5,
          currentNumber: 0,
          resetAnnually: true
        }
      });
      
      // 6. Crear pipeline stages por defecto (CRM)
      await this.crmService.createDefaultPipeline(tx, org.id);
      
      // 7. Audit log
      await this.auditService.log({
        action: 'create',
        module: 'core',
        entity: 'organization',
        entityId: org.id,
        actorType: 'human',
        afterState: { name: dto.name, industry: dto.industry }
      });
      
      // 8. Events
      this.eventBus.emit('OrganizationCreated', {
        organizationId: org.id,
        workspaceId: dto.workspaceId,
        name: dto.name,
        industry: dto.industry,
        ownerId: userId
      });
      
      return { organization: org, branch, roles };
    });
  }
}
```

#### ConfigureNovaUseCase
```typescript
class ConfigureNovaUseCase {
  async execute(dto: ConfigureNovaDto, userId: string): Promise<void> {
    // 1. Actualizar settings de la organización
    await this.settingsService.update(dto.organizationId, {
      nova: {
        enabled: dto.enabled,
        assistanceLevel: dto.assistanceLevel,
        enabledTools: this.resolveTools(dto.assistanceLevel)
      }
    });
    
    // 2. Audit log
    await this.auditService.log({
      action: 'update',
      module: 'nova',
      entity: 'organization_settings',
      entityId: dto.organizationId,
      actorType: 'human',
      afterState: { nova: { enabled: dto.enabled, level: dto.assistanceLevel } }
    });
    
    // 3. Event
    this.eventBus.emit('NovaConfigured', {
      organizationId: dto.organizationId,
      enabled: dto.enabled,
      assistanceLevel: dto.assistanceLevel
    });
  }
  
  private resolveTools(level: string): string[] | 'all' {
    if (level === 'basic') {
      return ['find_customer', 'find_product', 'get_sales_summary', 'get_inventory_report'];
    }
    if (level === 'intermediate') {
      return ['find_customer', 'find_product', 'get_sales_summary', 'get_inventory_report',
              'create_client', 'create_invoice', 'register_payment', 'create_task'];
    }
    return 'all';
  }
}
```

---

## 5. Frontend

### 5.1 Components

- `OnboardingWizard` - Container del wizard
- `WorkspaceStep` - Paso 1
- `OrganizationStep` - Paso 2
- `NovaSetupStep` - Paso 3
- `InviteTeamStep` - Paso 4
- `ProgressBar` - Barra de progreso
- `WelcomeTooltip` - Tooltip post-onboarding

### 5.2 Hooks

```typescript
useOnboarding()          // Estado del wizard
useCreateWorkspace()     // POST /api/v1/workspaces
useCreateOrganization()  // POST /api/v1/organizations
useConfigureNova()       // PUT /api/v1/organizations/:id/settings/nova
useInviteTeamMembers()   // POST /api/v1/users/invite (batch)
```

### 5.3 State Management

```typescript
interface OnboardingState {
  currentStep: 1 | 2 | 3 | 4;
  workspace: { name: string } | null;
  organization: { name: string; industry: string; country: string } | null;
  nova: { enabled: boolean; level: string } | null;
  invitations: { email: string; roleId: string }[];
  isCompleted: boolean;
}
```

---

## 6. API REST

### POST /api/v1/workspaces
(Ver PASO 4.1 en 0002)

### POST /api/v1/organizations
(Ver PASO 4.2 en 0002)

### PUT /api/v1/organizations/:id/settings/nova
```http
PUT /api/v1/organizations/org_abc123/settings/nova
Authorization: Bearer <token>

{
  "enabled": true,
  "assistanceLevel": "intermediate"
}

Response 200:
{
  "data": {
    "nova": {
      "enabled": true,
      "assistanceLevel": "intermediate",
      "enabledTools": ["find_customer", "find_product", ...]
    }
  }
}
```

### POST /api/v1/users/invite (batch)
```http
POST /api/v1/users/invite
Authorization: Bearer <token>

{
  "invitations": [
    { "email": "maria@empresa.com", "roleId": "role_manager_123" },
    { "email": "carlos@empresa.com", "roleId": "role_employee_123" }
  ]
}

Response 201:
{
  "data": {
    "invitations": [
      { "id": "inv_001", "email": "maria@empresa.com", "expiresAt": "2026-01-22T10:30:00Z" },
      { "id": "inv_002", "email": "carlos@empresa.com", "expiresAt": "2026-01-22T10:30:00Z" }
    ]
  }
}
```

---

## 7. Base de Datos

### Tablas afectadas
- `workspaces` (crear)
- `organizations` (crear)
- `branches` (crear branch principal)
- `roles` (crear roles predefinidos)
- `role_permissions` (asignar permisos)
- `organization_members` (asignar OWNER)
- `invoice_number_sequences` (crear secuencia por defecto)
- `pipeline_stages` (crear stages por defecto)
- `organization_settings` (guardar config Nova)

### Seed Data: Roles Predefinidos

```typescript
const defaultRoles = [
  {
    name: 'Owner',
    isSystemDefault: true,
    permissions: ['*'] // All permissions
  },
  {
    name: 'Admin',
    isSystemDefault: true,
    permissions: [
      'core.organization.update',
      'core.branch.*', 'core.user.*', 'core.role.*',
      'core.settings.update', 'core.audit.read',
      'crm.*', 'sales.*', 'inventory.*'
    ]
  },
  {
    name: 'Manager',
    isSystemDefault: true,
    permissions: [
      'core.branch.read',
      'crm.lead.*', 'crm.contact.*', 'crm.pipeline.*',
      'sales.quotation.*', 'sales.order.*', 'sales.invoice.create',
      'sales.invoice.read', 'sales.payment.*', 'sales.product.*',
      'inventory.product.*', 'inventory.stock.*', 'inventory.warehouse.*'
    ]
  },
  {
    name: 'Employee',
    isSystemDefault: true,
    permissions: [
      'crm.lead.create', 'crm.lead.read', 'crm.lead.update',
      'crm.contact.create', 'crm.contact.read', 'crm.contact.update',
      'sales.quotation.create', 'sales.quotation.read', 'sales.quotation.update',
      'sales.invoice.read', 'sales.payment.create', 'sales.payment.read',
      'inventory.product.read', 'inventory.stock.read'
    ]
  },
  {
    name: 'Viewer',
    isSystemDefault: true,
    permissions: [
      'crm.lead.read', 'crm.contact.read',
      'sales.quotation.read', 'sales.invoice.read', 'sales.payment.read',
      'inventory.product.read', 'inventory.stock.read',
      'analytics.dashboard.read'
    ]
  }
];
```

### Seed Data: Pipeline Stages por Defecto

```typescript
const defaultPipelineStages = [
  { name: 'Nuevo', position: 1, color: '#3B82F6' },
  { name: 'Contactado', position: 2, color: '#8B5CF6' },
  { name: 'Calificado', position: 3, color: '#F59E0B' },
  { name: 'Propuesta', position: 4, color: '#10B981' },
  { name: 'Negociación', position: 5, color: '#EF4444' },
  { name: 'Ganado', position: 6, color: '#22C55E' },
  { name: 'Perdido', position: 7, color: '#6B7280' }
];
```

---

## 8. Eventos

```
WorkspaceCreated {
  workspaceId: string
  name: string
  ownerId: string
  timestamp: DateTime
}

OrganizationCreated {
  organizationId: string
  workspaceId: string
  name: string
  industry: string
  ownerId: string
  timestamp: DateTime
}

BranchCreated {
  branchId: string
  organizationId: string
  name: string
  isHeadquarter: boolean
  timestamp: DateTime
}

RolesCreated {
  organizationId: string
  roleIds: string[]
  timestamp: DateTime
}

NovaConfigured {
  organizationId: string
  enabled: boolean
  assistanceLevel: string
  timestamp: DateTime
}

OnboardingCompleted {
  userId: string
  organizationId: string
  completedAt: DateTime
  timestamp: DateTime
}

TeamMembersInvited {
  organizationId: string
  invitations: { email: string; roleId: string }[]
  invitedBy: string
  timestamp: DateTime
}
```

---

## 9. Permisos

| Acción | Permiso | Contexto |
|--------|---------|----------|
| Crear workspace | Autenticado | El usuario crea su propio workspace |
| Crear organización | Autenticado | El usuario crea su propia organización |
| Configurar Nova | `core.settings.update` | Owner/Admin de la organización |
| Invitar equipo | `core.user.create` | Owner/Admin de la organización |

---

## 10. Validaciones

### Workspace
- `name`: obligatorio, 2-100 chars, alfanumérico + espacios + guiones

### Organization
- `name`: obligatorio, 2-255 chars
- `industry`: obligatorio, enum válido
- `countryCode`: obligatorio, ISO 3166-1 alpha-2
- `defaultCurrency`: obligatorio, ISO 4217
- `timezone`: obligatorio, timezone válido
- `employeeRange`: opcional, enum válido

### Nova Config
- `enabled`: boolean, default true
- `assistanceLevel`: enum ('basic' | 'intermediate' | 'advanced')

### Invitations
- `email`: obligatorio, formato email
- `roleId`: obligatorio, debe existir en la organización

---

## 11. Nova Tools

Ninguna durante onboarding (Nova aún no está configurado).

---

## 12. Notificaciones

### Email de invitación
```
Template: team_invitation
Channel: email
Subject: "{inviterName} te invitó a {organizationName} en Nexora"
Body: "Haz click en el enlace para unirte al equipo. La invitación expira en 7 días."
Priority: high
```

---

## 13. Auditoría

| Acción | Qué se graba |
|--------|-------------|
| Workspace created | workspaceId, name, ownerId |
| Organization created | orgId, name, industry, ownerId |
| Branch created | branchId, name, orgId |
| Roles created | roleIds, orgId |
| Nova configured | orgId, enabled, level |
| Team invited | orgId, invitations, invitedBy |
| Onboarding completed | userId, orgId |

---

## 14. Criterios de Aceptación

### US-ONBOARD-01: Flujo completo de onboarding
```
Given un usuario que verificó su email
When completa todos los pasos del onboarding
Then se crea workspace
And se crea organización con branch principal
And se crean roles predefinidos
And se configura Nova
And se redirige al dashboard
And el tiempo total es < 15 minutos
```

### US-ONBOARD-02: Saltar pasos
```
Given un usuario en el wizard de onboarding
When hace click en "Omitir"
Then se salta el paso actual
And se avanza al siguiente paso
And puede completar los pasos restantes después
```

### US-ONBOARD-03: Invitar equipo
```
Given un usuario en el paso 4 de onboarding
When agrega 2 emails con roles
Then se envían 2 invitaciones
And cada invitación expira en 7 días
And los invitados reciben email con enlace
```

### US-ONBOARD-04: Dashboard post-onboarding
```
Given un usuario que completó el onboarding
When llega al dashboard
Then ve welcome tooltip
And ve quick actions
And los datos reflejan su organización recién creada
```

---

## 15. Dependencias con Otros Módulos

| Módulo | Relación |
|--------|----------|
| Auth (004) | Post-verificación de email |
| Core (006) | Creación de org, roles, branches |
| CRM (009) | Pipeline stages por defecto |
| Nova (008) | Configuración inicial de Nova |
| Dashboard (007) | Destino final del onboarding |

---

## 16. Checklist de Implementación

- [ ] OnboardingWizard container
- [ ] WorkspaceStep
- [ ] OrganizationStep con country/currency/timezone defaults
- [ ] NovaSetupStep con niveles de asistencia
- [ ] InviteTeamStep con batch invitations
- [ ] ProgressBar animada
- [ ] WelcomeTooltip en dashboard
- [ ] CreateWorkspaceUseCase
- [ ] CreateOrganizationUseCase (con transacción)
- [ ] ConfigureNovaUseCase
- [ ] InviteUserUseCase (batch)
- [ ] Seed data: roles predefinidos
- [ ] Seed data: pipeline stages
- [ ] Email template: team_invitation
- [ ] Skip flow
- [ ] Resume onboarding (si el usuario cierra y vuelve)
- [ ] Analytics: onboarding_started, step_completed, onboarding_completed
- [ ] Time tracking: time_to_first_value
