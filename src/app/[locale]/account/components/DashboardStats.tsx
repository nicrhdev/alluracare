// src/app/[locale]/account/components/DashboardStats.tsx

'use client';

import { useEffect, useState } from 'react';
import { Package, Heart, MapPin, ShoppingBag } from 'lucide-react';

interface DashboardStatsProps {
  orderCount: number;
  wishlistCount: number;
  addressCount: number;
  locale: string;
}

export default function DashboardStats({
  orderCount,
  wishlistCount,
  addressCount,
  locale,
}: DashboardStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isPersian = locale === 'fa';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      icon: Package,
      value: orderCount,
      label: isPersian ? 'سفارشات' : 'Orders',
      color: 'from-[#EDEDFA] to-[#C9CAE1]',
      delay: 0,
    },
    {
      icon: Heart,
      value: wishlistCount,
      label: isPersian ? 'علاقه‌مندی‌ها' : 'Wishlist',
      color: 'from-[#C1EODF] to-[#D3E3E3]',
      delay: 100,
    },
    {
      icon: MapPin,
      value: addressCount,
      label: isPersian ? 'آدرس‌ها' : 'Addresses',
      color: 'from-[#EFDFE2] to-[#D7B8BF]',
      delay: 200,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6 transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${stat.delay}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-[#2D2D2D]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2D2D2D]">{stat.value}</p>
                <p className="text-sm text-[#8A8A8A]">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}