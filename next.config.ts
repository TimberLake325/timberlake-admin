import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jrm3wrhwseeb6vic.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
