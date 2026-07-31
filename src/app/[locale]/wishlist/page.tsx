// src/app/[locale]/wishlist/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import WishlistClient from './components/WishlistClient';
import { Heart } from 'lucide-react';

interface WishlistPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/wishlist`);
  }

  const t = await getTranslations('wishlist');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wishlist: {
        include: {
          product: {
            include: {
              variants: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const wishlistItems = user.wishlist;

  return (
    <main className="min-h-screen bg-brand-background py-12">
      <div className="container-custom max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">❤️</span>
            <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-3 py-1 rounded-full">
              {locale === 'fa' ? '✨ علاقه‌مندی‌ها' : '✨ Wishlist'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2">
            {t('title')}
          </h1>
          <p className="text-brand-text-secondary max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <WishlistClient
          wishlistItems={wishlistItems}
          locale={locale}
          t={{
            title: t('title'),
            subtitle: t('subtitle'),
            empty: t('empty'),
            emptyMessage: t('emptyMessage'),
            shopNow: t('shopNow'),
            remove: t('remove'),
            product: t('product'),
            price: t('price'),
            addToCart: t('addToCart'),
            inStock: t('inStock'),
            outOfStock: t('outOfStock'),
          }}
        />
      </div>
    </main>
  );
}