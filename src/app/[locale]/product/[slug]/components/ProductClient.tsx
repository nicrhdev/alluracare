// src/app/[locale]/product/[slug]/components/ProductClient.tsx

'use client';

import { useEffect, useRef } from 'react';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import FrequentlyBought from './FrequentlyBought';
import ProductReviews from './ProductReviews';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface ProductClientProps {
  product: any;
  relatedProducts: any[];
  frequentlyBought: any[];
  reviews: any[];
  isInWishlist: boolean;
  locale: string;
  benefitsEn: string[];
  benefitsFa: string[];
  ingredientsEn: string[];
  ingredientsFa: string[];
  skinTypes?: any[];
  concerns?: any[];
}

export default function ProductClient({
  product,
  relatedProducts,
  frequentlyBought,
  reviews,
  isInWishlist,
  locale,
  benefitsEn,
  benefitsFa,
  ingredientsEn,
  ingredientsFa,
  skinTypes = [],
  concerns = [],
}: ProductClientProps) {
  const { addToRecentlyViewed } = useRecentlyViewed();
  const productAddedRef = useRef(false);

  // Add to recently viewed when product loads - only once
  useEffect(() => {
    if (product && !productAddedRef.current) {
      productAddedRef.current = true;
      
      const productData = {
        id: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameFa: product.nameFa,
        image: product.images?.[0] || '',
        price: Math.min(...(product.variants?.map((v: any) => v.price) || [0])),
        brand: product.brand,
      };
      
      addToRecentlyViewed(productData);
    }
  }, [product, addToRecentlyViewed]);

  const isPersian = locale === 'fa';
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
    : 0;

  // Format skin types for ProductTabs
  const formattedSkinTypes = skinTypes.map((st: any) => ({
    id: st.id,
    nameEn: st.nameEn,
    nameFa: st.nameFa,
  }));

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-text-secondary mb-6">
        <a href={`/${locale}`} className="hover:text-brand-primary transition">
          {isPersian ? 'خانه' : 'Home'}
        </a>
        <span>/</span>
        <a href={`/${locale}/shop`} className="hover:text-brand-primary transition">
          {isPersian ? 'فروشگاه' : 'Shop'}
        </a>
        <span>/</span>
        <span className="text-brand-text line-clamp-1">
          {isPersian ? product.nameFa : product.nameEn}
        </span>
      </div>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <ProductGallery
            images={product.images}
            productName={isPersian ? product.nameFa : product.nameEn}
          />
        </div>

        {/* Info */}
        <div>
          <ProductInfo
            productId={product.id}
            productSlug={product.slug}
            nameEn={product.nameEn}
            nameFa={product.nameFa}
            brand={product.brand}
            variants={product.variants}
            rating={averageRating}
            reviewCount={reviews.length}
            isInWishlist={isInWishlist}
            locale={locale}
            descriptionEn={product.descriptionEn}
            descriptionFa={product.descriptionFa}
          />
        </div>
      </div>

      {/* Tabs */}
      <ProductTabs
        benefitsEn={benefitsEn}
        benefitsFa={benefitsFa}
        ingredientsEn={ingredientsEn}
        ingredientsFa={ingredientsFa}
        howToUseEn={product.howToUseEn}
        howToUseFa={product.howToUseFa}
        skinTypes={formattedSkinTypes}
        locale={locale}
      />

      {/* Reviews */}
      <ProductReviews
        productId={product.id}
        reviews={reviews}
        averageRating={averageRating}
        locale={locale}
      />

      {/* Frequently Bought Together */}
      {frequentlyBought.length > 0 && (
        <FrequentlyBought
          products={frequentlyBought}
          mainProductId={product.id}
          mainProductSlug={product.slug}
          mainProductNameEn={product.nameEn}
          mainProductNameFa={product.nameFa}
          mainProductPrice={Math.min(...(product.variants?.map((v: any) => v.price) || [0]))}
          mainProductVariantId={product.variants?.[0]?.id || ''}
          locale={locale}
        />
      )}

      {/* Related Products */}
      <RelatedProducts
        products={relatedProducts}
        locale={locale}
      />
    </div>
  );
}