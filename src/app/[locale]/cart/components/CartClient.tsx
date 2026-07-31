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
    quantity: string;
    product: string;
    price: string;
  };
  common: {
    currency: string;
  };
}

export default function CartClient({ locale, t, common }: CartClientProps) {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCartStore();

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-8 text-center">
        <p className="text-brand-text-secondary">Loading cart...</p>
      </div>
    );
  }

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold text-brand-text mb-2">
          {t.empty}
        </h2>
        <p className="text-brand-text-secondary mb-6">
          {locale === 'fa'
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
      {/* Cart Items */}
      <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 overflow-hidden">
        {/* Table Header - Desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-brand-pale-rose/30 border-b border-brand-secondary/20 text-sm font-medium text-brand-text-secondary">
          <div className="col-span-6">{t.product}</div>
          <div className="col-span-2 text-center">{t.price}</div>
          <div className="col-span-2 text-center">{t.quantity}</div>
          <div className="col-span-2 text-right">{t.total}</div>
        </div>

        {items.map((item) => {
          const itemTotal = item.price * item.quantity;
          const productName = locale === 'fa' ? item.nameFa : item.name;

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-brand-secondary/10 last:border-b-0 items-center hover:bg-brand-pale-rose/10 transition"
            >
              {/* Product Info */}
              <div className="col-span-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-pale-rose to-brand-light rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                    className="font-medium text-brand-text hover:text-brand-primary transition"
                  >
                    {productName}
                  </Link>
                  <p className="text-sm text-brand-text-secondary">
                    {item.brand} - {item.size}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 text-center text-brand-text font-medium">
                {formatPrice(item.price)}
              </div>

              {/* Quantity */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center border border-brand-secondary/30 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1.5 hover:bg-brand-pale-rose text-brand-text-secondary hover:text-brand-primary transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1.5 min-w-[40px] text-center text-brand-text font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 hover:bg-brand-pale-rose text-brand-text-secondary hover:text-brand-primary transition"
                    aria-label="Increase quantity"
                    disabled={item.quantity >= item.maxStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total & Remove */}
              <div className="col-span-2 flex items-center justify-end gap-4">
                <span className="font-semibold text-brand-text">
                  {formatPrice(itemTotal)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-brand-text-secondary hover:text-red-500 transition rounded-full hover:bg-red-50"
                  aria-label={t.remove}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left - Summary Details */}
          <div className="space-y-1 w-full md:w-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-brand-text-secondary">{t.subtotal}:</span>
              <span className="font-medium text-brand-text">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-brand-text-secondary">{t.total}:</span>
              <span className="text-2xl font-bold text-brand-primary">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-brand-text-secondary">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Right - Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={clearCart}
              className="px-6 py-2.5 border border-brand-secondary/40 rounded-lg text-brand-text-secondary hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition text-sm font-medium"
            >
              {locale === 'fa' ? 'پاک کردن سبد' : 'Clear Cart'}
            </button>
            <Link
              href={`/${locale}/shop`}
              className="px-6 py-2.5 border border-brand-secondary/40 rounded-lg text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary hover:bg-brand-pale-rose transition text-sm font-medium text-center"
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
        <div className="text-center p-4 bg-white rounded-xl shadow-soft border border-brand-secondary/20">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-xs font-medium text-brand-text">Secure Checkout</p>
          <p className="text-xs text-brand-text-secondary">SSL encrypted</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl shadow-soft border border-brand-secondary/20">
          <div className="text-2xl mb-1">🚚</div>
          <p className="text-xs font-medium text-brand-text">Free Shipping</p>
          <p className="text-xs text-brand-text-secondary">On orders over $50</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl shadow-soft border border-brand-secondary/20">
          <div className="text-2xl mb-1">💳</div>
          <p className="text-xs font-medium text-brand-text">Secure Payment</p>
          <p className="text-xs text-brand-text-secondary">Visa, Mastercard, PayPal</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl shadow-soft border border-brand-secondary/20">
          <div className="text-2xl mb-1">💚</div>
          <p className="text-xs font-medium text-brand-text">100% Natural</p>
          <p className="text-xs text-brand-text-secondary">Cruelty-free products</p>
        </div>
      </div>
    </div>
  );
}