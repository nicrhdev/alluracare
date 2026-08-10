// src/app/[locale]/admin/customers/[id]/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import CustomerDetailClient from './components/CustomerDetailClient';

interface CustomerDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { locale, id } = await params;
  
  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/customers/${id}`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin.customers');

  // Fetch customer with orders
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      provider: true,
      role: true,
      orders: {
        include: {
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
      },
      addresses: true,
    },
  });

  if (!customer) {
    notFound();
  }

  // Calculate stats
  const orderCount = customer.orders.length;
  const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + order.total, 0);
  const averageOrder = orderCount > 0 ? totalSpent / orderCount : 0;

  // Format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Format orders for display
  const formattedOrders = customer.orders.map((order) => ({
    ...order,
    formattedDate: formatDate(order.createdAt),
    formattedTotal: formatPrice(order.total),
    items: order.items.map((item) => ({
      ...item,
      productName: locale === 'fa' ? item.variant.product.nameFa : item.variant.product.nameEn,
    })),
  }));

  return (
    <CustomerDetailClient
      customer={{
        ...customer,
        formattedCreatedAt: formatDate(customer.createdAt),
        formattedTotalSpent: formatPrice(totalSpent),
        formattedAverageOrder: formatPrice(averageOrder),
        orderCount,
        totalSpent,
        averageOrder,
        orders: formattedOrders,
      }}
      locale={locale}
      t={{
        backToCustomers: t('backToCustomers'),
        customerDetails: t('customerDetails'),
        accountInfo: t('accountInfo'),
        name: t('name'),
        email: t('email'),
        joined: t('joined'),
        provider: t('provider'),
        role: t('role'),
        orderHistory: t('orderHistory'),
        noOrders: t('noOrders'),
        orderNumber: t('orderNumber'),
        date: t('date'),
        items: t('items'),
        total: t('total'),
        status: t('status'),
        orderCount: t('orderCount'),
        totalSpent: t('totalSpent'),
        averageOrder: t('averageOrder'),
        addresses: t('addresses'),
        noAddresses: t('noAddresses'),
        statusLabels: {
          PENDING: t('statuses.pending'),
          PROCESSING: t('statuses.processing'),
          SHIPPED: t('statuses.shipped'),
          DELIVERED: t('statuses.delivered'),
          CANCELLED: t('statuses.cancelled'),
          REFUNDED: t('statuses.refunded'),
        },
      }}
    />
  );
}