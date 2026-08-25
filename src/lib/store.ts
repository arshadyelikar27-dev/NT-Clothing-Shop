"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Cart Store ───

export interface CartItemData {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  unitType: string;
  sku: string;
  variantName?: string;
  maxStock: number;
}

export interface AppliedCouponData {
  id: string;
  code: string;
  discountAmount: number;
}

interface CartState {
  items: CartItemData[];
  isOpen: boolean;
  appliedCoupon: AppliedCouponData | null;
  addItem: (item: CartItemData) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setAppliedCoupon: (coupon: AppliedCouponData | null) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            const newQty = updated[existingIndex].quantity + item.quantity;
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: Math.min(newQty, item.maxStock),
            };
            return { items: updated, isOpen: true };
          }

          return { items: [...state.items, item], isOpen: true };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(0, Math.min(quantity, i.maxStock)) }
              : i
          ).filter((i) => i.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setCartOpen: (open) => set({ isOpen: open }),
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "nt-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ─── Wishlist Store ───

export interface WishlistItemData {
  productId: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  slug: string;
}

interface WishlistState {
  items: WishlistItemData[];
  addItem: (item: WishlistItemData) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.productId === item.productId)) {
            return state;
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "nt-wishlist",
    }
  )
);

// ─── UI Store ───

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isFilterOpen: boolean;
  notification: { message: string; type: "success" | "error" | "info" } | null;
  setMobileMenu: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  showNotification: (message: string, type: "success" | "error" | "info") => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  notification: null,

  setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setFilterOpen: (open) => set({ isFilterOpen: open }),

  showNotification: (message, type) => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 4000);
  },

  clearNotification: () => set({ notification: null }),
}));
