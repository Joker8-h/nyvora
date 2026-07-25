'use client';

import * as React from 'react';
import type { AuthUser } from '@nyvora/types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // In browser, always use relative path so Next.js proxy route handles host/port transparently
    return '/api/v1';
  }
  return process.env.API_URL || 'http://localhost:3001/api/v1';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      const apiUrl = getApiUrl();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/auth/me`, {
        headers,
        credentials: 'same-origin',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error?.message || 'Error al iniciar sesión');
    }

    const data = await response.json();

    if (data.tokens?.accessToken) {
      localStorage.setItem('access_token', data.tokens.accessToken);
      localStorage.setItem('refresh_token', data.tokens.refreshToken);
    }

    setUser(data.user);
  }

  async function register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  }) {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error?.message || 'Error al registrar');
    }

    const result = await response.json();

    if (result.tokens?.accessToken) {
      localStorage.setItem('access_token', result.tokens.accessToken);
      localStorage.setItem('refresh_token', result.tokens.refreshToken);
    }

    setUser(result.user);
  }

  async function logout() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const apiUrl = getApiUrl();
    await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      credentials: 'same-origin',
    }).catch(() => {});

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  }

  async function refreshUser() {
    await checkAuth();
  }

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    return {
      user: null,
      isLoading: true,
      isAuthenticated: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      refreshUser: async () => {},
    };
  }

  return context;
}
