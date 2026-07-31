// src/components/common/CartIcon.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag } from 'lucide-react';

interface CartIconProps {
  locale: string;
}

export default function CartIcon({ locale }: CartIconProps) {
  const [mounted, setMounted] = useState(false);
  const { items, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href={`/${locale}/cart`} className="relative p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-full hover:bg-brand-pale-rose">
        <ShoppingBag className="w-5 h-5" />
      </Link>
    );
  }

  const totalItems = getTotalItems();

  return (
    <Link href={`/${locale}/cart`} className="relative p-2 text-brand-text-secondary hover:text-brand-primary transition rounded-full hover:bg-brand-pale-rose">
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  );
}