// src/app/[locale]/product/[slug]/page.tsx

import { prisma } from '@/lib/prisma/client';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import ProductClient from './components/ProductClient';

interface ProductPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const session = await getServerSession(authOptions);

  // Fetch product
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
      isActive: true,
      status: 'PUBLISHED',
    },
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
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Check if in wishlist
  let isInWishlist = false;
  if (session?.user?.id) {
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId: product.id,
      },
    });
    isInWishlist = !!wishlistItem;
  }

  // Fetch related products (same category, exclude current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
      status: 'PUBLISHED',
    },
    include: {
      variants: true,
    },
    take: 8,
  });

  // Fetch frequently bought together (same concerns + similar price range)
  const productConcernIds = product.concerns.map((c: any) => c.concernId);
  const productPrice = Math.min(...product.variants.map((v: any) => v.price));
  const priceRange = {
    min: productPrice * 0.7,
    max: productPrice * 1.3,
  };

  const frequentlyBought = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      isActive: true,
      status: 'PUBLISHED',
      concerns: productConcernIds.length > 0 ? {
        some: {
          concernId: { in: productConcernIds },
        },
      } : undefined,
      variants: {
        some: {
          price: {
            gte: priceRange.min,
            lte: priceRange.max,
          },
        },
      },
    },
    include: {
      variants: true,
    },
    take: 4,
  });

  // Format reviews with images
  const formattedReviews = product.reviews.map((review: any) => ({
    ...review,
    images: review.images || [],
  }));

  // For benefits and ingredients: Use the same data for both languages
  const benefitsData = product.benefits || [];
  const ingredientsData = product.ingredients || [];

  // Extract skin types and concerns from the product
  const skinTypes = product.skinTypes.map((st: any) => st.skinType);
  const concerns = product.concerns.map((c: any) => c.concern);

  return (
    <ProductClient
      product={product}
      relatedProducts={relatedProducts}
      frequentlyBought={frequentlyBought}
      reviews={formattedReviews}
      isInWishlist={isInWishlist}
      locale={locale}
      benefitsEn={benefitsData}
      benefitsFa={benefitsData}
      ingredientsEn={ingredientsData}
      ingredientsFa={ingredientsData}
      skinTypes={skinTypes}
      concerns={concerns}
    />
  );
}