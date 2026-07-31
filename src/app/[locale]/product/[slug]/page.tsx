// src/app/[locale]/product/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import VariantSelector from './components/VariantSelector';
import ProductReviews from './components/ProductReviews';
import WishlistButton from '@/components/product/WishlistButton';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';

// At the top of the file, after the imports, define a type
interface ProductWithBilingualFields {
  id: string;
  nameEn: string;
  nameFa: string;
  slug: string;
  descriptionEn: string | null;
  descriptionFa: string | null;
  images: string[];
  benefits: string[];
  ingredients: string[];
  howToUseEn: string | null;
  howToUseFa: string | null;
  skinTypes: string[];
  concerns: string[];
  skinTypesEn: string[];
  skinTypesFa: string[];
  concernsEn: string[];
  concernsFa: string[];
  origin: string | null;
  brand: string | null;
  categoryId: string;
  variants: any[];
  category: any;
  isActive: boolean;
  isFeatured: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('product');

  // Get session for review check
  const session = await getServerSession(authOptions);

  // Fetch the product with its variants and category
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      category: true,
      skinTypes: {
        include: {
          skinType: true,
        },
      },
      concerns: {
        include: {
          concern: true,
        },
      },
    },
  }) as ProductWithBilingualFields | null;

  // If product doesn't exist, show 404
  if (!product) {
    notFound();
  }

  // Get the first variant as default
  const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
  const lowestPrice = Math.min(...product.variants.map(v => v.price));

  // Format prices for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Pre-format all variant prices
  const variantsWithFormattedPrices = product.variants.map(v => ({
    id: v.id,
    size: v.size,
    price: v.price,
    comparePrice: v.comparePrice,
    stock: v.stock,
    isDefault: v.isDefault,
    formattedPrice: formatPrice(v.price),
    formattedComparePrice: v.comparePrice ? formatPrice(v.comparePrice) : null,
    productId: product.id,
    brand: product.brand || '',
    slug: product.slug,
  }));

  // Get the product name in the correct language
  const productName = locale === 'fa' ? product.nameFa : product.nameEn;
  const productDescription = locale === 'fa' ? product.descriptionFa : product.descriptionEn;
  const howToUse = locale === 'fa' ? product.howToUseFa : product.howToUseEn;
  const productImage = product.images && product.images.length > 0 
  ? product.images[0] 
    : null;
  
  // Get variant translations
  const variantTranslations = {
    size: t('size'),
    price: t('price'),
    inStock: t('inStock'),
    outOfStock: t('outOfStock'),
    addToCart: t('addToCart'),
    selectSize: 'Select Size',
  };

  // Get skin types for display
  const displaySkinTypes = product.skinTypes?.map((st: any) => ({
    id: st.skinType.id,
    name: locale === 'fa' ? st.skinType.nameFa : st.skinType.nameEn,
  })) || [];

  const displayConcerns = product.concerns?.map((c: any) => ({
    id: c.concern.id,
    name: locale === 'fa' ? c.concern.nameFa : c.concern.nameEn,
  })) || [];

  // Fetch reviews
  const reviews = await prisma.review.findMany({
    where: {
      productId: product.id,
      isApproved: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Check if user has purchased this product
  let userHasPurchased = false;
  if (session && session.user && session.user.email) {
    const userOrders = await prisma.order.findMany({
      where: {
        user: { email: session.user.email },
        status: { not: 'CANCELLED' },
      },
      include: {
        items: {
          include: {
            variant: {
              select: {
                productId: true,
              },
            },
          },
        },
      },
    });

    userHasPurchased = userOrders.some(order =>
      order.items.some(item => item.variant.productId === product.id)
    );
  }

  return (
    <main className="min-h-screen bg-brand-background py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brand-text-secondary mb-6">
          <Link href={`/${locale}`} className="hover:text-brand-primary transition">
            {locale === 'fa' ? 'خانه' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/shop`} className="hover:text-brand-primary transition">
            {locale === 'fa' ? 'فروشگاه' : 'Shop'}
          </Link>
          <span>/</span>
          <span className="text-brand-text">{productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 overflow-hidden p-4">
            <ProductImageGallery
              images={product.images || []}
              productName={productName}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-sm text-brand-text-secondary mb-1">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
                {productName}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-brand-primary">
                {formatPrice(lowestPrice)}
              </span>
              {product.variants.length > 1 && (
                <span className="text-sm text-brand-text-secondary">
                  {locale === 'fa' ? 'به‌علاوه' : '+'}
                </span>
              )}
              {product.variants.length > 1 && (
                <span className="text-sm text-brand-text-secondary">
                  {locale === 'fa' ? 'سایزهای مختلف' : 'various sizes'}
                </span>
              )}
            </div>

            {/* Actions Row */}
            <div className="flex items-center gap-4">
              <WishlistButton productId={product.id} className="p-2.5 rounded-full border border-brand-secondary/30 hover:border-brand-primary hover:bg-brand-pale-rose transition" />
              <button className="p-2.5 rounded-full border border-brand-secondary/30 hover:border-brand-primary hover:bg-brand-pale-rose transition">
                <Share2 className="w-5 h-5 text-brand-text-secondary hover:text-brand-primary" />
              </button>
            </div>

            {/* Description */}
            {productDescription && (
              <div className="prose prose-slate max-w-none">
                <p className="text-brand-text-secondary leading-relaxed">
                  {productDescription}
                </p>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="font-semibold text-brand-text mb-2">
                  {t('benefits')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-brand-text-secondary">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold text-brand-text mb-2">
                  {t('ingredients')}
                </h3>
                <p className="text-brand-text-secondary">
                  {product.ingredients.join(', ')}
                </p>
              </div>
            )}

            {/* How to Use */}
            {howToUse && (
              <div>
                <h3 className="font-semibold text-brand-text mb-2">
                  {t('howToUse')}
                </h3>
                <p className="text-brand-text-secondary">{howToUse}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-brand-pale-rose/30 rounded-xl p-4">
              {product.origin && (
                <div>
                  <span className="text-brand-text-secondary">{t('origin')}:</span>
                  <span className="text-brand-text ml-2">{product.origin}</span>
                </div>
              )}
              {displaySkinTypes.length > 0 && (
                <div>
                  <span className="text-brand-text-secondary">{t('skinTypes')}:</span>
                  <span className="text-brand-text ml-2">
                    {displaySkinTypes.map((st: any, i: number) => (
                      <span key={st.id}>
                        {st.name}
                        {i < displaySkinTypes.length - 1 && '، '}
                      </span>
                    ))}
                  </span>
                </div>
              )}
              {displayConcerns.length > 0 && (
                <div className="col-span-2">
                  <span className="text-brand-text-secondary">Concerns:</span>
                  <span className="text-brand-text ml-2">
                    {displayConcerns.map((c: any, i: number) => (
                      <span key={c.id}>
                        {c.name}
                        {i < displayConcerns.length - 1 && '، '}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <VariantSelector
                variants={variantsWithFormattedPrices}
                defaultVariantId={defaultVariant.id}
                productName={productName}
                productNameFa={locale === 'fa' ? product.nameFa : product.nameEn}
                locale={locale}
                t={variantTranslations}
                productImage={productImage} // Add this
              />
            )}

            {/* Reviews Section */}
            <ProductReviews
              reviews={reviews}
              productId={product.id}
              productSlug={product.slug}
              locale={locale}
              userHasPurchased={userHasPurchased}
              t={{
                reviews: t('reviews'),
                noReviews: t('noReviews'),
                writeReview: t('writeReview'),
                rating: t('rating'),
                title: t('title'),
                comment: t('comment'),
                submit: t('submit'),
                cancel: t('cancel'),
                verifiedPurchase: t('verifiedPurchase'),
                pendingApproval: t('pendingApproval'),
                averageRating: t('averageRating'),
                outOf: t('outOf'),
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}