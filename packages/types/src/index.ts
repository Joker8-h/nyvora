// ============================================
// NEXORA TYPES - Shared TypeScript Types
// ============================================

// Re-export Prisma types
export type {
  Organization,
  Branch,
  User,
  Membership,
  Invitation,
  Session,
  CrmContact,
  CrmCompany,
  CrmLead,
  CrmPipeline,
  Product,
  ProductCategory,
  Warehouse,
  StockLevel,
  StockMovement,
  Supplier,
  PurchaseOrder,
  PurchaseOrderLine,
  SalesQuotation,
  SalesQuotationItem,
  SalesOrder,
  SalesOrderItem,
  SalesInvoice,
  SalesInvoiceItem,
  SalesPayment,
  FinanceAccount,
  FinanceCategory,
  FinanceTransaction,
  Department,
  Position,
  Employee,
  Absence,
  Evaluation,
  Project,
  Task,
  TimeEntry,
  Notification,
  AuditLog,
  Document,
  Template,
  ApiKey,
  Webhook,
  NovaSkill,
  NovaOrgSkill,
  Automation,
  MarketingCampaign,
  EmailTemplate,
  MarketingSegment,
  AppInstallation,
} from '../../database/src/generated/client';

// ============================================
// AUTH TYPES
// ============================================

export interface TokenPayload {
  sub: string;
  email: string;
  org?: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  emailVerified?: Date;
  permissions?: string[];
  organizationId?: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
  organization?: OrganizationInfo;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================
// ORGANIZATION TYPES
// ============================================

export interface OrganizationInfo {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

// ============================================
// RBAC TYPES
// ============================================

export type RoleType = 'owner' | 'admin' | 'manager' | 'employee' | 'viewer';

export interface RoleInfo {
  name: RoleType;
  description: string;
}

// ============================================
// COMMON TYPES
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  dateRange?: {
    from: string;
    to: string;
  };
}

// ============================================
// NOVA AI TYPES
// ============================================

export type NovaMessageType = 'user' | 'assistant' | 'tool' | 'system' | 'thinking';

export interface NovaMessage {
  id: string;
  type: NovaMessageType;
  content: string;
  toolCalls?: NovaToolCall[];
  toolResults?: NovaToolResult[];
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface NovaToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface NovaToolResult {
  toolCallId: string;
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
}

export interface NovaToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  category: 'crm' | 'sales' | 'finance' | 'inventory' | 'hr' | 'analytics' | 'operations' | 'marketing';
  requiredPermissions?: string[];
}

export interface NovaChatRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, any>;
  organizationId?: string;
  userId?: string;
}

export interface NovaChatResponse {
  conversationId: string;
  message: NovaMessage;
  toolCalls?: NovaToolCall[];
  suggestions?: string[];
}

// ============================================
// EVENT TYPES
// ============================================

export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
  version: number;
}

export interface EventMetadata {
  userId?: string;
  organizationId?: string;
  correlationId?: string;
  causationId?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

// ============================================
// NOVA TOOL IMPLEMENTATION TYPES
// ============================================

export interface NovaToolContext {
  userId: string;
  organizationId?: string;
  branchId?: string;
  permissions: string[];
}

export interface NovaToolImplementation<TInput = any, TOutput = any> {
  name: string;
  description: string;
  inputSchema: any;
  execute: (input: TInput, context: NovaToolContext) => Promise<TOutput>;
  validate?: (input: TInput) => boolean;
  requiredPermissions?: string[];
}
