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
  const common = await getTranslations('common');

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-custom max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🛒</span>
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
              {locale === 'fa' ? '✨ سبد خرید' : '✨ Shopping Cart'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2">
            {t('title')}
          </h1>
          <p className="text-brand-text-secondary max-w-md mx-auto">
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
            quantity: 'Quantity',
            product: 'Product',
            price: 'Price',
          }}
          common={{
            currency: 'USD',
          }}
        />
      </div>
    </main>
  );
}