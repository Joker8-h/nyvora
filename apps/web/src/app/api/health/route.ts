import { NextResponse } from 'next/server';

const API_URLS = ['http://api:3001', 'http://localhost:3001'];

export async function GET() {
  const results: Record<string, string> = {};

  for (const base of API_URLS) {
    try {
      const res = await fetch(`${base}/api/v1/health`, { signal: AbortSignal.timeout(5000) });
      results[base] = res.ok ? 'ok' : `error:${res.status}`;
    } catch (err: any) {
      results[base] = `unreachable:${err.message}`;
    }
  }

  const apiOk = Object.values(results).some(v => v === 'ok');

  return NextResponse.json({
    status: apiOk ? 'ok' : 'degraded',
    api: results,
  }, { status: apiOk ? 200 : 502 });
}
