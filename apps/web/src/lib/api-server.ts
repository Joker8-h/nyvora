export function getApiBaseUrls(): string[] {
  const urls: string[] = [];
  
  if (process.env.API_URL) urls.push(process.env.API_URL.replace(/\/$/, ''));
  if (process.env.NEXT_PUBLIC_API_URL) urls.push(process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''));
  if (process.env.INTERNAL_API_URL) urls.push(process.env.INTERNAL_API_URL.replace(/\/$/, ''));
  if (process.env.RAILWAY_INTERNAL_URL) urls.push(process.env.RAILWAY_INTERNAL_URL.replace(/\/$/, ''));
  
  // Local & Docker fallbacks
  urls.push('http://api:3001');
  urls.push('http://127.0.0.1:3001');
  urls.push('http://localhost:3001');

  // Deduplicate preserving priority order
  return Array.from(new Set(urls.filter(Boolean)));
}

export function getApiBaseUrl(): string {
  return getApiBaseUrls()[0];
}
