// src/app/[locale]/product/[slug]/components/ProductInfo.tsx

'use client';

import { useState } from 'react';
import { Star, Heart, ShoppingBag, Minus, Plus, Truck, Shield, Award } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Variant {
  id: string;
  size: string;
  price: number;
  comparePrice: number | null;
  discountPercent: number | null;
  stock: number;
  isDefault: boolean;
}

interface ProductInfoProps {
  productId: string;
  productSlug: string;
  nameEn: string;
  nameFa: string;
  brand: string | null;
  variants: Variant[];
  rating: number;
  reviewCount: number;
  isInWishlist: boolean;
  locale: string;
  descriptionEn?: string | null;
  descriptionFa?: string | null;
}

export default function ProductInfo({
  productId,
  productSlug,
  nameEn,
  nameFa,
  brand,
  variants,
  rating,
  reviewCount,
  isInWishlist: initialWishlist,
  locale,
  descriptionEn,
  descriptionFa,
}: ProductInfoProps) {
  const isPersian = locale === 'fa';
  const { data: session } = useSession();
  const router = useRouter();
  const addItem = useCartStore((state: any) => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
  variants.find((v: Variant) => v.isDefault) || variants[0]
);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(initialWishlist);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const name = isPersian ? nameFa : nameEn;
  const description = isPersian ? descriptionFa : descriptionEn;

  // CORRECT: Use the same exchange rate as formatPrice.ts
  const formatPrice = (price: number) => {
    if (isPersian) {
      const tomanRate = 185000; // ✅ Correct rate
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

  const getStockStatus = () => {
    if (selectedVariant.stock === 0) {
      return {
        label: isPersian ? 'ناموجود' : 'Out of Stock',
        color: 'text-error',
        bg: 'bg-error-light',
        inStock: false,
      };
    }
    if (selectedVariant.stock < 5) {
      return {
        label: isPersian ? 'موجودی محدود' : 'Low Stock',
        color: 'text-warning',
        bg: 'bg-warning-light',
        inStock: true,
      };
    }
    return {
      label: isPersian ? 'موجود در انبار' : 'In Stock',
      color: 'text-success',
      bg: 'bg-success-light',
      inStock: true,
    };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    if (!session) {
      router.push(`/${locale}/login`);
      return;
    }

    if (!stockStatus.inStock) {
      toast.error(isPersian ? 'این محصول موجود نیست' : 'This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    
    addItem({
      variantId: selectedVariant.id,
      productId: productId,
      name: nameEn,
      nameFa: nameFa,
      brand: brand || '',
      size: selectedVariant.size,
      price: selectedVariant.price,
      comparePrice: selectedVariant.comparePrice,
      quantity: quantity,
      maxStock: selectedVariant.stock,
      image: '',
      slug: productSlug,
    });

    toast.success(
      isPersian 
        ? `${nameFa} به سبد خرید اضافه شد` 
        : `${nameEn} added to cart`
    );
    
    setIsAddingToCart(false);
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      router.push(`/${locale}/login`);
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: isWishlist ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setIsWishlist(!isWishlist);
        toast.success(
          isWishlist
            ? isPersian ? 'از علاقه‌مندی‌ها حذف شد' : 'Removed from wishlist'
            : isPersian ? 'به علاقه‌مندی‌ها اضافه شد' : 'Added to wishlist'
        );
      }
    } catch (error) {
      toast.error(isPersian ? 'خطا در عملیات' : 'Operation failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      {brand && (
        <p className="text-sm font-medium text-brand-text-secondary uppercase tracking-wider">
          {brand}
        </p>
      )}

      {/* Title */}
      <h1 className="heading-2 text-brand-text">{name}</h1>

      {/* Description */}
      {description && (
        <div className="text-brand-text-secondary leading-relaxed bg-brand-purple-light/10 p-4 rounded-xl border border-brand-purple-light/20">
          <p>{description}</p>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(rating)
                  ? 'fill-current text-yellow-400'
                  : 'text-brand-secondary/30'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-brand-text-secondary">
          ({reviewCount} {isPersian ? 'نظر' : 'reviews'})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        {selectedVariant.discountPercent && selectedVariant.discountPercent > 0 ? (
          <>
            <span className="text-3xl font-bold text-brand-primary">
              {formatPrice(selectedVariant.price * (1 - selectedVariant.discountPercent / 100))}
            </span>
            <span className="text-lg text-brand-text-secondary line-through">
              {formatPrice(selectedVariant.price)}
            </span>
            <span className="text-sm font-semibold text-brand-primary bg-brand-pale-rose px-2 py-0.5 rounded-full">
              -{Math.round(selectedVariant.discountPercent)}%
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-brand-primary">
            {formatPrice(selectedVariant.price)}
          </span>
        )}
        {selectedVariant.comparePrice && !selectedVariant.discountPercent && (
          <span className="text-lg text-brand-text-secondary line-through">
            {formatPrice(selectedVariant.comparePrice)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${stockStatus.bg}`}>
        <div className={`w-2 h-2 rounded-full ${stockStatus.color}`} />
        <span className={`text-sm font-medium ${stockStatus.color}`}>
          {stockStatus.label}
        </span>
      </div>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-text">
            {isPersian ? 'انتخاب سایز' : 'Select Size'}
          </label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedVariant.id === variant.id
                    ? 'border-brand-primary bg-brand-pale-rose/20 text-brand-primary'
                    : 'border-brand-secondary/30 hover:border-brand-primary/50'
                } ${
                  variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={variant.stock === 0}
              >
                {variant.size}
                {variant.stock === 0 && (
                  <span className="text-xs text-error ml-1">
                    ({isPersian ? 'ناموجود' : 'Out of Stock'})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-brand-text">
          {isPersian ? 'تعداد' : 'Quantity'}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 rounded-lg border border-brand-secondary/30 hover:border-brand-primary transition"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4 text-brand-text" />
          </button>
          <span className="w-12 text-center font-medium text-brand-text">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
            className="p-2 rounded-lg border border-brand-secondary/30 hover:border-brand-primary transition"
            disabled={quantity >= selectedVariant.stock}
          >
            <Plus className="w-4 h-4 text-brand-text" />
          </button>
          <span className="text-sm text-brand-text-secondary">
            {isPersian ? 'حداکثر' : 'Max'} {selectedVariant.stock}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={!stockStatus.inStock || isAddingToCart}
          className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
        >
          {isAddingToCart ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isPersian ? 'در حال افزودن...' : 'Adding...'}
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              {isPersian ? 'افزودن به سبد خرید' : 'Add to Cart'}
            </>
          )}
        </button>

        <button
          onClick={handleWishlistToggle}
          className={`p-3 rounded-xl border-2 transition-all ${
            isWishlist
              ? 'border-brand-primary bg-brand-pale-rose/20 text-brand-primary'
              : 'border-brand-secondary/30 hover:border-brand-primary/50 text-brand-text-secondary hover:text-brand-primary'
          }`}
          aria-label={isPersian ? 'افزودن به علاقه‌مندی‌ها' : 'Add to wishlist'}
        >
          <Heart className={`w-5 h-5 ${isWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-brand-secondary/10">
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Truck className="w-4 h-4 text-brand-primary" />
          <span>{isPersian ? 'ارسال سریع' : 'Fast Shipping'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Shield className="w-4 h-4 text-brand-primary" />
          <span>{isPersian ? 'ضمانت کیفیت' : 'Quality Guarantee'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
          <Award className="w-4 h-4 text-brand-primary" />
          <span>{isPersian ? 'محصولات اورجینال' : 'Original Products'}</span>
        </div>
      </div>
    </div>
  );
}