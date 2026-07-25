import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrls } from '@/lib/api-server';

function stripSecureFlag(cookie: string): string {
  return cookie.replace(/;\s*Secure/gi, '').replace(/;\s*secure/gi, '');
}

async function proxyRequest(
  request: NextRequest,
  path: string[]
): Promise<NextResponse> {
  const targetPath = path.join('/');
  const url = new URL(request.url);
  const search = url.search;

  const headers: Record<string, string> = {};
  const cookieHeader = request.headers.get('cookie');
  const authHeader = request.headers.get('authorization');
  const contentType = request.headers.get('content-type');

  if (cookieHeader) headers['Cookie'] = cookieHeader;
  if (authHeader) headers['Authorization'] = authHeader;
  if (contentType) headers['Content-Type'] = contentType;

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  let lastError: any;
  const urls = getApiBaseUrls();

  for (const baseUrl of urls) {
    try {
      const targetUrl = `${baseUrl}/api/v1/${targetPath}${search}`;
      const response = await fetch(targetUrl, { ...init, signal: AbortSignal.timeout(60000) });
      const data = await response.text();

      const res = new NextResponse(data, {
        status: response.status,
        statusText: response.statusText,
      });

      const setCookie = response.headers.getSetCookie?.() || [];
      for (const cookie of setCookie) {
        res.headers.append('Set-Cookie', stripSecureFlag(cookie));
      }

      const ct = response.headers.get('content-type');
      if (ct) res.headers.set('Content-Type', ct);

      return res;
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    { error: { code: 'BAD_GATEWAY', message: lastError?.message || 'Failed to connect to API server' } },
    { status: 502 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}
