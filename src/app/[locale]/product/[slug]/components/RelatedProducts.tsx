// src/app/[locale]/product/[slug]/components/RelatedProducts.tsx

'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  images: string[];
  brand: string | null;
  variants: { price: number }[];
}

interface RelatedProductsProps {
  products: Product[];
  locale: string;
}

export default function RelatedProducts({ products, locale }: RelatedProductsProps) {
  const isPersian = locale === 'fa';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!products || products.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
  if (isPersian) {
    const tomanRate = 185000;
    const tomanPrice = price * tomanRate;
    return new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(tomanPrice) + ' تومان';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      const newPosition = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="heading-3 text-brand-text mb-6">
        {isPersian ? 'محصولات مشابه' : 'You May Also Like'}
      </h3>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft border border-brand-secondary/20 hover:bg-white transition"
          >
            <ChevronLeft className={`w-5 h-5 text-brand-primary ${isPersian ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Products */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const lowestPrice = Math.min(...product.variants.map((v) => v.price));
            const name = isPersian ? product.nameFa : product.nameEn;
            const image = product.images?.[0] || null;

            return (
              <Link
                key={product.id}
                href={`/${locale}/product/${product.slug}`}
                className="group flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 border border-brand-secondary/10"
              >
                <div className="aspect-square overflow-hidden bg-gradient-soft">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🧴
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-brand-text line-clamp-2 group-hover:text-brand-primary transition">
                    {name}
                  </h4>
                  <p className="text-xs text-brand-text-secondary mt-1">
                    {product.brand}
                  </p>
                  <p className="text-sm font-semibold text-brand-primary mt-2">
                    {formatPrice(lowestPrice)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-soft border border-brand-secondary/20 hover:bg-white transition"
          >
            <ChevronRight className={`w-5 h-5 text-brand-primary ${isPersian ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}