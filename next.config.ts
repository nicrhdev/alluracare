import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Your existing Next.js config options go here
  // For now, it's empty, but we can add options later
};

export default withNextIntl(nextConfig);