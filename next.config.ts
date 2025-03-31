import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `wknpvvtasrhwkqmkvoml.supabase.co`,
      },
      {
        protocol: 'https',
        hostname: `image.mux.com`,
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
};

export default nextConfig;
