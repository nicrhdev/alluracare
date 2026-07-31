// src/app/[locale]/admin/orders/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import OrdersClient from './components/OrdersClient';

interface OrdersPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const { locale } = await params;
  const search = await searchParams;

  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/orders`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin.orders');

  // Build where clause for filtering
  const where: any = {};

  if (search?.status) {
    where.status = search.status;
  }

  if (search?.search) {
    where.OR = [
      { orderNumber: { contains: search.search, mode: 'insensitive' } },
      { user: { name: { contains: search.search, mode: 'insensitive' } } },
      { user: { email: { contains: search.search, mode: 'insensitive' } } },
    ];
  }

  // Fetch orders
  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get order status counts for stats
  const stats = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.order.count({ where: { status: 'CANCELLED' } }),
  ]);

  const [total, pending, processing, shipped, delivered, cancelled] = stats;

  return (
    <OrdersClient
      orders={orders}
      locale={locale}
      searchParams={{
        status: search?.status || '',
        search: search?.search || '',
      }}
      stats={{
        total,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
      }}
      t={{
        title: t('title'),
        subtitle: t('subtitle'),
        orderNumber: t('orderNumber'),
        customer: t('customer'),
        date: t('date'),
        total: t('total'),
        status: t('status'),
        actions: t('actions'),
        view: t('view'),
        filterByStatus: t('filterByStatus'),
        allStatuses: t('allStatuses'),
        searchOrders: t('searchOrders'),
        search: t('search'),
        clear: t('clear'),
        noOrders: t('noOrders'),
        statusLabels: {
          PENDING: t('statuses.pending'),
          PROCESSING: t('statuses.processing'),
          SHIPPED: t('statuses.shipped'),
          DELIVERED: t('statuses.delivered'),
          CANCELLED: t('statuses.cancelled'),
          REFUNDED: t('statuses.refunded'),
        },
        stats: {
          total: t('stats.total'),
          pending: t('stats.pending'),
          processing: t('stats.processing'),
          shipped: t('stats.shipped'),
          delivered: t('stats.delivered'),
          cancelled: t('stats.cancelled'),
        },
      }}
    />
  );
}