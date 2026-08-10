// src/app/[locale]/account/settings/page.tsx

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsPageProps {
  params: {
    locale: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = params;
  const isPersian = locale === 'fa';
  const { data: session, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      await update();
      toast.success(isPersian ? '✅ تنظیمات ذخیره شد' : '✅ Settings saved');
      
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      toast.error(error.message || (isPersian ? 'خطا در ذخیره‌سازی' : 'Failed to save'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#2D2D2D]">
        {isPersian ? 'تنظیمات حساب' : 'Account Settings'}
      </h2>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'نام کامل' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
              {isPersian ? 'ایمیل' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          <div className="border-t border-brand-secondary/20 pt-4 mt-4">
            <h3 className="font-medium text-[#2D2D2D] mb-4">
              {isPersian ? 'تغییر رمز عبور' : 'Change Password'}
            </h3>
            <p className="text-sm text-[#8A8A8A] mb-4">
              {isPersian
                ? 'برای تغییر رمز عبور، رمز فعلی و رمز جدید را وارد کنید'
                : 'Enter your current password and new password to change it'}
            </p>

            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {isPersian ? 'رمز عبور فعلی' : 'Current Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
                  placeholder={isPersian ? 'رمز عبور فعلی را وارد کنید' : 'Enter current password'}
                />
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {isPersian ? 'رمز عبور جدید' : 'New Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
                  placeholder={isPersian ? 'رمز عبور جدید (اختیاری)' : 'New password (optional)'}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                {isPersian ? 'تکرار رمز عبور جدید' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition"
                  placeholder={isPersian ? 'رمز عبور جدید را تکرار کنید' : 'Confirm new password'}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isPersian ? 'در حال ذخیره...' : 'Saving...'}
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isPersian ? 'ذخیره تنظیمات' : 'Save Settings'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}