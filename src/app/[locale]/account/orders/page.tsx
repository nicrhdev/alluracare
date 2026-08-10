// src/app/[locale]/account/orders/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';

interface OrdersPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/orders`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Get all orders
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatPrice = (price: number) => {
    if (isPersian) {
      const tomanRate = 50000;
      const tomanPrice = price * tomanRate;
      return new Intl.NumberFormat('fa-IR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(tomanPrice) + ' تومان';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: isPersian ? 'در انتظار تایید' : 'Pending',
      PROCESSING: isPersian ? 'در حال پردازش' : 'Processing',
      SHIPPED: isPersian ? 'ارسال شده' : 'Shipped',
      DELIVERED: isPersian ? 'تحویل داده شده' : 'Delivered',
      CANCELLED: isPersian ? 'لغو شده' : 'Cancelled',
      REFUNDED: isPersian ? 'بازگشت داده شده' : 'Refunded',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      PROCESSING: 'bg-blue-100 text-blue-700',
      SHIPPED: 'bg-purple-100 text-purple-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
      REFUNDED: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#2D2D2D]">
        {isPersian ? 'سفارشات من' : 'My Orders'}
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-12 text-center">
          <Package className="w-16 h-16 text-[#8A8A8A] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
            {isPersian ? 'هیچ سفارشی ندارید' : 'No orders yet'}
          </h3>
          <p className="text-[#8A8A8A]">
            {isPersian
              ? 'هنوز سفارشی ثبت نکرده‌اید'
              : 'You haven\'t placed any orders yet'}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block mt-4 text-[#874A58] hover:text-[#C397A0] font-medium transition"
          >
            {isPersian ? 'شروع خرید' : 'Start Shopping'} →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/${locale}/account/orders/${order.id}`}
              className="block bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6 hover:shadow-md transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-[#2D2D2D]">
                    {isPersian ? `سفارش #${order.orderNumber}` : `Order #${order.orderNumber}`}
                  </p>
                  <p className="text-sm text-[#8A8A8A]">
                    {new Date(order.createdAt).toLocaleDateString(isPersian ? 'fa-IR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-[#8A8A8A]">
                    {order.items.length} {isPersian ? 'محصول' : 'items'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#874A58]">
                    {formatPrice(order.total)}
                  </p>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#8A8A8A]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}