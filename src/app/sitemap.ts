// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alluracare.com';

  // Get all products for sitemap
  const products = await prisma.product.findMany({
    where: { isActive: true, status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  // Get all categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  // Static pages with Persian priority (fa first, then en)
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

  // Add Persian pages FIRST (higher priority)
  const locales = ['fa', 'en'];
  for (const page of staticPages) {
    // Persian first - higher priority
    routes.push({
      url: `${baseUrl}/fa${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changefreq as any,
      priority: page.priority + 0.1, // Persian pages get +0.1 priority
    });

    // English pages - standard priority
    routes.push({
      url: `${baseUrl}/en${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changefreq as any,
      priority: page.priority,
    });
  }

  // Add product pages - Persian first
  for (const product of products) {
    routes.push({
      url: `${baseUrl}/fa/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
    routes.push({
      url: `${baseUrl}/en/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Add category pages - Persian first
  for (const category of categories) {
    routes.push({
      url: `${baseUrl}/fa/shop?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    routes.push({
      url: `${baseUrl}/en/shop?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return routes;
}