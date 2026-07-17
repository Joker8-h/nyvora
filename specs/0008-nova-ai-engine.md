# 0008 — Motor de IA: Nova

---

## 1. Descripción y Alcance

Motor de IA completo de Nexora. Nova es el orquestador que procesa mensajes del usuario, resuelve contexto, selecciona herramientas, ejecuta Use Cases, y genera respuestas en lenguaje natural.

### Alcance Fase 1
- Context resolver (org, branch, permisos, historial)
- Planner (OpenAI Responses API + Tool Calling + Structured Outputs)
- Tool Registry (10+ tools)
- Pre-check GUARD (validación de permisos)
- Post-check Result Validator
- Confirmation flow para destructivos
- Memory (historial de conversación)
- SSE streaming

### Alcance Futuro
- Multi-turn conversations avanzadas
- Voice input
- Proactive alerts
- Learning from interactions
- Cross-module insights
- Scheduled reports

---

## 2. Diagrama de Flujo

```mermaid
flowchart TD
    A[Usuario escribe mensaje] --> B[Context Resolver]
    B --> C[Planner - OpenAI]
    C --> D{¿Necesita tool?}
    
    D -->|No| E[Generar respuesta directa]
    D -->|Sí| F[Tool Registry - seleccionar tool]
    
    F --> G[Pre-check GUARD]
    G --> H{¿Permiso válido?}
    
    H -->|No| I[AI_PERMISSION_DENIED]
    H -->|Sí| J{¿Risk flag?}
    
    J -->|normal| K[Ejecutar Use Case]
    J -->|high_impact| L[Mostrar confirmación]
    J -->|destructive| M[Mostrar confirmación]
    
    L --> N{¿Usuario confirma?}
    M --> N
    
    N -->|No| O[Respuesta: "No se ejecutó"]
    N -->|Sí| K
    
    K --> P[Post-check Result Validator]
    P --> Q[Memory Update]
    Q --> R[Generar respuesta]
    
    I --> S[Respuesta: "Sin permiso"]
```

---

## 3. Componentes del Motor

### 3.1 Context Resolver

Construye `NovaExecutionContext` para cada turno de conversación:

```typescript
interface NovaExecutionContext {
  organizationId: string;
  activeBranchId: string | null;
  userId: string;
  permissions: string[];     // Permisos del usuario en la org actual
  branchScope: string[];     // Branches a los que tiene acceso (vacío = todos)
  conversationSummary: string; // Resumen de la conversación actual
  locale: string;
  timezone: string;
  conversationId: string;
  turnNumber: number;
}
```

**Reglas**:
- **RN-NOVA-CTX-01**: El contexto se recalcula en CADA turno desde la sesión autenticada actual
- **RN-NOVA-CTX-02**: Nunca reusar contexto cacheado de un turno anterior sin revalidar permisos
- **RN-NOVA-CTX-03**: Si el usuario cambia de organización, el contexto se reconstruye completamente

### 3.2 Planner

Usa OpenAI Responses API con Tool Calling y Structured Outputs:

```typescript
interface PlannerInput {
  systemPrompt: string;         // Prompt de sistema versionado
  messages: Message[];          // Historial de conversación
  tools: ToolDefinition[];      // Tools filtrados por permisos
  executionContext: NovaExecutionContext;
}

interface PlannerOutput {
  response?: string;            // Respuesta directa (sin tool call)
  toolCalls?: ToolCall[];       // Llamadas a herramientas
  clarification?: string;       // Pregunta de clarificación
}
```

**Prompt de sistema** (versión v1.0):
```
Eres Nova, el asistente de IA de Nexora. Ayudas a los usuarios a gestionar su negocio.

CONTEXTO:
- Organización: {organizationName}
- Sucursal activa: {branchName}
- Permisos del usuario: {permissions}
- Zona horaria: {timezone}
- Moneda: {currency}

REGLAS:
1. Solo puedes ejecutar acciones que el usuario tenga permiso para realizar
2. Si falta información requerida, pregunta al usuario
3. Para acciones destructivas, siempre muestra los detalles antes de ejecutar
4. Cuando consultes datos, incluye la fuente
5. Responde en el idioma del usuario (español por defecto)
6. Nunca inventes valores para parámetros requeridos
7. Si no tienes una herramienta para algo, di "No tengo una acción para eso todavía"

HERRAMIENTAS DISPONIBLES:
{toolsDescription}
```

### 3.3 Tool Registry

Catálogo versionado de herramientas:

```typescript
interface NovaTool {
  name: string;
  description: string;
  parameters: JSONSchema;
  restEquivalent: string;           // Endpoint REST equivalente
  requiredPermission: string;       // Permiso requerido
  riskFlag: 'normal' | 'high_impact' | 'destructive';
  useCase: string;                  // Token del Use Case a invocar
  destructive?: boolean;            // Deprecated, usar riskFlag
  highImpact?: boolean;             // Deprecated, usar riskFlag
}
```

**Tools MVP**:

| Tool | Descripción | REST Equivalent | Permiso | Risk Flag |
|------|-------------|-----------------|---------|-----------|
| `create_client` | Crear cliente | POST /api/v1/contacts | `crm.contact.create` | normal |
| `find_customer` | Buscar cliente | GET /api/v1/contacts | `crm.contact.read` | - |
| `create_invoice` | Crear factura | POST /api/v1/invoices | `sales.invoice.create` | normal |
| `find_product` | Buscar producto | GET /api/v1/products | `inventory.product.read` | - |
| `get_sales_summary` | Resumen ventas | GET /api/v1/analytics/sales-summary | `analytics.dashboard.read` | - |
| `get_inventory_report` | Reporte inventario | GET /api/v1/inventory/report | `inventory.stock.read` | - |
| `transfer_stock` | Transferir stock | POST /api/v1/stock-transfers | `inventory.stock.transfer` | high_impact |
| `void_invoice` | Anular factura | POST /api/v1/invoices/:id/void | `sales.invoice.void` | destructive |
| `register_payment` | Registrar pago | POST /api/v1/invoices/:id/payments | `sales.payment.create` | normal |
| `create_task` | Crear tarea | POST /api/v1/tasks | `tasks:create` | normal |

### 3.4 Pre-check (GUARD)

```typescript
class NovaPreCheck {
  validate(tool: NovaTool, context: NovaExecutionContext): PreCheckResult {
    // 1. Verificar que el permiso exista en el contexto
    if (!context.permissions.includes(tool.requiredPermission)) {
      return {
        allowed: false,
        error: {
          code: 'AI_PERMISSION_DENIED',
          message: `No tienes permiso para ejecutar: ${tool.description}`,
          permission: tool.requiredPermission
        }
      };
    }
    
    // 2. Verificar scope de branch
    if (tool.riskFlag !== 'normal' && context.branchScope.length > 0) {
      // Validar que la branch objetivo esté en el scope
    }
    
    return { allowed: true };
  }
}
```

**Reglas**:
- **RN-NOVA-GUARD-01**: El pre-check se ejecuta ANTES de invocar el Use Case
- **RN-NOVA-GUARD-02**: Si el pre-check falla, se registra intento denegado en audit
- **RN-NOVA-GUARD-03**: Nunca se ejecuta la acción si el pre-check falla, sin excepción

### 3.5 Confirmation Flow

```typescript
interface ConfirmationRequest {
  toolName: string;
  riskFlag: 'high_impact' | 'destructive';
  beforeState: any;
  afterState: any;
  description: string;
  confirmationToken: string;  // Token de uso único
  expiresAt: DateTime;
}

interface ConfirmationResponse {
  confirmed: boolean;
  confirmationToken: string;
}
```

**Flujo**:
```
1. Nova detecta riskFlag = 'high_impact' o 'destructive'
2. Ejecuta el Use Case para obtener el resultado PERO NO LO PERSISTE
3. Muestra NovaActionConfirmCard con:
   - Acción a ejecutar
   - Estado actual (before)
   - Estado después (after)
   - Advertencia (para destructivos: "Esta acción no se puede deshacer")
4. Botones de igual peso: "Confirmar" / "Cancelar"
5. Si confirma → se ejecuta la acción real
6. Si cancela → Nova responde "Entendido, no se ejecutó la acción"
7. Token expira si no se confirma en el mismo turno
```

**Reglas**:
- **RN-NOVA-CONF-01**: El `confirmation_token` es de uso único
- **RN-NOVA-CONF-02**: Expira si no se confirma dentro de la sesión activa
- **RN-NOVA-CONF-03**: No se puede reusar para otra acción o sesión
- **RN-NOVA-CONF-04**: Para destructivos, los botones son de igual peso (sin foco predeterminado)

### 3.6 Post-check (Result Validator)

```typescript
class NovaPostCheck {
  validate(
    intent: string,
    toolResult: any,
    originalParams: any
  ): PostCheckResult {
    // 1. Comparar resultado contra intención detectada
    // 2. Verificar que la acción se ejecutó correctamente
    // 3. Detectar resultados parciales o errores no capturados
    
    if (toolResult.error) {
      return {
        valid: false,
        response: `Error al ejecutar: ${toolResult.errorMessage}`
      };
    }
    
    return { valid: true };
  }
}
```

### 3.7 Memory

```typescript
interface ConversationMemory {
  conversationId: string;
  organizationId: string;
  userId: string;
  messages: Message[];
  summary: string;          // Resumen de la conversación
  entities: Entity[];       // Entidades mencionadas (clientes, facturas, etc.)
  turns: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

**Almacenamiento**:
- Fase 1: En memoria (in-process, se pierde al reiniciar)
- Fase 2: Redis
- Fase 3: PostgreSQL con vector embeddings

---

## 4. Frontend

### 4.1 Components

- `NovaPanel` - Side panel persistente
- `NovaChat` - Container del chat
- `NovaMessage` - Mensaje individual (user/assistant)
- `NovaInput` - Input de texto con sugerencias
- `NovaToolCall` - Indicador de tool call en progreso
- `NovaToolResult` - Resultado de un tool call
- `NovaActionConfirmCard` - Card de confirmación para destructivos
- `NovaSuggestions` - Sugerencias rápidas
- `NovaThinking` - Indicador de "pensando..."

### 4.2 Hooks

```typescript
useNova()                    // Estado del chat
useNovaStream()              // SSE streaming
useNovaTools()               // Lista de tools disponibles
useNovaConfirmAction()       // Confirmar acción destructiva
```

### 4.3 NovaActionConfirmCard

```typescript
interface NovaActionConfirmCardProps {
  toolName: string;
  description: string;
  beforeState: Record<string, any>;
  afterState: Record<string, any>;
  riskFlag: 'high_impact' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}
```

**Diseño**:
- Dos botones de igual peso (no hay "botón primario")
- Para destructivos: botón "Cancelar" a la izquierda, "Confirmar" a la derecha
- Warning text: "Esta acción no se puede deshacer" (solo destructive)
- Before/After state claramente visible

---

## 5. API REST

### POST /api/v1/ai/chat

```http
POST /api/v1/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "¿Cuánto vendí este mes?",
  "conversationId": "conv_abc123" (optional, creates new if not provided)
}

Response 200 (SSE):
data: {"type":"thinking","content":"Analizando ventas del mes..."}
data: {"type":"tool_call","tool":"get_sales_summary","params":{},"status":"executing"}
data: {"type":"tool_result","tool":"get_sales_summary","status":"success","result":{"totalSales":15000000,"period":"2026-01"}}
data: {"type":"response","content":"Este mes has vendido $15,000,000 COP, un 12% más que el mes pasado. ¿Te gustaría ver el desglose por producto?"}
data: [DONE]
```

### POST /api/v1/ai/chat/confirm

```http
POST /api/v1/ai/chat/confirm
Authorization: Bearer <token>

{
  "confirmationToken": "confirm_abc123",
  "confirmed": true
}

Response 200:
{
  "data": {
    "executed": true,
    "result": { ... }
  }
}
```

### GET /api/v1/ai/tools

```http
GET /api/v1/ai/tools
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "name": "create_client",
      "description": "Crear un nuevo cliente",
      "riskFlag": "normal",
      "requiredPermission": "crm.contact.create"
    }
  ]
}
```

### GET /api/v1/ai/conversations/:id

```http
GET /api/v1/ai/conversations/conv_abc123
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "id": "conv_abc123",
    "messages": [...],
    "summary": "...",
    "turns": 5,
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

## 6. Base de Datos

```sql
-- Conversations
CREATE TABLE nova_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  summary TEXT,
  turns INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nova_conv_org ON nova_conversations(organization_id);
CREATE INDEX idx_nova_conv_user ON nova_conversations(user_id);

-- Messages
CREATE TABLE nova_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES nova_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system', 'tool_call', 'tool_result'
  content TEXT,
  tool_name VARCHAR(100),
  tool_params JSONB,
  tool_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nova_msg_conv ON nova_messages(conversation_id);

-- Confirmation Tokens
CREATE TABLE nova_confirmation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  conversation_id UUID NOT NULL REFERENCES nova_conversations(id),
  tool_name VARCHAR(100) NOT NULL,
  params JSONB NOT NULL,
  risk_flag VARCHAR(20) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nova_ct_token ON nova_confirmation_tokens(token);
CREATE INDEX idx_nova_ct_expires ON nova_confirmation_tokens(expires_at);
```

---

## 7. Eventos

```
NovaMessageSent {
  conversationId: string
  userId: string
  organizationId: string
  message: string
  timestamp: DateTime
}

NovaToolExecuted {
  conversationId: string
  userId: string
  toolName: string
  riskFlag: string
  success: boolean
  confirmationRequired: boolean
  timestamp: DateTime
}

NovaActionConfirmed {
  confirmationToken: string
  toolName: string
  userId: string
  timestamp: DateTime
}

NovaActionDenied {
  conversationId: string
  userId: string
  toolName: string
  reason: string
  timestamp: DateTime
}

NovaConfirmationExpired {
  confirmationToken: string
  toolName: string
  timestamp: DateTime
}
```

---

## 8. Permisos

Cada tool tiene su propio permiso. El usuario debe tener el permiso para que Nova pueda ejecutar la acción.

| Permiso | Acceso |
|---------|--------|
| `nova.action.execute` | Acceso general a Nova (si se revoca, Nova queda read-only) |
| Permisos de módulo | Acceso a tools específicas |

**RN-NOVA-PERM-01**: Nova NUNCA ejecuta una acción que el usuario no tenga permiso para realizar, sin excepción aunque el usuario insista.

---

## 9. Validaciones

### Message
- `message`: obligatorio, 1-10000 chars
- `conversationId`: opcional, debe existir y pertenecer a la organización

### Confirmation
- `confirmationToken`: obligatorio, válido, no expirado, no usado
- `confirmed`: boolean

---

## 10. Métricas de Calidad

| Métrica | Definición | Target |
|---------|-----------|--------|
| Tool selection accuracy | % de turnos donde el tool seleccionado es el correcto | >90% |
| Permission-denial correctness | % de acciones no autorizadas correctamente bloqueadas | 100% |
| Confirmation compliance | % de acciones destructivas que pasaron por confirmación | 100% |
| Latency p95 (turn with tool) | Desde mensaje hasta respuesta final | <4s |
| Cost per conversation | Promedio de tokens por conversación | <$0.05 |

---

## 11. Nova como Creador de Workflows

Nova puede interpretar lenguaje natural del usuario y crear automatizaciones automáticamente, sin que el usuario tenga que usar el editor visual.

### 11.1 Flujo de Creación

```
USUARIO: "Cada vez que un cliente compre más de $500, crea una factura, 
          envíale un WhatsApp y agenda una llamada de seguimiento para 3 días"

        ↓ Nova interpreta ↓

1. Nova identifica: trigger=order.created, condition=total>50000 (cents)
2. Nova identifica actions: invoice.create, whatsapp.send, schedule.follow_up
3. Nova valida que trigger y actions existen en el sistema
4. Nova genera JSON del automation:
   {
     "name": "Cliente VIP > $500",
     "triggerType": "order.created",
     "triggerConfig": { "minAmount": 50000 },
     "conditions": [{ "field": "total", "op": "gt", "value": 50000 }],
     "actions": [
       { "type": "invoice.create", "config": { "fromOrder": true } },
       { "type": "whatsapp.send", "config": { "template": "purchase_confirm" } },
       { "type": "schedule.follow_up", "config": { "delay": "3d", "type": "call" } }
     ]
   }
5. Nova muestra confirmación al usuario con el flujo resumido
6. Si confirma → guarda automation en status "draft"
7. Nova pregunta: "¿Lo activo ahora?"
```

### 11.2 Tool: create_automation

```typescript
interface NovaTool {
  name: 'create_automation';
  description: 'Crea un flujo de automatización basado en instrucción del usuario';
  parameters: {
    type: 'object';
    properties: {
      name: { type: 'string'; description: 'Nombre del flujo' };
      description: { type: 'string'; description: 'Descripción del flujo' };
      triggerType: { 
        type: 'string'; 
        enum: ['lead.created', 'lead.stage_changed', 'order.created', 'invoice.paid', 
               'invoice.overdue', 'stock.low', 'employee.hired', 'schedule.cron'];
      };
      triggerConfig: { type: 'object'; description: 'Configuración del trigger' };
      conditions: { 
        type: 'array'; 
        items: { field: string; op: string; value: any };
        description: 'Condiciones opcionales para filtrar';
      };
      actions: { 
        type: 'array'; 
        items: { type: string; config: object };
        description: 'Lista ordenada de acciones a ejecutar';
      };
    };
    required: ['name', 'triggerType', 'actions'];
  };
  restEquivalent: 'POST /api/v1/automations';
  requiredPermission: 'automations:create';
  riskFlag: 'high_impact';
  useCase: 'CreateAutomationUseCase';
}
```

### 11.3 Triggers Disponibles para Nova

| Trigger | Descripción | Config esperada |
|---------|-------------|-----------------|
| `lead.created` | Lead creado | `pipelineId?`, `source?` |
| `lead.stage_changed` | Lead cambió etapa | `fromStage?`, `toStage?` |
| `order.created` | Orden creada | `minAmount?`, `maxAmount?` |
| `invoice.paid` | Factura pagada | `minAmount?` |
| `invoice.overdue` | Factura vencida | `daysOverdue?` |
| `stock.low` | Stock bajo mínimo | `productId?`, `warehouseId?` |
| `employee.hired` | Empleado contratado | `departmentId?` |
| `schedule.cron` | Programado | `cron: string` |

### 11.4 Actions Disponibles para Nova

| Action | Módulo | Config |
|--------|--------|--------|
| `invoice.create` | Sales | `fromOrder?: boolean`, `contactId?` |
| `lead.assign` | CRM | `strategy?: 'least_active' \| 'round_robin'` |
| `lead.update_stage` | CRM | `stage: string` |
| `lead.add_tag` | CRM | `tag: string` |
| `email.send` | Integrations | `to?: string`, `template?: string`, `subject?: string` |
| `whatsapp.send` | Integrations | `to?: string`, `template?: string` |
| `schedule.follow_up` | Core | `delay: string`, `type: 'call' \| 'email' \| 'meeting'` |
| `record.update` | Core | `entity: string`, `entityId?: string`, `fields: object` |
| `webhook.call` | Integrations | `url: string`, `method?: string`, `body?: object` |

### 11.5 Confirmación del Workflow

Cuando Nova crea un automation, muestra:

```
"He creado este flujo para ti:

🔄 **Trigger**: Cuando se cree una orden
⚠️ **Condición**: Total mayor a $500
→ **Acción 1**: Crear factura
→ **Acción 2**: Enviar WhatsApp de confirmación  
→ **Acción 3**: Agendar llamada de seguimiento en 3 días

¿Lo activo? [Sí, activar] [Guardar como borrador] [Cancelar]"
```

- "Sí, activar" → status = "active"
- "Guardar como borrador" → status = "draft"
- "Cancelar" → No se guarda

### 11.6 Limites de Creación

1. Nova solo puede crear automations con triggers y actions que existan en el sistema
2. Nova NO puede crear actions que ejecuten código arbitrario
3. Nova NO puede crear triggers de tipo "webhook" (solo los predefinidos)
4. Máximo 10 actions por automation al crear vía Nova
5. Todas las creaciones vía Nova quedan registradas en audit log con `createdBy: 'nova'`

---

## 12. Limites Explícitos de Nova

1. **NUNCA** modifica configuración de seguridad (roles, permisos, usuarios Owner/Admin) sin herramienta explícita diseñada y aprobada
2. **NUNCA** accede a datos de una organización diferente a la actual, aunque el usuario pertenezca a múltiples orgs
3. **NUNCA** genera o ejecuta código arbitrario a petición del usuario
4. **NUNCA** toma decisiones financieras o de RRHH autónomamente sin acción humana explícita
5. **NUNCA** crea automations con actions que no existan en el catálogo del sistema

---

## 12. Notificaciones

```
NovaHighImpactAction → in-app al usuario que confirmó
NovaActionDenied → in-app al usuario (intento fallido)
```

---

## 13. Auditoría

Toda ejecución de tool se audita:

```json
{
  "action": "execute",
  "module": "nova",
  "entity": "tool_execution",
  "entityId": "exec_abc123",
  "actor_type": "ai_agent",
  "on_behalf_of": "usr_abc123",
  "metadata": {
    "tool_name": "void_invoice",
    "confirmation_required": true,
    "user_confirmed_at": "2026-01-15T10:30:00Z",
    "params": { "invoiceId": "inv_123", "reason": "Error" },
    "result": { "success": true }
  }
}
```

---

## 14. Criterios de Aceptación

### US-NOVA-01: Consulta de solo lectura
```
Given un usuario con permisos de lectura
When pregunta "¿Cuánto vendí este mes?"
Then Nova ejecuta get_sales_summary
And responde con el monto de ventas
And cita la fuente de datos
```

### US-NOVA-02: Acción con permiso válido
```
Given un usuario con permiso sales.invoice.create
When dice "Crea una factura para el pedido #1234"
Then Nova ejecuta create_invoice_from_order
And muestra el número de factura generado
And registra auditoría con actor_type=ai_agent
```

### US-NOVA-03: Acción sin permiso
```
Given un usuario sin permiso sales.invoice.void
When dice "Anula la factura FAC-2026-00042"
Then Nova responde que no tiene permiso
And NO ejecuta la acción
And registra intento denegado en auditoría
```

### US-NOVA-04: Acción destructiva con confirmación
```
Given un usuario con permiso sales.invoice.void
When dice "Anula la factura FAC-2026-00042"
Then Nova muestra NovaActionConfirmCard
And muestra estado actual y estado después
And NO ejecuta hasta que el usuario confirme
And si confirma, ejecuta y muestra resultado
And si cancela, responde "No se ejecutó la acción"
```

### US-NOVA-05: Información faltante
```
Given un usuario que dice "Crea una factura"
When Nova detecta que falta el clientId
Then Nova pregunta "¿Para qué cliente quieres crear la factura?"
And NO inventa un valor
```

### US-NOVA-06: Datos parciales
```
Given un usuario que pregunta "¿Cuánto vendí?"
When solo hay datos de 2 de 5 branches
Then Nova responde con los datos disponibles
And indica "Estos son los datos de 2 de 5 sucursales"
```

---

## 15. Dependencias

| Módulo | Relación |
|--------|----------|
| Core (006) | Orgs, branches, users, permisos |
| Auth (004) | Sesión del usuario |
| CRM (009) | Tools de CRM |
| Sales (010) | Tools de ventas |
| Inventory (011) | Tools de inventario |
| Dashboard (007) | Tools de analytics |
| Audit (013) | Logging de acciones |
| Automations (028) | Creación de workflows |

---

## 16. Criterios de Aceptación — Creación de Workflows

### US-NOVA-07: Crear automation vía Nova
```
Given un usuario con permiso automations:create
When dice "Crea un automation que envíe un email cuando se pague una factura"
Then Nova interpreta la instrucción
And valida que trigger=invoice.paid y action=email.send existen
And muestra resumen del flujo creado
And si confirma, guarda automation con createdBy='nova'
And registra auditoría
```

### US-NOVA-08: Automation con condición
```
Given un usuario que dice "Cuando vendan más de $1000, crear factura y notificar al admin"
Then Nova crea automation con trigger=order.created
And condition=total>100000 (cents)
And actions=[invoice.create, notify]
And muestra condición en el resumen
```

### US-NOVA-09: Trigger inexistente
```
Given un usuario que dice "Cuando se envíe un tweet, notificar"
Then Nova responde "No tengo un trigger para ese evento"
And sugiere triggers disponibles relacionados
```

---

## 17. Checklist

- [ ] Context Resolver
- [ ] Planner con OpenAI Responses API
- [ ] Tool Registry (12+ tools)
- [ ] Pre-check GUARD
- [ ] Post-check Result Validator
- [ ] Confirmation flow (high_impact + destructive)
- [ ] Memory (conversation history)
- [ ] SSE streaming
- [ ] NovaPanel UI
- [ ] NovaChat UI
- [ ] NovaActionConfirmCard UI
- [ ] NovaSuggestions
- [ ] System prompt versioning
- [ ] Quality metrics tracking
- [ ] Audit logging
- [ ] Rate limiting (60 write actions/min per user)
- [ ] Error handling (AI_PERMISSION_DENIED, AI_MISSING_REQUIRED_PARAMETER)
- [ ] create_automation tool
- [ ] Workflow creation confirmation flow
- [ ] Trigger validation
- [ ] Action validation
- [ ] CreatedBy tracking (nova vs user)
