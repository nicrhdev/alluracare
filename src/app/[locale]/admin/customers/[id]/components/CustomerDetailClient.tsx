// src/app/[locale]/admin/customers/[id]/components/CustomerDetailClient.tsx

'use client';

import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  variant: {
    size: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  formattedDate: string;
  formattedTotal: string;
  items: OrderItem[];
}

interface Address {
  id: string;
  fullName: string;
  phone: string | null;
  street: string;
  city: string;
  state: string | null;
  zipCode: string | null;
  country: string;
  isDefault: boolean;
}

interface Customer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  formattedCreatedAt: string;
  provider: string | null;
  role: string;
  orderCount: number;
  totalSpent: number;
  formattedTotalSpent: string;
  averageOrder: number;
  formattedAverageOrder: string;
  orders: Order[];
  addresses: Address[];
}

interface CustomerDetailClientProps {
  customer: Customer;
  locale: string;
  t: {
    backToCustomers: string;
    customerDetails: string;
    accountInfo: string;
    name: string;
    email: string;
    joined: string;
    provider: string;
    role: string;
    orderHistory: string;
    noOrders: string;
    orderNumber: string;
    date: string;
    items: string;
    total: string;
    status: string;
    orderCount: string;
    totalSpent: string;
    averageOrder: string;
    addresses: string;
    noAddresses: string;
    statusLabels: Record<string, string>;
  };
}

export default function CustomerDetailClient({
  customer,
  locale,
  t,
}: CustomerDetailClientProps) {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/${locale}/admin/customers`}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
        >
          ← {t.backToCustomers}
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">
          {t.customerDetails}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">{t.accountInfo}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">{t.name}</p>
                <p className="font-medium text-slate-800">{customer.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">{t.email}</p>
                <p className="font-medium text-slate-800">{customer.email}</p>
              </div>
              <div>
                <p className="text-slate-500">{t.joined}</p>
                <p className="font-medium text-slate-800">{customer.formattedCreatedAt}</p>
              </div>
              <div>
                <p className="text-slate-500">{t.provider}</p>
                <p className="font-medium text-slate-800">{customer.provider || 'email'}</p>
              </div>
              <div>
                <p className="text-slate-500">{t.role}</p>
                <p className="font-medium text-slate-800">{customer.role}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{customer.orderCount}</p>
              <p className="text-xs font-medium text-blue-600">{t.orderCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{customer.formattedTotalSpent}</p>
              <p className="text-xs font-medium text-green-600">{t.totalSpent}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{customer.formattedAverageOrder}</p>
              <p className="text-xs font-medium text-purple-600">{t.averageOrder}</p>
            </div>
          </div>

          {/* Addresses Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">{t.addresses}</h3>
            {customer.addresses.length === 0 ? (
              <p className="text-slate-500 text-sm">{t.noAddresses}</p>
            ) : (
              <div className="space-y-3">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="border border-slate-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{address.fullName}</p>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600">{address.street}</p>
                    <p className="text-slate-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-slate-600">{address.country}</p>
                    {address.phone && <p className="text-slate-500 text-xs">Phone: {address.phone}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">{t.orderHistory}</h3>

            {customer.orders.length === 0 ? (
              <p className="text-slate-500 text-sm">{t.noOrders}</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {customer.orders.map((order) => (
                  <div key={order.id} className="border-b border-slate-100 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${locale}/admin/orders/${order.id}`}
                        className="font-medium text-slate-800 hover:text-slate-600 transition text-sm"
                      >
                        #{order.orderNumber.slice(0, 8)}
                      </Link>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {t.statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{order.formattedDate}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-sm font-medium text-slate-800">{order.formattedTotal}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}