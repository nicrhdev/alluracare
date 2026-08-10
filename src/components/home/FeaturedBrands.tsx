// src/components/home/FeaturedBrands.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  url?: string;
}

interface FeaturedBrandsProps {
  brands: Brand[];
  locale: string;
}

export default function FeaturedBrands({ brands, locale }: FeaturedBrandsProps) {
  const isPersian = locale === 'fa';
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!brands || brands.length === 0) {
    return null;
  }

  const showArrows = brands.length > 6;

  // Set mounted state to handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateMaxScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        setMaxScroll(maxScrollLeft);
      }
    };

    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, [brands, isMounted]);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: Math.max(0, Math.min(newPosition, maxScroll)),
        behavior: 'smooth',
      });
    }
  };

  const handleImageError = (brandId: string) => {
    setFailedImages(prev => new Set(prev).add(brandId));
  };

  // Only show arrows after hydration to avoid mismatch
  const canScrollLeft = isMounted && scrollPosition > 0;
  const canScrollRight = isMounted && scrollPosition < maxScroll - 10;

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-brand-primary bg-brand-pale-rose px-4 py-1.5 rounded-full inline-block mb-3">
            {isPersian ? 'برندها' : 'Featured Brands'}
          </span>
          <p className="text-brand-text-secondary mt-2 max-w-lg mx-auto">
            {isPersian
              ? 'برندهای معتبر و با کیفیت در آلوراکـر'
              : 'Trusted brands available at AlluraCare'}
          </p>
        </div>

        {/* Brand Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {showArrows && isMounted && (
            <button
              onClick={() => scroll('left')}
              className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft border border-brand-secondary/20 hover:bg-white hover:shadow-hover transition-all ${
                canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
              }`}
              disabled={!canScrollLeft}
              aria-label={isPersian ? 'قبلی' : 'Previous'}
            >
              <ChevronLeft className={`w-5 h-5 text-brand-primary ${isPersian ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Brands Grid - Scrollable */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex gap-4 min-w-max py-2">
              {brands.map((brand, index) => {
                const hasFailed = failedImages.has(brand.id);
                const initials = brand.name
                  .split(' ')
                  .map(word => word[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <Link
                    key={brand.id}
                    href={`/${locale}/shop?brand=${brand.slug}`}
                    className="group flex-shrink-0 w-[100px] sm:w-[120px] md:w-[140px] p-4 bg-white rounded-xl transition-all duration-300 hover:shadow-soft hover:-translate-y-1 border border-brand-secondary/10"
                    style={{
                      animation: `fade-up 0.6s ease-out ${index * 0.04}s both`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      {/* Logo Container - Fixed size */}
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2">
                        {!hasFailed ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                            onError={() => handleImageError(brand.id)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full rounded-lg bg-brand-pale-rose/50 flex items-center justify-center">
                            <span className="text-lg font-bold text-brand-text/60">
                              {initials || 'BR'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Brand Name */}
                      <span className="text-xs font-medium text-brand-text-secondary group-hover:text-brand-primary transition text-center line-clamp-2">
                        {brand.name}
                      </span>
                    </div>

                    {/* Hover overlay - subtle glow */}
                    <div className="absolute inset-0 bg-gradient-purple/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          {showArrows && isMounted && (
            <button
              onClick={() => scroll('right')}
              className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft border border-brand-secondary/20 hover:bg-white hover:shadow-hover transition-all ${
                canScrollRight ? 'opacity-100' : 'opacity-30 cursor-not-allowed'
              }`}
              disabled={!canScrollRight}
              aria-label={isPersian ? 'بعدی' : 'Next'}
            >
              <ChevronRight className={`w-5 h-5 text-brand-primary ${isPersian ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}