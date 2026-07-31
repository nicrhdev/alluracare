// src/app/[locale]/wishlist/components/WishlistClient.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    nameEn: string;
    nameFa: string;
    slug: string;
    brand: string | null;
    images: string[];
    variants: {
      id: string;
      size: string;
      price: number;
      comparePrice: number | null;
      stock: number;
      isDefault: boolean;
    }[];
    category: {
      nameEn: string;
      nameFa: string;
    };
  };
  createdAt: Date;
}

interface WishlistClientProps {
  wishlistItems: WishlistItem[];
  locale: string;
  t: {
    title: string;
    subtitle: string;
    empty: string;
    emptyMessage: string;
    shopNow: string;
    remove: string;
    product: string;
    price: string;
    addToCart: string;
    inStock: string;
    outOfStock: string;
  };
}

export default function WishlistClient({
  wishlistItems,
  locale,
  t,
}: WishlistClientProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addItem);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    setError(null);

    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove from wishlist');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRemovingId(null);
    }
  };

  const handleAddToCart = (product: any) => {
    const firstVariant = product.variants[0];
    if (!firstVariant) return;

    addToCart({
      variantId: firstVariant.id,
      productId: product.id,
      name: product.nameEn,
      nameFa: product.nameFa,
      brand: product.brand || '',
      size: firstVariant.size,
      price: firstVariant.price,
      comparePrice: null,
      quantity: 1,
      maxStock: firstVariant.stock,
      slug: product.slug,
      image: product.images?.[0] || undefined,
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-12 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-semibold text-brand-text mb-2">{t.empty}</h2>
        <p className="text-brand-text-secondary mb-6">{t.emptyMessage}</p>
        <Link href={`/${locale}/shop`} className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          {t.shopNow}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 overflow-hidden">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 m-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Table Header - Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-brand-pale-rose/30 border-b border-brand-secondary/20 text-sm font-medium text-brand-text-secondary">
        <div className="col-span-6">{t.product}</div>
        <div className="col-span-3 text-center">{t.price}</div>
        <div className="col-span-3 text-right">{t.remove}</div>
      </div>

      {wishlistItems.map((item) => {
        const product = item.product;
        const productName = locale === 'fa' ? product.nameFa : product.nameEn;
        const categoryName = locale === 'fa' ? product.category.nameFa : product.category.nameEn;
        const lowestPrice = Math.min(...product.variants.map((v) => v.price));
        const hasMultipleVariants = product.variants.length > 1;
        const productImage = product.images?.[0] || null;
        const firstVariant = product.variants[0];
        const isInStock = firstVariant && firstVariant.stock > 0;

        return (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-brand-secondary/10 last:border-b-0 items-center hover:bg-brand-pale-rose/10 transition"
          >
            {/* Product Info */}
            <div className="col-span-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-pale-rose to-brand-light rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🧴</span>
                )}
              </div>
              <div>
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  className="font-medium text-brand-text hover:text-brand-primary transition"
                >
                  {productName}
                </Link>
                <p className="text-sm text-brand-text-secondary">{product.brand}</p>
                <p className="text-xs text-brand-text-secondary">{categoryName}</p>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-3 text-center">
              <span className="font-medium text-brand-text">
                {formatPrice(lowestPrice)}
                {hasMultipleVariants && <span className="text-xs text-brand-text-secondary ml-1">+</span>}
              </span>
            </div>

            {/* Actions */}
            <div className="col-span-3 flex items-center justify-end gap-2">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={!isInStock}
                className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1 ${
                  isInStock
                    ? 'bg-brand-primary text-white hover:bg-brand-hover'
                    : 'bg-brand-secondary/50 text-brand-text-secondary cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {t.addToCart}
              </button>
              <button
                onClick={() => handleRemove(product.id)}
                disabled={removingId === item.id}
                className="p-2 text-brand-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                aria-label={t.remove}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}