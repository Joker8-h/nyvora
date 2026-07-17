
# 0001 — Visión Maestra y Contexto General

> **Documento fuente de verdad conceptual.** Todos los demás documentos dependen de este y se someten a él en caso de conflicto.

---

## 1. Qué es Nexora

**Nexora** es un **Business Operating System AI-First** donde un agente de IA llamado **Nova** es la interfaz de ejecución primaria, no solo un asistente de consultas. Nova tiene acceso a herramientas que leen y escriben en módulos de negocio, respetando los mismos permisos y reglas de negocio que un usuario humano.

### Qué NO es Nexora

| No es | Por qué |
|-------|---------|
| Un ERP tradicional | No requiere capacitación extensa; Nova ejecuta acciones conversacionalmente |
| Un CRM aislado | CRM es solo uno de los módulos integrados |
| Un chatbot de soporte | Nova tiene permisos de escritura reales, no solo lectura |
| Una solución de facturación puntual | Nexora cubre el ciclo completo del negocio |
| Una plataforma de código bajo | No genera código; ejecuta Use Cases predefinidos |

---

## 2. Misión, Visión y Principios

### Misión
Empoderar a cualquier empresa para gestionar y hacer crecer su negocio a través de IA, automatización y una plataforma unificada.

### Visión
Ser el sistema operativo de negocio estándar para empresas de cualquier tamaño y industria, donde la IA no es un addon sino el núcleo de la experiencia.

### Principios No Negociables

| # | Principio | Significado práctico |
|---|-----------|---------------------|
| 1 | **AI First** | Cada módulo debe preguntarse "¿qué puede hacer Nova aquí?" antes de diseñar la UI |
| 2 | **API First** | Ninguna UI se construye sin un contrato API paralelo |
| 3 | **Mobile First** | Flujos críticos deben funcionar en pantallas pequeñas |
| 4 | **Cloud Native** | Stateless donde sea posible, logs estructurados |
| 5 | **Modular** | Cada dominio es un bounded context desacoplado |
| 6 | **Escalable** | Decisiones de schema/infra deben soportar de 1 a decenas de miles de organizaciones |
| 7 | **Seguridad por defecto** | Permisos deny-by-default; todo acceso debe ser explícito |
| 8 | **UX excepcional** | Minimalismo inspirado en Linear/Notion/Stripe |

---

## 3. Público Objetivo

Nexora está diseñado para cualquier organización que necesite gestionar negocio:

- **Freelancers y micro-empresas** (1-5 personas)
- **PYMEs** (5-50 personas)
- **Empresas medianas** (50-500 personas)
- **Corporaciones** (500+ personas)
- **Sector público, ONGs, educación, salud**
- **Hoteles, restaurantes, barbershops, construcción, agencias, comercio, manufactura, logística**

**Industria**: Cualquier行业 organizada como una o más Organizaciones con Sucursales.

---

## 4. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Frontend** | Next.js 15 + React + TypeScript | Server Components, App Router, ecosistema |
| **UI** | Tailwind CSS + shadcn/ui | Design system consistente, dark-first |
| **State** | React Query | Caché, optimistic updates, background refetch |
| **Forms** | React Hook Form + Zod | Validación client/server con schemas compartidos |
| **Animations** | Framer Motion | Solo para transiciones de estado y feedback de acciones |
| **Backend** | NestJS (Node.js + TypeScript) | Modular, DI nativo, Guards, Interceptors |
| **ORM** | Prisma | Type-safe, migrations, client generation |
| **Database** | PostgreSQL | ACID, JSONB, partitioning, extensiones |
| **API Docs** | Swagger/OpenAPI | Auto-generado desde decoradores NestJS |
| **Auth** | JWT (access + refresh) | Stateless, rotatable, revocable |
| **AI** | OpenAI Responses API + Tool Calling + Structured Outputs | Control total sobre el pipeline de Nova |
| **Infra** | Railway + Docker + GitHub Actions | Deploy simplicity, CI/CD automatizado |
| **Email** | Resend | Transaccional, deliverability |
| **Storage** | Cloudflare R2 (Fase 2) | S3-compatible, cost-effective |

---

## 5. Arquitectura en Una Frase

> **Monolito modular con Clean Architecture, táctical DDD, eventos internos, diseñado para que cualquier módulo pueda extraerse como microservicio sin reescribir lógica de negocio.**

### Por qué Monolito Modular (no Microservices desde el Día 1)

| Ventaja | Detalle |
|---------|---------|
| Baja complejidad operacional inicial | Un deploy, una base de datos, un equipo |
| Transacciones ACID跨 módulos | Sin orchestración distribuida |
| Alta velocidad de iteración early | Sin contratos inter-servicio |
| Camino de extracción claro | Strangler Fig pattern cuando la carga lo justifique |

**Condición de extracción**: La carga, necesidad de escalado independiente, o tamaño del equipo dedicado lo justifican con evidencia, no por anticipación.

---

## 6. Entidad Central: La Organización

Todo cuelga de una **Organization**:

```
Organization
├── Branches (Sucursales)
│   └── Departments (Departamentos)
├── Users (Usuarios)
│   └── Memberships (Pertenencia con rol)
├── Roles (Roles predefinidos + custom)
│   └── Permissions (Catálogo global)
├── Settings (Configuración)
├── Billing (Facturación)
├── Inventory (Inventario)
│   ├── Products
│   ├── Warehouses
│   └── Stock
├── CRM
│   ├── Contacts
│   ├── Leads
│   └── Pipeline
├── Sales (Ventas)
│   ├── Quotations
│   ├── Orders
│   ├── Invoices
│   └── Payments
├── Purchases (Compras)
├── Finance (Finanzas)
├── HR (RRHH)
├── Projects (Proyectos)
├── Documents (Documentos)
├── Automations (Nexora Flow)
└── Marketplace (Nexora Marketplace)
```

---

## 7. Nova: Principio de Funcionamiento

### Ciclo de Nova

```
Mensaje del Usuario
       ↓
Context Resolver (org, rol, permisos, historial)
       ↓
Intent Analysis & Planning (OpenAI Responses API)
       ↓
Tool Selection (filtrado por permisos ANTES del modelo)
       ↓
Pre-check GUARD (valida permiso contra contexto)
       ↓
Use Case Execution (mismo Use Case que REST)
       ↓
Post-check Result Validator (compara resultado vs intención)
       ↓
Memory Update (almacena contexto)
       ↓
Response Generation (lenguaje natural)
```

### Principio Fundamental de Nova

> Cada herramienta de Nova es un wrapper delgado sobre un Use Case existente. **Nunca** lógica de negocio duplicada.

### Nova vs REST: Misma Lógica, Diferente Interfaz

```
REST Controller → Use Case → Repository → Database
                     ↑
AI Tool → Adaptation Layer → (mismo Use Case)
```

---

## 8. Mapa de Módulos y Prioridad de Construcción

### Fase 1 — MVP (0-6 meses)

| Módulo | Descripción | Prioridad |
|--------|-------------|-----------|
| **Core Platform** | Auth, Users, Roles, Permissions, Organizations, Branches, Config | 🔴 Crítico |
| **CRM** | Leads, Clientes, Empresas, Contactos, Funnel básico | 🔴 Crítico |
| **Ventas** | Cotizaciones, Pedidos, Facturas, Pagos, Productos | 🔴 Crítico |
| **Inventario** | Productos, Categorías, Stock, Almacenes, Movimientos | 🔴 Crítico |
| **Nova (básico)** | Read mode + write actions con 10+ tools | 🔴 Crítico |
| **Dashboard** | Versión inicial con KPIs | 🟡 Importante |
| **Notificaciones** | Centro básico de notificaciones | 🟡 Importante |

### Fase 2 — Crecimiento (6-12 meses)

| Módulo | Descripción | Prioridad |
|--------|-------------|-----------|
| **Compras** | Proveedores, Órdenes de compra, Recepción | 🟡 Importante |
| **Finanzas** | Cajas, Bancos, Transacciones, Presupuestos, Periodos | 🟡 Importante |
| **Documentos** | Gestión de archivos, plantillas, firmas | 🟢 Normal |
| **Analytics** | Reportes, gráficos, dashboards custom | 🟢 Normal |
| **API Pública** | API keys, webhooks, OAuth2 | 🟢 Normal |
| **Integraciones** | Third-party (contabilidad, pagos, email) | 🟢 Normal |
| **Nova avanzado** | Multi-turno, voz, alertas proactivas | 🟢 Normal |

### Fase 3 — Escala (12-24 meses)

| Módulo | Descripción | Prioridad |
|--------|-------------|-----------|
| **RRHH** | Empleados, Contratos, Nómina, Vacaciones | 🔵 Futuro |
| **Marketing** | Campañas, Email marketing, Landing builder | 🔵 Futuro |
| **Proyectos** | Projects, Tasks, Kanban, Gantt, Time tracking | 🔵 Futuro |
| **Marketplace** | Plugins, Install/uninstall, Licencias | 🔵 Futuro |
| **Automatizaciones** | Nexora Flow: Visual builder, Triggers, Actions | 🔵 Futuro |
| **Mobile App** | React Native / PWA | 🔵 Futuro |

### Módulos Transversales (activos desde Fase 1)

- **Notificaciones** (in-app + email)
- **Auditoría** (append-only)
- **API Pública** (documentada desde Fase 1)
- **IA/Nova** (crece con cada módulo)

---

## 9. Glosario Común

| Término | Definición |
|---------|-----------|
| **Organization** | Entidad raíz de tenant. Equivale técnicamente a "Tenant". |
| **Branch** | Sucursal física o lógica de una Organization |
| **Nova** | Agente de IA orchestrator de Nexora |
| **Tool** | Función expuesta a Nova que wrappea un Use Case |
| **Use Case** | Unidad invocable por REST o Nova con las mismas reglas de negocio |
| **Module** | Bounded context del dominio (CRM, Ventas, Inventario, etc.) |
| **Tenant** | Sinónimo técnico de Organization |
| **RBAC** | Role-Based Access Control |
| **ABAC** | Attribute-Based Access Control |
| **Domain Event** | Evento de dominio para comunicación inter-módulo |

---

## 10. Cómo Usar Esta Colección de Documentos

### Jerarquía de Documentos

```
0001 (este documento) — Fuente de verdad conceptual
    ↓
0002 User Flow — Flujo completo del usuario
    ↓
0003-0030 — Especificaciones por módulo/pantalla
    ↓
Cada archivo de módulo es auto-contenido pero depende de:
  - 0001 para principios y stack
  - 0002 para flujos transversales
  - 0014 para formato de errores
  - 0015 para sistema de permisos
```

### Regla de Resolución de Conflictos

Si dos documentos contradicten, el de **número menor** tiene prioridad:
1. 0001 (Visión) sobre cualquier otro
2. 0002 (User Flow) sobre specifics de módulo
3. Errores (0014) y Permisos (0015) son canónicos

### Para Desarrolladores

1. Lee este documento (0001) para entender el contexto general
2. Lee 0002 (User Flow) para entender el recorrido del usuario
3. Lee el archivo del módulo que vas a desarrollar
4. Consulta 0014 (Errores) y 0015 (Permisos) para referencias

### Para QA

1. Los criterios de aceptación están en cada archivo de módulo (sección 14)
2. Las reglas de negocio tienen IDs estables (RN-XXX-NN) para trazabilidad
3. Cada regla debe tener al menos una prueba automatizada

### Para Producto

1. Las historias de usuario están referenciadas en cada módulo
2. Los wireframes están en la sección 3 de cada archivo
3. Los estados de las máquinas están en la sección 4.6

---

## 11. Convenciones de Numeración

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Archivos de especificación | `XXXX-name.md` | `0010-sales.md` |
| Business Rules | `RN-<MODULO>-<NUM>` | `RN-SALES-01` |
| User Stories | `US-<MODULO>-<NUM>` | `US-SALES-03` |
| Error Codes | `SCREAMING_SNAKE_CASE` | `ORDER_FULLY_INVOICED` |
| Permisos | `<module>.<resource>.<action>` | `sales.invoice.create` |
| Eventos de dominio | `<Entity><VerbPast>` | `InvoicePaid` |
| API Version | `/api/v1/...` | `/api/v1/invoices` |

---

## 12. Métricas de Éxito del Producto

| Métrica | Target MVP |
|---------|-----------|
| Activación | ≥ 60% de orgs completan onboarding y crean un registro real en 7 días |
| Retención | ≥ 40% activas a 30 días |
| Nova Adoption | ≥ 25% de usuarios ejecutan al menos 1 acción de Nova por semana |
| Time to First Value | < 15 min desde registro hasta primera factura/cotización |
| NPS | ≥ 40 |

---

## 13. Riesgos Principales y Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Alcance demasiado amplio | Alto | Fases estrictas; MVP = Core + CRM + Sales + Inventory + Nova |
| Nova ejecutando acciones no deseadas | Alto | Confirmación explícita para destructivos; permisos estrictos |
| Complejidad multi-tenant | Alto | Middleware de tenant; Prisma middleware; tests de aislamiento |
| UX contradictoria con propuesta de valor | Medio | Design system consistente; mobile-first; testing de usabilidad |
| Costos de IA elevados | Medio | Rate limiting por usuario; caching de contexto; modelo adecuado |

---

*Documento fuente: `0000-vision-master-context.md` + `0001-prd.md`*
*Última actualización: Fase de planificación*
