// src/app/[locale]/product/[slug]/components/ProductReviews.tsx

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
    name: string | null;
  };
}

interface ProductReviewsProps {
  reviews: Review[];
  productId: string;
  productSlug: string;
  locale: string;
  userHasPurchased: boolean;
  t: {
    reviews: string;
    noReviews: string;
    writeReview: string;
    rating: string;
    title: string;
    comment: string;
    submit: string;
    cancel: string;
    verifiedPurchase: string;
    pendingApproval: string;
    averageRating: string;
    outOf: string;
  };
}

export default function ProductReviews({
  reviews,
  productId,
  productSlug,
  locale,
  userHasPurchased,
  t,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  const approvedReviews = reviews.filter(r => r.isApproved);
  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      setSuccess('Review submitted successfully!');
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">{t.reviews}</h2>
          <span className="text-sm text-slate-500">({approvedReviews.length})</span>
        </div>
        {session && userHasPurchased && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition text-sm"
          >
            {t.writeReview}
          </button>
        )}
        {!session && (
          <button
            onClick={() => router.push(`/${locale}/login?callbackUrl=/${locale}/product/${productSlug}`)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm"
          >
            Sign in to review
          </button>
        )}
      </div>

      {approvedReviews.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-4 mb-6 flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-slate-800">{averageRating.toFixed(1)}</p>
            <div>{renderStars(Math.round(averageRating))}</div>
            <p className="text-sm text-slate-500">{t.outOf} 5</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600">{approvedReviews.length} {t.reviews.toLowerCase()}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">{t.writeReview}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.rating} *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`text-3xl transition ${star <= formData.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.title}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                placeholder="What's your experience?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.comment} *</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                placeholder="Share your detailed experience..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : t.submit}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {approvedReviews.length === 0 && !showForm ? (
        <p className="text-slate-500 text-center py-8">{t.noReviews}</p>
      ) : (
        <div className="space-y-4">
          {approvedReviews.map((review) => (
            <div key={review.id} className="border-b border-slate-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-medium">
                    {review.user.name ? review.user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="font-medium text-slate-800">{review.user.name || 'Anonymous'}</span>
                  {review.isVerifiedPurchase && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      ✅ {t.verifiedPurchase}
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-400">{formatDate(review.createdAt)}</span>
              </div>
              <div className="mt-1">{renderStars(review.rating)}</div>
              {review.title && <p className="font-medium text-slate-800 mt-1">{review.title}</p>}
              <p className="text-slate-600 text-sm mt-1">
                {locale === 'fa' && review.commentFa ? review.commentFa : review.commentEn}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}