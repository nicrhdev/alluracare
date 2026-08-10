// src/app/[locale]/shop/page.tsx

import { prisma } from '@/lib/prisma/client';
import ShopClient from './components/ShopClient';

interface ShopPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string | string[];
    concern?: string | string[];
    skinType?: string | string[];
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    search?: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const isPersian = locale === 'fa';

  // Get search params
  const page = parseInt(search.page || '1');
  const sort = search.sort || 'newest';
  const categories = Array.isArray(search.category) ? search.category : search.category ? [search.category] : [];
  const concerns = Array.isArray(search.concern) ? search.concern : search.concern ? [search.concern] : [];
  const skinTypes = Array.isArray(search.skinType) ? search.skinType : search.skinType ? [search.skinType] : [];
  const brands = Array.isArray(search.brand) ? search.brand : search.brand ? [search.brand] : [];
  const brandNames = brands.length > 0 
  ? brands.map((slug: string) => {
      // Map slug to display name
      const brandMap: Record<string, string> = {
        'anua': 'Anua',
        'beauty-of-joseon': 'Beauty of Joseon',
        'skin-1004': 'SKIN1004',
        'medicube': 'Medicube',
        'axis-y': 'AXIS-Y',
        'dr-althea': 'Dr.Althea',
        'cosrx': 'COSRX',
        'laneige': 'LANEIGE',
        'tocobo': 'TOCOBO',
        'purito': 'Purito',
        'numbuzin': 'numbuzin',
        'the-ordinary': 'The Ordinary',
        'k-secret': 'K-SECRET',
        'some-by-mi': 'SOME BY MI',
        'la-roche-posay': 'La Roche-Posay',
        'arencia': 'Arencia',
      };
      return brandMap[slug] || slug;
    })
  : [];
  const minPrice = parseInt(search.minPrice || '0');
  const maxPrice = parseInt(search.maxPrice || '10000');
  const inStock = search.inStock === 'true';
  const searchQuery = search.search || '';

  // Build filter conditions
  const where: any = {
    isActive: true,
    status: 'PUBLISHED',
  };

  // Search query
  if (searchQuery) {
    where.OR = [
      { nameEn: { contains: searchQuery, mode: 'insensitive' } },
      { nameFa: { contains: searchQuery, mode: 'insensitive' } },
      { descriptionEn: { contains: searchQuery, mode: 'insensitive' } },
      { descriptionFa: { contains: searchQuery, mode: 'insensitive' } },
      { brand: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  // Category filter
  if (categories.length > 0) {
    where.category = {
      slug: { in: categories },
    };
  }

  // Concern filter
  if (concerns.length > 0) {
    where.concerns = {
      some: {
        concern: {
          slug: { in: concerns },
        },
      },
    };
  }

  // Skin Type filter
  if (skinTypes.length > 0) {
    where.skinTypes = {
      some: {
        skinType: {
          slug: { in: skinTypes },
        },
      },
    };
  }

  // Brand filter
  if (brandNames.length > 0) {
  where.brand = {
    in: brandNames,
    mode: 'insensitive',
  };
}

  // Price filter
  if (minPrice > 0 || maxPrice < 10000) {
    where.variants = {
      some: {
        price: {
          gte: minPrice || 0,
          lte: maxPrice || 10000,
        },
      },
    };
  }

  // In stock filter
  if (inStock) {
    where.variants = {
      some: {
        stock: { gt: 0 },
      },
    };
  }

  // Build sorting
  let orderBy: any = {};
  switch (sort) {
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'bestselling':
      orderBy = { createdAt: 'desc' };
      break;
    case 'price-asc':
      orderBy = { variants: { _min: { price: 'asc' } } };
      break;
    case 'price-desc':
      orderBy = { variants: { _min: { price: 'desc' } } };
      break;
    case 'rating':
      orderBy = { reviews: { _avg: { rating: 'desc' } } };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  // Get total count for pagination
  const totalCount = await prisma.product.count({ where });

  // Get products for current page
  const products = await prisma.product.findMany({
    where,
    include: {
      variants: true,
      category: true,
      skinTypes: { select: { skinTypeId: true } },
      concerns: { select: { concernId: true } },
    },
    orderBy,
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  // Get filter options with counts
  const allCategories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      nameEn: true,
      nameFa: true,
      slug: true,
      _count: {
        select: {
          products: {
            where: { isActive: true, status: 'PUBLISHED' },
          },
        },
      },
    },
  });

  const allConcerns = await prisma.concern.findMany({
    where: { isActive: true },
    select: {
      id: true,
      nameEn: true,
      nameFa: true,
      slug: true,
      _count: {
        select: {
          products: {
            where: { product: { isActive: true, status: 'PUBLISHED' } },
          },
        },
      },
    },
  });

  const allSkinTypes = await prisma.skinType.findMany({
    where: { isActive: true },
    select: {
      id: true,
      nameEn: true,
      nameFa: true,
      slug: true,
    },
  });

  // Get unique brands from products
const allBrands = await prisma.product.findMany({
  where: { isActive: true, status: 'PUBLISHED' },
  select: { brand: true },
  distinct: ['brand'],
});

// Also get count for each brand
const brandCounts = await prisma.product.groupBy({
  by: ['brand'],
  where: { isActive: true, status: 'PUBLISHED' },
  _count: {
    brand: true,
  },
});

// Format brands for filters
type BrandWithCount = {
  brand: string | null;
};

type BrandCount = {
  brand: string | null;
  _count: {
    brand: number;
  };
};

const formattedBrands = allBrands
  .filter((b: BrandWithCount) => b.brand)
  .map((b: BrandWithCount) => {
    const count = brandCounts.find((bc: BrandCount) => bc.brand === b.brand)?._count.brand || 0;
    return {
      id: b.brand!,
      label: b.brand!,
      count: count,
    };
  });

  // Format filters for UI
  type CategoryFilter = {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  _count: { products: number };
};

type ConcernFilter = {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  _count: { products: number };
};

type SkinTypeFilter = {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
};

const filters = {
  categories: allCategories.map((c: CategoryFilter) => ({
    id: c.slug,
    label: isPersian ? c.nameFa : c.nameEn,
    count: c._count.products,
  })),
  concerns: allConcerns.map((c: ConcernFilter) => ({
    id: c.slug,
    label: isPersian ? c.nameFa : c.nameEn,
    count: c._count.products,
  })),
  skinTypes: allSkinTypes.map((s: SkinTypeFilter) => ({
    id: s.slug,
    label: isPersian ? s.nameFa : s.nameEn,
    count: 0,
  })),
  brands: formattedBrands,
  priceRange: { min: 0, max: 10000 },
};

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get categories for FilterBar
  const categoriesForFilterBar = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      slug: true,
      nameEn: true,
      nameFa: true,
    },
  });

  return (
    <ShopClient
      initialProducts={products}
      totalCount={totalCount}
      filters={filters}
      locale={locale}
      currentPage={page}
      totalPages={totalPages}
      categories={categoriesForFilterBar}
    />
  );
}