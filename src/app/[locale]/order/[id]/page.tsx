// src/app/[locale]/order/[id]/page.tsx

import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';

interface OrderPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale, id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('account');

  // Fetch order with details
  const order = await prisma.order.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
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
  });

  if (!order) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Package className="w-5 h-5" />;
      case 'PROCESSING':
        return <Package className="w-5 h-5" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5" />;
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-custom max-w-4xl">
        <Link
          href={`/${locale}/account`}
          className="inline-flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === 'fa' ? 'بازگشت به حساب کاربری' : 'Back to Account'}
        </Link>

        <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-secondary/20 pb-4">
            <div>
              <p className="text-sm text-brand-text-secondary">{t('orderNumber')}</p>
              <h1 className="text-2xl font-bold text-brand-text">#{order.orderNumber}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-brand-text mb-3">
                {locale === 'fa' ? 'محصولات' : 'Items'}
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-brand-secondary/10 pb-2">
                    <div>
                      <p className="font-medium text-brand-text">
                        {locale === 'fa' ? item.variant.product.nameFa : item.variant.product.nameEn}
                      </p>
                      <p className="text-xs text-brand-text-secondary">
                        {item.variant.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-brand-text">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="font-semibold text-brand-text mb-3">
                {locale === 'fa' ? 'خلاصه سفارش' : 'Order Summary'}
              </h3>
              <div className="space-y-2 text-sm bg-brand-pale-rose/30 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">{locale === 'fa' ? 'زیرمجموع' : 'Subtotal'}</span>
                  <span className="text-brand-text">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-secondary">{locale === 'fa' ? 'ارسال' : 'Shipping'}</span>
                  <span className="text-brand-text">$0.00</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-brand-secondary/20">
                  <span className="text-brand-text">{locale === 'fa' ? 'مجموع' : 'Total'}</span>
                  <span className="text-brand-primary">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-4">
                <h4 className="font-medium text-brand-text text-sm mb-2">
                  {locale === 'fa' ? 'آدرس ارسال' : 'Shipping Address'}
                </h4>
                <div className="text-sm text-brand-text-secondary bg-brand-pale-rose/20 rounded-lg p-3">
                  <p>{shippingAddress.fullName}</p>
                  <p>{shippingAddress.street}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p>{shippingAddress.country}</p>
                  <p className="mt-1">{shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}