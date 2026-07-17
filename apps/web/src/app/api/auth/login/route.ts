import { NextRequest, NextResponse } from 'next/server';

const API_URLS = ['http://api:3001', 'http://localhost:3001'];

async function fetchFromApi(path: string, init?: RequestInit): Promise<Response> {
  let lastErr: any;
  for (const base of API_URLS) {
    try {
      const res = await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(10000) });
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

    const res = NextResponse.json(data);

    if (data.tokens) {
      res.cookies.set('accessToken', data.tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7200,
        path: '/',
      });
      res.cookies.set('refreshToken', data.tokens.refreshToken, {
        httpOnly: true,
        secure: false,
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
