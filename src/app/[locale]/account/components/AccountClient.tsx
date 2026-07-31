// src/app/[locale]/account/components/AccountClient.tsx

'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, Package, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  formattedDate: string;
}

interface UserData {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  formattedCreatedAt: string;
  orders: Order[];
  addresses: any[];
}

interface AccountClientProps {
  user: UserData;
  locale: string;
  t: {
    orders: string;
    noOrders: string;
    orderNumber: string;
    date: string;
    status: string;
    total: string;
    viewOrder: string;
    email: string;
    name: string;
    memberSince: string;
  };
}

export default function AccountClient({ user, locale, t }: AccountClientProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-hover flex items-center justify-center text-white text-xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-text">
                {user.name || 'User'}
              </h2>
              <p className="text-brand-text-secondary text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-brand-text-secondary hover:text-red-500 border border-brand-secondary/30 rounded-lg hover:border-red-200 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-brand-text flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary" />
            {t.orders}
          </h2>
          {user.orders.length > 0 && (
            <Link
              href={`/${locale}/account/orders`}
              className="text-sm text-brand-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {user.orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-text-secondary">{t.noOrders}</p>
            <Link
              href={`/${locale}/shop`}
              className="inline-block mt-4 text-brand-primary hover:underline text-sm"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-secondary/20 text-left">
                  <th className="pb-3 font-medium text-brand-text-secondary">
                    {t.orderNumber}
                  </th>
                  <th className="pb-3 font-medium text-brand-text-secondary">
                    {t.date}
                  </th>
                  <th className="pb-3 font-medium text-brand-text-secondary">
                    {t.status}
                  </th>
                  <th className="pb-3 font-medium text-brand-text-secondary text-right">
                    {t.total}
                  </th>
                  <th className="pb-3 font-medium text-brand-text-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((order) => (
                  <tr key={order.id} className="border-b border-brand-secondary/10 last:border-b-0 hover:bg-brand-pale-rose/20 transition">
                    <td className="py-3 font-medium text-brand-text">
                      #{order.orderNumber.slice(0, 8)}
                    </td>
                    <td className="py-3 text-brand-text-secondary">
                      {order.formattedDate}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-brand-text">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/${locale}/order/${order.id}`}
                        className="text-brand-primary hover:underline text-sm flex items-center justify-end gap-1"
                      >
                        {t.viewOrder} <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}