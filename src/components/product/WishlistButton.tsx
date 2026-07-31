// src/components/product/WishlistButton.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!session);
    if (session) {
      checkWishlistStatus();
    }
  }, [session]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        const exists = data.wishlist?.some((item: any) => item.productId === productId);
        setIsInWishlist(!!exists);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleToggle = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        if (response.ok) {
          setIsInWishlist(false);
          router.refresh();
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        if (response.ok) {
          setIsInWishlist(true);
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all ${className} ${
        isInWishlist
          ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50'
      }`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
      />
    </button>
  );
}