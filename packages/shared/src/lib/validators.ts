import { z } from 'zod';

// ============================================
// AUTH VALIDATORS
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'Nombre requerido').max(50),
  lastName: z.string().min(1, 'Apellido requerido').max(50),
  companyName: z.string().min(2, 'Nombre de empresa requerido').max(100).optional(),
  workspaceName: z.string().min(2, 'Nombre de workspace requerido').max(100).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// ============================================
// USER VALIDATORS
// ============================================

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Email inválido'),
  roleId: z.string().min(1, 'Rol requerido'),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  message: z.string().max(500).optional(),
});

// ============================================
// WORKSPACE VALIDATORS
// ============================================

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  settings: z.object({
    timezone: z.string().optional(),
    currency: z.string().optional(),
    language: z.string().optional(),
  }).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  settings: z.object({
    timezone: z.string().optional(),
    currency: z.string().optional(),
    language: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }).optional(),
});

// ============================================
// ORGANIZATION VALIDATORS
// ============================================

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  type: z.enum(['COMPANY', 'BRANCH', 'DEPARTMENT']),
  parentId: z.string().optional(),
  currency: z.string().default('COP'),
  timezone: z.string().default('America/Bogota'),
  locale: z.string().default('es'),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

// ============================================
// BRANCH VALIDATORS
// ============================================

export const createBranchSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(10).regex(/^[A-Z0-9-]+$/, 'Solo mayúsculas, números y guiones'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  timezone: z.string().default('America/Bogota'),
  currency: z.string().default('COP'),
  isHeadquarter: z.boolean().default(false),
});

export const updateBranchSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  isHeadquarter: z.boolean().optional(),
  settings: z.record(z.any()).optional(),
});

// ============================================
// DEPARTMENT VALIDATORS
// ============================================

export const createDepartmentSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(10).regex(/^[A-Z0-9-]+$/),
  parentId: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  parentId: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

// ============================================
// ROLE & PERMISSION VALIDATORS
// ============================================

export const createRoleSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const assignRoleSchema = z.object({
  userId: z.string().min(1, 'Usuario requerido'),
  roleId: z.string().min(1, 'Rol requerido'),
});

// ============================================
// NOVA AI VALIDATORS
// ============================================

export const novaChatSchema = z.object({
  message: z.string().min(1, 'Mensaje requerido').max(4000),
  conversationId: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export const novaToolCallSchema = z.object({
  toolName: z.string().min(1),
  arguments: z.record(z.any()),
  conversationId: z.string().optional(),
});

// ============================================
// PAGINATION VALIDATORS
// ============================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  search: z.string().optional(),
  filters: z.record(z.any()).optional(),
  dateRange: z.object({
    from: z.string(),
    to: z.string(),
  }).optional(),
});

// ============================================
// TYPES
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type NovaChatInput = z.infer<typeof novaChatSchema>;
export type NovaToolCallInput = z.infer<typeof novaToolCallSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;