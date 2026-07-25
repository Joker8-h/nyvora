import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrls } from '@/lib/api-server';

async function fetchFromApi(path: string, init?: RequestInit): Promise<Response> {
  let lastErr: any;
  const urls = getApiBaseUrls();
  for (const base of urls) {
    try {
      const res = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(15000) });
      return res;
    } catch (err: any) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('All API URLs failed');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetchFromApi('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const isProd = process.env.NODE_ENV === 'production';
    const res = NextResponse.json(data);

    if (data.tokens) {
      res.cookies.set('accessToken', data.tokens.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7200,
        path: '/',
      });
      res.cookies.set('refreshToken', data.tokens.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error?.message || 'Failed to connect to API' } },
      { status: 502 }
    );
  }
}
