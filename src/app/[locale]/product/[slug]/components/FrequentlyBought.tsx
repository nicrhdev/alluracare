// src/app/[locale]/product/[slug]/components/FrequentlyBought.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  images: string[];
  brand: string | null;
  variants: { id: string; price: number; stock: number }[];
}

interface FrequentlyBoughtProps {
  products: Product[];
  mainProductId: string;
  mainProductSlug: string;
  mainProductNameEn: string;
  mainProductNameFa: string;
  mainProductPrice: number;
  mainProductVariantId: string;
  locale: string;
}

interface ProductWithSelection {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  price: number;
  variantId: string;
  isMain: boolean;
  image: string | null;
  brand: string | null;
}

export default function FrequentlyBought({
  products,
  mainProductId,
  mainProductSlug,
  mainProductNameEn,
  mainProductNameFa,
  mainProductPrice,
  mainProductVariantId,
  locale,
}: FrequentlyBoughtProps) {
  const isPersian = locale === 'fa';
  const addItem = useCartStore((state: any) => state.addItem);
  const [selected, setSelected] = useState<Set<string>>(new Set([mainProductId]));
  const [isAdding, setIsAdding] = useState(false);

  if (!products || products.length === 0) {
    return null;
  }

  // Build the products list with proper typing
  const allProducts: ProductWithSelection[] = [
    {
      id: mainProductId,
      slug: mainProductSlug,
      nameEn: mainProductNameEn,
      nameFa: mainProductNameFa,
      price: mainProductPrice,
      variantId: mainProductVariantId,
      isMain: true,
      image: null,
      brand: null,
    },
    ...products.map((p) => ({
      id: p.id,
      slug: p.slug,
      nameEn: p.nameEn,
      nameFa: p.nameFa,
      price: Math.min(...p.variants.map((v) => v.price)),
      variantId: p.variants[0]?.id || '',
      isMain: false,
      image: p.images?.[0] || null,
      brand: p.brand || null,
    })),
  ];

  const toggleProduct = (productId: string) => {
    if (productId === mainProductId) return;
    const newSelected = new Set(selected);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelected(newSelected);
  };

  const totalPrice = allProducts
    .filter((p) => selected.has(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  const handleAddAll = () => {
    setIsAdding(true);

    allProducts
      .filter((p) => selected.has(p.id))
      .forEach((product) => {
        addItem({
          variantId: product.variantId,
          productId: product.id,
          name: product.nameEn,
          nameFa: product.nameFa,
          brand: product.brand || '',
          size: '',
          price: product.price,
          comparePrice: null,
          quantity: 1,
          maxStock: 999,
          image: product.image || '',
          slug: product.slug,
        });
      });

    toast.success(
      isPersian
        ? `${selected.size} محصول به سبد خرید اضافه شد`
        : `${selected.size} items added to cart`
    );

    setIsAdding(false);
  };

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

  return (
    <div className="mt-12 p-6 bg-gradient-soft rounded-2xl border border-brand-secondary/20">
      <h3 className="heading-3 text-brand-text mb-6">
        {isPersian ? 'خرید ترکیبی' : 'Frequently Bought Together'}
      </h3>

      <div className="space-y-4">
        {allProducts.map((product) => {
          const isSelected = selected.has(product.id);
          const name = isPersian ? product.nameFa : product.nameEn;

          return (
            <div key={product.id} className="flex items-center gap-4">
              {!product.isMain && (
                <button
                  onClick={() => toggleProduct(product.id)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition flex-shrink-0 ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary'
                      : 'border-brand-secondary/30 hover:border-brand-primary/50'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </button>
              )}

              {product.isMain && (
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary font-bold">★</span>
                </div>
              )}

              <Link
                href={`/${locale}/product/${product.slug}`}
                className="flex-1 flex items-center gap-3 group"
              >
                {product.image && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-soft flex-shrink-0">
                    <img
                      src={product.image}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-brand-text group-hover:text-brand-primary transition">
                    {name}
                  </p>
                  {product.brand && (
                    <p className="text-xs text-brand-text-secondary">{product.brand}</p>
                  )}
                </div>
              </Link>

              <span className="text-sm font-semibold text-brand-text whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Total & Add Button */}
      <div className="mt-6 pt-6 border-t border-brand-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm text-brand-text-secondary">
            {isPersian ? 'قیمت کل:' : 'Total Price:'}
          </p>
          <p className="text-2xl font-bold text-brand-primary">
            {formatPrice(totalPrice)}
          </p>
        </div>
        <button
          onClick={handleAddAll}
          disabled={isAdding || selected.size === 0}
          className="btn-primary flex items-center gap-2 py-3 px-8"
        >
          {isAdding ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isPersian ? 'در حال افزودن...' : 'Adding...'}
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              {isPersian ? `افزودن ${selected.size} محصول` : `Add ${selected.size} Items`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}