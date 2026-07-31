// src/app/[locale]/admin/customers/components/CustomersClient.tsx

'use client';

import Link from 'next/link';

interface Customer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  provider: string | null;
  role: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: {
    id: string;
    total: number;
    status: string;
    createdAt: Date;
  } | null;
}

interface CustomersClientProps {
  customers: Customer[];
  locale: string;
  searchTerm: string;
  stats: {
    totalCustomers: number;
    recentCustomers: number;
    totalOrders: number;
    totalRevenue: number;
  };
  t: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    search: string;
    clear: string;
    noCustomers: string;
    name: string;
    email: string;
    joined: string;
    orders: string;
    spent: string;
    lastOrder: string;
    view: string;
    stats: {
      totalCustomers: string;
      recentCustomers: string;
      totalOrders: string;
      totalRevenue: string;
    };
  };
}

export default function CustomersClient({ 
  customers, 
  locale, 
  searchTerm, 
  stats,
  t 
}: CustomersClientProps) {
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

  const statCards = [
    { label: t.stats.totalCustomers, value: stats.totalCustomers, color: 'bg-blue-100 text-blue-700' },
    { label: t.stats.recentCustomers, value: stats.recentCustomers, color: 'bg-green-100 text-green-700' },
    { label: t.stats.totalOrders, value: stats.totalOrders, color: 'bg-purple-100 text-purple-700' },
    { label: t.stats.totalRevenue, value: formatPrice(stats.totalRevenue), color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t.title}</h1>
          <p className="text-slate-600">{t.subtitle}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl shadow-sm p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form method="GET" className="flex gap-4">
          <input
            type="text"
            name="search"
            placeholder={t.searchPlaceholder}
            defaultValue={searchTerm}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
          >
            {t.search}
          </button>
          {searchTerm && (
            <Link
              href={`/${locale}/admin/customers`}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              {t.clear}
            </Link>
          )}
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">{t.noCustomers}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.name}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.email}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.joined}
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">
                    {t.orders}
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500">
                    {t.spent}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">
                    {t.lastOrder}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">
                    {t.view}
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-medium">
                          {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-medium text-slate-800">
                          {customer.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {customer.orderCount}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-slate-700">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {customer.lastOrder ? formatDate(customer.lastOrder.createdAt) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/${locale}/admin/customers/${customer.id}`}
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