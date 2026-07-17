const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

function processQueue(error: any, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

function getOrganizationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('organization_id');
}

function appendOrgParam(endpoint: string): string {
  const orgId = getOrganizationId();
  if (!orgId) return endpoint;
  const sep = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${sep}organizationId=${orgId}`;
}

function decodeJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'same-origin',
    });

    if (!response.ok) return null;

    const data = await response.json();
    const newAccessToken = data.accessToken || data.tokens?.accessToken;
    const newRefreshToken = data.refreshToken || data.tokens?.refreshToken;

    if (newAccessToken) localStorage.setItem('access_token', newAccessToken);
    if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

    return newAccessToken;
  } catch {
    return null;
  }
}

async function ensureFreshToken(): Promise<string | null> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!token) return null;
  const exp = decodeJwtExp(token);
  const now = Date.now();
  if (exp && exp - now < 5 * 60 * 1000) {
    const refreshed = await tryRefreshToken();
    if (refreshed) return refreshed;
  }
  return token;
}

function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('organization_id');
  window.location.href = '/login';
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  _retried = false,
): Promise<T> {
  const token = await ensureFreshToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const finalEndpoint = appendOrgParam(endpoint);

  const response = await fetch(`${API_BASE}${finalEndpoint}`, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  if (response.status === 401 && !_retried) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
        return fetch(`${API_BASE}${finalEndpoint}`, { ...options, headers: retryHeaders, credentials: 'same-origin' })
          .then((r) => (r.ok ? r.json() : Promise.reject(new ApiError(r.status, 'Sesion expirada'))));
      }) as Promise<T>;
    }

    isRefreshing = true;
    const newToken = await tryRefreshToken();
    processQueue(null, newToken);
    isRefreshing = false;

    if (newToken) {
      return request<T>(endpoint, options, true);
    }

    clearSession();
    throw new ApiError(401, 'Sesion expirada');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.message || response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
