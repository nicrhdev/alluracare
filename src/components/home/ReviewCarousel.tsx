// src/components/home/ReviewCarousel.tsx

'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  textEn: string;
  textFa: string;
  image?: string;
  date?: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
  locale: string;
}

export default function ReviewCarousel({ reviews, locale }: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPersian = locale === 'fa';

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const review = reviews[currentIndex];

  return (
    <section className="py-16 bg-brand-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-4 py-1.5 rounded-full inline-block mb-3">
            {isPersian ? 'نظرات مشتریان' : 'Customer Reviews'}
          </span>
        </div>

        {/* Review Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-soft border border-brand-secondary/10">
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-brand-pale-rose mb-4" />

            {/* Review Text */}
            <p className="text-lg text-brand-text leading-relaxed mb-6">
              "{isPersian ? review.textFa : review.textEn}"
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-current text-yellow-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Reviewer Info */}
            <div className="flex items-center gap-4">
              {review.image && (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-pale-rose">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-brand-text">{review.name}</p>
                {review.date && (
                  <p className="text-xs text-brand-text-secondary">{review.date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevReview}
                className="p-2 rounded-full border border-brand-secondary/20 hover:border-brand-primary hover:bg-brand-pale-rose transition"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5 text-brand-text-secondary" />
              </button>
              <div className="flex gap-1.5">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-brand-primary w-6'
                        : 'bg-brand-secondary/50 hover:bg-brand-secondary'
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextReview}
                className="p-2 rounded-full border border-brand-secondary/20 hover:border-brand-primary hover:bg-brand-pale-rose transition"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5 text-brand-text-secondary" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}