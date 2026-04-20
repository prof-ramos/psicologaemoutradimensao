import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['swisseph', 'astrochart'],
  turbopack: {
    resolveAlias: {
      swisseph: { browser: './src/lib/empty-module.js' },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
    ],
  },
};

export default nextConfig;
