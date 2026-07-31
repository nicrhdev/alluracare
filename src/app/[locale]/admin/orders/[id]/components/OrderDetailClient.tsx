// src/app/[locale]/admin/orders/[id]/components/OrderDetailClient.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  formattedPrice: string;
  formattedItemTotal: string;
  variant: {
    id: string;
    size: string;
    product: {
      id: string;
      nameEn: string;
      nameFa: string;
    };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  createdAt: Date;
  formattedCreatedAt: string;
  formattedTotal: string;
  formattedSubtotal: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: OrderItem[];
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderDetailClientProps {
  order: Order;
  shippingAddress: ShippingAddress;
  subtotal: number;
  locale: string;
  t: {
    backToOrders: string;
    orderNumber: string;
    orderDate: string;
    orderStatus: string;
    customerInfo: string;
    shippingInfo: string;
    orderItems: string;
    product: string;
    variant: string;
    quantity: string;
    price: string;
    total: string;
    subtotal: string;
    shipping: string;
    discount: string;
    statusUpdate: string;
    updateStatus: string;
    statusUpdated: string;
    statusLabels: Record<string, string>;
  };
}

export default function OrderDetailClient({
  order,
  shippingAddress,
  subtotal,
  locale,
  t,
}: OrderDetailClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  const statusOptions = [
    { value: 'PENDING', label: t.statusLabels.PENDING },
    { value: 'PROCESSING', label: t.statusLabels.PROCESSING },
    { value: 'SHIPPED', label: t.statusLabels.SHIPPED },
    { value: 'DELIVERED', label: t.statusLabels.DELIVERED },
    { value: 'CANCELLED', label: t.statusLabels.CANCELLED },
    { value: 'REFUNDED', label: t.statusLabels.REFUNDED },
  ];

  const handleStatusUpdate = async () => {
    if (status === order.status) {
      setMessage('No change to status');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setUpdating(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      setMessage(t.statusUpdated);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setUpdating(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/${locale}/admin/orders`}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
        >
          ← {t.backToOrders}
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">#{order.orderNumber}</h1>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg mb-6 ${
            message.includes('updated') || message.includes('No change')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">{t.orderDate}</p>
                <p className="font-medium text-slate-800">{order.formattedCreatedAt}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.orderStatus}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  {t.statusLabels[status] || status}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t.total}</p>
                <p className="font-bold text-slate-800">{order.formattedTotal}</p>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-3">{t.customerInfo}</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-slate-500">Name:</span> {order.user.name || 'N/A'}
              </p>
              <p>
                <span className="text-slate-500">Email:</span> {order.user.email}
              </p>
            </div>
          </div>

          {/* Shipping Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-3">{t.shippingInfo}</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-slate-500">Name:</span> {shippingAddress.fullName}
              </p>
              <p>
                <span className="text-slate-500">Address:</span> {shippingAddress.street}
              </p>
              <p>
                <span className="text-slate-500">City:</span> {shippingAddress.city}
              </p>
              <p>
                <span className="text-slate-500">State:</span> {shippingAddress.state}
              </p>
              <p>
                <span className="text-slate-500">ZIP:</span> {shippingAddress.zipCode}
              </p>
              <p>
                <span className="text-slate-500">Country:</span> {shippingAddress.country}
              </p>
              <p>
                <span className="text-slate-500">Phone:</span> {shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Status Update & Summary */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-3">{t.statusUpdate}</h3>
            <div className="space-y-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="w-full py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition disabled:opacity-50"
              >
                {updating ? 'Updating...' : t.updateStatus}
              </button>
              <p className="text-xs text-slate-400 mt-2">
                {locale === 'fa'
                  ? 'تغییر وضعیت سفارش'
                  : 'Update the order status to reflect its current state'}
              </p>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-3">{t.orderItems}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b border-slate-100 pb-2">
                  <div>
                    <p className="font-medium text-slate-700">
                      {locale === 'fa' ? item.variant.product.nameFa : item.variant.product.nameEn}
                    </p>
                    <p className="text-xs text-slate-400">{item.variant.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600">
                      {item.quantity} × {item.formattedPrice}
                    </p>
                    <p className="font-medium text-slate-800">{item.formattedItemTotal}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-3 mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.subtotal}</span>
                <span className="text-slate-700">{order.formattedSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.shipping}</span>
                <span className="text-slate-700">$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                <span className="text-slate-800">{t.total}</span>
                <span className="text-slate-800">{order.formattedTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}