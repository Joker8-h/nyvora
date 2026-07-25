import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrls } from '@/lib/api-server';

async function fetchFromApi(path: string, init?: RequestInit): Promise<Response> {
  let lastErr: any;
  const urls = getApiBaseUrls();
  for (const base of urls) {
    try {
      return await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(10000) });
    } catch (err: any) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('All API URLs failed');
}

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;
    if (authHeader) headers['Authorization'] = authHeader;

    const response = await fetchFromApi('/api/v1/auth/me', {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error?.message || 'Failed to connect to API' } },
      { status: 502 }
    );
  }
}
