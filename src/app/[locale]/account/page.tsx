// src/app/[locale]/account/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import AccountClient from './components/AccountClient';
import { User, Package, Heart, Settings } from 'lucide-react';

interface AccountPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;

  // Check if user is logged in
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account`);
  }

  const t = await getTranslations('account');

  // Get user data with orders
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      addresses: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Get wishlist count
  const wishlistCount = await prisma.wishlist.count({
    where: { userId: user.id },
  });

  // Format dates on the server
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  // Format order dates and prepare data for the client
  const formattedOrders = user.orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    formattedDate: formatDate(order.createdAt),
  }));

  // Prepare user data for the client
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    createdAt: user.createdAt,
    formattedCreatedAt: formatDate(user.createdAt),
    orders: formattedOrders,
    addresses: user.addresses,
  };

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-custom max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👤</span>
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
              {locale === 'fa' ? '✨ حساب کاربری' : '✨ My Account'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
            {t('title')}
          </h1>
          <p className="text-brand-text-secondary mt-1">
            {t('welcome', { name: user.name || user.email })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-pale-rose flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary">{t('orders')}</p>
              <p className="text-xl font-bold text-brand-text">{user.orders.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-pale-rose flex items-center justify-center">
              <Heart className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary">{t('wishlist')}</p>
              <p className="text-xl font-bold text-brand-text">{wishlistCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-pale-rose flex items-center justify-center">
              <User className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-sm text-brand-text-secondary">{t('memberSince')}</p>
              <p className="text-sm font-medium text-brand-text">{userData.formattedCreatedAt}</p>
            </div>
          </div>
        </div>

        <AccountClient
          user={userData}
          locale={locale}
          t={{
            orders: t('orders'),
            noOrders: t('noOrders'),
            orderNumber: t('orderNumber'),
            date: t('date'),
            status: t('status'),
            total: t('total'),
            viewOrder: t('viewOrder'),
            email: t('email'),
            name: t('name'),
            memberSince: t('memberSince'),
          }}
        />
      </div>
    </main>
  );
}