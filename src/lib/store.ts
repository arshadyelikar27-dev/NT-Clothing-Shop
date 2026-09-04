"use client";

import { create } from "zustand";

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
