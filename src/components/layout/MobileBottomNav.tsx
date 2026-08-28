"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore, useUIStore } from "@/lib/store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore((s) => s.items.length);
  const { setSearchOpen, setMobileMenu } = useUIStore();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop") || pathname.startsWith("/category");
  const isCart = pathname === "/cart";
  const isAccount = pathname.startsWith("/account");

  return (
    <nav aria-label="Mobile Navigation" className="mobile-bottom-nav-bar">
      {/* Home */}
      <Link
        href="/"
        className={`mobile-tab ${isHome ? "active" : ""}`}
      >
        <Home size={20} strokeWidth={isHome ? 2.5 : 2} />
        <span>Home</span>
      </Link>

      {/* Categories */}
      <button
        onClick={() => setMobileMenu(true)}
        className={`mobile-tab ${isShop ? "active" : ""}`}
      >
        <Grid size={20} strokeWidth={isShop ? 2.5 : 2} />
        <span>Categories</span>
      </button>

      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="mobile-tab"
      >
        <Search size={20} />
        <span>Search</span>
      </button>


      {/* Bag / Cart */}
      <Link
        href="/cart"
        className={`mobile-tab ${isCart ? "active" : ""}`}
      >
        <div style={{ position: "relative" }}>
          <ShoppingBag size={20} strokeWidth={isCart ? 2.5 : 2} />
          {cartItemCount > 0 && (
            <span className="mobile-tab-badge">
              {cartItemCount}
            </span>
          )}
        </div>
        <span>Bag</span>
      </Link>

      {/* Account */}
      <Link
        href="/account"
        className={`mobile-tab ${isAccount ? "active" : ""}`}
      >
        <User size={20} strokeWidth={isAccount ? 2.5 : 2} />
        <span>Account</span>
      </Link>
    </nav>
  );
}
