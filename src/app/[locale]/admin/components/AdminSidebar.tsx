// src/app/[locale]/admin/components/AdminSidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Image,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface AdminSidebarProps {
  locale: string;
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isPersian = locale === 'fa';

  const navItems = [
    { href: `/${locale}/admin`, label: isPersian ? 'داشبورد' : 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/admin/products`, label: isPersian ? 'محصولات' : 'Products', icon: Package },
    { href: `/${locale}/admin/orders`, label: isPersian ? 'سفارش‌ها' : 'Orders', icon: ShoppingBag },
    { href: `/${locale}/admin/customers`, label: isPersian ? 'مشتریان' : 'Customers', icon: Users },
    { href: `/${locale}/admin/reviews`, label: isPersian ? 'نظرات' : 'Reviews', icon: Star },
    { href: `/${locale}/admin/hero`, label: isPersian ? 'اسلایدهای هدر' : 'Hero Slides', icon: Image },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <aside
      className={`h-screen sticky top-0 bg-white border-r border-brand-secondary/20 flex flex-col shadow-soft transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo & Toggle Button - Top Left */}
      <div className={`p-3 border-b border-brand-secondary/20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary flex-shrink-0" />
            <h1 className="text-lg font-bold text-brand-text">AlluraCare</h1>
          </div>
        )}
        {isCollapsed && (
          <Sparkles className="w-5 h-5 text-brand-primary flex-shrink-0" />
        )}
        
        {/* Toggle Button - Top Left */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-7 h-7 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-hover transition-all duration-300 hover:scale-105 flex-shrink-0 ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Admin Panel Label - Only when expanded */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-b border-brand-secondary/10">
          <p className="text-xs text-brand-text-secondary">
            {isPersian ? 'پنل مدیریت' : 'Admin Panel'}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 p-2 space-y-1 overflow-y-auto ${isCollapsed ? 'px-1' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${
                  isActive(item.href)
                    ? 'bg-brand-primary text-white shadow-soft'
                    : 'text-brand-text-secondary hover:bg-brand-pale-rose hover:text-brand-primary'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className={`p-3 border-t border-brand-secondary/20 ${isCollapsed ? 'text-center' : ''}`}>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className={`
            flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-brand-text-secondary hover:text-red-500 hover:bg-red-50 transition-all duration-200
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
          title={isCollapsed ? (isPersian ? 'خروج' : 'Sign Out') : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">{isPersian ? 'خروج' : 'Sign Out'}</span>}
        </button>
      </div>
    </aside>
  );
}