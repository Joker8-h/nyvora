
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
