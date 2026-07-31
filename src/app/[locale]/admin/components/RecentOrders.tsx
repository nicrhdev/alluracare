// src/app/[locale]/admin/components/RecentOrders.tsx

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
}

interface RecentOrdersProps {
  orders: Order[];
  locale: string;
}

export default function RecentOrders({ orders, locale }: RecentOrdersProps) {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-brand-text">
          {locale === 'fa' ? 'سفارش‌های اخیر' : 'Recent Orders'}
        </h2>
        <Link
          href={`/${locale}/admin/orders`}
          className="text-sm text-brand-primary hover:underline flex items-center gap-1"
        >
          {locale === 'fa' ? 'مشاهده همه' : 'View All'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-brand-text-secondary text-center py-8">
          {locale === 'fa' ? 'هنوز سفارشی وجود ندارد' : 'No orders yet'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-secondary/20 text-left">
                <th className="pb-3 font-medium text-brand-text-secondary">Order</th>
                <th className="pb-3 font-medium text-brand-text-secondary">Customer</th>
                <th className="pb-3 font-medium text-brand-text-secondary">Date</th>
                <th className="pb-3 font-medium text-brand-text-secondary">Total</th>
                <th className="pb-3 font-medium text-brand-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-brand-secondary/10 last:border-b-0 hover:bg-brand-pale-rose/20 transition">
                  <td className="py-3 font-medium text-brand-text">
                    #{order.orderNumber.slice(0, 8)}
                  </td>
                  <td className="py-3 text-brand-text-secondary">
                    {order.user.name || order.user.email}
                  </td>
                  <td className="py-3 text-brand-text-secondary">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 font-medium text-brand-text">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}