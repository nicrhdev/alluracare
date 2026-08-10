// src/app/api/admin/products/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get a single product by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
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
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update a product
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    console.log('📦 Updating product:', body);

    const {
      nameEn,
      nameFa,
      slug,
      descriptionEn,
      descriptionFa,
      benefits,
      ingredients,
      howToUseEn,
      howToUseFa,
      selectedSkinTypeIds,
      selectedConcernIds,
      origin,
      brand,
      categoryId,
      isActive,
      isFeatured,
      status,
      variants,
      images,
    } = body;

    // Validate required fields
    if (!nameEn || !nameFa || !slug || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get existing variant IDs
    const existingVariantIds = existingProduct.variants.map((v: any) => v.id);
    const newVariantIds = variants
      .filter((v: any) => v.id)
      .map((v: any) => v.id);

    // Find variants to delete (exist in old but not in new)
    const variantIdsToDelete = existingVariantIds.filter(
      (id: string) => !newVariantIds.includes(id)
    );

    // Update product basic info
const product = await prisma.product.update({
  where: { id },
  data: {
    nameEn,
    nameFa,
    slug,
    descriptionEn: descriptionEn || null,
    descriptionFa: descriptionFa || null,
    benefits: benefits || [],
    ingredients: ingredients || [],
    benefitsEn: body.benefitsEn || [],  
    benefitsFa: body.benefitsFa || [],  
    ingredientsEn: body.ingredientsEn || [],  
    ingredientsFa: body.ingredientsFa || [], 
    howToUseEn: howToUseEn || null,
    howToUseFa: howToUseFa || null,
    origin: origin || null,
    brand: brand || null,
    categoryId,
    isActive: isActive ?? true,
    isFeatured: isFeatured ?? false,
    status: status || 'DRAFT',
    images: images || [],
  },
});

    // Handle variants - update or create
    for (const variant of variants) {
      if (variant.id) {
        // Update existing variant
       await prisma.variant.update({
  where: { id: variant.id },
  data: {
    size: variant.size,
    price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price,
    comparePrice: variant.comparePrice
      ? (typeof variant.comparePrice === 'string' ? parseFloat(variant.comparePrice) : variant.comparePrice)
      : null,
    discountPercent: variant.discountPercent
      ? (typeof variant.discountPercent === 'string' ? parseFloat(variant.discountPercent) : variant.discountPercent)
      : null,
    stock: typeof variant.stock === 'string' ? parseInt(variant.stock) : variant.stock,
    sku: variant.sku || '',
    isDefault: variant.isDefault || false,
  },
});
      } else {
        // Create new variant
        await prisma.variant.create({
  data: {
    productId: id,
    size: variant.size,
    price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price,
    comparePrice: variant.comparePrice
      ? (typeof variant.comparePrice === 'string' ? parseFloat(variant.comparePrice) : variant.comparePrice)
      : null,
    discountPercent: variant.discountPercent
      ? (typeof variant.discountPercent === 'string' ? parseFloat(variant.discountPercent) : variant.discountPercent)
      : null,
    stock: typeof variant.stock === 'string' ? parseInt(variant.stock) : variant.stock,
    sku: variant.sku || '',
    isDefault: variant.isDefault || false,
  },
});
      }
    }

    // Delete variants that were removed (only if they don't have order_items)
    if (variantIdsToDelete.length > 0) {
      // Check if any variants have order_items
      const variantsWithOrders = await prisma.variant.findMany({
        where: {
          id: { in: variantIdsToDelete },
          orderItems: {
            some: {},
          },
        },
        select: { id: true, size: true },
      });

      if (variantsWithOrders.length > 0) {
        // Warn but continue - archive instead of delete
        console.warn('⚠️ Variants with orders cannot be deleted:', variantsWithOrders);
        // Archive the product instead of deleting variants
      }

      // Delete variants without orders
      const variantIdsWithoutOrders = variantIdsToDelete.filter(
        (id: string) => !variantsWithOrders.some((v: any) => v.id === id)
      );

      if (variantIdsWithoutOrders.length > 0) {
        await prisma.variant.deleteMany({
          where: {
            id: { in: variantIdsWithoutOrders },
          },
        });
      }
    }

    // Update skin types - delete old ones and create new ones
    await prisma.productSkinType.deleteMany({
      where: { productId: id },
    });

    if (selectedSkinTypeIds && selectedSkinTypeIds.length > 0) {
      await prisma.productSkinType.createMany({
        data: selectedSkinTypeIds.map((skinTypeId: string) => ({
          productId: id,
          skinTypeId,
        })),
      });
    }

    // Update concerns - delete old ones and create new ones
    await prisma.productConcern.deleteMany({
      where: { productId: id },
    });

    if (selectedConcernIds && selectedConcernIds.length > 0) {
      await prisma.productConcern.createMany({
        data: selectedConcernIds.map((concernId: string) => ({
          productId: id,
          concernId,
        })),
      });
    }

    // Fetch the complete updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
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
    });

    console.log('✅ Product updated successfully:', id);
    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product (variants, skin types, concerns will be deleted via cascade)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}