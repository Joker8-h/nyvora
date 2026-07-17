// ============================================
// Nexora CONSTANTS
// ============================================

// ============================================
// APP CONSTANTS
// ============================================

export const APP_NAME = 'Nexora';
export const APP_DESCRIPTION = 'Business Operating System AI-First';
export const APP_VERSION = '0.0.1';
export const APP_URL = process.env.APP_URL || 'http://localhost:3000';
export const API_URL = process.env.API_URL || 'http://localhost:3001';

// ============================================
// AUTH CONSTANTS
// ============================================

export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;
export const MAX_SESSIONS = 5;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;
export const PASSWORD_RESET_EXPIRY_HOURS = 24;
export const EMAIL_VERIFICATION_EXPIRY_HOURS = 48;

// ============================================
// CURRENCY CONSTANTS
// ============================================

export const DEFAULT_CURRENCY = 'COP';
export const SUPPORTED_CURRENCIES = [
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', locale: 'es-CO' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', locale: 'es-MX' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', locale: 'es-AR' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', locale: 'es-CL' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', locale: 'es-PE' },
];

// ============================================
// TIMEZONE CONSTANTS
// ============================================

export const DEFAULT_TIMEZONE = 'America/Bogota';
export const SUPPORTED_TIMEZONES = [
  { value: 'America/Bogota', label: 'Colombia (COT)', offset: 'UTC-5' },
  { value: 'America/Mexico_City', label: 'México (CST)', offset: 'UTC-6' },
  { value: 'America/New_York', label: 'USA Este (EST)', offset: 'UTC-5' },
  { value: 'America/Los_Angeles', label: 'USA Oeste (PST)', offset: 'UTC-8' },
  { value: 'Europe/Madrid', label: 'España (CET)', offset: 'UTC+1' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (ART)', offset: 'UTC-3' },
  { value: 'America/Santiago', label: 'Chile (CLT)', offset: 'UTC-3' },
  { value: 'America/Lima', label: 'Perú (PET)', offset: 'UTC-5' },
  { value: 'UTC', label: 'UTC', offset: 'UTC+0' },
];

// ============================================
// LANGUAGE CONSTANTS
// ============================================

export const DEFAULT_LOCALE = 'es';
export const SUPPORTED_LOCALES = [
  { code: 'es', name: 'Español', flag: '🇨🇴' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

// ============================================
// USER STATUS CONSTANTS
// ============================================

export const USER_STATUSES = {
  ACTIVE: { label: 'Activo', color: 'success' },
  INACTIVE: { label: 'Inactivo', color: 'muted' },
  SUSPENDED: { label: 'Suspendido', color: 'warning' },
  PENDING_VERIFICATION: { label: 'Pendiente verificación', color: 'info' },
  DELETED: { label: 'Eliminado', color: 'destructive' },
} as const;

// ============================================
// MEMBERSHIP STATUS CONSTANTS
// ============================================

export const MEMBERSHIP_STATUSES = {
  ACTIVE: { label: 'Activo', color: 'success' },
  INACTIVE: { label: 'Inactivo', color: 'muted' },
  PENDING: { label: 'Pendiente', color: 'warning' },
  INVITED: { label: 'Invitado', color: 'info' },
  REJECTED: { label: 'Rechazado', color: 'destructive' },
} as const;

// ============================================
// ROLE CONSTANTS
// ============================================

export const SYSTEM_ROLES = {
  OWNER: { slug: 'owner', name: 'Propietario', description: 'Acceso total al workspace' },
  ADMIN: { slug: 'admin', name: 'Administrador', description: 'Acceso administrativo completo' },
  MEMBER: { slug: 'member', name: 'Miembro', description: 'Acceso básico' },
  VIEWER: { slug: 'viewer', name: 'Observador', description: 'Solo lectura' },
} as const;

// ============================================
// PERMISSION CONSTANTS
// ============================================

export const PERMISSION_RESOURCES = [
  'tenants',
  'workspaces',
  'organizations',
  'branches',
  'departments',
  'users',
  'roles',
  'permissions',
  'memberships',
  'customers',
  'products',
  'invoices',
  'orders',
  'payments',
  'reports',
  'settings',
  'integrations',
  'ai',
  'automations',
  'marketplace',
] as const;

export const PERMISSION_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'approve',
  'export',
  'import',
  'manage',
] as const;

export const PERMISSION_SCOPES = {
  OWN: { label: 'Propio', description: 'Solo propios' },
  DEPARTMENT: { label: 'Departamento', description: 'Todo el departamento' },
  BRANCH: { label: 'Sucursal', description: 'Toda la sucursal' },
  ORGANIZATION: { label: 'Organización', description: 'Toda la organización' },
  WORKSPACE: { label: 'Workspace', description: 'Todo el workspace' },
  GLOBAL: { label: 'Global', description: 'Acceso global' },
} as const;

// ============================================
// NOVA AI CONSTANTS
// ============================================

export const NOVA_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_TOOL_CALLS_PER_MESSAGE: 10,
  MAX_CONVERSATION_HISTORY: 50,
  STREAMING_ENABLED: true,
  THINKING_INDICATOR: true,
  SUGGESTIONS_COUNT: 4,
} as const;

export const NOVA_TOOLS = {
  CRM: {
    CREATE_CUSTOMER: 'createCustomer',
    FIND_CUSTOMER: 'findCustomer',
    UPDATE_CUSTOMER: 'updateCustomer',
    DELETE_CUSTOMER: 'deleteCustomer',
  },
  SALES: {
    CREATE_QUOTE: 'createQuote',
    CREATE_INVOICE: 'createInvoice',
    FIND_PRODUCT: 'findProduct',
    UPDATE_PRODUCT: 'updateProduct',
  },
  OPERATIONS: {
    SCHEDULE_MEETING: 'scheduleMeeting',
    CREATE_TASK: 'createTask',
    UPDATE_TASK: 'updateTask',
  },
  ANALYTICS: {
    GET_SALES_REPORT: 'getSalesReport',
    GET_INVENTORY_REPORT: 'getInventoryReport',
    GET_FINANCIAL_REPORT: 'getFinancialReport',
  },
  HR: {
    CREATE_EMPLOYEE: 'createEmployee',
    FIND_EMPLOYEE: 'findEmployee',
    SCHEDULE_INTERVIEW: 'scheduleInterview',
  },
  MARKETING: {
    CREATE_CAMPAIGN: 'createCampaign',
    SEND_EMAIL: 'sendEmail',
    SEND_WHATSAPP: 'sendWhatsApp',
  },
} as const;

// ============================================
// EVENT CONSTANTS
// ============================================

export const DOMAIN_EVENTS = {
  // Auth events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_LOGGED_IN: 'user.logged_in',
  USER_LOGGED_OUT: 'user.logged_out',
  PASSWORD_CHANGED: 'user.password_changed',
  EMAIL_VERIFIED: 'user.email_verified',

  // Workspace events
  WORKSPACE_CREATED: 'workspace.created',
  WORKSPACE_UPDATED: 'workspace.updated',
  WORKSPACE_DELETED: 'workspace.deleted',
  WORKSPACE_MEMBER_ADDED: 'workspace.member_added',
  WORKSPACE_MEMBER_REMOVED: 'workspace.member_removed',
  WORKSPACE_MEMBER_ROLE_CHANGED: 'workspace.member_role_changed',

  // Organization events
  ORGANIZATION_CREATED: 'organization.created',
  ORGANIZATION_UPDATED: 'organization.updated',
  ORGANIZATION_DELETED: 'organization.deleted',

  // Branch events
  BRANCH_CREATED: 'branch.created',
  BRANCH_UPDATED: 'branch.updated',
  BRANCH_DELETED: 'branch.deleted',

  // Department events
  DEPARTMENT_CREATED: 'department.created',
  DEPARTMENT_UPDATED: 'department.updated',
  DEPARTMENT_DELETED: 'department.deleted',

  // CRM events
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',
  CONTACT_CREATED: 'contact.created',
  CONTACT_UPDATED: 'contact.updated',
  DEAL_CREATED: 'deal.created',
  DEAL_UPDATED: 'deal.updated',
  DEAL_STAGE_CHANGED: 'deal.stage_changed',
  DEAL_WON: 'deal.won',
  DEAL_LOST: 'deal.lost',

  // Sales events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  QUOTE_CREATED: 'quote.created',
  QUOTE_SENT: 'quote.sent',
  QUOTE_ACCEPTED: 'quote.accepted',
  QUOTE_REJECTED: 'quote.rejected',
  INVOICE_CREATED: 'invoice.created',
  INVOICE_SENT: 'invoice.sent',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_OVERDUE: 'invoice.overdue',
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',

  // Inventory events
  STOCK_UPDATED: 'stock.updated',
  STOCK_LOW: 'stock.low',
  STOCK_OUT: 'stock.out',
  PURCHASE_CREATED: 'purchase.created',
  PURCHASE_APPROVED: 'purchase.approved',
  PURCHASE_RECEIVED: 'purchase.received',

  // AI events
  AGENT_THINKING: 'agent.thinking',
  AGENT_TOOL_CALLED: 'agent.tool_called',
  AGENT_COMPLETED: 'agent.completed',
  AGENT_ERROR: 'agent.error',

  // Automation events
  FLOW_CREATED: 'flow.created',
  FLOW_UPDATED: 'flow.updated',
  FLOW_DELETED: 'flow.deleted',
  FLOW_EXECUTED: 'flow.executed',
  FLOW_COMPLETED: 'flow.completed',
  FLOW_FAILED: 'flow.failed',

  // Notification events
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_READ: 'notification.read',

  // Audit events
  AUDIT_LOG_CREATED: 'audit_log.created',
} as const;

// ============================================
// API CONSTANTS
// ============================================

export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============================================
// ROUTE CONSTANTS
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/home',
  NOVA: '/nova',
  CRM: {
    BASE: '/crm',
    CUSTOMERS: '/crm/customers',
    CUSTOMER_DETAIL: '/crm/customers/:id',
    CONTACTS: '/crm/contacts',
    DEALS: '/crm/deals',
    DEAL_DETAIL: '/crm/deals/:id',
    ACTIVITIES: '/crm/activities',
  },
  SALES: {
    BASE: '/sales',
    PRODUCTS: '/sales/products',
    QUOTES: '/sales/quotes',
    INVOICES: '/sales/invoices',
    PAYMENTS: '/sales/payments',
  },
  INVENTORY: {
    BASE: '/inventory',
    PRODUCTS: '/inventory/products',
    STOCK: '/inventory/stock',
    PURCHASES: '/inventory/purchases',
    WAREHOUSES: '/inventory/warehouses',
  },
  FINANCE: {
    BASE: '/finance',
    CHART_OF_ACCOUNTS: '/finance/chart-of-accounts',
    JOURNAL_ENTRIES: '/finance/journal-entries',
    REPORTS: '/finance/reports',
  },
  HR: {
    BASE: '/hr',
    EMPLOYEES: '/hr/employees',
    DEPARTMENTS: '/hr/departments',
    ATTENDANCE: '/hr/attendance',
    PAYROLL: '/hr/payroll',
  },
  AUTOMATIONS: {
    BASE: '/automations',
    FLOWS: '/automations/flows',
    EXECUTIONS: '/automations/executions',
  },
  MARKETPLACE: {
    BASE: '/marketplace',
    APPS: '/marketplace/apps',
    INSTALL: '/marketplace/install/:id',
  },
  SETTINGS: {
    BASE: '/settings',
    WORKSPACE: '/settings/workspace',
    ORGANIZATION: '/settings/organization',
    BRANCHES: '/settings/branches',
    DEPARTMENTS: '/settings/departments',
    USERS: '/settings/users',
    ROLES: '/settings/roles',
    APPEARANCE: '/settings/appearance',
    BILLING: '/settings/billing',
    INTEGRATIONS: '/settings/integrations',
    API: '/settings/api',
  },
} as const;