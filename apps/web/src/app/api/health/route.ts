import { NextResponse } from 'next/server';
import { getApiBaseUrls } from '@/lib/api-server';

export async function GET() {
  const results: Record<string, string> = {};
  const urls = getApiBaseUrls();

  for (const base of urls) {
    try {
      const res = await fetch(`${base}/api/v1/health`, { signal: AbortSignal.timeout(5000) });
      results[base] = res.ok ? 'ok' : `error:${res.status}`;
    } catch (err: any) {
      results[base] = `unreachable:${err.message}`;
    }
  }

  const apiOk = Object.values(results).some((v) => v === 'ok');

  return NextResponse.json(
    {
      status: apiOk ? 'ok' : 'degraded',
      api: results,
    },
    { status: apiOk ? 200 : 502 }
  );
}
