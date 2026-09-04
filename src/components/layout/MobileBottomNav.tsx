"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Store, Phone } from "lucide-react";
import { useUIStore } from "@/lib/store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setSearchOpen } = useUIStore();

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop") || pathname.startsWith("/category");

  return (
    <nav aria-label="Mobile Navigation" className="mobile-bottom-nav-bar">
      {/* Home */}
      <Link
        href="/"
        prefetch={true}
        className={`mobile-tab ${isHome ? "active" : ""}`}
      >
        <Home size={20} strokeWidth={isHome ? 2.5 : 2} />
        <span>Home</span>
      </Link>

      {/* Shop */}
      <Link
        href="/shop"
        prefetch={true}
        className={`mobile-tab ${isShop ? "active" : ""}`}
      >
        <Store size={20} strokeWidth={isShop ? 2.5 : 2} />
        <span>Shop</span>
      </Link>

      {/* Search */}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="mobile-tab"
      >
        <Search size={20} strokeWidth={2} />
        <span>Search</span>
      </button>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919764313958"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-tab"
        style={{ color: "#25D366" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <span>Inquire</span>
      </a>

      {/* Call */}
      <a
        href="tel:+919764313958"
        className="mobile-tab"
      >
        <Phone size={20} strokeWidth={2} />
        <span>Call</span>
      </a>
    </nav>
  );
}
