'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

// ============================================
// AUTH HOOKS
// ============================================

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<{ tokens: { accessToken: string; refreshToken: string }; user: any }>(
        '/auth/login',
        data,
      ),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.accessToken);
      localStorage.setItem('refresh_token', data.tokens.refreshToken);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: any) => api.post('/auth/register', data),
    onSuccess: (data: any) => {
      localStorage.setItem('access_token', data.tokens.accessToken);
      localStorage.setItem('refresh_token', data.tokens.refreshToken);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => api.post('/auth/logout', {}),
    onSettled: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<{ user: any }>('/auth/me'),
    retry: false,
  });
}

// ============================================
// CRM HOOKS
// ============================================

export function useContacts(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('query', params.search);
  const qs = query.toString();
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => api.get<any>(`/crm/contacts${qs ? `?${qs}` : ''}`),
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => api.get<any>(`/crm/contacts/${id}`),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/crm/contacts', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/crm/contacts/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/crm/contacts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });
}

export function useCompanies(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => api.get<any>(`/crm/companies${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/crm/companies', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/crm/companies/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  });
}

export function useDeleteCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/crm/companies/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  });
}

export function useLeads(params?: { page?: number; limit?: number; stage?: string; status?: string; pipelineId?: string; query?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.stage) query.set('stage', params.stage);
  if (params?.status) query.set('status', params.status);
  if (params?.pipelineId) query.set('pipelineId', params.pipelineId);
  if (params?.query) query.set('query', params.query);
  const qs = query.toString();
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => api.get<any>(`/crm/leads${qs ? `?${qs}` : ''}`),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => api.get<any>(`/crm/leads/${id}`),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/crm/leads', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['contacts'] });
      qc.invalidateQueries({ queryKey: ['pipelines'] });
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/crm/leads/${id}`, data),
    onSuccess: (_r, v: any) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      if (v?.id) qc.invalidateQueries({ queryKey: ['lead', v.id] });
    },
  });
}

export function useMoveLeadStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => api.patch(`/crm/leads/${id}/stage`, { stage }),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead', v.id] });
    },
  });
}

export function useConvertLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/crm/leads/${id}/convert`, {}),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead', id] });
      qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useMarkLeadLost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => api.post(`/crm/leads/${id}/lost`, { reason }),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead', v.id] });
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/crm/leads/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  });
}

export function useLeadActivities(leadId: string) {
  return useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: () => api.get<any>(`/crm/leads/${leadId}/activities`),
    enabled: !!leadId,
  });
}

export function useCreateLeadActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, ...data }: any) => api.post(`/crm/leads/${leadId}/activities`, data),
    onSuccess: (_r, v: any) => {
      qc.invalidateQueries({ queryKey: ['lead-activities', v.leadId] });
      qc.invalidateQueries({ queryKey: ['lead', v.leadId] });
    },
  });
}

export function usePipelines() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => api.get<any>('/crm/pipelines'),
  });
}

export function useCreatePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/crm/pipelines', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipelines'] }),
  });
}

export function useUpdatePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/crm/pipelines/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipelines'] }),
  });
}

export function useDeletePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/crm/pipelines/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipelines'] }),
  });
}

// ============================================
// SALES HOOKS
// ============================================

export function useQuotations(params?: { page?: number; limit?: number; status?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return useQuery({
    queryKey: ['quotations', params],
    queryFn: () => api.get<any>(`/sales/quotations${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/sales/quotations', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
}

export function useUpdateQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/sales/quotations/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
}

export function useDeleteQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sales/quotations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }),
  });
}

export function useOrders(params?: { page?: number; limit?: number; status?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => api.get<any>(`/sales/orders${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/sales/orders', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/sales/orders/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sales/orders/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useInvoices(params?: { page?: number; limit?: number; status?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => api.get<any>(`/sales/invoices${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/sales/invoices', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/sales/invoices/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sales/invoices/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function usePayments(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => api.get<any>(`/sales/payments${qs ? `?${qs}` : ''}`),
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/sales/payments', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  });
}

export function useDeletePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sales/payments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  });
}

// ============================================
// INVENTORY HOOKS
// ============================================

export function useProducts(params?: { page?: number; limit?: number; search?: string; categoryId?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('query', params.search);
  if (params?.categoryId) query.set('categoryId', params.categoryId);
  const qs = query.toString();
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<any>(`/inventory/products${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/inventory/products', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/inventory/products/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/inventory/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<any>('/inventory/categories'),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/inventory/categories', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/inventory/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/inventory/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useWarehouses() {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: () => api.get<any>('/inventory/warehouses'),
  });
}

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/inventory/warehouses', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  });
}

export function useUpdateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/inventory/warehouses/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/inventory/warehouses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  });
}

export function useStock(productId: string) {
  return useQuery({
    queryKey: ['stock', productId],
    queryFn: () => api.get<any>(`/inventory/stock/${productId}`),
    enabled: !!productId,
  });
}

export function useUpdateStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/inventory/stock/movements', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stock'] }),
  });
}

// ============================================
// FINANCE HOOKS
// ============================================

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get<any>('/finance/accounts'),
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/finance/accounts', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/finance/accounts/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/finance/accounts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useFinanceCategories() {
  return useQuery({
    queryKey: ['finance-categories'],
    queryFn: () => api.get<any>('/finance/categories'),
  });
}

export function useCreateFinanceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/finance/categories', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['finance-categories'] }),
  });
}

export function useUpdateFinanceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/finance/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['finance-categories'] }),
  });
}

export function useDeleteFinanceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/finance/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['finance-categories'] }),
  });
}

export function useTransactions(params?: { page?: number; limit?: number; type?: string; accountId?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.type) query.set('type', params.type);
  if (params?.accountId) query.set('accountId', params.accountId);
  const qs = query.toString();
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.get<any>(`/finance/transactions${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/finance/transactions', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/finance/transactions/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/finance/transactions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useProfitLoss(params?: { from?: string; to?: string }) {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  const qs = query.toString();
  return useQuery({
    queryKey: ['profit-loss', params],
    queryFn: () => api.get<any>(`/finance/reports/profit-loss${qs ? `?${qs}` : ''}`),
  });
}

export function useBalanceSheet() {
  return useQuery({
    queryKey: ['balance-sheet'],
    queryFn: () => api.get<any>('/finance/reports/balance-sheet'),
  });
}

// ============================================
// HR HOOKS
// ============================================

export function useEmployees(params?: { page?: number; limit?: number; departmentId?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.departmentId) query.set('departmentId', params.departmentId);
  const qs = query.toString();
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => api.get<any>(`/hr/employees${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/hr/employees', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/hr/employees/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/hr/employees/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function usePositions() {
  return useQuery({
    queryKey: ['positions'],
    queryFn: () => api.get<any>('/hr/positions'),
  });
}

export function useCreatePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/hr/positions', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['positions'] }),
  });
}

export function useUpdatePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/hr/positions/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['positions'] }),
  });
}

export function useDeletePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/hr/positions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['positions'] }),
  });
}

export function useAbsences(params?: { page?: number; limit?: number; employeeId?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.employeeId) query.set('employeeId', params.employeeId);
  const qs = query.toString();
  return useQuery({
    queryKey: ['absences', params],
    queryFn: () => api.get<any>(`/hr/absences${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateAbsence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/hr/absences', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['absences'] }),
  });
}

export function useUpdateAbsence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/hr/absences/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['absences'] }),
  });
}

export function useDeleteAbsence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/hr/absences/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['absences'] }),
  });
}

export function useEvaluations(params?: { page?: number; limit?: number; employeeId?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.employeeId) query.set('employeeId', params.employeeId);
  const qs = query.toString();
  return useQuery({
    queryKey: ['evaluations', params],
    queryFn: () => api.get<any>(`/hr/evaluations${qs ? `?${qs}` : ''}`),
  });
}

export function useCreateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/hr/evaluations', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['evaluations'] }),
  });
}

export function useUpdateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/hr/evaluations/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['evaluations'] }),
  });
}

export function useDeleteEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/hr/evaluations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['evaluations'] }),
  });
}

// ============================================
// SETTINGS HOOKS
// ============================================

export function useOrganization() {
  return useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const data = await api.get<any[]>('/organizations');
      return data?.[0] || null;
    },
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const orgId = localStorage.getItem('organization_id');
      const current = qc.getQueryData<any>(['organization']);
      const settings = { ...(current?.settings || {}), ...(data.settings || {}) };
      return api.put(`/organizations/${orgId}`, { ...data, settings });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organization'] }),
  });
}

export function useOrganizationUsers() {
  return useQuery({
    queryKey: ['organization-users'],
    queryFn: () => api.get<any>('/users'),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/users/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organization-users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['organization-users'] }),
  });
}

export function useInvitations() {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: () => api.get<any>('/invitations'),
  });
}

export function useCreateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; role: string }) => api.post('/invitations', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  });
}

export function useRevokeInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/invitations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  });
}

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: () => api.get<any>('/branches'),
  });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/branches', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/branches/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useDeleteBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/branches/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<any>('/departments'),
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/departments', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/departments/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/departments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

// ============================================
// AUTOMATIONS
// ============================================

export function useAutomations(params?: { status?: string }) {
  return useQuery({
    queryKey: ['automations', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      return api.get<any>(`/automations?${searchParams.toString()}`);
    },
  });
}

export function useCreateAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/automations', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useToggleAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/automations/${id}/toggle`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useDeleteAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/automations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useExecuteAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/automations/${id}/execute`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

// ============================================
// MARKETPLACE
// ============================================

export function useMarketplaceCatalog() {
  return useQuery({
    queryKey: ['marketplace-catalog'],
    queryFn: () => api.get<any[]>('/marketplace/apps/catalog'),
  });
}

export function useMarketplaceApps() {
  return useQuery({
    queryKey: ['marketplace-apps'],
    queryFn: () => api.get<any>('/marketplace/apps'),
  });
}

export function useInstallApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { appId: string; config?: any }) =>
      api.post('/marketplace/apps/install', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace-catalog'] });
      qc.invalidateQueries({ queryKey: ['marketplace-apps'] });
    },
  });
}

export function useUninstallApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appId: string) => api.delete(`/marketplace/apps/${appId}/uninstall`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace-catalog'] });
      qc.invalidateQueries({ queryKey: ['marketplace-apps'] });
    },
  });
}

export function useUpdateAppConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, config }: { id: string; config: Record<string, string> }) =>
      api.put(`/marketplace/apps/${id}/config`, { config }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace-catalog'] });
      qc.invalidateQueries({ queryKey: ['marketplace-apps'] });
    },
  });
}

// ============================================
// INTEGRATIONS
// ============================================

export interface IntegrationCredential {
  id: string;
  provider: string;
  isActive: boolean;
  fields: Record<string, string>;
  lastTestedAt: string | null;
  lastTestOk: boolean | null;
  updatedAt: string;
}

export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => api.get<{ data: IntegrationCredential[]; total: number }>('/integrations'),
  });
}

export function useUpsertIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ provider, data }: { provider: string; data: Record<string, string> }) =>
      api.put(`/integrations/${provider}`, { data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export function useTestIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (provider: string) =>
      api.post<{ ok: boolean; provider: string; error?: string }>(`/integrations/${provider}/test`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export function useDeleteIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (provider: string) => api.delete(`/integrations/${provider}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export interface WhatsappSessionStatus {
  organizationId: string;
  status: 'disconnected' | 'connecting' | 'qr' | 'connected';
  qr: string | null;
  phoneNumber: string | null;
}

export function useWhatsappSession(poll = false) {
  return useQuery({
    queryKey: ['whatsapp-session'],
    queryFn: () => api.get<WhatsappSessionStatus>('/integrations/whatsapp/session'),
    refetchInterval: poll ? 3000 : false,
  });
}

export function useStartWhatsappSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/integrations/whatsapp/session/start', {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['whatsapp-session'] }),
  });
}

export function useLogoutWhatsappSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/integrations/whatsapp/session/logout', {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['whatsapp-session'] }),
  });
}

// ============================================
// CAMPAIGNS
// ============================================

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  provider: string | null;
  subject: string | null;
  body: string;
  delayMs: number;
  status: string;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Array<{ id: string; recipient: string; status: string; error: string | null }>;
}

export function useCampaigns(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => api.get<{ data: Campaign[]; total: number; page: number; limit: number }>(`/campaigns${qs ? `?${qs}` : ''}`),
    refetchInterval: (query) => {
      const rows = query.state.data?.data ?? [];
      return rows.some((c) => c.status === 'sending') ? 3000 : false;
    },
  });
}

export function useCampaign(id: string, poll = false) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => api.get<Campaign>(`/campaigns/${id}`),
    enabled: !!id,
    refetchInterval: poll ? 3000 : false,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<Campaign>('/campaigns', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/campaigns/${id}`, data),
    onSuccess: (_r, v: any) => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      if (v?.id) qc.invalidateQueries({ queryKey: ['campaign', v.id] });
    },
  });
}

export function useStartCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, recipients }: { id: string; recipients?: Array<{ to: string; name?: string }> }) =>
      api.post(`/campaigns/${id}/start`, { recipients }),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      qc.invalidateQueries({ queryKey: ['campaign', v.id] });
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/campaigns/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

// ============================================
// PROJECTS HOOKS
// ============================================

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  budgetHours: number | null;
  clientId: string | null;
  createdById: string | null;
  createdAt: string;
  deletedAt: string | null;
  tasks?: Array<{ id: string; status: string }>;
  client?: { id: string; firstName: string; lastName: string; company?: { name: string } | null } | null;
}

export function useProjects(params?: { page?: number; limit?: number; status?: string; query?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status) query.set('status', params.status);
  if (params?.query) query.set('query', params.query);
  const qs = query.toString();
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => api.get<{ data: Project[]; total: number; page: number; limit: number }>(`/projects${qs ? `?${qs}` : ''}`),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get<Project>(`/projects/${id}`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<Project>('/projects', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/projects/${id}`, data),
    onSuccess: (_r, v: any) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      if (v?.id) qc.invalidateQueries({ queryKey: ['project', v.id] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

// ============================================
// TASKS HOOKS
// ============================================

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  priority: string;
  status: string;
  estimatedHours: number | null;
  dueDate: string | null;
  createdById: string | null;
  createdAt: string;
  completedAt: string | null;
  assignee?: { id: string; firstName: string; lastName: string; email: string } | null;
  project?: { id: string; name: string } | null;
}

export function useTasks(params?: {
  page?: number;
  limit?: number;
  projectId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  query?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.projectId) query.set('projectId', params.projectId);
  if (params?.assigneeId) query.set('assigneeId', params.assigneeId);
  if (params?.status) query.set('status', params.status);
  if (params?.priority) query.set('priority', params.priority);
  if (params?.query) query.set('query', params.query);
  const qs = query.toString();
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => api.get<{ data: Task[]; total: number; page: number; limit: number }>(`/tasks${qs ? `?${qs}` : ''}`),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => api.get<Task>(`/tasks/${id}`),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post<Task>('/tasks', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/tasks/${id}`, data),
    onSuccess: (_r, v: any) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['task', v.id] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// ============================================
// NOVA CONVERSATIONS
// ============================================

export interface NovaConversationSummary {
  conversationId: string;
  lastMessage: string;
  updatedAt: string;
}

export function useNovaConversations() {
  return useQuery({
    queryKey: ['nova-conversations'],
    queryFn: () => api.get<NovaConversationSummary[]>('/ai/nova/conversations'),
  });
}

export function useImportContacts() {
  return useMutation({
    mutationFn: (rows: any[]) => api.post('/crm/import/contacts', { rows }),
  });
}

export function useImportEmployees() {
  return useMutation({
    mutationFn: (rows: any[]) => api.post('/crm/import/employees', { rows }),
  });
}

export function useImportCompanies() {
  return useMutation({
    mutationFn: (rows: any[]) => api.post('/crm/import/companies', { rows }),
  });
}

export function useNovaConversation(id: string | null) {
  return useQuery({
    queryKey: ['nova-conversation', id],
    queryFn: () => api.get<{ conversationId: string; messages: any[] }>(`/ai/nova/conversations/${id}`),
    enabled: !!id,
  });
}

export function useDeleteNovaConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/ai/nova/conversations/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nova-conversations'] });
    },
  });
}
