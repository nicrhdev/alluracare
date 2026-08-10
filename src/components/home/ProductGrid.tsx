// src/components/home/ProductGrid.tsx

'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface ProductVariant {
  id: string;
  price: number;
  comparePrice: number | null;
  discountPercent: number | null;
  stock: number;
  size: string;
}

interface Product {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  images: string[];
  brand: string | null;
  variants: ProductVariant[];
  category: {
    nameEn: string;
    nameFa: string;
  };
}

interface ProductGridProps {
  products: Product[];
  locale: string;
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  showBadge?: boolean;
  badgeText?: string;
  columns?: 3 | 4;
}

export default function ProductGrid({
  products,
  locale,
  title,
  subtitle,
  viewAllLink,
  showBadge = false,
  badgeText = 'New',
  columns = 4,
}: ProductGridProps) {
  const isPersian = locale === 'fa';
  const addItem = useCartStore((state: any) => state.addItem);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

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

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants[0];
    if (!variant) return;

    addItem({
      variantId: variant.id,
      productId: product.id,
      name: isPersian ? product.nameFa : product.nameEn,
      nameFa: product.nameFa,
      brand: product.brand || '',
      size: variant.size,
      price: variant.price,
      comparePrice: variant.comparePrice,
      quantity: 1,
      maxStock: variant.stock,
      image: product.images[0],
      slug: product.slug,
    });

    toast.success(
      isPersian
        ? `${isPersian ? product.nameFa : product.nameEn} به سبد خرید اضافه شد`
        : `${isPersian ? product.nameFa : product.nameEn} added to cart`
    );
  };

  const gridCols = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white via-brand-purple-light/5 to-brand-mint-soft/5">
      <div className="container-custom">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 className="heading-2 text-brand-text">{title}</h2>
            )}
            {subtitle && (
              <p className="text-brand-text-secondary mt-2 max-w-lg mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Product Grid */}
        <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
          {products.map((product, index) => {
            // Calculate prices and discounts from variants
            const firstVariant = product.variants[0];
            const lowestPrice = firstVariant ? firstVariant.price : 0;
            const discountPercent = firstVariant?.discountPercent || 0;
            const hasDiscount = discountPercent > 0;
            const discountedPrice = hasDiscount 
              ? lowestPrice * (1 - discountPercent / 100) 
              : null;
            
            // Check if any variant has compare price
            const hasComparePrice = product.variants.some((v: ProductVariant) => v.comparePrice);
            const comparePrice = Math.min(
              ...product.variants.map((v: ProductVariant) => v.comparePrice || Infinity)
            );
            
            const image = product.images[0] || null;
            const name = isPersian ? product.nameFa : product.nameEn;
            const categoryName = isPersian ? product.category.nameFa : product.category.nameEn;

            return (
              <Link
                key={product.id}
                href={`/${locale}/product/${product.slug}`}
                className="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-hover hover:-translate-y-2 border border-brand-secondary/10"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{
                  animation: `fade-up 0.6s ease-out ${index * 0.08}s both`,
                }}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-brand-pale-rose/20">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredProduct === product.id ? 'scale-110' : 'scale-100'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/product-placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🧴</div>
                  )}

                  {/* Badge - New or Sale */}
                  {showBadge && !hasDiscount && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-brand-primary text-white rounded-full">
                        {badgeText}
                      </span>
                    </div>
                  )}

                  {/* Sale Badge - Show if discount exists */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-brand-gold text-white rounded-full">
                        {isPersian ? `تخفیف ${Math.round(discountPercent)}%` : `${Math.round(discountPercent)}% OFF`}
                      </span>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div
                    className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-brand-primary hover:bg-brand-primary hover:text-white hover:scale-110 transition-all shadow-soft"
                      aria-label={isPersian ? 'مشاهده سریع' : 'Quick view'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-brand-primary hover:bg-brand-primary hover:text-white hover:scale-110 transition-all shadow-soft"
                      aria-label={isPersian ? 'افزودن به سبد خرید' : 'Add to cart'}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-brand-primary hover:bg-brand-primary hover:text-white hover:scale-110 transition-all shadow-soft"
                      aria-label={isPersian ? 'افزودن به علاقه‌مندی‌ها' : 'Add to wishlist'}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-brand-text text-sm line-clamp-2 group-hover:text-brand-primary transition">
                        {name}
                      </h3>
                      {product.brand && (
                        <p className="text-xs text-brand-text-secondary mt-0.5">
                          {product.brand}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-brand-text-secondary bg-brand-pale-rose/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {categoryName}
                    </span>
                  </div>

                  {/* Price with Discount */}
                  <div className="flex items-center gap-2 mt-2">
                    {hasDiscount && discountedPrice !== null ? (
                      <>
                        <span className="font-semibold text-brand-primary">
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-xs text-brand-text-secondary line-through">
                          {formatPrice(lowestPrice)}
                        </span>
                        <span className="text-xs font-semibold text-brand-primary bg-brand-pale-rose px-2 py-0.5 rounded-full">
                          -{Math.round(discountPercent)}%
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-brand-primary">
                        {formatPrice(lowestPrice)}
                      </span>
                    )}
                    {!hasDiscount && hasComparePrice && comparePrice < Infinity && comparePrice > lowestPrice && (
                      <span className="text-xs text-brand-text-secondary line-through">
                        {formatPrice(comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        {viewAllLink && (
          <div className="text-center mt-10">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-hover font-medium transition group"
            >
              {isPersian ? 'مشاهده همه محصولات' : 'View All Products'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}