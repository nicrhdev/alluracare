// src/app/api/orders/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Please log in to place an order' },
        { status: 401 }
      );
    }

    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { items, total, shippingAddress, saveAddress } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Get user with addresses
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get product IDs for each item
    const orderItemsData = await Promise.all(
      items.map(async (item: any) => {
        // Get the variant to find its product
        const variant = await prisma.variant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        return {
          variant: {
            connect: { id: item.variantId }
          },
          product: {
            connect: { id: variant.productId }
          },
          quantity: item.quantity,
          price: item.price,
        };
      })
    );

    // Generate order number
    const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        total: total || 0,
        subtotal: total || 0,
        shippingAddress: shippingAddress,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            variant: true,
            product: true,
          },
        },
      },
    });

    // Save address if requested
    if (saveAddress) {
      try {
        await prisma.address.create({
          data: {
            userId: user.id,
            fullName: shippingAddress.fullName || '',
            phone: shippingAddress.phone || null,
            street: shippingAddress.street || '',
            city: shippingAddress.city || '',
            state: shippingAddress.state || null,
            zipCode: shippingAddress.zipCode || null,
            country: shippingAddress.country || 'IR',
            isDefault: user.addresses.length === 0,
          },
        });
      } catch (addressError) {
        console.error('Failed to save address:', addressError);
        // Continue with order creation even if address saving fails
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    );
  }
}