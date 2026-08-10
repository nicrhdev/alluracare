// src/app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'newest';
    const categories = searchParams.getAll('category');
    const concerns = searchParams.getAll('concern');
    const skinTypes = searchParams.getAll('skinType');
    const brands = searchParams.getAll('brand');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '10000');
    const inStock = searchParams.get('inStock') === 'true';
    const searchQuery = searchParams.get('search') || '';

    // Build filter conditions
    const where: any = {
      isActive: true,
      status: 'PUBLISHED',
    };

    // Search query
    if (searchQuery) {
      where.OR = [
        { nameEn: { contains: searchQuery, mode: 'insensitive' } },
        { nameFa: { contains: searchQuery, mode: 'insensitive' } },
        { descriptionEn: { contains: searchQuery, mode: 'insensitive' } },
        { descriptionFa: { contains: searchQuery, mode: 'insensitive' } },
        { brand: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (categories.length > 0) {
      where.category = {
        slug: { in: categories },
      };
    }

    // Concern filter
    if (concerns.length > 0) {
      where.concerns = {
        some: {
          concern: {
            slug: { in: concerns },
          },
        },
      };
    }

    // Skin Type filter
    if (skinTypes.length > 0) {
      where.skinTypes = {
        some: {
          skinType: {
            slug: { in: skinTypes },
          },
        },
      };
    }

    // Brand filter
    if (brands.length > 0) {
      where.brand = { in: brands };
    }

    // Price filter
    if (minPrice > 0 || maxPrice < 10000) {
      where.variants = {
        some: {
          price: {
            gte: minPrice || 0,
            lte: maxPrice || 10000,
          },
        },
      };
    }

    // In stock filter
    if (inStock) {
      where.variants = {
        some: {
          stock: { gt: 0 },
        },
      };
    }

    // Build sorting
    let orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'bestselling':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price-asc':
        orderBy = { variants: { _min: { price: 'asc' } } };
        break;
      case 'price-desc':
        orderBy = { variants: { _min: { price: 'desc' } } };
        break;
      case 'rating':
        orderBy = { reviews: { _avg: { rating: 'desc' } } };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    // Get products for current page
    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        category: true,
        skinTypes: { select: { skinTypeId: true } },
        concerns: { select: { concernId: true } },
      },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return NextResponse.json({
      success: true,
      products,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}