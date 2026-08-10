// src/components/cart/CartDrawer.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function CartDrawer({ isOpen, onClose, locale }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isPersian = locale === 'fa';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

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

  const getProductName = (item: any) => {
    return isPersian ? item.nameFa : item.name;
  };

  if (!mounted) return null;

  const isVisible = isOpen || isClosing;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 ${isPersian ? 'left-0' : 'right-0'} h-full w-full sm:w-[400px] bg-white z-50 shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : isPersian ? '-translate-x-full' : 'translate-x-full'
        }`}
        style={{
          transform: isClosing
            ? isPersian
              ? 'translateX(-100%)'
              : 'translateX(100%)'
            : isOpen
            ? 'translateX(0)'
            : isPersian
            ? 'translateX(-100%)'
            : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-secondary/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-primary" />
            <h2 className="font-semibold text-brand-text">
              {isPersian ? 'سبد خرید' : 'Shopping Cart'}
              {totalItems > 0 && (
                <span className="ml-1 text-sm text-brand-text-secondary">({totalItems})</span>
              )}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="font-semibold text-brand-text mb-2">
              {isPersian ? 'سبد خرید شما خالی است' : 'Your cart is empty'}
            </h3>
            <p className="text-sm text-brand-text-secondary mb-6">
              {isPersian
                ? 'محصولات مورد نظر خود را به سبد خرید اضافه کنید'
                : 'Add your favorite products to your cart'}
            </p>
            <button
              onClick={handleClose}
              className="btn-primary"
            >
              {isPersian ? 'خرید محصولات' : 'Start Shopping'}
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-220px)]">
              {items.map((item: any) => {
                const productName = getProductName(item);
                const itemTotal = item.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-brand-secondary/10 pb-3 last:border-b-0"
                  >
                    {/* Image */}
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

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/${locale}/product/${item.slug}`}
                        className="font-medium text-brand-text hover:text-brand-primary transition text-sm line-clamp-1"
                        onClick={handleClose}
                      >
                        {productName}
                      </Link>
                      <p className="text-xs text-brand-text-secondary">
                        {item.brand} - {item.size}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-brand-secondary/20 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 hover:bg-brand-pale-rose text-brand-text-secondary hover:text-brand-primary transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 py-0.5 min-w-[28px] text-center text-sm text-brand-text">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.maxStock))}
                            className="px-2 py-0.5 hover:bg-brand-pale-rose text-brand-text-secondary hover:text-brand-primary transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-brand-primary text-sm">
                            {formatPrice(itemTotal)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-brand-text-secondary hover:text-red-500 transition rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-brand-secondary/20 p-4 bg-white">
              {/* Subtotal */}
              <div className="flex justify-between mb-2">
                <span className="text-brand-text-secondary">
                  {isPersian ? 'جمع کل:' : 'Subtotal:'}
                </span>
                <span className="font-semibold text-brand-text">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Shipping progress */}
              {totalPrice < 50 && totalPrice > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-brand-text-secondary mb-1">
                    <span>
                      {isPersian
                        ? `${formatPrice(50 - totalPrice)} تا ارسال رایگان`
                        : `${formatPrice(50 - totalPrice)} away from free shipping`}
                    </span>
                    <span>Free Shipping</span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-pale-rose rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totalPrice / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/cart`}
                  className="flex-1 px-4 py-2.5 border border-brand-secondary/30 rounded-lg text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary transition text-sm font-medium text-center"
                  onClick={handleClose}
                >
                  {isPersian ? 'مشاهده سبد خرید' : 'View Cart'}
                </Link>
                <Link
                  href={`/${locale}/checkout`}
                  className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-1"
                  onClick={handleClose}
                >
                  {isPersian ? 'تکمیل خرید' : 'Checkout'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}