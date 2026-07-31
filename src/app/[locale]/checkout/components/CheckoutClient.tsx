// src/app/[locale]/checkout/components/CheckoutClient.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Truck, CreditCard, CheckCircle } from 'lucide-react';

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

  // Form state
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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push(`/${locale}/cart`);
    }
  }, [items, router, locale]);

  const totalPrice = getTotalPrice();

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

    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone ||
      !formData.street || !formData.city || !formData.state ||
      !formData.zipCode || !formData.country) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Create order in database
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
        let errorMessage = 'Failed to create order';
        try {
          const errorData = await orderResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Server error: ${orderResponse.status}`;
        }
        throw new Error(errorMessage);
      }

      // Parse the response
      let data;
      try {
        data = await orderResponse.json();
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        throw new Error('Server returned invalid response');
      }

      if (!data.orderId) {
        throw new Error('No order ID returned');
      }

      // Clear cart
      clearCart();

      // Use window.location for full page navigation to success page
      const successUrl = `/${locale}/checkout/success?orderId=${data.orderId}`;
      window.location.href = successUrl;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Country options
  const countryOptions = locale === 'fa'
    ? [
      { code: 'IR', name: 'ایران' },
      { code: 'US', name: 'ایالات متحده' },
      { code: 'CA', name: 'کانادا' },
      { code: 'UK', name: 'بریتانیا' },
      { code: 'DE', name: 'آلمان' },
      { code: 'FR', name: 'فرانسه' },
      { code: 'JP', name: 'ژاپن' },
      { code: 'AU', name: 'استرالیا' },
      { code: 'AE', name: 'امارات' },
      { code: 'TR', name: 'ترکیه' },
    ]
    : [
      { code: 'IR', name: 'Iran' },
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'UK', name: 'United Kingdom' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'JP', name: 'Japan' },
      { code: 'AU', name: 'Australia' },
      { code: 'AE', name: 'UAE' },
      { code: 'TR', name: 'Turkey' },
    ];

  const getPlaceholder = (field: string) => {
    if (locale === 'fa') {
      const placeholders: Record<string, string> = {
        fullName: 'نام کامل',
        email: 'ایمیل',
        phone: '۰۹XXXXXXXXX',
        street: 'آدرس کامل',
        city: 'شهر',
        state: 'استان',
        zipCode: 'کد پستی',
        country: 'کشور',
      };
      return placeholders[field] || '';
    }
    const placeholders: Record<string, string> = {
      fullName: 'Full Name',
      email: 'Email',
      phone: '09XXXXXXXXX',
      street: 'Full Address',
      city: 'City',
      state: 'State/Province',
      zipCode: 'Postal Code',
      country: 'Country',
    };
    return placeholders[field] || '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Shipping Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-6">
          <h2 className="text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-primary" />
            {t.shippingInfo}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.fullName} *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={getPlaceholder('fullName')}
                className="input-pastel"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.email} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={getPlaceholder('email')}
                className="input-pastel"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.country} *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="select-pastel"
                required
              >
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Province/State */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.state} *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder={getPlaceholder('state')}
                className="input-pastel"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.city} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={getPlaceholder('city')}
                className="input-pastel"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.address} *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder={getPlaceholder('street')}
                className="input-pastel"
                required
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.zipCode} *
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder={getPlaceholder('zipCode')}
                className="input-pastel"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                {t.phone} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={getPlaceholder('phone')}
                className="input-pastel"
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
                className="w-4 h-4 rounded border-brand-secondary/50 text-brand-primary focus:ring-brand-primary"
              />
              <label className="text-sm text-brand-text-secondary">
                {t.saveAddress}
              </label>
            </div>

            {/* Submit button moved inside form */}
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full mt-4 btn-primary py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {locale === 'fa' ? 'در حال پردازش...' : 'Processing...'}
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
        <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-6 sticky top-24">
          <h2 className="text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-primary" />
            {t.orderSummary}
          </h2>

          {/* Items */}
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm border-b border-brand-secondary/10 pb-2">
                <span className="text-brand-text">
                  {locale === 'fa' ? item.nameFa : item.name} × {item.quantity}
                </span>
                <span className="font-medium text-brand-text">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-brand-secondary/20 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Subtotal</span>
              <span className="text-brand-text">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Shipping</span>
              <span className="text-brand-text">$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-brand-secondary/20">
              <span className="text-brand-text">Total</span>
              <span className="text-brand-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="mt-4 p-3 bg-brand-pale-rose/30 rounded-lg flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-brand-primary" />
            <span className="text-brand-text-secondary">
              {locale === 'fa' ? 'پرداخت امن با کارت اعتباری' : 'Secure payment with credit card'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}