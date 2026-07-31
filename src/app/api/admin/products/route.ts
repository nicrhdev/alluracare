// src/app/api/admin/products/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';

// GET - Get all products
export async function GET(request: Request) {
  try {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameFa: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: Request) {
  try {
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
    console.log('📦 Received product data:', body);

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
      return NextResponse.json(
        { error: 'Missing required fields: nameEn, nameFa, slug, categoryId' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Create the product with relations
    const product = await prisma.product.create({
      data: {
        nameEn,
        nameFa,
        slug,
        descriptionEn: descriptionEn || null,
        descriptionFa: descriptionFa || null,
        benefits: benefits || [],
        ingredients: ingredients || [],
        howToUseEn: howToUseEn || null,
        howToUseFa: howToUseFa || null,
        origin: origin || null,
        brand: brand || null,
        categoryId,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        status: status || 'DRAFT',
        images: images || [],
        variants: {
          create: variants?.map((v: any) => ({
            size: v.size,
            price: v.price,
            comparePrice: v.comparePrice || null,
            stock: v.stock || 0,
            sku: v.sku || '',
            isDefault: v.isDefault || false,
          })) || [],
        },
      },
    });

    // Connect skin types and concerns after product creation
    if (selectedSkinTypeIds && selectedSkinTypeIds.length > 0) {
      await prisma.productSkinType.createMany({
        data: selectedSkinTypeIds.map((skinTypeId: string) => ({
          productId: product.id,
          skinTypeId,
        })),
      });
    }

    if (selectedConcernIds && selectedConcernIds.length > 0) {
      await prisma.productConcern.createMany({
        data: selectedConcernIds.map((concernId: string) => ({
          productId: product.id,
          concernId,
        })),
      });
    }

    // Fetch the complete product
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
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

    console.log('✅ Product created successfully:', product.id);
    return NextResponse.json({ product: completeProduct }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}