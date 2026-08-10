// src/components/common/CartIcon.tsx

'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface CartIconProps {
  locale: string;
}

export default function CartIcon({ locale }: CartIconProps) {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href={`/${locale}/cart`}
      className="header-action-btn"
      aria-label={locale === 'fa' ? 'سبد خرید' : 'Cart'}
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="badge">{totalItems > 99 ? '99+' : totalItems}</span>
      )}
    </Link>
  );
}