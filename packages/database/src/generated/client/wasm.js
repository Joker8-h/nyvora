
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  plan: 'plan',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.BranchScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  address: 'address',
  phone: 'phone',
  isHeadquarters: 'isHeadquarters',
  isActive: 'isActive',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  avatar: 'avatar',
  isActive: 'isActive',
  emailVerifiedAt: 'emailVerifiedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokenHash: 'tokenHash',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  revokedAt: 'revokedAt'
};

exports.Prisma.MembershipScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  organizationId: 'organizationId',
  role: 'role',
  branchIds: 'branchIds',
  invitedById: 'invitedById',
  invitedAt: 'invitedAt',
  acceptedAt: 'acceptedAt',
  createdAt: 'createdAt'
};

exports.Prisma.InvitationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  email: 'email',
  role: 'role',
  token: 'token',
  expiresAt: 'expiresAt',
  acceptedAt: 'acceptedAt',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.PasswordResetScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  expiresAt: 'expiresAt',
  usedAt: 'usedAt',
  createdAt: 'createdAt'
};

exports.Prisma.EmailVerificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  expiresAt: 'expiresAt',
  verifiedAt: 'verifiedAt',
  createdAt: 'createdAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  organizationId: 'organizationId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  lastActiveAt: 'lastActiveAt',
  createdAt: 'createdAt'
};

exports.Prisma.CrmContactScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  companyId: 'companyId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  position: 'position',
  type: 'type',
  tags: 'tags',
  customFields: 'customFields',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.CrmCompanyScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  industry: 'industry',
  website: 'website',
  address: 'address',
  taxId: 'taxId',
  notes: 'notes',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.CrmLeadScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  contactId: 'contactId',
  pipelineId: 'pipelineId',
  stage: 'stage',
  status: 'status',
  title: 'title',
  notes: 'notes',
  source: 'source',
  score: 'score',
  assignedToId: 'assignedToId',
  estimatedValue: 'estimatedValue',
  expectedCloseDate: 'expectedCloseDate',
  convertedAt: 'convertedAt',
  lostReason: 'lostReason',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.CrmLeadActivityScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  type: 'type',
  content: 'content',
  occurredAt: 'occurredAt',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.CrmPipelineScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  stages: 'stages',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ProductCategoryScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  parentId: 'parentId',
  createdAt: 'createdAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  sku: 'sku',
  name: 'name',
  description: 'description',
  categoryId: 'categoryId',
  unitPrice: 'unitPrice',
  currency: 'currency',
  hasBatches: 'hasBatches',
  allowNegativeStock: 'allowNegativeStock',
  isActive: 'isActive',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.WarehouseScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  branchId: 'branchId',
  name: 'name',
  address: 'address',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.StockLevelScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  productId: 'productId',
  warehouseId: 'warehouseId',
  quantity: 'quantity',
  minimumQuantity: 'minimumQuantity',
  updatedAt: 'updatedAt'
};

exports.Prisma.StockMovementScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  productId: 'productId',
  warehouseId: 'warehouseId',
  type: 'type',
  quantity: 'quantity',
  unitCost: 'unitCost',
  transferId: 'transferId',
  referenceType: 'referenceType',
  referenceId: 'referenceId',
  reason: 'reason',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  taxId: 'taxId',
  email: 'email',
  phone: 'phone',
  address: 'address',
  paymentTerms: 'paymentTerms',
  isActive: 'isActive',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  number: 'number',
  supplierId: 'supplierId',
  status: 'status',
  expectedDate: 'expectedDate',
  notes: 'notes',
  total: 'total',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.PurchaseOrderLineScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  productId: 'productId',
  quantity: 'quantity',
  receivedQuantity: 'receivedQuantity',
  unitPrice: 'unitPrice',
  subtotal: 'subtotal',
  createdAt: 'createdAt'
};

exports.Prisma.SalesQuotationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  number: 'number',
  contactId: 'contactId',
  status: 'status',
  validUntil: 'validUntil',
  subtotal: 'subtotal',
  taxRate: 'taxRate',
  taxAmount: 'taxAmount',
  total: 'total',
  notes: 'notes',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.SalesQuotationItemScalarFieldEnum = {
  id: 'id',
  quotationId: 'quotationId',
  productId: 'productId',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  subtotal: 'subtotal',
  createdAt: 'createdAt'
};

exports.Prisma.SalesOrderScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  number: 'number',
  quotationId: 'quotationId',
  contactId: 'contactId',
  status: 'status',
  subtotal: 'subtotal',
  taxAmount: 'taxAmount',
  total: 'total',
  notes: 'notes',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.SalesOrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  subtotal: 'subtotal',
  createdAt: 'createdAt'
};

exports.Prisma.SalesInvoiceScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  number: 'number',
  orderId: 'orderId',
  contactId: 'contactId',
  status: 'status',
  dueDate: 'dueDate',
  subtotal: 'subtotal',
  taxAmount: 'taxAmount',
  total: 'total',
  paidAmount: 'paidAmount',
  voidedAt: 'voidedAt',
  sentAt: 'sentAt',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.SalesInvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  productId: 'productId',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  subtotal: 'subtotal',
  createdAt: 'createdAt'
};

exports.Prisma.SalesPaymentScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  invoiceId: 'invoiceId',
  amount: 'amount',
  method: 'method',
  reference: 'reference',
  notes: 'notes',
  paidAt: 'paidAt',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.FinanceAccountScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  type: 'type',
  currency: 'currency',
  balance: 'balance',
  reconciledBalance: 'reconciledBalance',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.FinanceCategoryScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  parentId: 'parentId',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.FinanceTransactionScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  accountId: 'accountId',
  categoryId: 'categoryId',
  type: 'type',
  amount: 'amount',
  description: 'description',
  referenceType: 'referenceType',
  referenceId: 'referenceId',
  transactionDate: 'transactionDate',
  isReconciled: 'isReconciled',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  managerId: 'managerId',
  createdAt: 'createdAt'
};

exports.Prisma.PositionScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  departmentId: 'departmentId',
  createdAt: 'createdAt'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  branchId: 'branchId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  departmentId: 'departmentId',
  positionId: 'positionId',
  hireDate: 'hireDate',
  salary: 'salary',
  contractType: 'contractType',
  status: 'status',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.AbsenceScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  type: 'type',
  startDate: 'startDate',
  endDate: 'endDate',
  notes: 'notes',
  status: 'status',
  approvedById: 'approvedById',
  createdAt: 'createdAt'
};

exports.Prisma.EvaluationScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  period: 'period',
  selfScore: 'selfScore',
  managerScore: 'managerScore',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  clientId: 'clientId',
  name: 'name',
  description: 'description',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  budgetHours: 'budgetHours',
  createdById: 'createdById',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  title: 'title',
  description: 'description',
  assigneeId: 'assigneeId',
  priority: 'priority',
  status: 'status',
  estimatedHours: 'estimatedHours',
  dueDate: 'dueDate',
  createdById: 'createdById',
  createdAt: 'createdAt',
  completedAt: 'completedAt'
};

exports.Prisma.TimeEntryScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  userId: 'userId',
  hours: 'hours',
  description: 'description',
  entryDate: 'entryDate',
  createdAt: 'createdAt'
};

exports.Prisma.MarketingCampaignScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  type: 'type',
  channel: 'channel',
  provider: 'provider',
  subject: 'subject',
  body: 'body',
  templateId: 'templateId',
  segmentId: 'segmentId',
  audienceSize: 'audienceSize',
  delayMs: 'delayMs',
  status: 'status',
  totalCount: 'totalCount',
  sentCount: 'sentCount',
  failedCount: 'failedCount',
  error: 'error',
  scheduledAt: 'scheduledAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  sentAt: 'sentAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignMessageScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  organizationId: 'organizationId',
  recipient: 'recipient',
  name: 'name',
  status: 'status',
  error: 'error',
  providerMessageId: 'providerMessageId',
  sentAt: 'sentAt',
  createdAt: 'createdAt'
};

exports.Prisma.MeetingScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  title: 'title',
  description: 'description',
  date: 'date',
  endDate: 'endDate',
  location: 'location',
  organizerId: 'organizerId',
  attendees: 'attendees',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IntegrationCredentialScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  provider: 'provider',
  data: 'data',
  meta: 'meta',
  isActive: 'isActive',
  lastTestedAt: 'lastTestedAt',
  lastTestOk: 'lastTestOk',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WhatsappSessionScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  status: 'status',
  qr: 'qr',
  phoneNumber: 'phoneNumber',
  lastConnectedAt: 'lastConnectedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailTemplateScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  subject: 'subject',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.MarketingSegmentScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  rules: 'rules',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  recipientId: 'recipientId',
  organizationId: 'organizationId',
  title: 'title',
  message: 'message',
  icon: 'icon',
  link: 'link',
  module: 'module',
  eventType: 'eventType',
  isRead: 'isRead',
  metadata: 'metadata',
  createdAt: 'createdAt',
  readAt: 'readAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  userId: 'userId',
  changes: 'changes',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  entityType: 'entityType',
  entityId: 'entityId',
  fileName: 'fileName',
  fileSize: 'fileSize',
  mimeType: 'mimeType',
  storageKey: 'storageKey',
  url: 'url',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  type: 'type',
  content: 'content',
  variables: 'variables',
  isDefault: 'isDefault',
  createdAt: 'createdAt'
};

exports.Prisma.ApiKeyScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  keyHash: 'keyHash',
  keyPrefix: 'keyPrefix',
  permissions: 'permissions',
  expiresAt: 'expiresAt',
  lastUsedAt: 'lastUsedAt',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.WebhookScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  url: 'url',
  secret: 'secret',
  events: 'events',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.NovaSkillScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  requiredPermissions: 'requiredPermissions',
  promptTemplate: 'promptTemplate',
  tools: 'tools',
  isSystem: 'isSystem',
  createdAt: 'createdAt'
};

exports.Prisma.NovaMessageScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  organizationId: 'organizationId',
  userId: 'userId',
  role: 'role',
  content: 'content',
  toolCalls: 'toolCalls',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.NovaOrgSkillScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  skillId: 'skillId',
  installedAt: 'installedAt'
};

exports.Prisma.AutomationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  description: 'description',
  triggerType: 'triggerType',
  triggerConfig: 'triggerConfig',
  conditions: 'conditions',
  actions: 'actions',
  status: 'status',
  createdBy: 'createdBy',
  createdByUserId: 'createdByUserId',
  lastExecutedAt: 'lastExecutedAt',
  executionCount: 'executionCount',
  successCount: 'successCount',
  failureCount: 'failureCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AutomationExecutionScalarFieldEnum = {
  id: 'id',
  automationId: 'automationId',
  triggerData: 'triggerData',
  conditionsMet: 'conditionsMet',
  results: 'results',
  status: 'status',
  error: 'error',
  durationMs: 'durationMs',
  createdAt: 'createdAt'
};

exports.Prisma.AppInstallationScalarFieldEnum = {
  id: 'id',
  appId: 'appId',
  organizationId: 'organizationId',
  config: 'config',
  isActive: 'isActive',
  installedAt: 'installedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Organization: 'Organization',
  Branch: 'Branch',
  User: 'User',
  RefreshToken: 'RefreshToken',
  Membership: 'Membership',
  Invitation: 'Invitation',
  PasswordReset: 'PasswordReset',
  EmailVerification: 'EmailVerification',
  Session: 'Session',
  CrmContact: 'CrmContact',
  CrmCompany: 'CrmCompany',
  CrmLead: 'CrmLead',
  CrmLeadActivity: 'CrmLeadActivity',
  CrmPipeline: 'CrmPipeline',
  ProductCategory: 'ProductCategory',
  Product: 'Product',
  Warehouse: 'Warehouse',
  StockLevel: 'StockLevel',
  StockMovement: 'StockMovement',
  Supplier: 'Supplier',
  PurchaseOrder: 'PurchaseOrder',
  PurchaseOrderLine: 'PurchaseOrderLine',
  SalesQuotation: 'SalesQuotation',
  SalesQuotationItem: 'SalesQuotationItem',
  SalesOrder: 'SalesOrder',
  SalesOrderItem: 'SalesOrderItem',
  SalesInvoice: 'SalesInvoice',
  SalesInvoiceItem: 'SalesInvoiceItem',
  SalesPayment: 'SalesPayment',
  FinanceAccount: 'FinanceAccount',
  FinanceCategory: 'FinanceCategory',
  FinanceTransaction: 'FinanceTransaction',
  Department: 'Department',
  Position: 'Position',
  Employee: 'Employee',
  Absence: 'Absence',
  Evaluation: 'Evaluation',
  Project: 'Project',
  Task: 'Task',
  TimeEntry: 'TimeEntry',
  MarketingCampaign: 'MarketingCampaign',
  CampaignMessage: 'CampaignMessage',
  Meeting: 'Meeting',
  IntegrationCredential: 'IntegrationCredential',
  WhatsappSession: 'WhatsappSession',
  EmailTemplate: 'EmailTemplate',
  MarketingSegment: 'MarketingSegment',
  Notification: 'Notification',
  AuditLog: 'AuditLog',
  Document: 'Document',
  Template: 'Template',
  ApiKey: 'ApiKey',
  Webhook: 'Webhook',
  NovaSkill: 'NovaSkill',
  NovaMessage: 'NovaMessage',
  NovaOrgSkill: 'NovaOrgSkill',
  Automation: 'Automation',
  AutomationExecution: 'AutomationExecution',
  AppInstallation: 'AppInstallation'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\usuario\\OneDrive\\Documents\\Atlas\\nyvora\\packages\\database\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "seed": "node ../prisma/seed.ts",
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\Users\\usuario\\OneDrive\\Documents\\Atlas\\nyvora\\packages\\database\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/client\"\n  previewFeatures = [\"driverAdapters\"]\n  seed            = \"node ../prisma/seed.ts\"\n}\n\n// ============================================\n// CORE - Organization Centric\n// ============================================\n\nmodel Organization {\n  id        String    @id @default(uuid())\n  name      String\n  slug      String    @unique\n  logo      String?\n  plan      String    @default(\"free\")\n  settings  Json      @default(\"{}\")\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  branches               Branch[]\n  memberships            Membership[]\n  invitations            Invitation[]\n  crmContacts            CrmContact[]\n  crmCompanies           CrmCompany[]\n  crmLeads               CrmLead[]\n  crmPipelines           CrmPipeline[]\n  products               Product[]\n  productCategories      ProductCategory[]\n  warehouses             Warehouse[]\n  stockLevels            StockLevel[]\n  stockMovements         StockMovement[]\n  suppliers              Supplier[]\n  purchaseOrders         PurchaseOrder[]\n  financeAccounts        FinanceAccount[]\n  financeCategories      FinanceCategory[]\n  financeTransactions    FinanceTransaction[]\n  departments            Department[]\n  positions              Position[]\n  employees              Employee[]\n  projects               Project[]\n  salesQuotations        SalesQuotation[]\n  salesOrders            SalesOrder[]\n  salesInvoices          SalesInvoice[]\n  salesPayments          SalesPayment[]\n  notifications          Notification[]\n  documents              Document[]\n  templates              Template[]\n  apiKeys                ApiKey[]\n  meetings               Meeting[]\n  webhooks               Webhook[]\n  automations            Automation[]\n  marketingCampaigns     MarketingCampaign[]\n  emailTemplates         EmailTemplate[]\n  marketingSegments      MarketingSegment[]\n  novaOrgSkills          NovaOrgSkill[]\n  appInstallations       AppInstallation[]\n  integrationCredentials IntegrationCredential[]\n  campaignMessages       CampaignMessage[]\n  whatsappSession        WhatsappSession?\n}\n\nmodel Branch {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  address        Json?\n  phone          String?\n  isHeadquarters Boolean      @default(false)\n  isActive       Boolean      @default(true)\n  createdAt      DateTime     @default(now())\n  deletedAt      DateTime?\n\n  warehouses Warehouse[]\n  employees  Employee[]\n\n  @@index([organizationId])\n}\n\n// ============================================\n// AUTH & IDENTITY\n// ============================================\n\nmodel User {\n  id              String    @id @default(uuid())\n  email           String    @unique\n  passwordHash    String\n  firstName       String\n  lastName        String\n  avatar          String?\n  isActive        Boolean   @default(true)\n  emailVerifiedAt DateTime?\n  createdAt       DateTime  @default(now())\n  updatedAt       DateTime  @updatedAt\n\n  memberships        Membership[]\n  refreshTokens      RefreshToken[]\n  passwordResets     PasswordReset[]\n  emailVerifications EmailVerification[]\n  sessions           Session[]\n  assignedTasks      Task[]              @relation(\"TaskAssignee\")\n  createdTasks       Task[]              @relation(\"TaskCreator\")\n  timeEntries        TimeEntry[]\n  notifications      Notification[]\n  documents          Document[]\n  employees          Employee?\n  organizedMeetings  Meeting[]           @relation(\"MeetingOrganizer\")\n}\n\nmodel RefreshToken {\n  id        String    @id @default(uuid())\n  userId    String\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  tokenHash String    @unique\n  expiresAt DateTime\n  createdAt DateTime  @default(now())\n  revokedAt DateTime?\n\n  @@index([userId])\n  @@index([tokenHash])\n}\n\nmodel Membership {\n  id             String       @id @default(uuid())\n  userId         String\n  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  role           String       @default(\"employee\")\n  branchIds      String[]     @default([])\n  invitedById    String?\n  invitedAt      DateTime?\n  acceptedAt     DateTime?\n  createdAt      DateTime     @default(now())\n\n  @@unique([userId, organizationId])\n  @@index([organizationId])\n  @@index([role])\n}\n\nmodel Invitation {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  email          String\n  role           String\n  token          String       @unique\n  expiresAt      DateTime\n  acceptedAt     DateTime?\n  createdById    String?\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n  @@index([token])\n}\n\nmodel PasswordReset {\n  id        String    @id @default(uuid())\n  userId    String\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  token     String    @unique\n  expiresAt DateTime\n  usedAt    DateTime?\n  createdAt DateTime  @default(now())\n\n  @@index([userId])\n  @@index([token])\n}\n\nmodel EmailVerification {\n  id         String    @id @default(uuid())\n  userId     String\n  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  token      String    @unique\n  expiresAt  DateTime\n  verifiedAt DateTime?\n  createdAt  DateTime  @default(now())\n\n  @@index([userId])\n  @@index([token])\n}\n\nmodel Session {\n  id             String   @id @default(uuid())\n  userId         String\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  organizationId String?\n  ipAddress      String?\n  userAgent      String?\n  lastActiveAt   DateTime @default(now())\n  createdAt      DateTime @default(now())\n\n  @@index([userId])\n  @@index([lastActiveAt])\n}\n\n// ============================================\n// CRM\n// ============================================\n\nmodel CrmContact {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  companyId      String?\n  company        CrmCompany?  @relation(fields: [companyId], references: [id], onDelete: SetNull)\n  firstName      String\n  lastName       String?\n  email          String?\n  phone          String?\n  position       String?\n  type           String       @default(\"lead\")\n  tags           String[]     @default([])\n  customFields   Json         @default(\"{}\")\n  createdById    String?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  crmLeads        CrmLead[]\n  salesQuotations SalesQuotation[]\n  salesOrders     SalesOrder[]\n  salesInvoices   SalesInvoice[]\n  projects        Project[]\n\n  @@index([organizationId])\n  @@index([companyId])\n  @@index([email])\n}\n\nmodel CrmCompany {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  industry       String?\n  website        String?\n  address        Json?\n  taxId          String?\n  notes          String?\n  createdById    String?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  contacts CrmContact[]\n\n  @@index([organizationId])\n  @@index([name])\n}\n\nmodel CrmLead {\n  id                String       @id @default(uuid())\n  organizationId    String\n  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  contactId         String?\n  contact           CrmContact?  @relation(fields: [contactId], references: [id], onDelete: SetNull)\n  pipelineId        String\n  pipeline          CrmPipeline  @relation(fields: [pipelineId], references: [id], onDelete: Restrict)\n  stage             String\n  status            String       @default(\"active\")\n  title             String?\n  notes             String?\n  source            String?\n  score             Int          @default(0)\n  assignedToId      String?\n  estimatedValue    BigInt?\n  expectedCloseDate DateTime?\n  convertedAt       DateTime?\n  lostReason        String?\n  createdById       String?\n  createdAt         DateTime     @default(now())\n  updatedAt         DateTime     @updatedAt\n  deletedAt         DateTime?\n\n  activities CrmLeadActivity[]\n\n  @@index([organizationId])\n  @@index([pipelineId])\n  @@index([stage])\n  @@index([status])\n  @@index([assignedToId])\n}\n\nmodel CrmLeadActivity {\n  id          String   @id @default(uuid())\n  leadId      String\n  lead        CrmLead  @relation(fields: [leadId], references: [id], onDelete: Cascade)\n  type        String\n  content     String\n  occurredAt  DateTime @default(now())\n  createdById String?\n  createdAt   DateTime @default(now())\n\n  @@index([leadId])\n}\n\nmodel CrmPipeline {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  stages         Json         @default(\"[]\")\n  isDefault      Boolean      @default(false)\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  leads CrmLead[]\n\n  @@index([organizationId])\n}\n\n// ============================================\n// INVENTORY\n// ============================================\n\nmodel ProductCategory {\n  id             String            @id @default(uuid())\n  organizationId String\n  organization   Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  parentId       String?\n  parent         ProductCategory?  @relation(\"CategoryHierarchy\", fields: [parentId], references: [id], onDelete: SetNull)\n  children       ProductCategory[] @relation(\"CategoryHierarchy\")\n  createdAt      DateTime          @default(now())\n\n  products Product[]\n\n  @@unique([organizationId, name])\n  @@index([organizationId])\n  @@index([parentId])\n}\n\nmodel Product {\n  id                 String           @id @default(uuid())\n  organizationId     String\n  organization       Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  sku                String\n  name               String\n  description        String?\n  categoryId         String?\n  category           ProductCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n  unitPrice          BigInt\n  currency           String           @default(\"USD\")\n  hasBatches         Boolean          @default(false)\n  allowNegativeStock Boolean          @default(false)\n  isActive           Boolean          @default(true)\n  createdById        String?\n  createdAt          DateTime         @default(now())\n  updatedAt          DateTime         @updatedAt\n  deletedAt          DateTime?\n\n  stockLevels         StockLevel[]\n  stockMovements      StockMovement[]\n  purchaseOrderLines  PurchaseOrderLine[]\n  salesQuotationItems SalesQuotationItem[]\n  salesOrderItems     SalesOrderItem[]\n  salesInvoiceItems   SalesInvoiceItem[]\n\n  @@unique([organizationId, sku])\n  @@index([organizationId])\n  @@index([categoryId])\n  @@index([sku])\n}\n\nmodel Warehouse {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  branchId       String?\n  branch         Branch?      @relation(fields: [branchId], references: [id], onDelete: SetNull)\n  name           String\n  address        Json?\n  isActive       Boolean      @default(true)\n  createdAt      DateTime     @default(now())\n\n  stockLevels    StockLevel[]\n  stockMovements StockMovement[]\n\n  @@unique([organizationId, name])\n  @@index([organizationId])\n  @@index([branchId])\n}\n\nmodel StockLevel {\n  id              String       @id @default(uuid())\n  organizationId  String\n  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  productId       String\n  product         Product      @relation(fields: [productId], references: [id], onDelete: Cascade)\n  warehouseId     String\n  warehouse       Warehouse    @relation(fields: [warehouseId], references: [id], onDelete: Cascade)\n  quantity        Int          @default(0)\n  minimumQuantity Int          @default(0)\n  updatedAt       DateTime     @updatedAt\n\n  @@unique([organizationId, productId, warehouseId])\n  @@index([productId])\n  @@index([warehouseId])\n}\n\nmodel StockMovement {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  productId      String\n  product        Product      @relation(fields: [productId], references: [id], onDelete: Cascade)\n  warehouseId    String\n  warehouse      Warehouse    @relation(fields: [warehouseId], references: [id], onDelete: Cascade)\n  type           String\n  quantity       Int\n  unitCost       BigInt?\n  transferId     String?\n  referenceType  String?\n  referenceId    String?\n  reason         String?\n  createdById    String?\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n  @@index([productId])\n  @@index([warehouseId])\n  @@index([transferId])\n  @@index([createdAt])\n}\n\n// ============================================\n// PURCHASING\n// ============================================\n\nmodel Supplier {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  taxId          String?\n  email          String?\n  phone          String?\n  address        Json?\n  paymentTerms   Int          @default(30)\n  isActive       Boolean      @default(true)\n  createdAt      DateTime     @default(now())\n  deletedAt      DateTime?\n\n  purchaseOrders PurchaseOrder[]\n\n  @@index([organizationId])\n  @@index([name])\n}\n\nmodel PurchaseOrder {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  number         String\n  supplierId     String\n  supplier       Supplier     @relation(fields: [supplierId], references: [id], onDelete: Restrict)\n  status         String       @default(\"draft\")\n  expectedDate   DateTime?\n  notes          String?\n  total          BigInt       @default(0)\n  createdById    String?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  lines PurchaseOrderLine[]\n\n  @@unique([organizationId, number])\n  @@index([organizationId])\n  @@index([supplierId])\n  @@index([status])\n}\n\nmodel PurchaseOrderLine {\n  id               String        @id @default(uuid())\n  purchaseOrderId  String\n  purchaseOrder    PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)\n  productId        String\n  product          Product       @relation(fields: [productId], references: [id], onDelete: Restrict)\n  quantity         Int\n  receivedQuantity Int           @default(0)\n  unitPrice        BigInt\n  subtotal         BigInt\n  createdAt        DateTime      @default(now())\n\n  @@index([purchaseOrderId])\n  @@index([productId])\n}\n\n// ============================================\n// SALES\n// ============================================\n\nmodel SalesQuotation {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  number         String\n  contactId      String?\n  contact        CrmContact?  @relation(fields: [contactId], references: [id], onDelete: SetNull)\n  status         String       @default(\"draft\")\n  validUntil     DateTime?\n  subtotal       BigInt       @default(0)\n  taxRate        Decimal      @default(0) @db.Decimal(5, 2)\n  taxAmount      BigInt       @default(0)\n  total          BigInt       @default(0)\n  notes          String?\n  createdById    String?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  items SalesQuotationItem[]\n\n  @@unique([organizationId, number])\n  @@index([organizationId])\n  @@index([contactId])\n  @@index([status])\n}\n\nmodel SalesQuotationItem {\n  id          String         @id @default(uuid())\n  quotationId String\n  quotation   SalesQuotation @relation(fields: [quotationId], references: [id], onDelete: Cascade)\n  productId   String?\n  product     Product?       @relation(fields: [productId], references: [id], onDelete: SetNull)\n  description String\n  quantity    Int\n  unitPrice   BigInt\n  subtotal    BigInt\n  createdAt   DateTime       @default(now())\n\n  @@index([quotationId])\n  @@index([productId])\n}\n\nmodel SalesOrder {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  number         String\n  quotationId    String?\n  contactId      String?\n  contact        CrmContact?  @relation(fields: [contactId], references: [id], onDelete: SetNull)\n  status         String       @default(\"pending\")\n  subtotal       BigInt       @default(0)\n  taxAmount      BigInt       @default(0)\n  total          BigInt       @default(0)\n  notes          String?\n  createdById    String?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  items SalesOrderItem[]\n\n  @@unique([organizationId, number])\n  @@index([organizationId])\n  @@index([contactId])\n  @@index([status])\n}\n\nmodel SalesOrderItem {\n  id          String     @id @default(uuid())\n  orderId     String\n  order       SalesOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  productId   String?\n  product     Product?   @relation(fields: [productId], references: [id], onDelete: SetNull)\n  description String\n  quantity    Int\n  unitPrice   BigInt\n  subtotal    BigInt\n  createdAt   DateTime   @default(now())\n\n  @@index([orderId])\n  @@index([productId])\n}\n\nmodel SalesInvoice {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  number         String\n  orderId        String?\n  contactId      String\n  contact        CrmContact   @relation(fields: [contactId], references: [id], onDelete: Restrict)\n  status         String       @default(\"draft\")\n  dueDate        DateTime?\n  subtotal       BigInt       @default(0)\n  taxAmount      BigInt       @default(0)\n  total          BigInt       @default(0)\n  paidAmount     BigInt       @default(0)\n  voidedAt       DateTime?\n  sentAt         DateTime?\n  createdById    String?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  deletedAt      DateTime?\n\n  items    SalesInvoiceItem[]\n  payments SalesPayment[]\n\n  @@unique([organizationId, number])\n  @@index([organizationId])\n  @@index([contactId])\n  @@index([orderId])\n  @@index([status])\n}\n\nmodel SalesInvoiceItem {\n  id          String       @id @default(uuid())\n  invoiceId   String\n  invoice     SalesInvoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)\n  productId   String?\n  product     Product?     @relation(fields: [productId], references: [id], onDelete: SetNull)\n  description String\n  quantity    Int\n  unitPrice   BigInt\n  subtotal    BigInt\n  createdAt   DateTime     @default(now())\n\n  @@index([invoiceId])\n  @@index([productId])\n}\n\nmodel SalesPayment {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  invoiceId      String\n  invoice        SalesInvoice @relation(fields: [invoiceId], references: [id], onDelete: Restrict)\n  amount         BigInt\n  method         String\n  reference      String?\n  notes          String?\n  paidAt         DateTime     @default(now())\n  createdById    String?\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n  @@index([invoiceId])\n  @@index([paidAt])\n}\n\n// ============================================\n// FINANCE\n// ============================================\n\nmodel FinanceAccount {\n  id                String       @id @default(uuid())\n  organizationId    String\n  organization      Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name              String\n  type              String\n  currency          String       @default(\"USD\")\n  balance           BigInt       @default(0)\n  reconciledBalance BigInt       @default(0)\n  isActive          Boolean      @default(true)\n  createdAt         DateTime     @default(now())\n\n  transactions FinanceTransaction[]\n\n  @@index([organizationId])\n  @@index([type])\n}\n\nmodel FinanceCategory {\n  id             String            @id @default(uuid())\n  organizationId String\n  organization   Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  parentId       String?\n  parent         FinanceCategory?  @relation(\"FinanceCategoryHierarchy\", fields: [parentId], references: [id], onDelete: SetNull)\n  children       FinanceCategory[] @relation(\"FinanceCategoryHierarchy\")\n  type           String\n  createdAt      DateTime          @default(now())\n\n  transactions FinanceTransaction[]\n\n  @@unique([organizationId, name])\n  @@index([organizationId])\n  @@index([parentId])\n  @@index([type])\n}\n\nmodel FinanceTransaction {\n  id              String           @id @default(uuid())\n  organizationId  String\n  organization    Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  accountId       String\n  account         FinanceAccount   @relation(fields: [accountId], references: [id], onDelete: Restrict)\n  categoryId      String?\n  category        FinanceCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n  type            String\n  amount          BigInt\n  description     String?\n  referenceType   String?\n  referenceId     String?\n  transactionDate DateTime\n  isReconciled    Boolean          @default(false)\n  createdById     String?\n  createdAt       DateTime         @default(now())\n\n  @@index([organizationId])\n  @@index([accountId])\n  @@index([categoryId])\n  @@index([transactionDate])\n}\n\n// ============================================\n// HR\n// ============================================\n\nmodel Department {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  managerId      String?\n  createdAt      DateTime     @default(now())\n\n  employees Employee[]\n\n  @@index([organizationId])\n}\n\nmodel Position {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  departmentId   String?\n  createdAt      DateTime     @default(now())\n\n  employees Employee[]\n\n  @@index([organizationId])\n  @@index([departmentId])\n}\n\nmodel Employee {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  userId         String?      @unique\n  user           User?        @relation(fields: [userId], references: [id], onDelete: SetNull)\n  branchId       String?\n  branch         Branch?      @relation(fields: [branchId], references: [id], onDelete: SetNull)\n  firstName      String\n  lastName       String\n  email          String\n  phone          String?\n  departmentId   String?\n  department     Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)\n  positionId     String?\n  position       Position?    @relation(fields: [positionId], references: [id], onDelete: SetNull)\n  hireDate       DateTime\n  salary         BigInt?\n  contractType   String?\n  status         String       @default(\"active\")\n  createdAt      DateTime     @default(now())\n  deletedAt      DateTime?\n\n  absences    Absence[]\n  evaluations Evaluation[]\n\n  @@index([organizationId])\n  @@index([departmentId])\n  @@index([branchId])\n}\n\nmodel Absence {\n  id           String   @id @default(uuid())\n  employeeId   String\n  employee     Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)\n  type         String\n  startDate    DateTime\n  endDate      DateTime\n  notes        String?\n  status       String   @default(\"pending\")\n  approvedById String?\n  createdAt    DateTime @default(now())\n\n  @@index([employeeId])\n  @@index([status])\n}\n\nmodel Evaluation {\n  id           String   @id @default(uuid())\n  employeeId   String\n  employee     Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)\n  period       String\n  selfScore    Int?\n  managerScore Int?\n  notes        String?\n  createdAt    DateTime @default(now())\n\n  @@index([employeeId])\n  @@index([period])\n}\n\n// ============================================\n// PROJECTS\n// ============================================\n\nmodel Project {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  clientId       String?\n  client         CrmContact?  @relation(fields: [clientId], references: [id], onDelete: SetNull)\n  name           String\n  description    String?\n  status         String       @default(\"planning\")\n  startDate      DateTime?\n  endDate        DateTime?\n  budgetHours    Int?\n  createdById    String?\n  createdAt      DateTime     @default(now())\n  deletedAt      DateTime?\n\n  tasks Task[]\n\n  @@index([organizationId])\n  @@index([clientId])\n  @@index([status])\n}\n\nmodel Task {\n  id             String    @id @default(uuid())\n  projectId      String\n  project        Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  title          String\n  description    String?\n  assigneeId     String?\n  assignee       User?     @relation(\"TaskAssignee\", fields: [assigneeId], references: [id], onDelete: SetNull)\n  priority       String    @default(\"medium\")\n  status         String    @default(\"todo\")\n  estimatedHours Int?\n  dueDate        DateTime?\n  createdById    String?\n  createdBy      User?     @relation(\"TaskCreator\", fields: [createdById], references: [id], onDelete: SetNull)\n  createdAt      DateTime  @default(now())\n  completedAt    DateTime?\n\n  timeEntries TimeEntry[]\n\n  @@index([projectId])\n  @@index([assigneeId])\n  @@index([status])\n  @@index([priority])\n}\n\nmodel TimeEntry {\n  id          String   @id @default(uuid())\n  taskId      String\n  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  userId      String\n  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  hours       Decimal  @db.Decimal(5, 2)\n  description String?\n  entryDate   DateTime\n  createdAt   DateTime @default(now())\n\n  @@index([taskId])\n  @@index([userId])\n  @@index([entryDate])\n}\n\n// ============================================\n// MARKETING\n// ============================================\n\nmodel MarketingCampaign {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  type           String\n  channel        String       @default(\"email\")\n  provider       String?\n  subject        String?\n  body           String?\n  templateId     String?\n  segmentId      String?\n  audienceSize   Int          @default(0)\n  delayMs        Int          @default(5000)\n  status         String       @default(\"draft\")\n  totalCount     Int          @default(0)\n  sentCount      Int          @default(0)\n  failedCount    Int          @default(0)\n  error          String?\n  scheduledAt    DateTime?\n  startedAt      DateTime?\n  completedAt    DateTime?\n  sentAt         DateTime?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n\n  messages CampaignMessage[]\n\n  @@index([organizationId])\n  @@index([status])\n}\n\nmodel CampaignMessage {\n  id                String            @id @default(uuid())\n  campaignId        String\n  campaign          MarketingCampaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)\n  organizationId    String\n  organization      Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  recipient         String\n  name              String?\n  status            String            @default(\"pending\")\n  error             String?\n  providerMessageId String?\n  sentAt            DateTime?\n  createdAt         DateTime          @default(now())\n\n  @@index([campaignId])\n  @@index([organizationId])\n  @@index([status])\n}\n\nmodel Meeting {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  title          String\n  description    String?\n  date           DateTime\n  endDate        DateTime?\n  location       String?\n  organizerId    String?\n  organizer      User?        @relation(\"MeetingOrganizer\", fields: [organizerId], references: [id], onDelete: SetNull)\n  attendees      String[]\n  status         String       @default(\"scheduled\")\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n\n  @@index([organizationId])\n  @@index([date])\n}\n\nmodel IntegrationCredential {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  provider       String\n  data           String\n  meta           Json         @default(\"{}\")\n  isActive       Boolean      @default(true)\n  lastTestedAt   DateTime?\n  lastTestOk     Boolean?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n\n  @@unique([organizationId, provider])\n  @@index([organizationId])\n}\n\nmodel WhatsappSession {\n  id              String       @id @default(uuid())\n  organizationId  String       @unique\n  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  status          String       @default(\"disconnected\")\n  qr              String?\n  phoneNumber     String?\n  lastConnectedAt DateTime?\n  createdAt       DateTime     @default(now())\n  updatedAt       DateTime     @updatedAt\n}\n\nmodel EmailTemplate {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  subject        String?\n  content        String\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n}\n\nmodel MarketingSegment {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  rules          Json\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n}\n\n// ============================================\n// NOTIFICATIONS & AUDIT\n// ============================================\n\nmodel Notification {\n  id             String       @id @default(uuid())\n  recipientId    String\n  recipient      User         @relation(fields: [recipientId], references: [id], onDelete: Cascade)\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  title          String\n  message        String\n  icon           String?\n  link           String?\n  module         String\n  eventType      String\n  isRead         Boolean      @default(false)\n  metadata       Json?\n  createdAt      DateTime     @default(now())\n  readAt         DateTime?\n\n  @@index([recipientId])\n  @@index([organizationId])\n  @@index([isRead])\n  @@index([createdAt])\n}\n\nmodel AuditLog {\n  id             String   @id @default(uuid())\n  organizationId String\n  entityType     String\n  entityId       String\n  action         String\n  userId         String?\n  changes        Json?\n  ipAddress      String?\n  userAgent      String?\n  createdAt      DateTime @default(now())\n\n  @@index([organizationId])\n  @@index([entityType, entityId])\n  @@index([action])\n  @@index([createdAt])\n}\n\n// ============================================\n// DOCUMENTS & TEMPLATES\n// ============================================\n\nmodel Document {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  entityType     String\n  entityId       String\n  fileName       String\n  fileSize       Int\n  mimeType       String\n  storageKey     String\n  url            String\n  createdById    String?\n  createdBy      User?        @relation(fields: [createdById], references: [id], onDelete: SetNull)\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n  @@index([entityType, entityId])\n}\n\nmodel Template {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  type           String\n  content        String\n  variables      Json?\n  isDefault      Boolean      @default(false)\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n  @@index([type])\n}\n\n// ============================================\n// API & WEBHOOKS\n// ============================================\n\nmodel ApiKey {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name           String\n  keyHash        String       @unique\n  keyPrefix      String\n  permissions    Json         @default(\"[\\\"read\\\"]\")\n  expiresAt      DateTime?\n  lastUsedAt     DateTime?\n  isActive       Boolean      @default(true)\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n  @@index([keyHash])\n}\n\nmodel Webhook {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  url            String\n  secret         String\n  events         String[]\n  isActive       Boolean      @default(true)\n  createdAt      DateTime     @default(now())\n\n  @@index([organizationId])\n}\n\n// ============================================\n// NOVA & AUTOMATIONS\n// ============================================\n\nmodel NovaSkill {\n  id                  String   @id @default(uuid())\n  name                String   @unique\n  description         String\n  requiredPermissions String[]\n  promptTemplate      String\n  tools               Json?\n  isSystem            Boolean  @default(false)\n  createdAt           DateTime @default(now())\n\n  orgSkills NovaOrgSkill[]\n\n  @@index([name])\n}\n\nmodel NovaMessage {\n  id             String   @id @default(uuid())\n  conversationId String\n  organizationId String\n  userId         String\n  role           String\n  content        String\n  toolCalls      Json?\n  metadata       Json?\n  createdAt      DateTime @default(now())\n\n  @@index([conversationId])\n  @@index([organizationId])\n  @@index([userId])\n}\n\nmodel NovaOrgSkill {\n  id             String       @id @default(uuid())\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  skillId        String\n  skill          NovaSkill    @relation(fields: [skillId], references: [id], onDelete: Cascade)\n  installedAt    DateTime     @default(now())\n\n  @@unique([organizationId, skillId])\n  @@index([organizationId])\n  @@index([skillId])\n}\n\nmodel Automation {\n  id              String       @id @default(uuid())\n  organizationId  String\n  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  name            String\n  description     String?\n  triggerType     String\n  triggerConfig   Json\n  conditions      Json?\n  actions         Json\n  status          String       @default(\"draft\")\n  createdBy       String       @default(\"user\")\n  createdByUserId String?\n  lastExecutedAt  DateTime?\n  executionCount  Int          @default(0)\n  successCount    Int          @default(0)\n  failureCount    Int          @default(0)\n  createdAt       DateTime     @default(now())\n  updatedAt       DateTime     @updatedAt\n\n  executions AutomationExecution[]\n\n  @@index([organizationId])\n  @@index([status])\n  @@index([triggerType])\n}\n\nmodel AutomationExecution {\n  id            String     @id @default(uuid())\n  automationId  String\n  automation    Automation @relation(fields: [automationId], references: [id], onDelete: Cascade)\n  triggerData   Json?\n  conditionsMet Boolean    @default(true)\n  results       Json?\n  status        String\n  error         String?\n  durationMs    Int?\n  createdAt     DateTime   @default(now())\n\n  @@index([automationId])\n  @@index([status])\n  @@index([createdAt])\n}\n\n// ============================================\n// MARKETPLACE\n// ============================================\n\nmodel AppInstallation {\n  id             String       @id @default(uuid())\n  appId          String\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  config         Json         @default(\"{}\")\n  isActive       Boolean      @default(true)\n  installedAt    DateTime     @default(now())\n\n  @@unique([appId, organizationId])\n  @@index([appId])\n  @@index([organizationId])\n}\n",
  "inlineSchemaHash": "691381d57f5925ce0fd40334e5b9e590cb0666d19b1615424c2dcff85519f938",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Organization\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"plan\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"settings\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"branches\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchToOrganization\"},{\"name\":\"memberships\",\"kind\":\"object\",\"type\":\"Membership\",\"relationName\":\"MembershipToOrganization\"},{\"name\":\"invitations\",\"kind\":\"object\",\"type\":\"Invitation\",\"relationName\":\"InvitationToOrganization\"},{\"name\":\"crmContacts\",\"kind\":\"object\",\"type\":\"CrmContact\",\"relationName\":\"CrmContactToOrganization\"},{\"name\":\"crmCompanies\",\"kind\":\"object\",\"type\":\"CrmCompany\",\"relationName\":\"CrmCompanyToOrganization\"},{\"name\":\"crmLeads\",\"kind\":\"object\",\"type\":\"CrmLead\",\"relationName\":\"CrmLeadToOrganization\"},{\"name\":\"crmPipelines\",\"kind\":\"object\",\"type\":\"CrmPipeline\",\"relationName\":\"CrmPipelineToOrganization\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"OrganizationToProduct\"},{\"name\":\"productCategories\",\"kind\":\"object\",\"type\":\"ProductCategory\",\"relationName\":\"OrganizationToProductCategory\"},{\"name\":\"warehouses\",\"kind\":\"object\",\"type\":\"Warehouse\",\"relationName\":\"OrganizationToWarehouse\"},{\"name\":\"stockLevels\",\"kind\":\"object\",\"type\":\"StockLevel\",\"relationName\":\"OrganizationToStockLevel\"},{\"name\":\"stockMovements\",\"kind\":\"object\",\"type\":\"StockMovement\",\"relationName\":\"OrganizationToStockMovement\"},{\"name\":\"suppliers\",\"kind\":\"object\",\"type\":\"Supplier\",\"relationName\":\"OrganizationToSupplier\"},{\"name\":\"purchaseOrders\",\"kind\":\"object\",\"type\":\"PurchaseOrder\",\"relationName\":\"OrganizationToPurchaseOrder\"},{\"name\":\"financeAccounts\",\"kind\":\"object\",\"type\":\"FinanceAccount\",\"relationName\":\"FinanceAccountToOrganization\"},{\"name\":\"financeCategories\",\"kind\":\"object\",\"type\":\"FinanceCategory\",\"relationName\":\"FinanceCategoryToOrganization\"},{\"name\":\"financeTransactions\",\"kind\":\"object\",\"type\":\"FinanceTransaction\",\"relationName\":\"FinanceTransactionToOrganization\"},{\"name\":\"departments\",\"kind\":\"object\",\"type\":\"Department\",\"relationName\":\"DepartmentToOrganization\"},{\"name\":\"positions\",\"kind\":\"object\",\"type\":\"Position\",\"relationName\":\"OrganizationToPosition\"},{\"name\":\"employees\",\"kind\":\"object\",\"type\":\"Employee\",\"relationName\":\"EmployeeToOrganization\"},{\"name\":\"projects\",\"kind\":\"object\",\"type\":\"Project\",\"relationName\":\"OrganizationToProject\"},{\"name\":\"salesQuotations\",\"kind\":\"object\",\"type\":\"SalesQuotation\",\"relationName\":\"OrganizationToSalesQuotation\"},{\"name\":\"salesOrders\",\"kind\":\"object\",\"type\":\"SalesOrder\",\"relationName\":\"OrganizationToSalesOrder\"},{\"name\":\"salesInvoices\",\"kind\":\"object\",\"type\":\"SalesInvoice\",\"relationName\":\"OrganizationToSalesInvoice\"},{\"name\":\"salesPayments\",\"kind\":\"object\",\"type\":\"SalesPayment\",\"relationName\":\"OrganizationToSalesPayment\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"NotificationToOrganization\"},{\"name\":\"documents\",\"kind\":\"object\",\"type\":\"Document\",\"relationName\":\"DocumentToOrganization\"},{\"name\":\"templates\",\"kind\":\"object\",\"type\":\"Template\",\"relationName\":\"OrganizationToTemplate\"},{\"name\":\"apiKeys\",\"kind\":\"object\",\"type\":\"ApiKey\",\"relationName\":\"ApiKeyToOrganization\"},{\"name\":\"meetings\",\"kind\":\"object\",\"type\":\"Meeting\",\"relationName\":\"MeetingToOrganization\"},{\"name\":\"webhooks\",\"kind\":\"object\",\"type\":\"Webhook\",\"relationName\":\"OrganizationToWebhook\"},{\"name\":\"automations\",\"kind\":\"object\",\"type\":\"Automation\",\"relationName\":\"AutomationToOrganization\"},{\"name\":\"marketingCampaigns\",\"kind\":\"object\",\"type\":\"MarketingCampaign\",\"relationName\":\"MarketingCampaignToOrganization\"},{\"name\":\"emailTemplates\",\"kind\":\"object\",\"type\":\"EmailTemplate\",\"relationName\":\"EmailTemplateToOrganization\"},{\"name\":\"marketingSegments\",\"kind\":\"object\",\"type\":\"MarketingSegment\",\"relationName\":\"MarketingSegmentToOrganization\"},{\"name\":\"novaOrgSkills\",\"kind\":\"object\",\"type\":\"NovaOrgSkill\",\"relationName\":\"NovaOrgSkillToOrganization\"},{\"name\":\"appInstallations\",\"kind\":\"object\",\"type\":\"AppInstallation\",\"relationName\":\"AppInstallationToOrganization\"},{\"name\":\"integrationCredentials\",\"kind\":\"object\",\"type\":\"IntegrationCredential\",\"relationName\":\"IntegrationCredentialToOrganization\"},{\"name\":\"campaignMessages\",\"kind\":\"object\",\"type\":\"CampaignMessage\",\"relationName\":\"CampaignMessageToOrganization\"},{\"name\":\"whatsappSession\",\"kind\":\"object\",\"type\":\"WhatsappSession\",\"relationName\":\"OrganizationToWhatsappSession\"}],\"dbName\":null},\"Branch\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"BranchToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isHeadquarters\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"warehouses\",\"kind\":\"object\",\"type\":\"Warehouse\",\"relationName\":\"BranchToWarehouse\"},{\"name\":\"employees\",\"kind\":\"object\",\"type\":\"Employee\",\"relationName\":\"BranchToEmployee\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"avatar\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"emailVerifiedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"memberships\",\"kind\":\"object\",\"type\":\"Membership\",\"relationName\":\"MembershipToUser\"},{\"name\":\"refreshTokens\",\"kind\":\"object\",\"type\":\"RefreshToken\",\"relationName\":\"RefreshTokenToUser\"},{\"name\":\"passwordResets\",\"kind\":\"object\",\"type\":\"PasswordReset\",\"relationName\":\"PasswordResetToUser\"},{\"name\":\"emailVerifications\",\"kind\":\"object\",\"type\":\"EmailVerification\",\"relationName\":\"EmailVerificationToUser\"},{\"name\":\"sessions\",\"kind\":\"object\",\"type\":\"Session\",\"relationName\":\"SessionToUser\"},{\"name\":\"assignedTasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskAssignee\"},{\"name\":\"createdTasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskCreator\"},{\"name\":\"timeEntries\",\"kind\":\"object\",\"type\":\"TimeEntry\",\"relationName\":\"TimeEntryToUser\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"NotificationToUser\"},{\"name\":\"documents\",\"kind\":\"object\",\"type\":\"Document\",\"relationName\":\"DocumentToUser\"},{\"name\":\"employees\",\"kind\":\"object\",\"type\":\"Employee\",\"relationName\":\"EmployeeToUser\"},{\"name\":\"organizedMeetings\",\"kind\":\"object\",\"type\":\"Meeting\",\"relationName\":\"MeetingOrganizer\"}],\"dbName\":null},\"RefreshToken\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"RefreshTokenToUser\"},{\"name\":\"tokenHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"revokedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Membership\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MembershipToUser\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"MembershipToOrganization\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"branchIds\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invitedById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invitedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"acceptedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Invitation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"InvitationToOrganization\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"acceptedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"PasswordReset\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PasswordResetToUser\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"usedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"EmailVerification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"EmailVerificationToUser\"},{\"name\":\"token\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"verifiedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Session\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SessionToUser\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastActiveAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"CrmContact\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"CrmContactToOrganization\"},{\"name\":\"companyId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"company\",\"kind\":\"object\",\"type\":\"CrmCompany\",\"relationName\":\"CrmCompanyToCrmContact\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"position\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tags\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customFields\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"crmLeads\",\"kind\":\"object\",\"type\":\"CrmLead\",\"relationName\":\"CrmContactToCrmLead\"},{\"name\":\"salesQuotations\",\"kind\":\"object\",\"type\":\"SalesQuotation\",\"relationName\":\"CrmContactToSalesQuotation\"},{\"name\":\"salesOrders\",\"kind\":\"object\",\"type\":\"SalesOrder\",\"relationName\":\"CrmContactToSalesOrder\"},{\"name\":\"salesInvoices\",\"kind\":\"object\",\"type\":\"SalesInvoice\",\"relationName\":\"CrmContactToSalesInvoice\"},{\"name\":\"projects\",\"kind\":\"object\",\"type\":\"Project\",\"relationName\":\"CrmContactToProject\"}],\"dbName\":null},\"CrmCompany\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"CrmCompanyToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"industry\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"website\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"taxId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"contacts\",\"kind\":\"object\",\"type\":\"CrmContact\",\"relationName\":\"CrmCompanyToCrmContact\"}],\"dbName\":null},\"CrmLead\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"CrmLeadToOrganization\"},{\"name\":\"contactId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contact\",\"kind\":\"object\",\"type\":\"CrmContact\",\"relationName\":\"CrmContactToCrmLead\"},{\"name\":\"pipelineId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pipeline\",\"kind\":\"object\",\"type\":\"CrmPipeline\",\"relationName\":\"CrmLeadToCrmPipeline\"},{\"name\":\"stage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"source\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"score\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"assignedToId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"estimatedValue\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"expectedCloseDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"convertedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lostReason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"activities\",\"kind\":\"object\",\"type\":\"CrmLeadActivity\",\"relationName\":\"CrmLeadToCrmLeadActivity\"}],\"dbName\":null},\"CrmLeadActivity\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"leadId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lead\",\"kind\":\"object\",\"type\":\"CrmLead\",\"relationName\":\"CrmLeadToCrmLeadActivity\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"occurredAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"CrmPipeline\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"CrmPipelineToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stages\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isDefault\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"leads\",\"kind\":\"object\",\"type\":\"CrmLead\",\"relationName\":\"CrmLeadToCrmPipeline\"}],\"dbName\":null},\"ProductCategory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToProductCategory\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"ProductCategory\",\"relationName\":\"CategoryHierarchy\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"ProductCategory\",\"relationName\":\"CategoryHierarchy\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToProductCategory\"}],\"dbName\":null},\"Product\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToProduct\"},{\"name\":\"sku\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"ProductCategory\",\"relationName\":\"ProductToProductCategory\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"hasBatches\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"allowNegativeStock\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"stockLevels\",\"kind\":\"object\",\"type\":\"StockLevel\",\"relationName\":\"ProductToStockLevel\"},{\"name\":\"stockMovements\",\"kind\":\"object\",\"type\":\"StockMovement\",\"relationName\":\"ProductToStockMovement\"},{\"name\":\"purchaseOrderLines\",\"kind\":\"object\",\"type\":\"PurchaseOrderLine\",\"relationName\":\"ProductToPurchaseOrderLine\"},{\"name\":\"salesQuotationItems\",\"kind\":\"object\",\"type\":\"SalesQuotationItem\",\"relationName\":\"ProductToSalesQuotationItem\"},{\"name\":\"salesOrderItems\",\"kind\":\"object\",\"type\":\"SalesOrderItem\",\"relationName\":\"ProductToSalesOrderItem\"},{\"name\":\"salesInvoiceItems\",\"kind\":\"object\",\"type\":\"SalesInvoiceItem\",\"relationName\":\"ProductToSalesInvoiceItem\"}],\"dbName\":null},\"Warehouse\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToWarehouse\"},{\"name\":\"branchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"branch\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchToWarehouse\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"stockLevels\",\"kind\":\"object\",\"type\":\"StockLevel\",\"relationName\":\"StockLevelToWarehouse\"},{\"name\":\"stockMovements\",\"kind\":\"object\",\"type\":\"StockMovement\",\"relationName\":\"StockMovementToWarehouse\"}],\"dbName\":null},\"StockLevel\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToStockLevel\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToStockLevel\"},{\"name\":\"warehouseId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"warehouse\",\"kind\":\"object\",\"type\":\"Warehouse\",\"relationName\":\"StockLevelToWarehouse\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"minimumQuantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"StockMovement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToStockMovement\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToStockMovement\"},{\"name\":\"warehouseId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"warehouse\",\"kind\":\"object\",\"type\":\"Warehouse\",\"relationName\":\"StockMovementToWarehouse\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"unitCost\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"transferId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"referenceType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Supplier\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToSupplier\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taxId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"paymentTerms\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"purchaseOrders\",\"kind\":\"object\",\"type\":\"PurchaseOrder\",\"relationName\":\"PurchaseOrderToSupplier\"}],\"dbName\":null},\"PurchaseOrder\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToPurchaseOrder\"},{\"name\":\"number\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplier\",\"kind\":\"object\",\"type\":\"Supplier\",\"relationName\":\"PurchaseOrderToSupplier\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expectedDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"total\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lines\",\"kind\":\"object\",\"type\":\"PurchaseOrderLine\",\"relationName\":\"PurchaseOrderToPurchaseOrderLine\"}],\"dbName\":null},\"PurchaseOrderLine\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"purchaseOrderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"purchaseOrder\",\"kind\":\"object\",\"type\":\"PurchaseOrder\",\"relationName\":\"PurchaseOrderToPurchaseOrderLine\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToPurchaseOrderLine\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"receivedQuantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"SalesQuotation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToSalesQuotation\"},{\"name\":\"number\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contactId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contact\",\"kind\":\"object\",\"type\":\"CrmContact\",\"relationName\":\"CrmContactToSalesQuotation\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"validUntil\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"taxRate\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"taxAmount\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"total\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"SalesQuotationItem\",\"relationName\":\"SalesQuotationToSalesQuotationItem\"}],\"dbName\":null},\"SalesQuotationItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quotationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quotation\",\"kind\":\"object\",\"type\":\"SalesQuotation\",\"relationName\":\"SalesQuotationToSalesQuotationItem\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToSalesQuotationItem\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"SalesOrder\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToSalesOrder\"},{\"name\":\"number\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quotationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contactId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contact\",\"kind\":\"object\",\"type\":\"CrmContact\",\"relationName\":\"CrmContactToSalesOrder\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"taxAmount\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"total\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"SalesOrderItem\",\"relationName\":\"SalesOrderToSalesOrderItem\"}],\"dbName\":null},\"SalesOrderItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"SalesOrder\",\"relationName\":\"SalesOrderToSalesOrderItem\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToSalesOrderItem\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"SalesInvoice\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToSalesInvoice\"},{\"name\":\"number\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contactId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contact\",\"kind\":\"object\",\"type\":\"CrmContact\",\"relationName\":\"CrmContactToSalesInvoice\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"taxAmount\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"total\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"paidAmount\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"voidedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"SalesInvoiceItem\",\"relationName\":\"SalesInvoiceToSalesInvoiceItem\"},{\"name\":\"payments\",\"kind\":\"object\",\"type\":\"SalesPayment\",\"relationName\":\"SalesInvoiceToSalesPayment\"}],\"dbName\":null},\"SalesInvoiceItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invoiceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invoice\",\"kind\":\"object\",\"type\":\"SalesInvoice\",\"relationName\":\"SalesInvoiceToSalesInvoiceItem\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToSalesInvoiceItem\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"subtotal\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"SalesPayment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToSalesPayment\"},{\"name\":\"invoiceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"invoice\",\"kind\":\"object\",\"type\":\"SalesInvoice\",\"relationName\":\"SalesInvoiceToSalesPayment\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"method\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reference\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"paidAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"FinanceAccount\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"FinanceAccountToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"balance\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"reconciledBalance\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"transactions\",\"kind\":\"object\",\"type\":\"FinanceTransaction\",\"relationName\":\"FinanceAccountToFinanceTransaction\"}],\"dbName\":null},\"FinanceCategory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"FinanceCategoryToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"FinanceCategory\",\"relationName\":\"FinanceCategoryHierarchy\"},{\"name\":\"children\",\"kind\":\"object\",\"type\":\"FinanceCategory\",\"relationName\":\"FinanceCategoryHierarchy\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"transactions\",\"kind\":\"object\",\"type\":\"FinanceTransaction\",\"relationName\":\"FinanceCategoryToFinanceTransaction\"}],\"dbName\":null},\"FinanceTransaction\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"FinanceTransactionToOrganization\"},{\"name\":\"accountId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"account\",\"kind\":\"object\",\"type\":\"FinanceAccount\",\"relationName\":\"FinanceAccountToFinanceTransaction\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"FinanceCategory\",\"relationName\":\"FinanceCategoryToFinanceTransaction\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"referenceType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"transactionDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isReconciled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Department\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"DepartmentToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"managerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"employees\",\"kind\":\"object\",\"type\":\"Employee\",\"relationName\":\"DepartmentToEmployee\"}],\"dbName\":null},\"Position\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToPosition\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"departmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"employees\",\"kind\":\"object\",\"type\":\"Employee\",\"relationName\":\"EmployeeToPosition\"}],\"dbName\":null},\"Employee\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"EmployeeToOrganization\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"EmployeeToUser\"},{\"name\":\"branchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"branch\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchToEmployee\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"departmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"department\",\"kind\":\"object\",\"type\":\"Department\",\"relationName\":\"DepartmentToEmployee\"},{\"name\":\"positionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"position\",\"kind\":\"object\",\"type\":\"Position\",\"relationName\":\"EmployeeToPosition\"},{\"name\":\"hireDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"salary\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"contractType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"absences\",\"kind\":\"object\",\"type\":\"Absence\",\"relationName\":\"AbsenceToEmployee\"},{\"name\":\"evaluations\",\"kind\":\"object\",\"type\":\"Evaluation\",\"relationName\":\"EmployeeToEvaluation\"}],\"dbName\":null},\"Absence\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"employeeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"employee\",\"kind\":\"object\",\"type\":\"Employee\",\"relationName\":\"AbsenceToEmployee\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"approvedById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Evaluation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"employeeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"employee\",\"kind\":\"object\",\"type\":\"Employee\",\"relationName\":\"EmployeeToEvaluation\"},{\"name\":\"period\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"selfScore\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"managerScore\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Project\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToProject\"},{\"name\":\"clientId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"client\",\"kind\":\"object\",\"type\":\"CrmContact\",\"relationName\":\"CrmContactToProject\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"budgetHours\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"tasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"ProjectToTask\"}],\"dbName\":null},\"Task\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"projectId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"project\",\"kind\":\"object\",\"type\":\"Project\",\"relationName\":\"ProjectToTask\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assigneeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TaskAssignee\"},{\"name\":\"priority\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"estimatedHours\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TaskCreator\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"timeEntries\",\"kind\":\"object\",\"type\":\"TimeEntry\",\"relationName\":\"TaskToTimeEntry\"}],\"dbName\":null},\"TimeEntry\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taskId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"task\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskToTimeEntry\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TimeEntryToUser\"},{\"name\":\"hours\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"MarketingCampaign\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"MarketingCampaignToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"channel\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subject\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"body\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"templateId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"segmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"audienceSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"delayMs\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"totalCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"sentCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"failedCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"error\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"messages\",\"kind\":\"object\",\"type\":\"CampaignMessage\",\"relationName\":\"CampaignMessageToMarketingCampaign\"}],\"dbName\":null},\"CampaignMessage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"campaignId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"campaign\",\"kind\":\"object\",\"type\":\"MarketingCampaign\",\"relationName\":\"CampaignMessageToMarketingCampaign\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"CampaignMessageToOrganization\"},{\"name\":\"recipient\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"error\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"providerMessageId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Meeting\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"MeetingToOrganization\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizer\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"MeetingOrganizer\"},{\"name\":\"attendees\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"IntegrationCredential\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"IntegrationCredentialToOrganization\"},{\"name\":\"provider\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"data\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"meta\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lastTestedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastTestOk\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"WhatsappSession\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToWhatsappSession\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"qr\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phoneNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastConnectedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"EmailTemplate\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"EmailTemplateToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"subject\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"MarketingSegment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"MarketingSegmentToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rules\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Notification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"recipientId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"recipient\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NotificationToUser\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"NotificationToOrganization\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"link\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"module\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"eventType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isRead\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"readAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"AuditLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"action\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"changes\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Document\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"DocumentToOrganization\"},{\"name\":\"entityType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storageKey\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"DocumentToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Template\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToTemplate\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"variables\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isDefault\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"ApiKey\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"ApiKeyToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"keyHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"keyPrefix\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"permissions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastUsedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Webhook\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"OrganizationToWebhook\"},{\"name\":\"url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"secret\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"events\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"NovaSkill\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"requiredPermissions\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"promptTemplate\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tools\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isSystem\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"orgSkills\",\"kind\":\"object\",\"type\":\"NovaOrgSkill\",\"relationName\":\"NovaOrgSkillToNovaSkill\"}],\"dbName\":null},\"NovaMessage\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"conversationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toolCalls\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"NovaOrgSkill\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"NovaOrgSkillToOrganization\"},{\"name\":\"skillId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"skill\",\"kind\":\"object\",\"type\":\"NovaSkill\",\"relationName\":\"NovaOrgSkillToNovaSkill\"},{\"name\":\"installedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Automation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"AutomationToOrganization\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"triggerType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"triggerConfig\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"conditions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"actions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdByUserId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastExecutedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"executionCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"successCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"failureCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"executions\",\"kind\":\"object\",\"type\":\"AutomationExecution\",\"relationName\":\"AutomationToAutomationExecution\"}],\"dbName\":null},\"AutomationExecution\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"automationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"automation\",\"kind\":\"object\",\"type\":\"Automation\",\"relationName\":\"AutomationToAutomationExecution\"},{\"name\":\"triggerData\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"conditionsMet\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"results\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"error\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"durationMs\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"AppInstallation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"appId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organizationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"organization\",\"kind\":\"object\",\"type\":\"Organization\",\"relationName\":\"AppInstallationToOrganization\"},{\"name\":\"config\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"installedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

