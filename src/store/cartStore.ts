// src/store/cartStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  nameFa: string;
  brand: string;
  size: string;
  price: number;
  comparePrice: number | null;
  quantity: number;
  maxStock: number;
  image?: string;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        
        // Check if item already exists in cart (same variant)
        const existingItemIndex = items.findIndex(
          (i) => i.variantId === item.variantId
        );

        if (existingItemIndex !== -1) {
          // Update quantity of existing item
          const updatedItems = [...items];
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = Math.min(
            existingItem.quantity + item.quantity,
            existingItem.maxStock
          );
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            id: generateId(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        const updatedItems = items.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(quantity, item.maxStock) }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
);