// src/app/[locale]/admin/reviews/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import ReviewsClient from './components/ReviewsClient';

interface ReviewsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { locale } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/reviews`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/`);
  }

  const t = await getTranslations('admin.reviews');

  // Fetch all reviews with user and product
const reviews = await prisma.review.findMany({
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    product: {
      select: {
        id: true,
        nameEn: true,
        nameFa: true,
        slug: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
});

  // Type-safe stats calculation
  const pendingReviews = reviews.filter((r: any) => r.isApproved === false);
  const approvedReviews = reviews.filter((r: any) => r.isApproved === true);
  
  const stats = {
    total: reviews.length,
    pending: pendingReviews.length,
    approved: approvedReviews.length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
      : 0,
  };

  return (
    <ReviewsClient
      reviews={reviews}
      locale={locale}
      stats={stats}
      t={{
        title: t('title'),
        subtitle: t('subtitle'),
        stats: {
          total: t('stats.total'),
          pending: t('stats.pending'),
          approved: t('stats.approved'),
          averageRating: t('stats.averageRating'),
        },
        product: t('product'),
        customer: t('customer'),
        rating: t('rating'),
        review: t('review'),
        status: t('status'),
        actions: t('actions'),
        approve: t('approve'),
        delete: t('delete'),
        pendingStatus: t('pendingStatus'),
        approvedStatus: t('approvedStatus'),
        noReviews: t('noReviews'),
      }}
    />
  );
}