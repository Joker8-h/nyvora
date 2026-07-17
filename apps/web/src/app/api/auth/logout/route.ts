import { NextRequest, NextResponse } from 'next/server';

async function fetchFromApi(path: string, init?: RequestInit): Promise<Response> {
  const urls = ['http://api:3001', 'http://localhost:3001'];
  for (const base of urls) {
    try {
      return await fetch(`${base}${path}`, { ...init, signal: AbortSignal.timeout(5000) });
    } catch {}
  }
  throw new Error('All API URLs failed');
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;
    if (authHeader) headers['Authorization'] = authHeader;

    const response = await fetchFromApi('/api/v1/auth/logout', {
      method: 'POST',
      headers,
    });

    const data = await response.json();
    const res = NextResponse.json(data, { status: response.status });
    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error?.message || 'Failed to connect to API' } },
      { status: 502 }
    );
  }
}
