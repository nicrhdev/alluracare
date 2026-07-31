// src/app/[locale]/admin/customers/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import CustomersClient from './components/CustomersClient';

interface CustomersPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    search?: string;
  }>;
}

export default async function CustomersPage({ 
  params, 
  searchParams 
}: CustomersPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  
  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/customers`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin.customers');

  // Build where clause for search
  const where: any = {};
  if (search?.search) {
    where.OR = [
      { name: { contains: search.search, mode: 'insensitive' } },
      { email: { contains: search.search, mode: 'insensitive' } },
    ];
  }

  // Fetch customers with their order count and total spent
  const customers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      provider: true,
      role: true,
      orders: {
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate stats
  const totalCustomers = await prisma.user.count();
  const recentCustomers = await prisma.user.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: 'CANCELLED' } },
  });

  // Format customer data with stats
  const formattedCustomers = customers.map((customer) => {
    const orderCount = customer.orders.length;
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
    const lastOrder = customer.orders.length > 0
      ? customer.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null;

    return {
      ...customer,
      orderCount,
      totalSpent,
      lastOrder,
    };
  });

  return (
    <CustomersClient
      customers={formattedCustomers}
      locale={locale}
      searchTerm={search?.search || ''}
      stats={{
        totalCustomers,
        recentCustomers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
      }}
      t={{
        title: t('title'),
        subtitle: t('subtitle'),
        searchPlaceholder: t('searchPlaceholder'),
        search: t('search'),
        clear: t('clear'),
        noCustomers: t('noCustomers'),
        name: t('name'),
        email: t('email'),
        joined: t('joined'),
        orders: t('orders'),
        spent: t('spent'),
        lastOrder: t('lastOrder'),
        view: t('view'),
        stats: {
          totalCustomers: t('stats.totalCustomers'),
          recentCustomers: t('stats.recentCustomers'),
          totalOrders: t('stats.totalOrders'),
          totalRevenue: t('stats.totalRevenue'),
        },
      }}
    />
  );
}