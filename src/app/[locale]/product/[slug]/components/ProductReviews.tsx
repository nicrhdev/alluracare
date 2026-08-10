// src/app/[locale]/product/[slug]/components/ProductReviews.tsx

'use client';

import { useState } from 'react';
import { Star, User, Image as ImageIcon, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  commentEn: string | null;
  commentFa: string | null;
  images: string[];
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  isVerifiedPurchase: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  locale: string;
}

export default function ProductReviews({
  productId,
  reviews,
  averageRating,
  locale,
}: ProductReviewsProps) {
  const isPersian = locale === 'fa';
  const { data: session } = useSession();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalReviews = reviews.length;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => r.rating === stars).length / totalReviews) * 100 : 0,
  }));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error(isPersian ? 'لطفاً وارد شوید' : 'Please login to review');
      return;
    }

    if (rating === 0) {
      toast.error(isPersian ? 'لطفاً امتیاز دهید' : 'Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', String(rating));
      formData.append('title', title);
      formData.append('comment', comment);
      
      reviewImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success(isPersian ? 'نظر شما ثبت شد' : 'Review submitted');
        setRating(0);
        setTitle('');
        setComment('');
        setReviewImages([]);
        setShowWriteReview(false);
        // Refresh the page to show new review
        window.location.reload();
      } else {
        toast.error(isPersian ? 'خطا در ثبت نظر' : 'Failed to submit review');
      }
    } catch (error) {
      toast.error(isPersian ? 'خطا در ثبت نظر' : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + reviewImages.length > 5) {
      toast.error(isPersian ? 'حداکثر ۵ عکس می‌توانید آپلود کنید' : 'Maximum 5 images allowed');
      return;
    }
    setReviewImages([...reviewImages, ...files]);
  };

  const removeImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-12">
      <h3 className="heading-3 text-brand-text mb-6">
        {isPersian ? 'نظرات مشتریان' : 'Customer Reviews'}
      </h3>

      {/* Review Summary */}
      <div className="flex flex-col md:flex-row gap-8 p-6 bg-brand-pale-rose/20 rounded-2xl mb-8">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-brand-text">{averageRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? 'fill-current text-yellow-400'
                    : 'text-brand-secondary/30'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-brand-text-secondary mt-1">
            {totalReviews} {isPersian ? 'نظر' : 'reviews'}
          </p>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm text-brand-text-secondary w-8">{item.stars}★</span>
              <div className="flex-1 h-2 bg-brand-pale-rose rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-brand-text-secondary w-12">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <div className="flex items-center">
          <button
            onClick={() => setShowWriteReview(!showWriteReview)}
            className="btn-primary"
          >
            {isPersian ? 'ثبت نظر' : 'Write a Review'}
          </button>
        </div>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-white rounded-2xl p-6 border border-brand-secondary/20 mb-8">
          <h4 className="font-semibold text-brand-text mb-4">
            {isPersian ? 'ثبت نظر جدید' : 'Write a Review'}
          </h4>
          <form onSubmit={handleSubmitReview}>
            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-text mb-2">
                {isPersian ? 'امتیاز' : 'Rating'}
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition ${
                        star <= (hoverRating || rating)
                          ? 'fill-current text-yellow-400'
                          : 'text-brand-secondary/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-text mb-2">
                {isPersian ? 'عنوان' : 'Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isPersian ? 'خلاصه نظر خود را بنویسید' : 'Summary of your review'}
                className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-text mb-2">
                {isPersian ? 'نظر' : 'Comment'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder={isPersian ? 'نظر خود را بنویسید...' : 'Write your review...'}
                className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-text mb-2">
                {isPersian ? 'عکس‌ها (اختیاری)' : 'Images (Optional)'}
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="px-4 py-2 border-2 border-dashed border-brand-secondary/30 rounded-lg hover:border-brand-primary transition">
                    <ImageIcon className="w-5 h-5 text-brand-text-secondary" />
                  </div>
                </label>
                {reviewImages.map((file, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Review ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-brand-text-secondary mt-1">
                {isPersian ? 'حداکثر ۵ عکس' : 'Maximum 5 images'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isPersian ? 'در حال ثبت...' : 'Submitting...'}
                  </>
                ) : (
                  isPersian ? 'ثبت نظر' : 'Submit Review'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowWriteReview(false)}
                className="px-4 py-2 text-brand-text-secondary hover:text-brand-primary transition"
              >
                {isPersian ? 'انصراف' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => {
          const comment = isPersian ? review.commentFa || review.commentEn : review.commentEn || review.commentFa;
          const reviewTitle = review.title || (isPersian ? 'نظر' : 'Review');

          return (
            <div key={review.id} className="p-6 bg-white rounded-xl border border-brand-secondary/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.user.image ? (
                    <img
                      src={review.user.image}
                      alt={review.user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-pale-rose flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-text-secondary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-brand-text">
                      {review.user.name || (isPersian ? 'کاربر' : 'User')}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? 'fill-current text-yellow-400'
                                : 'text-brand-secondary/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-brand-text-secondary">
                        {new Date(review.createdAt).toLocaleDateString(isPersian ? 'fa-IR' : 'en-US')}
                      </span>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs text-success bg-success-light px-2 py-0.5 rounded-full">
                          {isPersian ? 'خرید تأیید شده' : 'Verified Purchase'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-brand-text mt-3">{reviewTitle}</h4>
              <p className="text-brand-text-secondary mt-2">{comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {review.images.map((image, index) => (
                    <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Review ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalReviews === 0 && (
        <div className="text-center py-8">
          <p className="text-brand-text-secondary">
            {isPersian ? 'هنوز نظری ثبت نشده است' : 'No reviews yet'}
          </p>
        </div>
      )}
    </div>
  );
}