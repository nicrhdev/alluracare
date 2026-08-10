// src/app/[locale]/account/components/WishlistGrid.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight } from 'lucide-react';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    slug: string;
    nameEn: string;
    nameFa: string;
    images: string[];
    brand: string | null;
    variants: { price: number }[];
  };
}

interface WishlistGridProps {
  items: WishlistItem[];
  locale: string;
}

export default function WishlistGrid({ items, locale }: WishlistGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isPersian = locale === 'fa';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatPrice = (price: number) => {
    if (isPersian) {
      const tomanRate = 50000;
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

  if (items.length === 0) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-8 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <Heart className="w-12 h-12 text-[#8A8A8A] mx-auto mb-3" />
        <h3 className="font-semibold text-[#2D2D2D]">
          {isPersian ? 'لیست علاقه‌مندی‌ها خالی است' : 'Wishlist is empty'}
        </h3>
        <p className="text-sm text-[#8A8A8A] mt-1">
          {isPersian
            ? 'محصولات مورد علاقه خود را ذخیره کنید'
            : 'Save your favorite products'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block mt-4 text-[#874A58] hover:text-[#C397A0] font-medium transition"
        >
          {isPersian ? 'مشاهده محصولات' : 'Browse Products'} →
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2D2D2D]">
          {isPersian ? 'علاقه‌مندی‌ها' : 'Wishlist'}
        </h3>
        <Link
          href={`/${locale}/account/wishlist`}
          className="text-sm text-[#874A58] hover:text-[#C397A0] transition flex items-center gap-1"
        >
          {isPersian ? 'مشاهده همه' : 'View All'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {items.slice(0, 4).map((item, index) => {
          const product = item.product;
          const name = isPersian ? product.nameFa : product.nameEn;
          const image = product.images?.[0] || null;
          const price = Math.min(...product.variants.map((v) => v.price));

          return (
            <Link
              key={item.id}
              href={`/${locale}/product/${product.slug}`}
              className={`flex items-center gap-4 p-3 border border-brand-secondary/10 rounded-xl hover:border-brand-secondary/30 hover:bg-[#EDEDFA]/10 transition group ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-soft flex items-center justify-center flex-shrink-0 overflow-hidden">
                {image ? (
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🧴</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#2D2D2D] group-hover:text-[#874A58] transition text-sm line-clamp-1">
                  {name}
                </p>
                <p className="text-xs text-[#8A8A8A]">{product.brand}</p>
                <p className="text-sm font-semibold text-[#874A58]">
                  {formatPrice(price)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}