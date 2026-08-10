// src/app/[locale]/account/components/RecentOrders.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  items: any[];
}

interface RecentOrdersProps {
  orders: Order[];
  locale: string;
}

export default function RecentOrders({ orders, locale }: RecentOrdersProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isPersian = locale === 'fa';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatPrice = (price: number) => {
  if (isPersian) {
    const tomanRate = 185000; 
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

  if (orders.length === 0) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-8 text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <Package className="w-12 h-12 text-[#8A8A8A] mx-auto mb-3" />
        <h3 className="font-semibold text-[#2D2D2D]">
          {isPersian ? 'هیچ سفارشی ندارید' : 'No orders yet'}
        </h3>
        <p className="text-sm text-[#8A8A8A] mt-1">
          {isPersian
            ? 'سفارشات شما در اینجا نمایش داده می‌شوند'
            : 'Your orders will appear here'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block mt-4 text-[#874A58] hover:text-[#C397A0] font-medium transition"
        >
          {isPersian ? 'شروع خرید' : 'Start Shopping'} →
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2D2D2D]">
          {isPersian ? 'سفارشات اخیر' : 'Recent Orders'}
        </h3>
        <Link
          href={`/${locale}/account/orders`}
          className="text-sm text-[#874A58] hover:text-[#C397A0] transition flex items-center gap-1"
        >
          {isPersian ? 'مشاهده همه' : 'View All'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {orders.map((order, index) => (
          <Link
            key={order.id}
            href={`/${locale}/account/orders/${order.id}`}
            className={`block p-4 border border-brand-secondary/10 rounded-xl hover:border-brand-secondary/30 hover:bg-[#EDEDFA]/10 transition group ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-medium text-[#2D2D2D] group-hover:text-[#874A58] transition">
                  {isPersian ? `سفارش #${order.orderNumber}` : `Order #${order.orderNumber}`}
                </p>
                <p className="text-sm text-[#8A8A8A]">
                  {new Date(order.createdAt).toLocaleDateString(isPersian ? 'fa-IR' : 'en-US')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#874A58]">
                  {formatPrice(order.total)}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
                <ChevronRight className="w-4 h-4 text-[#8A8A8A] group-hover:text-[#874A58] transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}