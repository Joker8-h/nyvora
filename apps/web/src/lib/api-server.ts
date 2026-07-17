function getApiBaseUrl(): string {
  if (process.env.API_URL) return process.env.API_URL;
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return 'http://api:3001';
}

export { getApiBaseUrl };
