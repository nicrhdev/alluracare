// src/app/[locale]/admin/products/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import ProductsClient from './components/ProductsClient';

interface ProductsPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const search = await searchParams;

  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/products`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin.products');

  // Build the where clause
  const where: any = {};

  // Search filter
  if (search?.search) {
    where.OR = [
      { nameEn: { contains: search.search, mode: 'insensitive' } },
      { nameFa: { contains: search.search, mode: 'insensitive' } },
      { brand: { contains: search.search, mode: 'insensitive' } },
    ];
  }

  // Status filter - default to 'all' if not specified
  const statusFilter = search?.status || 'all';
  if (statusFilter !== 'all') {
    where.status = statusFilter;
  }

  // Fetch products directly from database
  let products: any[] = [];
  let fetchError: string | null = null;

  try {
    products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        category: true,
        skinTypes: {
          include: {
            skinType: true,
          },
        },
        concerns: {
          include: {
            concern: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    fetchError = 'Failed to load products. Please try again.';
  }

  // Get status counts for the filter badges
  const statusCounts = await prisma.$transaction([
    prisma.product.count({ where: { status: 'DRAFT' } }),
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.product.count({ where: { status: 'ARCHIVED' } }),
    prisma.product.count(),
  ]);

  const [draftCount, publishedCount, archivedCount, totalCount] = statusCounts;

  return (
    <ProductsClient
      products={products}
      locale={locale}
      searchTerm={search?.search || ''}
      statusFilter={statusFilter}
      fetchError={fetchError}
      statusCounts={{
        all: totalCount,
        draft: draftCount,
        published: publishedCount,
        archived: archivedCount,
      }}
      t={{
        title: t('title'),
        subtitle: t('subtitle'),
        addProduct: t('addProduct'),
        searchPlaceholder: t('searchPlaceholder'),
        search: t('search'),
        clear: t('clear'),
        noProducts: t('noProducts'),
        addFirstProduct: t('addFirstProduct'),
        deleteConfirm: t('deleteConfirm'),
        deleteCancel: t('deleteCancel'),
        status: t('status'),
        allStatuses: t('allStatuses'),
        draft: t('draft'),
        published: t('published'),
        archived: t('archived'),
      }}
    />
  );
}