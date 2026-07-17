/**
 * Registro central de contenido de ayuda, tutoriales y guias de la plataforma.
 * Fuente unica y estatica. Sin backend. Todo el texto en espanol.
 */

export interface GuideStep {
  text: string;
  url?: string;
  urlLabel?: string;
}

export interface ProviderGuide {
  id: string;
  name: string;
  summary: string;
  docsUrl?: string;
  fields: string[];
  steps: GuideStep[];
}

export interface ModuleHelp {
  title: string;
  whatIs: string;
  whatFor: string;
  howToStart: string[];
  tips?: string[];
  relatedLinks?: { label: string; href: string }[];
}

export interface FieldTip {
  label: string;
  text: string;
}

export interface TourStep {
  element?: string;
  title: string;
  description: string;
}

/* -------------------------------------------------------------------------- */
/*  Tutoriales de credenciales / API keys por proveedor                        */
/* -------------------------------------------------------------------------- */

export const providerGuides: Record<string, ProviderGuide> = {
  resend: {
    id: 'resend',
    name: 'Resend (Email)',
    summary: 'Servicio para enviar correos transaccionales y campanas de email.',
    docsUrl: 'https://resend.com/docs',
    fields: ['apiKey'],
    steps: [
      { text: 'Crea una cuenta gratuita en Resend.', url: 'https://resend.com/signup', urlLabel: 'Registrarse en Resend' },
      { text: 'Verifica tu dominio en Domains para poder enviar correos con tu propia direccion (opcional pero recomendado).', url: 'https://resend.com/domains', urlLabel: 'Configurar dominio' },
      { text: 'Ve a la seccion API Keys y haz clic en "Create API Key".', url: 'https://resend.com/api-keys', urlLabel: 'Abrir API Keys' },
      { text: 'Ponle un nombre (ej. "Nyvora"), selecciona permiso "Sending access" y crea la clave.' },
      { text: 'Copia la clave que empieza con "re_" (solo se muestra una vez) y pegala en el campo API Key.' },
    ],
  },
  'meta-whatsapp': {
    id: 'meta-whatsapp',
    name: 'WhatsApp Cloud API (Meta)',
    summary: 'API oficial de Meta para enviar mensajes de WhatsApp Business.',
    docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    fields: ['phoneNumberId', 'accessToken', 'businessAccountId'],
    steps: [
      { text: 'Entra a Meta for Developers e inicia sesion con tu cuenta de Facebook.', url: 'https://developers.facebook.com', urlLabel: 'Abrir Meta for Developers' },
      { text: 'Crea una App de tipo "Business" y agregale el producto "WhatsApp".', url: 'https://developers.facebook.com/apps', urlLabel: 'Mis Apps' },
      { text: 'En WhatsApp > API Setup copia el "Phone number ID" y pegalo en Phone Number ID.' },
      { text: 'Copia tambien el "WhatsApp Business Account ID" y pegalo en Business Account ID.' },
      { text: 'Genera un Token de acceso permanente en Business Settings > Users > System Users (permisos whatsapp_business_messaging).', url: 'https://business.facebook.com/settings', urlLabel: 'Business Settings' },
      { text: 'Pega el token en Access Token. Nunca lo compartas publicamente.' },
    ],
  },
  twilio: {
    id: 'twilio',
    name: 'Twilio (SMS)',
    summary: 'Envio de SMS y llamadas a nivel global.',
    docsUrl: 'https://www.twilio.com/docs/sms',
    fields: ['accountSid', 'authToken', 'fromNumber'],
    steps: [
      { text: 'Crea una cuenta en Twilio.', url: 'https://www.twilio.com/try-twilio', urlLabel: 'Registrarse en Twilio' },
      { text: 'En la consola, en el panel principal, copia tu "Account SID" y pegalo en Account SID.', url: 'https://console.twilio.com', urlLabel: 'Abrir consola Twilio' },
      { text: 'Copia tu "Auth Token" (haz clic en "Show") y pegalo en Auth Token.' },
      { text: 'Compra o usa un numero de telefono en Phone Numbers > Manage > Active numbers.', url: 'https://console.twilio.com/us1/develop/phone-numbers/manage/incoming', urlLabel: 'Numeros de telefono' },
      { text: 'Pega tu numero (formato +1XXXXXXXXXX) en From Number.' },
    ],
  },
  'twilio-whatsapp': {
    id: 'twilio-whatsapp',
    name: 'Twilio WhatsApp',
    summary: 'Envio de mensajes de WhatsApp a traves de Twilio.',
    docsUrl: 'https://www.twilio.com/docs/whatsapp',
    fields: ['accountSid', 'authToken', 'whatsappFrom'],
    steps: [
      { text: 'Usa tu Account SID y Auth Token de Twilio (los mismos que para SMS).', url: 'https://console.twilio.com', urlLabel: 'Consola Twilio' },
      { text: 'Activa el sandbox de WhatsApp o solicita un numero de WhatsApp Business aprobado.', url: 'https://console.twilio.com/us1/develop/sms/whatsapp/senders', urlLabel: 'WhatsApp Senders' },
      { text: 'Copia el numero habilitado para WhatsApp (formato whatsapp:+14155238886) y pegalo en WhatsApp From.' },
    ],
  },
  slack: {
    id: 'slack',
    name: 'Slack (Notificaciones)',
    summary: 'Recibe notificaciones de Nyvora en tus canales de Slack.',
    docsUrl: 'https://api.slack.com/messaging/webhooks',
    fields: ['webhookUrl'],
    steps: [
      { text: 'Ve a Slack API y crea una nueva App ("From scratch").', url: 'https://api.slack.com/apps', urlLabel: 'Abrir Slack Apps' },
      { text: 'Elige el workspace donde quieres recibir notificaciones.' },
      { text: 'Activa "Incoming Webhooks" y ponlo en On.' },
      { text: 'Haz clic en "Add New Webhook to Workspace" y selecciona el canal destino.' },
      { text: 'Copia la URL del webhook (empieza con https://hooks.slack.com/...) y pegala en Webhook URL.' },
    ],
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (Nova IA)',
    summary: 'Modelo de lenguaje que potencia a Nova, tu asistente de IA.',
    docsUrl: 'https://platform.openai.com/docs',
    fields: ['apiKey'],
    steps: [
      { text: 'Inicia sesion en la plataforma de OpenAI.', url: 'https://platform.openai.com', urlLabel: 'Abrir OpenAI Platform' },
      { text: 'Ve a API Keys y haz clic en "Create new secret key".', url: 'https://platform.openai.com/api-keys', urlLabel: 'Abrir API Keys' },
      { text: 'Copia la clave que empieza con "sk-" (solo se muestra una vez) y pegala en API Key.' },
      { text: 'Asegurate de tener creditos o metodo de pago configurado en Billing.', url: 'https://platform.openai.com/account/billing', urlLabel: 'Billing' },
    ],
  },
  sendgrid: {
    id: 'sendgrid',
    name: 'SendGrid (Email)',
    summary: 'Envio de emails transaccionales y campanas.',
    docsUrl: 'https://docs.sendgrid.com',
    fields: ['apiKey', 'fromEmail'],
    steps: [
      { text: 'Crea una cuenta en SendGrid.', url: 'https://signup.sendgrid.com', urlLabel: 'Registrarse en SendGrid' },
      { text: 'Verifica un remitente en Settings > Sender Authentication.', url: 'https://app.sendgrid.com/settings/sender_auth', urlLabel: 'Sender Authentication' },
      { text: 'Ve a Settings > API Keys y crea una clave con permiso "Full Access" o "Mail Send".', url: 'https://app.sendgrid.com/settings/api_keys', urlLabel: 'API Keys' },
      { text: 'Copia la clave (empieza con "SG.") y pegala en API Key.' },
      { text: 'Escribe tu email remitente verificado en From Email.' },
    ],
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe (Pagos)',
    summary: 'Acepta pagos en linea, facturacion y cobros.',
    docsUrl: 'https://stripe.com/docs/keys',
    fields: ['secretKey', 'publishableKey'],
    steps: [
      { text: 'Crea o inicia sesion en tu cuenta de Stripe.', url: 'https://dashboard.stripe.com/register', urlLabel: 'Abrir Stripe' },
      { text: 'Ve a Developers > API keys.', url: 'https://dashboard.stripe.com/apikeys', urlLabel: 'API keys' },
      { text: 'Copia la "Publishable key" (pk_...) y pegala en Publishable Key.' },
      { text: 'Revela y copia la "Secret key" (sk_...) y pegala en Secret Key. No la compartas.' },
      { text: 'Usa las claves de test (pk_test/sk_test) mientras pruebas y las live cuando pases a produccion.' },
    ],
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot CRM',
    summary: 'Sincroniza contactos y deals con HubSpot.',
    docsUrl: 'https://developers.hubspot.com/docs/api/private-apps',
    fields: ['accessToken'],
    steps: [
      { text: 'Entra a tu cuenta de HubSpot y ve a Settings.', url: 'https://app.hubspot.com', urlLabel: 'Abrir HubSpot' },
      { text: 'En Integrations > Private Apps, crea una nueva Private App.' },
      { text: 'Asigna los scopes de crm.objects.contacts (read/write) y crm.objects.deals.' },
      { text: 'Copia el Access Token generado y pegalo en Access Token.' },
    ],
  },
  webhook: {
    id: 'webhook',
    name: 'Webhook generico',
    summary: 'Envia eventos de Nyvora a cualquier URL HTTP externa.',
    fields: ['webhookUrl', 'secret'],
    steps: [
      { text: 'Obten la URL destino del servicio que quieres notificar (tu backend, Zapier, Make, etc.).' },
      { text: 'Pega esa URL en Webhook URL. Debe aceptar peticiones POST con cuerpo JSON.' },
      { text: 'Opcional: define un Secret compartido para validar la firma de las peticiones.' },
    ],
  },
  google: {
    id: 'google',
    name: 'Google (Calendar / Sheets)',
    summary: 'Conexion con servicios de Google mediante OAuth.',
    docsUrl: 'https://console.cloud.google.com/apis/credentials',
    fields: ['clientId', 'clientSecret'],
    steps: [
      { text: 'Entra a Google Cloud Console y crea un proyecto.', url: 'https://console.cloud.google.com', urlLabel: 'Abrir Google Cloud' },
      { text: 'Habilita las APIs que necesites (Calendar API, Google Sheets API).', url: 'https://console.cloud.google.com/apis/library', urlLabel: 'Biblioteca de APIs' },
      { text: 'Ve a APIs y servicios > Credenciales y crea un "ID de cliente de OAuth".', url: 'https://console.cloud.google.com/apis/credentials', urlLabel: 'Credenciales' },
      { text: 'Copia el Client ID y el Client Secret y pegalos en los campos correspondientes.' },
    ],
  },
  trello: {
    id: 'trello',
    name: 'Trello',
    summary: 'Crea tarjetas en Trello automaticamente desde tareas de Nyvora.',
    docsUrl: 'https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/',
    fields: ['apiKey', 'token'],
    steps: [
      { text: 'Inicia sesion en Trello con la cuenta donde estan tus tableros.', url: 'https://trello.com/login', urlLabel: 'Abrir Trello' },
      { text: 'Crea un Power-Up en el panel de administracion para obtener tu API Key.', url: 'https://trello.com/power-ups/admin', urlLabel: 'Power-Ups Admin' },
      { text: 'Copia la "API Key" generada y pegala en API Key.' },
      { text: 'Genera un Token haciendo clic en el enlace "Token" junto a tu API Key y autoriza el acceso.' },
      { text: 'Copia el Token generado y pegalo en Token. No lo compartas publicamente.' },
    ],
  },
  jira: {
    id: 'jira',
    name: 'Jira (Atlassian)',
    summary: 'Crea y gestiona issues de Jira desde tareas y proyectos de Nyvora.',
    docsUrl: 'https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/',
    fields: ['siteUrl', 'email', 'apiToken'],
    steps: [
      { text: 'Copia la URL de tu sitio de Jira (ej. https://tuempresa.atlassian.net) y pegala en Site URL.' },
      { text: 'Escribe el email de la cuenta de Atlassian que usaras en Email.' },
      { text: 'Crea un API token en Atlassian Account > Security.', url: 'https://id.atlassian.com/manage-profile/security/api-tokens', urlLabel: 'Crear API token' },
      { text: 'Copia el token generado (solo se muestra una vez) y pegalo en API Token.' },
    ],
  },
  dropbox: {
    id: 'dropbox',
    name: 'Dropbox',
    summary: 'Almacena y sincroniza archivos adjuntos en Dropbox.',
    docsUrl: 'https://www.dropbox.com/developers/documentation',
    fields: ['accessToken'],
    steps: [
      { text: 'Entra a la consola de apps de Dropbox e inicia sesion.', url: 'https://www.dropbox.com/developers/apps', urlLabel: 'Dropbox App Console' },
      { text: 'Crea una app: elige "Scoped access" y el tipo de acceso (App folder o Full Dropbox).' },
      { text: 'En la pestana Permissions, activa los scopes files.content.write y files.content.read, y guarda.' },
      { text: 'En la pestana Settings, en "Generated access token", haz clic en Generate.' },
      { text: 'Copia el token generado y pegalo en Access Token. No lo compartas publicamente.' },
    ],
  },
  zapier: {
    id: 'zapier',
    name: 'Zapier',
    summary: 'Conecta Nyvora con miles de aplicaciones sin escribir codigo.',
    docsUrl: 'https://help.zapier.com/hc/en-us/articles/8496288690317-Trigger-Zaps-from-webhooks',
    fields: ['webhookUrl'],
    steps: [
      { text: 'Inicia sesion en Zapier y crea un nuevo Zap.', url: 'https://zapier.com/app/zaps', urlLabel: 'Abrir Zapier' },
      { text: 'Como disparador (Trigger) elige "Webhooks by Zapier" y el evento "Catch Hook".' },
      { text: 'Zapier te dara una "Custom Webhook URL". Copiala.' },
      { text: 'Pega esa URL en Webhook URL. Nyvora enviara los eventos por POST a esa direccion.' },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Metadatos de campos de credenciales (etiqueta, placeholder, si es secreto) */
/* -------------------------------------------------------------------------- */

export interface FieldMeta {
  label: string;
  placeholder?: string;
  secret?: boolean;
}

export const providerFieldMeta: Record<string, FieldMeta> = {
  apiKey: { label: 'API Key', placeholder: 'Pega tu API key', secret: true },
  accessToken: { label: 'Access Token', placeholder: 'Pega tu access token', secret: true },
  authToken: { label: 'Auth Token', placeholder: 'Pega tu auth token', secret: true },
  secretKey: { label: 'Secret Key', placeholder: 'sk_...', secret: true },
  publishableKey: { label: 'Publishable Key', placeholder: 'pk_...' },
  apiToken: { label: 'API Token', placeholder: 'Pega tu API token', secret: true },
  token: { label: 'Token', placeholder: 'Pega tu token', secret: true },
  secret: { label: 'Secret (opcional)', placeholder: 'Secreto compartido', secret: true },
  phoneNumberId: { label: 'Phone Number ID', placeholder: 'ej. 123456789012345' },
  businessAccountId: { label: 'Business Account ID', placeholder: 'ej. 987654321098765' },
  accountSid: { label: 'Account SID', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  fromNumber: { label: 'From Number', placeholder: '+1XXXXXXXXXX' },
  whatsappFrom: { label: 'WhatsApp From', placeholder: 'whatsapp:+14155238886' },
  webhookUrl: { label: 'Webhook URL', placeholder: 'https://...' },
  fromEmail: { label: 'From Email', placeholder: 'remitente@tudominio.com' },
  clientId: { label: 'Client ID', placeholder: 'xxxx.apps.googleusercontent.com' },
  clientSecret: { label: 'Client Secret', placeholder: 'Pega tu client secret', secret: true },
  siteUrl: { label: 'Site URL', placeholder: 'https://tuempresa.atlassian.net' },
  email: { label: 'Email', placeholder: 'cuenta@tudominio.com' },
};

/* -------------------------------------------------------------------------- */
/*  Ayuda contextual por modulo (clave = primer segmento de la ruta)           */
/* -------------------------------------------------------------------------- */

export const moduleHelp: Record<string, ModuleHelp> = {
  home: {
    title: 'Inicio',
    whatIs: 'Tu panel principal con un resumen del estado de tu negocio.',
    whatFor: 'Ver de un vistazo tus metricas clave, actividad reciente y accesos rapidos a cada modulo.',
    howToStart: [
      'Revisa las tarjetas de resumen para conocer el estado general.',
      'Usa el buscador superior para saltar a cualquier registro.',
      'Abre Nova (asistente IA) para pedir acciones en lenguaje natural.',
    ],
    tips: ['Puedes relanzar el recorrido guiado desde el boton de ayuda "?" en la barra superior.'],
  },
  crm: {
    title: 'CRM',
    whatIs: 'Modulo para gestionar tus relaciones comerciales: contactos, empresas, leads y pipelines.',
    whatFor: 'Centralizar a tus clientes potenciales y actuales, dar seguimiento a oportunidades y no perder ninguna venta.',
    howToStart: [
      'Crea tus primeros Contactos o importalos.',
      'Agrupa contactos en Empresas cuando pertenezcan a la misma organizacion.',
      'Registra Leads y muevelos por las etapas del Pipeline hasta cerrarlos.',
    ],
    tips: [
      'Usa etiquetas (tags) en los contactos para segmentar audiencias de campanas.',
      'El campo "tipo" (lead/cliente) define a quien llegan las campanas de marketing.',
    ],
    relatedLinks: [
      { label: 'Contactos', href: '/crm/contacts' },
      { label: 'Empresas', href: '/crm/companies' },
      { label: 'Leads', href: '/crm/leads' },
      { label: 'Pipelines', href: '/crm/pipelines' },
    ],
  },
  sales: {
    title: 'Ventas',
    whatIs: 'Gestion del ciclo de venta: cotizaciones, ordenes, facturas y pagos.',
    whatFor: 'Convertir oportunidades en ingresos con documentos formales y seguimiento de cobros.',
    howToStart: [
      'Crea una Cotizacion para un cliente.',
      'Conviertela en Orden cuando el cliente acepte.',
      'Genera la Factura y registra el Pago cuando se cobre.',
    ],
    tips: ['Los productos de tus cotizaciones se descuentan del Inventario al facturar.'],
    relatedLinks: [
      { label: 'Cotizaciones', href: '/sales/quotations' },
      { label: 'Ordenes', href: '/sales/orders' },
      { label: 'Facturas', href: '/sales/invoices' },
      { label: 'Pagos', href: '/sales/payments' },
    ],
  },
  inventory: {
    title: 'Inventario',
    whatIs: 'Control de productos, existencias, almacenes y categorias.',
    whatFor: 'Saber que tienes, cuanto y donde, evitando quiebres de stock o sobreinventario.',
    howToStart: [
      'Crea tus Almacenes.',
      'Registra Productos y asignalos a categorias.',
      'Ajusta el Stock inicial de cada producto por almacen.',
    ],
    tips: ['Configura niveles minimos para recibir alertas de reposicion.'],
    relatedLinks: [
      { label: 'Productos', href: '/inventory/products' },
      { label: 'Almacenes', href: '/inventory/warehouses' },
      { label: 'Stock', href: '/inventory/stock' },
      { label: 'Categorias', href: '/inventory/categories' },
    ],
  },
  finance: {
    title: 'Finanzas',
    whatIs: 'Cuentas, transacciones, categorias contables y reportes financieros.',
    whatFor: 'Llevar el control del dinero: ingresos, egresos, saldos y salud financiera.',
    howToStart: [
      'Crea tus Cuentas (banco, caja, etc.).',
      'Registra Transacciones de ingreso y egreso categorizadas.',
      'Consulta los Reportes para analizar tu flujo de caja.',
    ],
    relatedLinks: [
      { label: 'Cuentas', href: '/finance/accounts' },
      { label: 'Transacciones', href: '/finance/transactions' },
      { label: 'Categorias', href: '/finance/categories' },
      { label: 'Reportes', href: '/finance/reports' },
    ],
  },
  hr: {
    title: 'Recursos Humanos',
    whatIs: 'Gestion de empleados, cargos, ausencias y evaluaciones.',
    whatFor: 'Administrar a tu equipo: datos, estructura organizacional y desempeno.',
    howToStart: [
      'Define los Cargos de tu organizacion.',
      'Registra a tus Empleados y asignales un cargo.',
      'Gestiona Ausencias y Evaluaciones de desempeno.',
    ],
    tips: ['Los empleados con telefono/email pueden ser audiencia de comunicados internos.'],
    relatedLinks: [
      { label: 'Empleados', href: '/hr/employees' },
      { label: 'Cargos', href: '/hr/positions' },
      { label: 'Ausencias', href: '/hr/absences' },
      { label: 'Evaluaciones', href: '/hr/evaluations' },
    ],
  },
  automations: {
    title: 'Automatizaciones',
    whatIs: 'Flujos de trabajo que ejecutan acciones automaticamente cuando ocurre un evento.',
    whatFor: 'Ahorrar tiempo eliminando tareas repetitivas: notificaciones, seguimientos, actualizaciones.',
    howToStart: [
      'Crea una automatizacion y elige un disparador (ej. "nuevo lead").',
      'Anade las acciones a ejecutar (ej. enviar email, crear tarea).',
      'Activala y monitorea sus ejecuciones.',
    ],
    tips: ['Combina automatizaciones con integraciones (Slack, Email) para notificar a tu equipo.'],
  },
  nova: {
    title: 'Nova (Asistente IA)',
    whatIs: 'Tu asistente de inteligencia artificial que entiende lenguaje natural.',
    whatFor: 'Pedir acciones y consultas sin navegar por menus: crear registros, lanzar campanas, obtener reportes.',
    howToStart: [
      'Escribe lo que necesitas, por ejemplo: "crea un contacto llamado Juan".',
      'Pide reportes: "cuantas ventas tuve este mes".',
      'Lanza campanas: "envia un WhatsApp a todos mis clientes con la promo".',
    ],
    tips: [
      'Nova respeta tus permisos: solo hara lo que tu rol permite.',
      'Se especifico con la audiencia: "clientes", "leads" o "empleados".',
    ],
  },
  marketplace: {
    title: 'Marketplace',
    whatIs: 'Catalogo de aplicaciones e integraciones para conectar Nyvora con otras herramientas.',
    whatFor: 'Extender la plataforma: pagos, mensajeria, notificaciones, almacenamiento y mas.',
    howToStart: [
      'Explora el catalogo y busca la app que necesitas.',
      'Haz clic en "Instalar" para agregarla.',
      'Abre "Configurar" y sigue el tutorial para conectar tus credenciales.',
    ],
    tips: ['Cada app incluye una guia paso a paso de como obtener sus claves de acceso.'],
  },
  integrations: {
    title: 'Integraciones',
    whatIs: 'Centro de credenciales de tu organizacion para servicios externos (Email, SMS, WhatsApp, etc.).',
    whatFor: 'Guardar de forma segura y por organizacion las claves que Nyvora usa para enviar comunicaciones.',
    howToStart: [
      'Elige el proveedor que quieres conectar.',
      'Sigue el tutorial "Como obtener esta clave" incluido en cada tarjeta.',
      'Pega tus credenciales y guarda. Usa "Probar conexion" para verificar.',
    ],
    tips: ['Tus claves se guardan cifradas y solo aplican a tu organizacion.'],
  },
  campaigns: {
    title: 'Campanas',
    whatIs: 'Envios masivos de mensajes por Email, SMS o WhatsApp a una audiencia.',
    whatFor: 'Comunicarte con clientes, leads o empleados: promociones, avisos y seguimientos.',
    howToStart: [
      'Conecta primero un proveedor en Integraciones.',
      'Crea una campana, elige canal y audiencia (clientes, leads, empleados).',
      'Escribe el mensaje, define el ritmo de envio y lanza.',
    ],
    tips: ['Configura un retraso entre mensajes para evitar bloqueos por spam.'],
  },
  settings: {
    title: 'Configuracion',
    whatIs: 'Ajustes de tu organizacion: usuarios, roles, sucursales, departamentos e integraciones.',
    whatFor: 'Administrar quien accede, con que permisos y como esta estructurada tu empresa.',
    howToStart: [
      'Invita usuarios y asignales un rol en Usuarios.',
      'Define Sucursales y Departamentos.',
      'Conecta servicios externos en Integraciones.',
    ],
    relatedLinks: [
      { label: 'Usuarios', href: '/settings/users' },
      { label: 'Organizacion', href: '/settings/organization' },
      { label: 'Sucursales', href: '/settings/branches' },
      { label: 'Departamentos', href: '/settings/departments' },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Tips inline por campo/seccion, agrupados por modulo                         */
/* -------------------------------------------------------------------------- */

export const fieldTips: Record<string, Record<string, string>> = {
  crm: {
    tipo: 'Define si el contacto es un "lead" (potencial) o "cliente". Determina a quien llegan las campanas.',
    tags: 'Etiquetas para segmentar. Ej: "vip", "mayorista". Utiles para filtrar audiencias.',
    pipeline: 'Flujo de etapas por las que avanza una oportunidad hasta cerrarse.',
  },
  sales: {
    quotation: 'Documento con precios propuesto al cliente antes de vender.',
    order: 'Confirmacion de la venta una vez el cliente acepta la cotizacion.',
    invoice: 'Documento fiscal que formaliza el cobro.',
  },
  campaigns: {
    audience: 'A quien se envia: clientes, leads o empleados. Puedes filtrar por etiquetas.',
    delaySeconds: 'Segundos de espera entre cada mensaje para evitar bloqueos por spam.',
    channel: 'Medio de envio: Email, SMS o WhatsApp.',
    whatsappMode: 'Cloud API (oficial de Meta) o WhatsApp Web (escaneando un QR).',
  },
};

/* -------------------------------------------------------------------------- */
/*  Guias post-instalacion por app del marketplace                             */
/* -------------------------------------------------------------------------- */

export const marketplaceAppGuides: Record<string, { provider?: string; howToUse: string[] }> = {
  whatsapp: {
    provider: 'meta-whatsapp',
    howToUse: [
      'Configura tus credenciales de WhatsApp Cloud API.',
      'Usala en Campanas para enviar mensajes masivos, o pide a Nova "envia un WhatsApp a mis clientes".',
    ],
  },
  twilio: {
    provider: 'twilio',
    howToUse: [
      'Ingresa tu Account SID, Auth Token y numero remitente.',
      'Envia SMS desde Campanas o mediante automatizaciones.',
    ],
  },
  slack: {
    provider: 'slack',
    howToUse: [
      'Pega la URL del webhook de tu canal.',
      'Recibiras notificaciones de eventos de Nyvora en ese canal.',
    ],
  },
  sendgrid: {
    provider: 'sendgrid',
    howToUse: [
      'Configura tu API Key y email remitente verificado.',
      'Envia campanas de email desde el modulo Campanas.',
    ],
  },
  stripe: {
    provider: 'stripe',
    howToUse: [
      'Ingresa tus claves publicable y secreta.',
      'Podras cobrar facturas en linea desde el modulo de Ventas.',
    ],
  },
  hubspot: {
    provider: 'hubspot',
    howToUse: [
      'Conecta tu Access Token de una Private App de HubSpot.',
      'Tus contactos se sincronizaran entre Nyvora y HubSpot.',
    ],
  },
  'google-calendar': {
    provider: 'google',
    howToUse: [
      'Conecta tu cuenta de Google.',
      'Las reuniones creadas en Nyvora se reflejaran en tu Google Calendar.',
    ],
  },
  'google-sheets': {
    provider: 'google',
    howToUse: [
      'Conecta tu cuenta de Google.',
      'Exporta datos de Nyvora a una hoja de calculo en tiempo real.',
    ],
  },
  zapier: {
    provider: 'zapier',
    howToUse: [
      'Usa la URL de webhook que te da Zapier al crear un Zap con disparador "Webhooks by Zapier".',
      'Conecta Nyvora con miles de apps sin escribir codigo.',
    ],
  },
  trello: {
    provider: 'trello',
    howToUse: [
      'Autoriza el acceso a tu cuenta de Trello.',
      'Las tareas de Nyvora podran crear tarjetas automaticamente.',
    ],
  },
  jira: {
    provider: 'jira',
    howToUse: [
      'Ingresa la URL de tu instancia y un API token de Atlassian.',
      'Gestiona issues de Jira desde tus proyectos.',
    ],
  },
  dropbox: {
    provider: 'dropbox',
    howToUse: [
      'Autoriza el acceso a tu cuenta de Dropbox.',
      'Los archivos adjuntos se sincronizaran automaticamente.',
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Recorrido guiado inicial (driver.js)                                        */
/* -------------------------------------------------------------------------- */

export const productTour: TourStep[] = [
  {
    title: 'Bienvenido a Nyvora',
    description:
      'Tu plataforma todo-en-uno para gestionar tu negocio: clientes, ventas, inventario, finanzas, equipo y mas. Te mostramos lo esencial en 1 minuto.',
  },
  {
    element: '[data-tour="sidebar"]',
    title: 'Navegacion principal',
    description:
      'Desde aqui accedes a todos los modulos: CRM, Ventas, Inventario, Finanzas, RRHH, Automatizaciones y mas.',
  },
  {
    element: '[data-tour="nav-crm"]',
    title: 'CRM: tus clientes',
    description: 'Gestiona contactos, empresas, leads y oportunidades de venta.',
  },
  {
    element: '[data-tour="nav-sales"]',
    title: 'Ventas',
    description: 'Crea cotizaciones, ordenes, facturas y registra pagos.',
  },
  {
    element: '[data-tour="nav-marketplace"]',
    title: 'Marketplace e integraciones',
    description:
      'Conecta Nyvora con WhatsApp, email, pagos y mas. Cada integracion incluye un tutorial de como obtener sus claves.',
  },
  {
    element: '[data-tour="nova"]',
    title: 'Nova, tu asistente IA',
    description:
      'Pide acciones en lenguaje natural: "crea un contacto", "envia una campana de WhatsApp a mis clientes" o "dame el reporte de ventas".',
  },
  {
    element: '[data-tour="help-button"]',
    title: 'Ayuda siempre a mano',
    description:
      'En cada pantalla, este boton "?" te explica que hace la seccion y como usarla. Aqui tambien puedes relanzar este recorrido.',
  },
  {
    element: '[data-tour="search"]',
    title: 'Busqueda rapida',
    description: 'Encuentra cualquier registro al instante desde el buscador superior.',
  },
];

export function getModuleHelpKey(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)[0] || 'home';
  return moduleHelp[seg] ? seg : 'home';
}
