// src/app/api/reviews/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Please log in to submit a review' },
        { status: 401 }
      );
    }

    const { productId, rating, title, comment, locale } = await request.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          where: { status: { not: 'CANCELLED' } },
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
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const hasPurchased = user.orders.some(order =>
      order.items.some(item => item.variant.productId === productId)
    );

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review (auto-approve if user purchased, otherwise pending)
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating,
        title: title || null,
        commentEn: locale === 'en' ? comment : null,
        commentFa: locale === 'fa' ? comment : null,
        isVerifiedPurchase: hasPurchased,
        isApproved: hasPurchased, // Auto-approve verified purchases
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: hasPurchased 
        ? 'Review submitted successfully!' 
        : 'Review submitted! It will appear after admin approval.',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}