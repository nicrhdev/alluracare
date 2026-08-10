// src/components/home/CategoryGrid.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  image: string | null;
  productCount?: number;
}

interface CategoryGridProps {
  categories: Category[];
  locale: string;
}

export default function CategoryGrid({ categories, locale }: CategoryGridProps) {
  const isPersian = locale === 'fa';

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EDEDFA 30%, #C1EODF 70%, #FFFFFF 100%)' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-3">
            {isPersian ? 'دسته‌بندی‌ها' : 'Categories'}
          </span>
          <h2 className="heading-2 text-[#2D2D2D]">
            {isPersian ? 'خرید بر اساس دسته‌بندی' : 'Shop by Category'}
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const name = isPersian ? category.nameFa : category.nameEn;
            const imagePath = `/images/categories/${category.slug}.png`;
            
            // Fallback emojis if image fails
            const emojis: Record<string, string> = {
              cleansers: '🧊',
              moisturizers: '💧',
              serums: '✨',
              sunscreens: '☀️',
              'eye-creams': '👁️',
              masks: '🧖',
              toners: '🌊',
              'body-care': '🧴',
              'hair-care': '💇',
            };
            const fallbackEmoji = emojis[category.slug] || '📦';

            return (
              <Link
                key={category.id}
                href={`/${locale}/shop?category=${category.slug}`}
                className="group relative bg-gradient-to-br from-[#EDEDFA] to-[#C9CAE1] rounded-2xl p-6 text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-[#C9CAE1]/30 overflow-hidden"
                style={{
                  animation: `fade-up 0.6s ease-out ${index * 0.08}s both`,
                }}
              >
                {/* White overlay on hover */}
                <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Category Image - Using Next.js Image with fallback */}
                <div className="relative w-20 h-20 mx-auto mb-">
                  <Image
                    src={imagePath}
                    alt={name}
                    width={200}
                    height={200}
                    className="w-40 h-20 object-contain transition-transform duration-300 group-hover:scale-150"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'text-4xl';
                        emojiSpan.textContent = fallbackEmoji;
                        parent.appendChild(emojiSpan);
                      }
                    }}
                  />
                </div>

                {/* Name */}
                <h3 className="font-medium text-[#2D2D2D] text-sm group-hover:text-[#874A58] transition relative z-10">
                  {name}
                </h3>

                {/* Product count */}
                {category.productCount !== undefined && (
                  <p className="text-xs text-[#8A8A8A] mt-1 relative z-10">
                    {category.productCount} {isPersian ? 'محصول' : 'products'}
                  </p>
                )}

                {/* Hover arrow */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 text-[#874A58]" />
                </div>

                {/* Decorative circle */}
                <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full bg-[#EDEDFA]/40 group-hover:scale-150 transition-transform duration-500" />
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 text-[#874A58] hover:text-[#C397A0] font-medium transition group"
          >
            {isPersian ? 'مشاهده همه محصولات' : 'View All Products'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}