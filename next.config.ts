// next.config.ts

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // ✅ Show detailed errors in production (temporarily)
  productionBrowserSourceMaps: true,

  // ✅ Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Remove eslint from config (it goes in package.json, not here)

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  compress: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);