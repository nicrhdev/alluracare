// src/app/[locale]/checkout/components/CheckoutClient.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Truck, CreditCard, CheckCircle, MapPin, Phone, Mail, User } from 'lucide-react';

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

interface User {
  id: string;
  email: string;
  name: string | null;
  addresses: Address[];
}

interface CheckoutClientProps {
  user: User;
  locale: string;
  t: {
    shippingInfo: string;
    orderSummary: string;
    payment: string;
    confirm: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    saveAddress: string;
  };
}

export default function CheckoutClient({ user, locale, t }: CheckoutClientProps) {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const isPersian = locale === 'fa';

  const [formData, setFormData] = useState({
    fullName: user.name || '',
    email: user.email,
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IR',
    saveAddress: false,
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push(`/${locale}/cart`);
    }
  }, [items, router, locale]);

  const totalPrice = getTotalPrice();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.fullName || !formData.email || !formData.phone ||
      !formData.street || !formData.city || !formData.state ||
      !formData.zipCode || !formData.country) {
      setError(isPersian ? 'لطفاً تمام فیلدها را پر کنید' : 'Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: totalPrice,
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          saveAddress: formData.saveAddress,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await orderResponse.json();
      clearCart();
      window.location.href = `/${locale}/checkout/success?orderId=${data.orderId}`;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const countryOptions = isPersian
    ? [
      { code: 'IR', name: 'ایران' },
    ]
    : [
      { code: 'IR', name: 'Iran' },
    ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-brand-secondary/20 p-6">
          <h2 className="text-xl font-semibold text-[#2D2D2D] mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#874A58]" />
            {t.shippingInfo}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.fullName} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={isPersian ? 'نام کامل' : 'Full Name'}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.email} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isPersian ? 'ایمیل' : 'Email'}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.phone} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={isPersian ? '۰۹XXXXXXXXX' : '09XXXXXXXXX'}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                  required
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.country} *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] bg-white"
                required
              >
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.state} *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder={isPersian ? 'استان' : 'State/Province'}
                className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.city} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={isPersian ? 'شهر' : 'City'}
                className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.address} *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder={isPersian ? 'آدرس کامل' : 'Full Address'}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                  required
                />
              </div>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {t.zipCode} *
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder={isPersian ? 'کد پستی' : 'Postal Code'}
                className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A]"
                required
              />
            </div>

            {/* Save Address */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleChange}
                className="w-4 h-4 rounded border-brand-secondary/50 text-[#874A58] focus:ring-[#874A58]"
              />
              <label className="text-sm text-[#8A8A8A]">
                {t.saveAddress}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full mt-4 btn-primary py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isPersian ? 'در حال پردازش...' : 'Processing...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t.confirm}
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-brand-secondary/20 p-6 sticky top-24">
          <h2 className="text-xl font-semibold text-[#2D2D2D] mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#874A58]" />
            {t.orderSummary}
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm border-b border-brand-secondary/10 pb-2">
                <span className="text-[#2D2D2D]">
                  {isPersian ? item.nameFa : item.name} × {item.quantity}
                </span>
                <span className="font-medium text-[#2D2D2D]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-secondary/20 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8A8A8A]">{isPersian ? 'جمع جزئی' : 'Subtotal'}</span>
              <span className="text-[#2D2D2D]">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A8A]">{isPersian ? 'ارسال' : 'Shipping'}</span>
              <span className="text-[#2D2D2D]">{isPersian ? 'رایگان' : 'Free'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-brand-secondary/20">
              <span className="text-[#2D2D2D]">{isPersian ? 'جمع کل' : 'Total'}</span>
              <span className="text-[#874A58]">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#EDEDFA]/30 rounded-lg flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-[#874A58]" />
            <span className="text-[#8A8A8A]">
              {isPersian ? 'پرداخت امن با کارت اعتباری' : 'Secure payment with credit card'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}