// src/app/[locale]/cart/components/CartClient.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

interface CartClientProps {
  locale: string;
  t: {
    empty: string;
    continueShopping: string;
    checkout: string;
    subtotal: string;
    total: string;
    remove: string;
  };
}

export default function CartClient({ locale, t }: CartClientProps) {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCartStore();

  // ✅ Add isPersian here
  const isPersian = locale === 'fa';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-brand-secondary/20 p-8 text-center">
        <p className="text-brand-text-secondary">Loading cart...</p>
      </div>
    );
  }

  const totalItems = getTotalItems();
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

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-brand-secondary/20 p-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold text-brand-text mb-2">
          {t.empty}
        </h2>
        <p className="text-brand-text-secondary mb-6">
          {isPersian
            ? 'به نظر می‌رسد سبد خرید شما خالی است'
            : 'Looks like your cart is empty'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          {t.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items Table */}
      <div className="bg-white rounded-xl border border-brand-secondary/20 overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-[#EDEDFA]/40 border-b border-brand-secondary/20 text-sm font-medium text-[#8A8A8A]">
          <div className="col-span-6">{isPersian ? 'محصول' : 'Product'}</div>
          <div className="col-span-2 text-center">{isPersian ? 'قیمت' : 'Price'}</div>
          <div className="col-span-2 text-center">{isPersian ? 'تعداد' : 'Quantity'}</div>
          <div className="col-span-2 text-right">{isPersian ? 'مجموع' : 'Total'}</div>
        </div>

        {items.map((item: any) => {
          const productName = isPersian ? item.nameFa : item.name;
          const itemTotal = item.price * item.quantity;

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-brand-secondary/10 last:border-b-0 items-center hover:bg-[#EDEDFA]/10 transition"
            >
              {/* Product Info */}
              <div className="col-span-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-soft flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🧴</span>
                  )}
                </div>
                <div>
                  <Link
                    href={`/${locale}/product/${item.slug}`}
                    className="font-medium text-[#2D2D2D] hover:text-[#874A58] transition"
                  >
                    {productName}
                  </Link>
                  <p className="text-sm text-[#8A8A8A]">
                    {item.brand} - {item.size}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 text-center text-[#2D2D2D] font-medium">
                {formatPrice(item.price)}
              </div>

              {/* Quantity */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center border border-brand-secondary/30 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1.5 hover:bg-[#EDEDFA] text-[#8A8A8A] hover:text-[#874A58] transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1.5 min-w-[40px] text-center text-[#2D2D2D] font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.maxStock))}
                    className="px-3 py-1.5 hover:bg-[#EDEDFA] text-[#8A8A8A] hover:text-[#874A58] transition"
                    disabled={item.quantity >= item.maxStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total & Remove */}
              <div className="col-span-2 flex items-center justify-end gap-4">
                <span className="font-semibold text-[#2D2D2D]">
                  {formatPrice(itemTotal)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-[#8A8A8A] hover:text-red-500 transition rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-xl border border-brand-secondary/20 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[#8A8A8A]">{t.subtotal}:</span>
              <span className="font-medium text-[#2D2D2D]">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[#8A8A8A]">{t.total}:</span>
              <span className="text-2xl font-bold text-[#874A58]">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-[#8A8A8A]">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={clearCart}
              className="px-6 py-2.5 border border-brand-secondary/40 rounded-lg text-[#8A8A8A] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition text-sm font-medium"
            >
              {isPersian ? 'پاک کردن سبد' : 'Clear Cart'}
            </button>
            <Link
              href={`/${locale}/shop`}
              className="px-6 py-2.5 border border-brand-secondary/40 rounded-lg text-[#8A8A8A] hover:text-[#874A58] hover:border-[#874A58] hover:bg-[#EDEDFA] transition text-sm font-medium text-center"
            >
              {t.continueShopping}
            </Link>
            <Link
              href={`/${locale}/checkout`}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              {t.checkout}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {[
          { icon: '🔒', title: isPersian ? 'پرداخت امن' : 'Secure Checkout', desc: isPersian ? 'رمزگذاری شده' : 'SSL encrypted' },
          { icon: '🚚', title: isPersian ? 'ارسال رایگان' : 'Free Shipping', desc: isPersian ? 'سفارش بالای ۵۰ دلار' : 'On orders over $50' },
          { icon: '💳', title: isPersian ? 'پرداخت امن' : 'Secure Payment', desc: isPersian ? 'ویزا، مسترکارت' : 'Visa, Mastercard' },
          { icon: '💚', title: isPersian ? 'طبیعی ۱۰۰٪' : '100% Natural', desc: isPersian ? 'بدون تست حیوانات' : 'Cruelty-free' },
        ].map((badge, index) => (
          <div key={index} className="text-center p-4 bg-white rounded-xl border border-brand-secondary/20">
            <div className="text-2xl mb-1">{badge.icon}</div>
            <p className="text-xs font-medium text-[#2D2D2D]">{badge.title}</p>
            <p className="text-xs text-[#8A8A8A]">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}