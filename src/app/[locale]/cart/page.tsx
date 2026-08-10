// src/app/[locale]/cart/page.tsx

import { getTranslations } from 'next-intl/server';
import CartClient from './components/CartClient';

interface CartPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  const t = await getTranslations('cart');

  return (
    <main className="min-h-screen py-12" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EDEDFA 30%, #C1EODF 70%, #FFFFFF 100%)' }}>
      <div className="container-custom max-w-5xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-3">
            {locale === 'fa' ? '🛒 سبد خرید' : '🛒 Shopping Cart'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
            {t('title')}
          </h1>
          <p className="text-[#8A8A8A] max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <CartClient
          locale={locale}
          t={{
            empty: t('empty'),
            continueShopping: t('continueShopping'),
            checkout: t('checkout'),
            subtotal: t('subtotal'),
            total: t('total'),
            remove: t('remove'),
          }}
        />
      </div>
    </main>
  );
}