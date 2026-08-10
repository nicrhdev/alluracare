// src/app/robots.ts

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/fa/',
        '/en/',
      ],
      disallow: [
        '/api/',
        '/admin/',
        '/checkout/success?',
        '/_next/',
        '/login?',
        '/register?',
      ],
    },
    sitemap: [
      'https://alluracare.com/sitemap.xml',
      'https://alluracare.com/fa/sitemap.xml', // Persian sitemap
    ],
  };
}