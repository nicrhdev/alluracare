// src/app/[locale]/account/layout.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface AccountLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function AccountLayout({
  children,
  params,
}: AccountLayoutProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  // Check if user is logged in
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account`);
  }

  // Check if user is admin - redirect to admin panel
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // If user is admin, redirect to admin dashboard
  if (user.role === 'ADMIN') {
    redirect(`/${locale}/admin`);
  }

  const navItems = [
    { 
      icon: User, 
      label: isPersian ? 'داشبورد' : 'Dashboard', 
      href: `/${locale}/account`, 
      active: true,
      exact: true,
    },
    { 
      icon: ShoppingBag, 
      label: isPersian ? 'سفارشات' : 'Orders', 
      href: `/${locale}/account/orders`, 
      active: false,
      exact: false,
    },
    { 
      icon: Heart, 
      label: isPersian ? 'علاقه‌مندی‌ها' : 'Wishlist', 
      href: `/${locale}/account/wishlist`, 
      active: false,
      exact: false,
    },
    { 
      icon: MapPin, 
      label: isPersian ? 'آدرس‌ها' : 'Addresses', 
      href: `/${locale}/account/addresses`, 
      active: false,
      exact: false,
    },
    { 
      icon: Settings, 
      label: isPersian ? 'تنظیمات' : 'Settings', 
      href: `/${locale}/account/settings`, 
      active: false,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen py-12" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EDEDFA 30%, #C1EODF 70%, #FFFFFF 100%)' }}>
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-3">
            {isPersian ? '👤 حساب کاربری' : '👤 Account'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
            {isPersian ? 'حساب کاربری' : 'My Account'}
          </h1>
          <p className="text-[#8A8A8A] max-w-md mx-auto">
            {isPersian
              ? `خوش آمدید، ${user.name || 'کاربر'}`
              : `Welcome back, ${user.name || 'User'}`}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? item.href === `/${locale}/account`
              : item.href === `/${locale}/account` + (typeof window !== 'undefined' ? window.location.pathname.replace(`/${locale}/account`, '') : '');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#874A58] text-white'
                    : 'text-[#8A8A8A] hover:text-[#874A58] hover:bg-[#EDEDFA]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <button 
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition ml-auto"
          >
            <LogOut className="w-4 h-4" />
            {isPersian ? 'خروج' : 'Logout'}
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}