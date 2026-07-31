// src/components/home/HeroSlideshow.tsx

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  imageMobile?: string | null;
  titleEn?: string | null;
  titleFa?: string | null;
  subtitleEn?: string | null;
  subtitleFa?: string | null;
  ctaTextEn?: string | null;
  ctaTextFa?: string | null;
  ctaLink?: string | null;
  order: number;
  isActive: boolean;
}

interface HeroSlideshowProps {
  slides: HeroSlide[];
  locale: string;
}

export default function HeroSlideshow({ slides, locale }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPersian = locale === 'fa';

  const activeSlides = slides.filter((slide) => slide.isActive);
  const slideCount = activeSlides.length;

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Auto-play with progress
  useEffect(() => {
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }

    // Only start auto-play if not hovering and more than 1 slide
    if (!isHovering && slideCount > 1 && isAutoPlaying) {
      const intervalDuration = 4000;
      const progressStep = 100 / (intervalDuration / 50);

      // Progress update
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return Math.min(prev + progressStep, 100);
        });
      }, 50);

      // Slide change
      intervalRef.current = setInterval(() => {
        if (progress >= 100) {
          goToNext();
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    };
  }, [isHovering, slideCount, isAutoPlaying, progress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, 600);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    goToSlide((currentIndex - 1 + slideCount) % slideCount);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    goToSlide((currentIndex + 1) % slideCount);
  };

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  if (slideCount === 0) {
    return (
      <section className="relative bg-gradient-hero py-20 md:py-28 overflow-hidden">
        <div className="container-custom text-center">
          <div className="text-6xl mb-4">🧴</div>
          <p className="text-brand-text-secondary">
            {isPersian ? 'هیچ اسلایدی برای نمایش وجود ندارد' : 'No slides to display'}
          </p>
        </div>
      </section>
    );
  }

  const currentSlide = activeSlides[currentIndex];
  const hasImageError = imageError[currentSlide.id];
  const title = isPersian ? currentSlide.titleFa : currentSlide.titleEn;
  const subtitle = isPersian ? currentSlide.subtitleFa : currentSlide.subtitleEn;
  const ctaText = isPersian ? currentSlide.ctaTextFa : currentSlide.ctaTextEn;
  const ctaLink = currentSlide.ctaLink || '/shop';

  return (
    <section
      className="relative bg-gradient-hero overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      <div className="container-custom relative z-10 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Text Content */}
          <div className={`order-2 lg:order-1 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Slide indicator - Dots with progress */}
            <div className="flex items-center gap-2 mb-4">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative h-2 rounded-full transition-all duration-500 ${
                    index === currentIndex ? 'w-12 bg-brand-primary' : 'w-2 bg-brand-secondary/50 hover:bg-brand-secondary'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentIndex && (
                    <div
                      className="absolute inset-0 bg-brand-primary/30 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>

            <h1 className="heading-display text-brand-text mb-3 leading-tight">
              {title || (isPersian ? 'درخشش از اینجا شروع می‌شود' : 'Radiance Starts Here')}
            </h1>

            <p className="body-large max-w-lg mb-6">
              {subtitle ||
                (isPersian
                  ? 'مجموعه‌ای از بهترین محصولات مراقبت از پوست با کیفیت بالا'
                  : 'A curated collection of high-quality skincare products')}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href={ctaLink} className="btn-primary group">
                {ctaText || (isPersian ? 'خرید کنید' : 'Shop Now')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={`/${locale}/about`} className="btn-secondary">
                {isPersian ? 'درباره ما' : 'Learn More'}
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
                <span className="text-sm text-brand-text-secondary ml-2">(1.2k)</span>
              </div>
              <span className="text-sm text-brand-text-secondary">
                {isPersian ? 'محصولات با کیفیت بالا' : 'High-quality products'}
              </span>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className={`relative rounded-2xl overflow-hidden shadow-hover aspect-square bg-gradient-to-br from-brand-pale-rose to-brand-light transition-opacity duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {hasImageError || !currentSlide.image ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-6xl mb-4">🧴</div>
                  <p className="text-brand-text-secondary text-sm">
                    {isPersian ? 'تصویر محصول' : 'Product Image'}
                  </p>
                  <p className="text-xs text-brand-text-secondary/60 mt-1">
                    {isPersian ? 'برای دیدن تصویر، آن را در بخش مدیریت آپلود کنید' : 'Upload an image in the admin panel'}
                  </p>
                </div>
              ) : (
                <img
                  src={currentSlide.image}
                  alt={title || (isPersian ? 'اسلاید قهرمان' : 'Hero slide')}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={() => handleImageError(currentSlide.id)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Navigation Arrows */}
            {slideCount > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-soft transition-all duration-300 hover:scale-110 hover:shadow-medium"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-brand-text" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-soft transition-all duration-300 hover:scale-110 hover:shadow-medium"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-brand-text" />
                </button>
              </>
            )}

            {/* Slide Counter */}
            {slideCount > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white/90">
                {currentIndex + 1} / {slideCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}