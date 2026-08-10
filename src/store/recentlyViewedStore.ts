// src/store/recentlyViewedStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  image: string;
  price: number;
  brand: string | null;
}

interface RecentlyViewedStore {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  clearAll: () => void;
  getRecent: () => Product[];
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const { products } = get();
        
        // Check if product already exists
        const existingIndex = products.findIndex((p) => p.id === product.id);
        
        let updated;
        if (existingIndex !== -1) {
          // Move existing product to front
          updated = [product, ...products.filter((_, i) => i !== existingIndex)];
        } else {
          // Add new product to front
          updated = [product, ...products];
        }
        
        // Keep only last 10
        const limited = updated.slice(0, 10);
        set({ products: limited });
      },

      removeProduct: (id) => {
        const { products } = get();
        set({ products: products.filter((p) => p.id !== id) });
      },

      clearAll: () => {
        set({ products: [] });
      },

      getRecent: () => {
        return get().products;
      },
    }),
    {
      name: 'recently-viewed-storage',
      skipHydration: true,
    }
  )
);