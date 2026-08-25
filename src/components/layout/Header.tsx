"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartStore, useWishlistStore, useUIStore } from "@/lib/store";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  {
    href: "/shop",
    label: "Categories",
    children: [
      { href: "/category/sarees", label: "Sarees (Banarasi & Paithani)" },
      { href: "/category/dress-materials", label: "Dress Materials & Suits" },
      { href: "/category/fabrics", label: "Fabrics by the Meter" },
      { href: "/category/kurtis", label: "Kurtis & Tunics" },
      { href: "/category/mens-wear", label: "Men's Shirting & Suiting" },
      { href: "/category/dupattas", label: "Dupattas & Stoles" },
      { href: "/category/kids-wear", label: "Kids Wear" },
      { href: "/category/seasonal", label: "Monsoon & Festive Collection" },
    ],
  },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/shop?sort=best-selling", label: "Best Sellers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const { isMobileMenuOpen, setMobileMenu, setSearchOpen } = useUIStore();
  const cartItemCount = useCartStore((s) => s.items.length);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ─── Responsive Header Navigation ─── */}
      <header className={`site-header-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="site-header-capsule">
          {/* ─── Left: Mobile Hamburger & Brand Logo ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: 0,
            }}
          >
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenu(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 active:scale-95 text-[#1A1918] transition-all cursor-pointer border-none shrink-0"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand Logo & Title */}
            <Link
              href="/"
              className="group flex items-center gap-2 sm:gap-2.5 no-underline shrink-0"
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#1A1918",
                  border: "1px solid rgba(224, 169, 109, 0.4)",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/images/nt-logo.jpg"
                  alt="NOBLE TEXTILE"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={42}
                  height={42}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "#1A1918",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
                className="group-hover:text-[#9E3B2B] sm:text-[18px] md:text-[19px]"
              >
                NOBLE TEXTILE
              </span>
            </Link>
          </div>

          {/* ─── Center: Desktop Navigation Pill ─── */}
          <nav
            className="hidden md:flex"
            style={{
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              padding: "4px 8px",
              borderRadius: "9999px",
              border: "1px solid rgba(0, 0, 0, 0.03)",
            }}
          >
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setMegaMenuOpen((prev) => !prev);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: megaMenuOpen ? "#9E3B2B" : "#1A1918",
                      padding: "6px 12px",
                      borderRadius: "9999px",
                      transition: "all 0.2s ease",
                    }}
                    className="hover:bg-white hover:shadow-sm"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      style={{
                        transform: megaMenuOpen ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {megaMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        paddingTop: "12px",
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.98)",
                          backdropFilter: "blur(24px)",
                          WebkitBackdropFilter: "blur(24px)",
                          border: "1px solid rgba(228, 221, 211, 0.95)",
                          borderRadius: "16px",
                          boxShadow: "0 20px 48px rgba(0,0,0,0.16)",
                          minWidth: "270px",
                          padding: "8px",
                          animation: "fadeIn 0.2s ease-out",
                        }}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMegaMenuOpen(false)}
                            style={{
                              display: "block",
                              padding: "10px 16px",
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#1A1918",
                              textDecoration: "none",
                              borderRadius: "10px",
                              transition: "all 0.15s ease",
                              fontFamily: "var(--font-sans)",
                            }}
                            className="hover:bg-[#FAF7F2] hover:text-[#9E3B2B] hover:translate-x-1"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#1A1918",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-sans)",
                  }}
                  className="hover:bg-white hover:text-[#9E3B2B] hover:shadow-sm"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* ─── Right: Search & Action Buttons ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Search Button (Mobile & Desktop) */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search Catalog"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.04)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1A1918",
                transition: "all 0.2s ease",
              }}
              className="hover:bg-black/10 active:scale-95 sm:w-[38px] sm:h-[38px]"
            >
              <Search size={18} />
            </button>

            {/* User Account Icon (Desktop Only - Mobile has Bottom Nav) */}
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? `Account (${user.name})` : "Sign In"}
              className="hidden md:flex items-center justify-center transition-all relative hover:bg-black/10 hover:scale-105 active:scale-95 no-underline"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: user ? "rgba(224, 169, 109, 0.25)" : "rgba(0,0,0,0.04)",
                border: user ? "1px solid rgba(224, 169, 109, 0.6)" : "none",
                color: user ? "#9E3B2B" : "#1A1918",
              }}
            >
              <User size={18} />
              {user?.role === "ADMIN" && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    right: "-2px",
                    backgroundColor: "#1A1918",
                    color: "white",
                    fontSize: "8px",
                    fontWeight: 800,
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  A
                </span>
              )}
            </Link>

            {/* Wishlist Icon (Desktop Only - Mobile has Bottom Nav) */}
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="hidden md:flex items-center justify-center transition-all relative hover:bg-black/10 hover:scale-105 active:scale-95 no-underline"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.04)",
                color: "#1A1918",
              }}
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    backgroundColor: "#9E3B2B",
                    color: "white",
                    fontSize: "9px",
                    fontWeight: 700,
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(158, 59, 43, 0.4)",
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon Button (Mobile & Desktop) */}
            <button
              onClick={toggleCart}
              aria-label="Shopping Bag"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#1A1918",
                border: "none",
                cursor: "pointer",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 12px rgba(26, 25, 24, 0.25)",
              }}
              className="hover:bg-[#9E3B2B] active:scale-95 sm:w-[38px] sm:h-[38px]"
            >
              <ShoppingBag size={17} />
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-3px",
                    right: "-3px",
                    backgroundColor: "#E0A96D",
                    color: "#1A1918",
                    fontSize: "10px",
                    fontWeight: 800,
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-In Mega Drawer ─── */}
      {isMobileMenuOpen && (
        <>
          <div
            className="overlay"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 60,
              animation: "fadeIn 0.25s ease-out",
            }}
            onClick={() => setMobileMenu(false)}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "320px",
              maxWidth: "85vw",
              backgroundColor: "#FAF7F2",
              zIndex: 65,
              overflowY: "auto",
              boxShadow: "4px 0 30px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              animation: "slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
                borderBottom: "1px solid #E4DDD3",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#1A1918",
                  }}
                >
                  NOBLE TEXTILE
                </span>
                <p style={{ fontSize: "11px", color: "#8A8279" }}>Latur, Maharashtra</p>
              </div>
              <button
                onClick={() => setMobileMenu(false)}
                aria-label="Close menu"
                style={{
                  background: "rgba(0,0,0,0.05)",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1A1918",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Categories List */}
            <div style={{ padding: "16px 20px", flex: 1 }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8A8279",
                  marginBottom: "12px",
                }}
              >
                Categories
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {[
                  { name: "✨ All Fabrics & Wear", href: "/shop" },
                  { name: "👑 Sarees (Banarasi & Paithani)", href: "/category/sarees" },
                  { name: "👗 Dress Materials & Suits", href: "/category/dress-materials" },
                  { name: "✂️ Fabrics by the Meter", href: "/category/fabrics" },
                  { name: "🌸 Designer Kurtis", href: "/category/kurtis" },
                  { name: "👔 Men's Shirting & Suiting", href: "/category/mens-wear" },
                  { name: "🧣 Silk & Cotton Dupattas", href: "/category/dupattas" },
                  { name: "🧒 Kids Ethnic Wear", href: "/category/kids-wear" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1A1918",
                      textDecoration: "none",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "8px",
                      border: "1px solid #E4DDD3",
                      marginBottom: "6px",
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Navigation Extra Links */}
              <div style={{ marginTop: "24px", borderTop: "1px solid #E4DDD3", paddingTop: "16px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8A8279",
                    marginBottom: "12px",
                  }}
                >
                  Quick Links
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenu(false)}
                    style={{ fontSize: "14px", color: "#1A1918", textDecoration: "none" }}
                  >
                    About Noble Textile
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenu(false)}
                    style={{ fontSize: "14px", color: "#1A1918", textDecoration: "none" }}
                  >
                    Store Location & Contact
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenu(false)}
                    style={{ fontSize: "14px", color: "#1A1918", textDecoration: "none" }}
                  >
                    My Orders & Account
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #E4DDD3",
                backgroundColor: "#FFFFFF",
              }}
            >
              <a
                href="https://wa.me/917821059350"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px",
                  backgroundColor: "#25D366",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                <span>💬 WhatsApp Store Assistance</span>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
