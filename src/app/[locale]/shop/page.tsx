// src/app/[locale]/shop/page.tsx

import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma/client';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface ShopPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { locale } = await params;
  const search = await searchParams;

  const t = await getTranslations('shop');

  // Fetch categories for the filter
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  // Build the where clause for filtering
  const where: any = {
    isActive: true,
    status: 'PUBLISHED',
  };

  // Filter by category if provided
  if (search?.category) {
    const category = await prisma.category.findFirst({
      where: { slug: search.category },
    });
    if (category) {
      where.categoryId = category.id;
    }
  }

  // Search by name or brand
  if (search?.search) {
    const searchTerm = search.search;
    where.OR = [
      { nameEn: { contains: searchTerm, mode: 'insensitive' } },
      { nameFa: { contains: searchTerm, mode: 'insensitive' } },
      { brand: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  // Fetch products with their variants
  const products = await prisma.product.findMany({
    where,
    include: {
      variants: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Get translation for filter bar
  const filterBarTranslations = {
    allCategories: t('allCategories'),
    searchPlaceholder: t('searchPlaceholder'),
  };

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
              {locale === 'fa' ? '✨ محصولات ما' : '✨ Our Products'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2">
            {t('title')}
          </h1>
          <p className="text-brand-text-secondary max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          currentCategory={search?.category || ''}
          currentSearch={search?.search || ''}
          locale={locale}
          t={filterBarTranslations}
        />

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-soft border border-brand-secondary/20">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-brand-text-secondary text-lg">{t('noProducts')}</p>
            <Link
              href={`/${locale}/shop`}
              className="inline-block mt-4 text-brand-primary hover:underline"
            >
              {locale === 'fa' ? 'مشاهده همه محصولات' : 'View all products'}
            </Link>
          </div>
        ) : (
          <>
            {/* Product Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-brand-text-secondary">
                {locale === 'fa'
                  ? `${products.length} محصول یافت شد`
                  : `${products.length} products found`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const lowestPrice = Math.min(...product.variants.map((v) => v.price));
                const hasMultipleVariants = product.variants.length > 1;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    formattedLowestPrice={formatPrice(lowestPrice)}
                    hasMultipleVariants={hasMultipleVariants}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}