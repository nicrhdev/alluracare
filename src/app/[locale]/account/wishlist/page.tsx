// src/app/[locale]/account/wishlist/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma/client';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface WishlistPageProps {
  params: {
    locale: string;
  };
}

export default function WishlistPage({ params }: WishlistPageProps) {
  const { locale } = params;
  const isPersian = locale === 'fa';
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setItems(items.filter((item) => item.product.id !== productId));
        toast.success(isPersian ? 'از علاقه‌مندی‌ها حذف شد' : 'Removed from wishlist');
      }
    } catch (error) {
      toast.error(isPersian ? 'خطا در حذف' : 'Failed to remove');
    }
  };

  const formatPrice = (price: number) => {
    if (isPersian) {
      const tomanRate = 50000;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#874A58]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#2D2D2D]">
        {isPersian ? 'علاقه‌مندی‌ها' : 'My Wishlist'}
      </h2>

      {items.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-12 text-center">
          <Heart className="w-16 h-16 text-[#8A8A8A] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
            {isPersian ? 'لیست علاقه‌مندی‌ها خالی است' : 'Wishlist is empty'}
          </h3>
          <p className="text-[#8A8A8A]">
            {isPersian
              ? 'محصولات مورد علاقه خود را ذخیره کنید'
              : 'Save your favorite products'}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block mt-4 text-[#874A58] hover:text-[#C397A0] font-medium transition"
          >
            {isPersian ? 'مشاهده محصولات' : 'Browse Products'} →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const product = item.product;
            const name = isPersian ? product.nameFa : product.nameEn;
            const price = Math.min(...product.variants.map((v: any) => v.price));
            const image = product.images?.[0] || null;

            return (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 overflow-hidden group"
              >
                <Link href={`/${locale}/product/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-gradient-soft">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🧴
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/${locale}/product/${product.slug}`}>
                    <h3 className="font-medium text-[#2D2D2D] group-hover:text-[#874A58] transition line-clamp-2">
                      {name}
                    </h3>
                  </Link>
                  {product.brand && (
                    <p className="text-sm text-[#8A8A8A]">{product.brand}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-[#874A58]">
                      {formatPrice(price)}
                    </span>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="p-2 text-[#8A8A8A] hover:text-red-500 transition rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}