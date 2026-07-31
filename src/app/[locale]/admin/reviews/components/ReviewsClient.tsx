// src/app/[locale]/admin/reviews/components/ReviewsClient.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  commentEn: string | null;
  commentFa: string | null;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  product: {
    id: string;
    nameEn: string;
    nameFa: string;
    slug: string;
  };
}

interface ReviewsClientProps {
  reviews: Review[];
  locale: string;
  stats: {
    total: number;
    pending: number;
    approved: number;
    averageRating: number;
  };
  t: {
    title: string;
    subtitle: string;
    stats: {
      total: string;
      pending: string;
      approved: string;
      averageRating: string;
    };
    product: string;
    customer: string;
    rating: string;
    review: string;
    status: string;
    actions: string;
    approve: string;
    delete: string;
    pendingStatus: string;
    approvedStatus: string;
    noReviews: string;
  };
}

export default function ReviewsClient({ reviews, locale, stats, t }: ReviewsClientProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error approving review:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    setActionLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-slate-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const statCards = [
    { label: t.stats.total, value: stats.total, color: 'bg-blue-100 text-blue-700' },
    { label: t.stats.pending, value: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
    { label: t.stats.approved, value: stats.approved, color: 'bg-green-100 text-green-700' },
    { label: t.stats.averageRating, value: stats.averageRating.toFixed(1), color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t.title}</h1>
          <p className="text-slate-600">{t.subtitle}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl shadow-sm p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">{t.noReviews}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">{t.product}</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">{t.customer}</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">{t.rating}</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">{t.review}</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">{t.status}</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <Link
                        href={`/${locale}/product/${review.product.slug}`}
                        className="text-slate-700 hover:text-slate-900"
                        target="_blank"
                      >
                        {locale === 'fa' ? review.product.nameFa : review.product.nameEn}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {review.user.name || review.user.email}
                    </td>
                    <td className="px-4 py-3">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-slate-600 truncate">
                        {locale === 'fa' && review.commentFa ? review.commentFa : review.commentEn}
                      </p>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs text-green-600">✅ Verified</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.isApproved ? t.approvedStatus : t.pendingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!review.isApproved && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            disabled={actionLoading === review.id}
                            className="px-3 py-1 text-sm text-green-600 hover:text-green-800 border border-green-200 rounded-lg hover:bg-green-50 transition disabled:opacity-50"
                          >
                            {actionLoading === review.id ? '...' : t.approve}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={actionLoading === review.id}
                          className="px-3 py-1 text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {actionLoading === review.id ? '...' : t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}