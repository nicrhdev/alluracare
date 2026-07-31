// src/app/[locale]/product/[slug]/components/VariantSelector.tsx

'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

interface Variant {
  id: string;
  size: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  isDefault: boolean;
  formattedPrice: string;
  formattedComparePrice: string | null;
  productId: string;
  brand: string;
  slug: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  defaultVariantId: string;
  productName: string;
  productNameFa: string;
  locale: string;
  t: {
    size: string;
    price: string;
    inStock: string;
    outOfStock: string;
    addToCart: string;
    selectSize: string;
  };
  productImage?: string | null; // Add this
}

export default function VariantSelector({
  variants,
  defaultVariantId,
  productName,
  productNameFa,
  locale,
  t,
  productImage, // Add this
}: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
  const isInStock = selectedVariant.stock > 0;
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (isInStock) {
      addToCart({
        variantId: selectedVariant.id,
        productId: selectedVariant.productId,
        name: productName,
        nameFa: productNameFa,
        brand: selectedVariant.brand,
        size: selectedVariant.size,
        price: selectedVariant.price,
        comparePrice: selectedVariant.comparePrice,
        quantity: quantity,
        maxStock: selectedVariant.stock,
        slug: selectedVariant.slug,
        image: productImage || undefined, // Add the image
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div className="border-t border-slate-200 pt-6 space-y-4">
      {variants.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.selectSize}</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = variant.id === selectedVariantId;
              const isOutOfStock = variant.stock === 0;

              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={isOutOfStock}
                  className={`
                    px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all
                    ${isSelected ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-200 hover:border-slate-400 text-slate-700'}
                    ${isOutOfStock ? 'opacity-50 cursor-not-allowed line-through' : 'cursor-pointer'}
                  `}
                >
                  {variant.size}
                  {isOutOfStock && <span className="ml-2 text-xs">({t.outOfStock})</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-800">{selectedVariant.formattedPrice}</span>
          {selectedVariant.formattedComparePrice && (
            <span className="ml-2 text-sm text-slate-400 line-through">{selectedVariant.formattedComparePrice}</span>
          )}
        </div>
        <div>
          <span className={`text-sm ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
            {isInStock ? `${t.inStock} (${selectedVariant.stock})` : t.outOfStock}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-slate-50 text-slate-600"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-2 min-w-[50px] text-center text-slate-800">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:bg-slate-50 text-slate-600"
            disabled={!isInStock || quantity >= selectedVariant.stock}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`
            flex-1 px-6 py-3 rounded-lg font-medium transition-all
            ${isInStock ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}
          `}
        >
          {addedToCart ? '✅ Added to Cart!' : t.addToCart}
        </button>
      </div>

      {/* Product details - SKU hidden from customers */}
      {/* SKU is only shown in admin panel */}
    </div>
  );
}