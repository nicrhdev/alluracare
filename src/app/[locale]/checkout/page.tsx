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

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/checkout`);
  }

  const t = await getTranslations('checkout');

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
    <main className="min-h-screen py-12" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EDEDFA 30%, #C1EODF 70%, #FFFFFF 100%)' }}>
      <div className="container-custom max-w-5xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-3">
            {locale === 'fa' ? '📦 تکمیل خرید' : '📦 Checkout'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
            {t('title')}
          </h1>
          <p className="text-[#8A8A8A] max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#874A58] text-white flex items-center justify-center text-sm font-medium">1</div>
            <span className="text-sm font-medium text-[#2D2D2D]">{t('shippingInfo')}</span>
          </div>
          <div className="w-12 h-0.5 bg-brand-secondary/50"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/50 text-[#8A8A8A] flex items-center justify-center text-sm font-medium">2</div>
            <span className="text-sm text-[#8A8A8A]">{t('payment')}</span>
          </div>
          <div className="w-12 h-0.5 bg-brand-secondary/50"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/50 text-[#8A8A8A] flex items-center justify-center text-sm font-medium">3</div>
            <span className="text-sm text-[#8A8A8A]">{t('confirm')}</span>
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