# 0003 — Landing y Marketing

---

## 1. Descripción y Alcance

La landing page es la primera impresión de Nexora. Debe convertir visitantes en registros mostrando claramente el valor del producto: un Business Operating System AI-First donde Nova ejecuta acciones reales.

### Objetivos
- **Conversión**: Visitante → Registro (>3% target)
- **SEO**: Posicionar "business operating system AI", "ERP con IA", "Nova asistente IA negocio"
- **Claridad**: Comunicar qué es Nexora en <5 segundos
- **Confianza**: Social proof, pricing transparente

---

## 2. Diagrama de Flujo

```mermaid
flowchart TD
    A[Visitante llega] --> B{¿Página?}
    B -->|/| C[Homepage]
    B -->|/pricing| D[Pricing]
    B -->|/features| E[Features]
    B -->|/docs| F[Documentación]
    B -->|/login| G[Login]
    
    C --> H[Click "Comenzar gratis"]
    D --> H
    E --> H
    
    H --> I[Registro]
    I --> J[Verificación Email]
    J --> K[Onboarding]
    K --> L[Dashboard]
```

---

## 3. Pantallas

### 3.1 Homepage

**Qué ve el usuario**:
- **Navbar**: Logo, Links (Features, Pricing, Docs, Blog), Botón "Iniciar sesión", Botón "Comenzar gratis"
- **Hero**: Headline + Subheadline + CTA principal + Video/Demo preview
- **Logos de empresas** (social proof)
- **Features grid**: 6-8 features principales con icono + título + descripción
- **Cómo funciona**: 3 pasos con diagrama
- **Testimonios**: 3-6 testimonios con foto, nombre, empresa, rol
- **Pricing preview**: Resumen de planes
- **FAQ**: 8-10 preguntas frecuentes
- **CTA final**: "Comienza gratis hoy"
- **Footer**: Links, legal, social, newsletter

**Wireframe**:
```
┌─────────────────────────────────────────────┐
│ [Logo]  Features  Pricing  Docs  [Login] [▶ Comenzar] │
├─────────────────────────────────────────────┤
│                                             │
│   Business Operating System                 │
│   AI-First                                 │
│                                             │
│   Nova ejecuta las acciones de tu negocio   │
│   mientras tú te enfocás en crecer.         │
│                                             │
│   [▶ Comenzar gratis]  [Ver demo]           │
│                                             │
├─────────────────────────────────────────────┤
│   Empresas que confían en Nexora            │
│   [Logo1] [Logo2] [Logo3] [Logo4] [Logo5]  │
├─────────────────────────────────────────────┤
│                                             │
│   Todo lo que necesitas, unificado           │
│                                             │
│   ┌──────┐ ┌──────┐ ┌──────┐               │
│   │ CRM  │ │Ventas│ │Invent│               │
│   └──────┘ └──────┘ └──────┘               │
│   ┌──────┐ ┌──────┐ ┌──────┐               │
│   │NovaIA│ │Dashbd│ │Notif │               │
│   └──────┘ └──────┘ └──────┘               │
│                                             │
├─────────────────────────────────────────────┤
│   Cómo funciona                             │
│   1. Crea tu cuenta  2. Configura tu empresa│
│   3. Nova ejecuta    4. Crece tu negocio    │
├─────────────────────────────────────────────┤
│   Testimonios                               │
│   "Nexora transformó..." - Juan, CEO        │
│   "Nova me ahorra..." - María, Gerente     │
│   "Por fin un ERP..." - Carlos, Director    │
├─────────────────────────────────────────────┤
│   Pricing                                   │
│   Starter $0  Business $29  Enterprise $99  │
├─────────────────────────────────────────────┤
│   FAQ                                       │
│   ¿Qué es Nexora? ¿Nova qué hace? ...      │
├─────────────────────────────────────────────┤
│   [Comienza gratis hoy]                     │
├─────────────────────────────────────────────┤
│   Footer: Legal, Social, Newsletter         │
└─────────────────────────────────────────────┘
```

**Componentes**:
- `Navbar` (sticky, transparent → solid on scroll)
- `HeroSection`
- `SocialProofLogos`
- `FeaturesGrid`
- `HowItWorks`
- `Testimonials`
- `PricingPreview`
- `FAQ`
- `CTAFinal`
- `Footer`

**SEO**:
```html
<title>Nexora — Business Operating System AI-First</title>
<meta name="description" content="Gestiona tu negocio con IA. Nova ejecuta ventas, facturación, inventario y más. Gratis para empezar.">
<meta property="og:title" content="Nexora — AI-First Business OS">
<meta property="og:description" content="Nova, tu asistente de IA, ejecuta acciones reales en tu negocio.">
<meta property="og:image" content="/og-image.png">
```

**Responsive**:
- Desktop (>=1024px): Grid de features 3 columnas, testimonios carousel
- Tablet (768-1023px): Grid 2 columnas
- Mobile (<768px): Stack vertical, hero simplificado, CTA sticky bottom

---

### 3.2 Pricing

**Qué ve el usuario**:
- Título: "Planes para cada etapa de tu negocio"
- Toggle: Mensual / Anual (20% descuento)
- 3 cards de pricing:
  - **Starter** (Gratis): 1 usuario, 1 organización, funcionalidades básicas
  - **Business** ($29/mes): 10 usuarios, organizaciones ilimitadas, Nova completo, soporte prioritario
  - **Enterprise** ($99/mes): Usuarios ilimitados, API pública, soporte dedicado, SLA 99.95%
- Feature comparison table
- CTA por plan

**Pricing data**:
```typescript
const plans = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    features: [
      '1 usuario',
      '1 organización',
      'CRM básico',
      'Facturación básica',
      'Nova (50 acciones/mes)',
      'Soporte comunitario'
    ],
    cta: 'Comenzar gratis',
    highlighted: false
  },
  {
    name: 'Business',
    price: { monthly: 29, annual: 23 },
    features: [
      '10 usuarios',
      'Organizaciones ilimitadas',
      'Todos los módulos',
      'Nova ilimitado',
      'Automatizaciones',
      'Soporte prioritario',
      'API pública'
    ],
    cta: 'Empezar prueba gratis',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: { monthly: 99, annual: 79 },
    features: [
      'Usuarios ilimitados',
      'Todo en Business',
      'SSO / SAML',
      'SLA 99.95%',
      'Soporte dedicado',
      'On-premise option',
      'Custom integrations'
    ],
    cta: 'Contactar ventas',
    highlighted: false
  }
];
```

---

### 3.3 Features

**Qué ve el usuario**:
- Hero: "Todo lo que necesitas, potenciado por IA"
- Tabs: Core, CRM, Ventas, Inventario, Nova, Automatizaciones
- Cada tab muestra features detalladas con screenshots/diagramas

---

### 3.4 Blog / Docs

- Blog: Artículos de SEO, casos de uso, updates
- Docs: VitePress (ya configurado en `apps/docs`)

---

## 4. Backend

### 4.1 Newsletter Subscription

**Use Case**: SubscribeNewsletterUseCase
```
1. Validar email
2. Guardar en newsletter_subscribers
3. Enviar email de bienvenida
4. Retornar success
```

**API**:
```http
POST /api/v1/newsletter/subscribe
{
  "email": "visitor@example.com"
}

Response 201:
{
  "data": { "subscribed": true }
}
```

### 4.2 Contact Form

**Use Case**: SubmitContactFormUseCase
```
1. Validar campos
2. Guardar en contact_submissions
3. Enviar email al equipo de ventas
4. Retornar success
```

**API**:
```http
POST /api/v1/contact
{
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "company": "Empresa S.A.S",
  "message": "Quiero información sobre Enterprise"
}

Response 201:
{
  "data": { "submitted": true }
}
```

---

## 5. Base de Datos

### Tablas nuevas (Phase 1 mínimo)

```sql
-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Eventos

```
NewsletterSubscribed {
  email: string
  timestamp: DateTime
}

ContactFormSubmitted {
  name: string
  email: string
  company: string
  timestamp: DateTime
}
```

---

## 7. Permisos

Público (no requiere autenticación).

---

## 8. Validaciones

### Newsletter
- `email`: obligatorio, formato email, único

### Contact Form
- `name`: obligatorio, 1-255 chars
- `email`: obligatorio, formato email
- `company`: opcional, 0-255 chars
- `message`: obligatorio, 10-5000 chars

---

## 9. Nova Tools

Ninguna (landing es pública).

---

## 10. Notificaciones

### Email de bienvenida (newsletter)
```
Template: newsletter_welcome
Channel: email
Subject: "Bienvenido a Nexora"
Body: "Gracias por suscribirte. Te mantendremos informado sobre novedades."
```

### Notificación al equipo (contact form)
```
Template: contact_form_submission
Channel: email (interno)
Subject: "Nuevo contacto desde la web"
Body: "{name} de {company} quiere información: {message}"
```

---

## 11. Auditoría

Ninguna (acciones públicas no se auditan).

---

## 12. Criterios de Aceptación

### US-LANDING-01: Homepage carga correctamente
```
Given un visitante navega a /
When la página carga completamente
Then ve el hero con headline "Business Operating System AI-First"
And ve al menos 6 features
And ve al menos 3 testimonios
And ve el CTA "Comenzar gratis"
```

### US-LANDING-02: Registro desde landing
```
Given un visitante hace click en "Comenzar gratis"
When es redirigido a /register
Then ve el formulario de registro
And puede completar el registro exitosamente
```

### US-LANDING-03: Newsletter subscription
```
Given un visitante ingresa su email en el newsletter
When hace click en "Suscribir"
Then recibe confirmación
And recibe email de bienvenida
```

### US-LANDING-04: Pricing responsive
```
Given un visitante navega a /pricing en mobile
When la página carga
Then ve las cards de pricing apiladas verticalmente
And puede hacer toggle mensual/anual
And los CTAs son visibles y clickeables
```

---

## 13. Dependencias con Otros Módulos

| Módulo | Relación |
|--------|----------|
| Auth (0004) | Registro desde landing |
| Onboarding (0005) | Post-registro |
| Dashboard (0007) | Post-onboarding |

---

## 14. Checklist de Implementación

- [ ] Navbar responsive (sticky, mobile hamburger)
- [ ] Hero section con CTA
- [ ] Social proof logos (placeholder)
- [ ] Features grid (6+ features)
- [ ] How it works (3 pasos)
- [ ] Testimonials (3+)
- [ ] Pricing cards con toggle
- [ ] Feature comparison table
- [ ] FAQ accordion
- [ ] CTA final
- [ ] Footer con links legales
- [ ] SEO meta tags
- [ ] Open Graph tags
- [ ] Newsletter subscription
- [ ] Contact form
- [ ] Analytics events (page_view, CTA_click, signup_start)
- [ ] A/B testing framework
