// src/app/sitemap.ts

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://alluracare.vercel.app';

  // ✅ Don't query database during build
  // Return only static pages
  const staticPages = [
    { path: '', priority: 1.0, changefreq: 'daily' },
    { path: '/shop', priority: 0.9, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' },
    { path: '/faq', priority: 0.7, changefreq: 'monthly' },
    { path: '/shipping', priority: 0.5, changefreq: 'monthly' },
    { path: '/returns', priority: 0.5, changefreq: 'monthly' },
    { path: '/privacy', priority: 0.4, changefreq: 'monthly' },
    { path: '/terms', priority: 0.4, changefreq: 'monthly' },
  ];

  const routes: MetadataRoute.Sitemap = [];
  const locales = ['en', 'fa'];

  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq as any,
        priority: page.priority,
      });
    }
  }

  return routes;
}