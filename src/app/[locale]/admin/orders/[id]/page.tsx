// src/app/[locale]/admin/orders/[id]/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import OrderDetailClient from './components/OrderDetailClient';

interface OrderDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale, id } = await params;

  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/orders/${id}`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin.orders');

  // Fetch order details
  const order = await prisma.order.findUnique({
    where: { id },
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
  });

  if (!order) {
    notFound();
  }

  // Format shipping address
  const shippingAddress = order.shippingAddress as {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Format dates and prices on the server
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

  // Prepare formatted order data for the client
  const formattedOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    subtotal: order.subtotal,
    createdAt: order.createdAt,
    formattedCreatedAt: formatDate(order.createdAt),
    formattedTotal: formatPrice(order.total),
    formattedSubtotal: formatPrice(order.subtotal),
    user: {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
    },
    items: order.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      formattedPrice: formatPrice(item.price),
      formattedItemTotal: formatPrice(item.price * item.quantity),
      variant: {
        id: item.variant.id,
        size: item.variant.size,
        product: {
          id: item.variant.product.id,
          nameEn: item.variant.product.nameEn,
          nameFa: item.variant.product.nameFa,
        },
      },
    })),
  };

  // Format shipping address for display
  const formattedShippingAddress = {
    fullName: shippingAddress.fullName,
    email: shippingAddress.email,
    phone: shippingAddress.phone || 'N/A',
    street: shippingAddress.street,
    city: shippingAddress.city,
    state: shippingAddress.state || 'N/A',
    zipCode: shippingAddress.zipCode || 'N/A',
    country: shippingAddress.country,
  };

  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <OrderDetailClient
      order={formattedOrder}
      shippingAddress={formattedShippingAddress}
      subtotal={subtotal}
      locale={locale}
      t={{
        backToOrders: t('backToOrders'),
        orderNumber: t('orderNumber'),
        orderDate: t('orderDate'),
        orderStatus: t('orderStatus'),
        customerInfo: t('customerInfo'),
        shippingInfo: t('shippingInfo'),
        orderItems: t('orderItems'),
        product: t('product'),
        variant: t('variant'),
        quantity: t('quantity'),
        price: t('price'),
        total: t('total'),
        subtotal: t('subtotal'),
        shipping: t('shipping'),
        discount: t('discount'),
        statusUpdate: t('statusUpdate'),
        updateStatus: t('updateStatus'),
        statusUpdated: t('statusUpdated'),
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