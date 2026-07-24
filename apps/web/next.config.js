/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nyvora/ui', '@nyvora/shared', '@nyvora/types'],
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@nyvora/ui', 'lucide-react'],
  },
  headers: async () => [
    {
      source: '/login',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        { key: 'Pragma', value: 'no-cache' },
        { key: 'Expires', value: '0' },
        { key: 'Surrogate-Control', value: 'no-store' },
      ],
    },
    {
      source: '/register',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        { key: 'Pragma', value: 'no-cache' },
        { key: 'Expires', value: '0' },
        { key: 'Surrogate-Control', value: 'no-store' },
      ],
    },
  ],
};

module.exports = nextConfig;
