// src/app/[locale]/checkout/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import CheckoutClient from './components/CheckoutClient';

interface CheckoutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;

  // Check if user is logged in
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/checkout`);
  }

  const t = await getTranslations('checkout');

  // Get user with addresses
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-custom max-w-5xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">📦</span>
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
              {locale === 'fa' ? '✨ تکمیل خرید' : '✨ Checkout'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2">
            {t('title')}
          </h1>
          <p className="text-brand-text-secondary max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Checkout Steps Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-medium">1</div>
            <span className="text-sm font-medium text-brand-text">{t('shippingInfo')}</span>
          </div>
          <div className="w-12 h-0.5 bg-brand-secondary/50"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/50 text-brand-text-secondary flex items-center justify-center text-sm font-medium">2</div>
            <span className="text-sm text-brand-text-secondary">{t('payment')}</span>
          </div>
          <div className="w-12 h-0.5 bg-brand-secondary/50"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/50 text-brand-text-secondary flex items-center justify-center text-sm font-medium">3</div>
            <span className="text-sm text-brand-text-secondary">{t('confirm')}</span>
          </div>
        </div>

        <CheckoutClient
          user={user}
          locale={locale}
          t={{
            shippingInfo: t('shippingInfo'),
            orderSummary: t('orderSummary'),
            payment: t('payment'),
            confirm: t('confirm'),
            fullName: t('fullName'),
            email: t('email'),
            phone: t('phone'),
            address: t('address'),
            city: t('city'),
            state: t('state'),
            zipCode: t('zipCode'),
            country: t('country'),
            saveAddress: t('saveAddress'),
          }}
        />
      </div>
    </main>
  );
}