// src/app/[locale]/admin/orders/components/OrdersClient.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: any[];
}

interface OrdersClientProps {
  orders: Order[];
  locale: string;
  searchParams: {
    status: string;
    search: string;
  };
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  t: {
    title: string;
    subtitle: string;
    orderNumber: string;
    customer: string;
    date: string;
    total: string;
    status: string;
    actions: string;
    view: string;
    filterByStatus: string;
    allStatuses: string;
    searchOrders: string;
    search: string;
    clear: string;
    noOrders: string;
    statusLabels: Record<string, string>;
    stats: {
      total: string;
      pending: string;
      processing: string;
      shipped: string;
      delivered: string;
      cancelled: string;
    };
  };
}

export default function OrdersClient({ 
  orders, 
  locale, 
  searchParams, 
  stats,
  t 
}: OrdersClientProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const statusOptions = [
    { value: '', label: t.allStatuses },
    { value: 'PENDING', label: t.statusLabels.PENDING },
    { value: 'PROCESSING', label: t.statusLabels.PROCESSING },
    { value: 'SHIPPED', label: t.statusLabels.SHIPPED },
    { value: 'DELIVERED', label: t.statusLabels.DELIVERED },
    { value: 'CANCELLED', label: t.statusLabels.CANCELLED },
  ];

  const statCards = [
    { label: t.stats.total, value: stats.total, color: 'bg-slate-100 text-slate-700' },
    { label: t.stats.pending, value: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
    { label: t.stats.processing, value: stats.processing, color: 'bg-blue-100 text-blue-700' },
    { label: t.stats.shipped, value: stats.shipped, color: 'bg-purple-100 text-purple-700' },
    { label: t.stats.delivered, value: stats.delivered, color: 'bg-green-100 text-green-700' },
    { label: t.stats.cancelled, value: stats.cancelled, color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t.title}</h1>
          <p className="text-slate-600">{t.subtitle}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl shadow-sm p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <select
              name="status"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              defaultValue={searchParams.status}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              placeholder={t.searchOrders}
              defaultValue={searchParams.search}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            {t.search}
          </button>

          {(searchParams.status || searchParams.search) && (
            <Link
              href={`/${locale}/admin/orders`}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              {t.clear}
            </Link>
          )}
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">{t.noOrders}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.orderNumber}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.customer}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.date}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.total}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.status}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-700">
                      #{order.orderNumber.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {t.statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/${locale}/admin/orders/${order.id}`}
                        className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                      >
                        {t.view}
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