// src/app/[locale]/admin/page.tsx

import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth/adminMiddleware';
import DashboardStats from './components/DashboardStats';
import RecentOrders from './components/RecentOrders';
import { Sparkles } from 'lucide-react';

interface AdminPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  await requireAdmin(locale);

  const t = await getTranslations('admin');
  const isPersian = locale === 'fa';

  // Get stats
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    totalReviews,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.review.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: {
            variant: true,
          },
        },
      },
    }),
  ]);

  const stats = [
    { label: t('stats.totalProducts'), value: totalProducts, icon: '📦' },
    { label: t('stats.totalOrders'), value: totalOrders, icon: '🛒' },
    { label: t('stats.totalCustomers'), value: totalCustomers, icon: '👤' },
    { label: t('stats.pendingOrders'), value: pendingOrders, icon: '⏳' },
    { label: isPersian ? 'مجموع نظرات' : 'Total Reviews', value: totalReviews, icon: '⭐' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-primary" />
        <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
          {isPersian ? '✨ مدیریت' : '✨ Admin'}
        </span>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-brand-text">
          {t('title')}
        </h1>
        <p className="text-brand-text-secondary mt-1">{t('subtitle')}</p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Recent Orders */}
      <div className="mt-6">
        <RecentOrders orders={recentOrders} locale={locale} />
      </div>
    </div>
  );
}