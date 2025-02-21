import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
      }
    ]
  },
};

export default withNextVideo(nextConfig);