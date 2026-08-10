// src/hooks/useRecentlyViewed.ts

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';

interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  image: string;
  price: number;
  brand: string | null;
}

export function useRecentlyViewed() {
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { addProduct, removeProduct, clearAll, getRecent } = useRecentlyViewedStore();
  const lastAddedId = useRef<string | null>(null);

  // Initialize on client
  useEffect(() => {
    setIsClient(true);
    setProducts(getRecent());
  }, [getRecent]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    // Prevent duplicate additions of the same product
    if (lastAddedId.current === product.id) {
      return;
    }
    lastAddedId.current = product.id;
    
    addProduct(product);
    // Update local state immediately
    setProducts((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  }, [addProduct]);

  // Update products when store changes
  useEffect(() => {
    if (isClient) {
      const unsubscribe = useRecentlyViewedStore.subscribe((state) => {
        setProducts(state.products);
      });
      return unsubscribe;
    }
  }, [isClient]);

  return {
    recentlyViewed: products,
    addToRecentlyViewed,
    removeFromRecentlyViewed: removeProduct,
    clearRecentlyViewed: clearAll,
    getRecent,
    isClient,
  };
}