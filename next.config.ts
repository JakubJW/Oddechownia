import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wknpvvtasrhwkqmkvoml.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'qyeaqtbnhktsdcirugjd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
