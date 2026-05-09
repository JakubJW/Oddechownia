import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    rules: {
      './src/assets/*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    dangerouslyAllowLocalIP: true, // Only for private networks
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
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  // webpack(config) {
  //   const fileLoaderRule = config.module.rules.find((rule: any) =>
  //     rule.test?.test?.('.svg')
  //   );

  //   config.module.rules.push({
  //     test: /\.svg$/i,
  //     include: /assets/,
  //     use: ['@svgr/webpack'],
  //   });

  //   if (fileLoaderRule) {
  //     fileLoaderRule.exclude = /assets/;
  //   }

  //   return config;
  // },
};

export default nextConfig;
