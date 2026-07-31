// src/app/[locale]/checkout/success/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

interface SuccessPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { locale } = await params;
  const search = await searchParams;

  const session = await getServerSession(authOptions);

  // If not logged in, redirect to login
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('checkout');

  // If no orderId, redirect to account page
  if (!search?.orderId) {
    redirect(`/${locale}/account`);
  }

  // Get order details
  let order = null;
  let orderError = null;

  try {
    order = await prisma.order.findUnique({
      where: {
        id: search.orderId,
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
  } catch (error) {
    console.error('Failed to fetch order:', error);
    orderError = 'Failed to load order details';
  }

  // If order not found, redirect to account
  if (!order) {
    redirect(`/${locale}/account`);
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

  return (
    <main className="min-h-screen bg-brand-background flex items-center justify-center py-12">
      <div className="container-custom max-w-2xl">
        <div className="bg-white rounded-2xl shadow-soft border border-brand-secondary/20 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-brand-text mb-2">
            {t('successTitle')}
          </h1>
          <p className="text-brand-text-secondary mb-8">
            {t('successMessage')}
          </p>

          {/* Order Details */}
          <div className="bg-brand-pale-rose/30 rounded-xl p-6 mb-8 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-text-secondary">{t('orderNumber')}</p>
                <p className="font-medium text-brand-text">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-brand-text-secondary">{t('total')}</p>
                <p className="font-bold text-brand-primary">{formatPrice(order.total)}</p>
              </div>
            </div>
            {order.items && order.items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-brand-secondary/20">
                <p className="text-sm text-brand-text-secondary mb-2">{t('items')}:</p>
                <ul className="space-y-1">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="text-sm text-brand-text flex justify-between">
                      <span>
                        {locale === 'fa' ? item.variant.product.nameFa : item.variant.product.nameEn}
                        {' × '}{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-brand-secondary/20">
              <p className="text-sm text-brand-text-secondary">{t('orderDate')}</p>
              <p className="text-sm text-brand-text">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/account`}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('viewOrders')}
            </Link>
            <Link
              href={`/${locale}/shop`}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              {t('continueShopping')}
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-brand-text-secondary">
            <span>✅ Order Confirmed</span>
            <span>📧 Email Sent</span>
            <span>🔒 Secure Payment</span>
          </div>
        </div>
      </div>
    </main>
  );
}