// src/app/[locale]/shop/components/ProductCard.tsx

'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface Product {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  brand: string | null;
  images: string[];
  variants: {
    id: string;
    price: number;
    stock: number;
    size: string;
  }[];
  category: {
    nameEn: string;
    nameFa: string;
  };
  isFeatured: boolean;
}

interface ProductCardProps {
  product: Product;
  locale: string;
  formattedLowestPrice: string;
  hasMultipleVariants: boolean;
}

export default function ProductCard({
  product,
  locale,
  formattedLowestPrice,
  hasMultipleVariants,
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);

  const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const firstVariant = product.variants[0];
  const isInStock = firstVariant && firstVariant.stock > 0;

  const handleAddToCart = () => {
    if (!firstVariant || !isInStock) return;

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
      image: productImage || undefined, // Add the image
    });
  };

  return (
    <div className="product-card group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-soft-hover hover:-translate-y-1 border border-brand-secondary/20">
      {/* Product Image */}
      <Link href={`/${locale}/product/${product.slug}`} className="product-image block relative aspect-square overflow-hidden bg-gradient-to-br from-brand-pale-rose to-brand-light">
        {productImage ? (
          <img
            src={productImage}
            alt={locale === 'fa' ? product.nameFa : product.nameEn}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🧴
          </div>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 badge badge-primary text-xs">
            {locale === 'fa' ? 'ویژه' : 'Featured'}
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className="product-info p-4">
        <Link href={`/${locale}/product/${product.slug}`} className="block">
          <h3 className="product-name font-semibold text-brand-text group-hover:text-brand-primary transition line-clamp-2">
            {locale === 'fa' ? product.nameFa : product.nameEn}
          </h3>
        </Link>
        <p className="product-brand text-sm text-brand-text-secondary mt-1">{product.brand}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="product-price font-bold text-brand-primary">
            {formattedLowestPrice}
            {hasMultipleVariants && (
              <span className="text-sm font-normal text-brand-text-secondary ml-1">+</span>
            )}
          </span>
          <span className="text-xs text-brand-text-secondary bg-brand-pale-rose px-2 py-1 rounded-full">
            {locale === 'fa' ? product.category.nameFa : product.category.nameEn}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
            isInStock
              ? 'bg-brand-primary text-white hover:bg-brand-hover hover:shadow-soft'
              : 'bg-brand-secondary/50 text-brand-text-secondary cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isInStock
            ? locale === 'fa'
              ? 'افزودن به سبد'
              : 'Add to Cart'
            : locale === 'fa'
            ? 'ناموجود'
            : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}