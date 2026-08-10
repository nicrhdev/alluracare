// src/app/[locale]/account/page.tsx

import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, Settings, Package, LogOut } from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import RecentOrders from './components/RecentOrders';
import WishlistGrid from './components/WishlistGrid';

interface AccountPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account`);
  }

  const t = await getTranslations('account');

  // Get user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Get order count
  const orderCount = await prisma.order.count({
    where: { userId: user.id },
  });

  // Get wishlist count
  const wishlistCount = await prisma.wishlist.count({
    where: { userId: user.id },
  });

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Get wishlist items
  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          variants: true,
          category: true,
        },
      },
    },
    take: 4,
  });

  const navItems = [
    { icon: User, label: isPersian ? 'داشبورد' : 'Dashboard', href: `/${locale}/account`, active: true },
    { icon: Package, label: isPersian ? 'سفارشات' : 'Orders', href: `/${locale}/account/orders`, active: false },
    { icon: Heart, label: isPersian ? 'علاقه‌مندی‌ها' : 'Wishlist', href: `/${locale}/account/wishlist`, active: false },
    { icon: MapPin, label: isPersian ? 'آدرس‌ها' : 'Addresses', href: `/${locale}/account/addresses`, active: false },
    { icon: Settings, label: isPersian ? 'تنظیمات' : 'Settings', href: `/${locale}/account/settings`, active: false },
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
            {isPersian ? 'داشبورد' : 'Dashboard'}
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
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  item.active
                    ? 'bg-[#874A58] text-white'
                    : 'text-[#8A8A8A] hover:text-[#874A58] hover:bg-[#EDEDFA]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition ml-auto">
            <LogOut className="w-4 h-4" />
            {isPersian ? 'خروج' : 'Logout'}
          </button>
        </div>

        {/* Stats */}
        <DashboardStats
          orderCount={orderCount}
          wishlistCount={wishlistCount}
          addressCount={user.addresses.length}
          locale={locale}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders orders={recentOrders} locale={locale} />
          </div>

          {/* Wishlist Preview */}
          <div>
            <WishlistGrid items={wishlistItems} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}