// src/app/[locale]/admin/hero/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import HeroManager from './components/HeroManager';

interface AdminHeroPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminHeroPage({ params }: AdminHeroPageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/hero`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin.hero');

  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-text mb-2">
        {t('title')}
      </h1>
      <p className="text-brand-text-secondary mb-8">{t('subtitle')}</p>

      <HeroManager slides={slides} locale={locale} />
    </div>
  );
}