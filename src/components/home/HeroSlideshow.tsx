// src/components/home/HeroSlideshow.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isPersian = locale === 'fa';
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlides = slides.filter(s => s.isActive);

  // Auto-play slides
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const startTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      timerRef.current = setInterval(() => {
        if (!isHovering && !isAnimating) {
          goToNext();
        }
      }, 5000);
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeSlides.length, isHovering, isAnimating]);

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) =>
      prev === 0 ? activeSlides.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) =>
      prev === activeSlides.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Restart timer after leaving
    if (activeSlides.length > 1) {
      timerRef.current = setInterval(() => {
        if (!isAnimating) {
          goToNext();
        }
      }, 5000);
    }
  };

  if (activeSlides.length === 0) {
    return (
      <div className="relative h-[60vh] min-h-[400px] bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-primary mb-4 animate-fade-up">
            {isPersian ? 'به آلوراکـر خوش آمدید' : 'Welcome to AlluraCare'}
          </h1>
          <p className="text-lg md:text-xl text-brand-text-secondary animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {isPersian ? 'محصولات مراقبت از پوست با کیفیت بالا' : 'Premium skincare products'}
          </p>
        </div>
      </div>
    );
  }

  const slide = activeSlides[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="relative h-[60vh] min-h-[400px] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-brand-pale-rose"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slide Background */}
      <div className="absolute inset-0">
        {slide.image && (
          <img
            src={slide.image}
            alt={isPersian ? slide.titleFa || '' : slide.titleEn || ''}
            className="w-full h-full object-cover transition-transform duration-10000"
            style={{
              transform: isHovering ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 8s ease-out',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hero-placeholder.jpg';
            }}
          />
        )}
        {/* Darker Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/30" />
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-white/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content - Centered with animations */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            {/* Title with animation */}
            {slide.titleEn && (
              <h1
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg ${
                  isPersian ? 'font-persian' : ''
                }`}
                style={{
                  animation: `fadeUp 0.8s ease-out forwards`,
                  animationDelay: '0.1s',
                  opacity: 0,
                }}
              >
                {isPersian ? slide.titleFa : slide.titleEn}
              </h1>
            )}
            
            {/* Subtitle with animation */}
            {slide.subtitleEn && (
              <p
                className={`text-lg sm:text-xl md:text-2xl text-white/95 mb-8 drop-shadow ${
                  isPersian ? 'font-persian' : ''
                }`}
                style={{
                  animation: `fadeUp 0.8s ease-out forwards`,
                  animationDelay: '0.3s',
                  opacity: 0,
                }}
              >
                {isPersian ? slide.subtitleFa : slide.subtitleEn}
              </p>
            )}
            
            {/* CTA Button with animation */}
            {slide.ctaLink && slide.ctaTextEn && (
              <Link
                href={slide.ctaLink}
                className="btn-primary inline-flex items-center gap-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 shadow-lg hover:scale-105 transition-transform duration-300"
                style={{
                  animation: `fadeUp 0.8s ease-out forwards`,
                  animationDelay: '0.5s',
                  opacity: 0,
                }}
              >
                {isPersian ? slide.ctaTextFa : slide.ctaTextEn}
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Always visible with better styling */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* Dots with hover pause indicator */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-10 h-2.5 bg-white shadow-lg'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          {/* Pause indicator dot */}
          {isHovering && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60">
              ⏸ Paused
            </div>
          )}
        </div>
      )}

      {/* Slide counter */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 right-6 text-xs text-white/40 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full z-20">
          {currentIndex + 1} / {activeSlides.length}
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}