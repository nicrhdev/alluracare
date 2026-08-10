// src/app/[locale]/shop/brand/[slug]/page.tsx

import { prisma } from '@/lib/prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '@/components/home/ProductGrid';

interface BrandPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale, slug } = await params;
  const isPersian = locale === 'fa';

  // Find the brand (using the brand field on Product)
  const products = await prisma.product.findMany({
    where: {
      brand: {
        // Match brand by slug (you'll need to store brand slug on products)
        // For now, we'll use a simple text match
        contains: slug.replace(/-/g, ' '),
        mode: 'insensitive',
      },
      isActive: true,
      status: 'PUBLISHED',
    },
    include: {
      variants: true,
      category: true,
    },
  });

  if (products.length === 0) {
    notFound();
  }

  // Get brand name from first product
  const brandName = products[0]?.brand || slug.replace(/-/g, ' ');

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Back button */}
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {isPersian ? 'بازگشت به فروشگاه' : 'Back to Shop'}
        </Link>

        {/* Brand Header */}
        <div className="mb-8">
          <h1 className="heading-1 text-brand-text mb-2">
            {brandName}
          </h1>
          <p className="text-brand-text-secondary">
            {isPersian
              ? `${products.length} محصول از برند ${brandName}`
              : `${products.length} products from ${brandName}`}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          locale={locale}
          title=""
        />
      </div>
    </div>
  );
}