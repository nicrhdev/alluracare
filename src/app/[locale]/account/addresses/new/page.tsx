'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface NewAddressPageProps {
  params: {
    locale: string;
  };
}

export default function NewAddressPage({ params }: NewAddressPageProps) {
  const { locale } = params;
  const isPersian = locale === 'fa';
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IR',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add address');
      }

      toast.success(isPersian ? '✅ آدرس با موفقیت اضافه شد' : '✅ Address added successfully');
      router.push(`/${locale}/account/addresses`);
    } catch (error: any) {
      toast.error(error.message || (isPersian ? 'خطا در افزودن آدرس' : 'Failed to add address'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#2D2D2D]">
        {isPersian ? 'افزودن آدرس جدید' : 'Add New Address'}
      </h2>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'نام کامل' : 'Full Name'} *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'شماره تماس' : 'Phone Number'} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'کشور' : 'Country'} *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
              required
            >
              <option value="IR">{isPersian ? 'ایران' : 'Iran'}</option>
              <option value="US">{isPersian ? 'ایالات متحده' : 'United States'}</option>
              <option value="CA">{isPersian ? 'کانادا' : 'Canada'}</option>
              <option value="UK">{isPersian ? 'بریتانیا' : 'United Kingdom'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'استان' : 'State/Province'} *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'شهر' : 'City'} *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'آدرس' : 'Address'} *
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'کد پستی' : 'Postal Code'} *
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (isPersian ? 'در حال ثبت...' : 'Saving...') : (isPersian ? 'ذخیره آدرس' : 'Save Address')}
            </button>
            <Link
              href={`/${locale}/account/addresses`}
              className="px-6 py-2 border border-brand-secondary/30 rounded-lg text-[#8A8A8A] hover:text-[#874A58] hover:border-[#874A58] transition"
            >
              {isPersian ? 'انصراف' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}