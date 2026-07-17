// ============================================
// NYVORA ERROR HANDLING
// ============================================

// ============================================
// BASE ERROR CLASSES
// ============================================

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================
// SPECIFIC ERROR CLASSES
// ============================================

export class BadRequestError extends AppError {
  constructor(message: string = 'Solicitud inválida', details?: Record<string, any>) {
    super(message, 'BAD_REQUEST', 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado', details?: Record<string, any>) {
    super(message, 'UNAUTHORIZED', 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado', details?: Record<string, any>) {
    super(message, 'FORBIDDEN', 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado', details?: Record<string, any>) {
    super(message, 'NOT_FOUND', 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto', details?: Record<string, any>) {
    super(message, 'CONFLICT', 409, details);
  }
}

export class ValidationError extends AppError {
  public readonly validationErrors: Array<{ field: string; message: string; code: string }>;

  constructor(
    message: string = 'Error de validación',
    validationErrors: Array<{ field: string; message: string; code: string }> = []
  ) {
    super(message, 'VALIDATION_ERROR', 422, { validationErrors });
    this.validationErrors = validationErrors;
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(message: string = 'Demasiadas solicitudes', retryAfter: number = 60) {
    super(message, 'RATE_LIMITED', 429, { retryAfter });
    this.retryAfter = retryAfter;
  }
}

export class InternalError extends AppError {
  constructor(message: string = 'Error interno del servidor', details?: Record<string, any>) {
    super(message, 'INTERNAL_ERROR', 500, details, false);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Servicio no disponible', details?: Record<string, any>) {
    super(message, 'SERVICE_UNAVAILABLE', 503, details, false);
  }
}

// ============================================
// AUTH SPECIFIC ERRORS
// ============================================

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Credenciales inválidas');
  }
}

export class EmailNotVerifiedError extends UnauthorizedError {
  constructor() {
    super('Email no verificado');
  }
}

export class AccountLockedError extends ForbiddenError {
  constructor(retryAfter: number = 900) {
    super('Cuenta bloqueada temporalmente', { retryAfter });
  }
}

export class SessionExpiredError extends UnauthorizedError {
  constructor() {
    super('Sesión expirada');
  }
}

export class TokenInvalidError extends UnauthorizedError {
  constructor(message: string = 'Token inválido') {
    super(message);
  }
}

export class TokenExpiredError extends UnauthorizedError {
  constructor() {
    super('Token expirado');
  }
}

// ============================================
// RESOURCE SPECIFIC ERRORS
// ============================================

export class UserNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Usuario no encontrado: ${identifier}`);
  }
}

export class WorkspaceNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Workspace no encontrado: ${identifier}`);
  }
}

export class OrganizationNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Organización no encontrada: ${identifier}`);
  }
}

export class BranchNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Sucursal no encontrada: ${identifier}`);
  }
}

export class DepartmentNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Departamento no encontrado: ${identifier}`);
  }
}

export class RoleNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Rol no encontrado: ${identifier}`);
  }
}

export class CustomerNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Cliente no encontrado: ${identifier}`);
  }
}

export class ProductNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Producto no encontrado: ${identifier}`);
  }
}

export class InvoiceNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Factura no encontrada: ${identifier}`);
  }
}

export class OrderNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Pedido no encontrado: ${identifier}`);
  }
}

// ============================================
// CONFLICT ERRORS
// ============================================

export class EmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`El email ya está registrado: ${email}`);
  }
}

export class WorkspaceSlugAlreadyExistsError extends ConflictError {
  constructor(slug: string) {
    super(`El slug del workspace ya existe: ${slug}`);
  }
}

export class UserAlreadyMemberError extends ConflictError {
  constructor(userId: string, workspaceId: string) {
    super(`El usuario ya es miembro del workspace`, { userId, workspaceId });
  }
}

// ============================================
// AI SPECIFIC ERRORS
// ============================================

export class NovaError extends AppError {
  constructor(message: string, code: string = 'NOVA_ERROR', details?: Record<string, any>) {
    super(message, code, 500, details);
  }
}

export class NovaToolExecutionError extends NovaError {
  constructor(toolName: string, error: string) {
    super(`Error ejecutando tool ${toolName}: ${error}`, 'NOVA_TOOL_ERROR', { toolName, error });
  }
}

export class NovaContextError extends NovaError {
  constructor(message: string = 'Error construyendo contexto') {
    super(message, 'NOVA_CONTEXT_ERROR');
  }
}

export class NovaRateLimitError extends NovaError {
  constructor() {
    super('Límite de solicitudes AI alcanzado', 'NOVA_RATE_LIMIT');
  }
}

// ============================================
// ERROR RESPONSE TYPE
// ============================================

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    validationErrors?: Array<{ field: string; message: string; code: string }>;
  };
  timestamp: string;
  requestId?: string;
}

// ============================================
// ERROR HANDLER UTILITY
// ============================================

export function formatErrorResponse(
  error: Error,
  requestId?: string
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        validationErrors: error instanceof ValidationError ? error.validationErrors : undefined,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Error interno del servidor'
        : error.message,
    },
    timestamp: new Date().toISOString(),
    requestId,
  };
}