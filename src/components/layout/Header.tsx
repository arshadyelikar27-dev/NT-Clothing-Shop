"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { getCategoriesAction } from "@/app/actions/categories";
import { useUIStore } from "@/lib/store";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  children?: CategoryItem[];
}

const STATIC_NAV = [
  { href: "/shop", label: "Shop" },
];

// Module-level client cache to prevent redundant fetches on route change
let cachedCategoriesData: CategoryItem[] | null = null;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>(cachedCategoriesData || []);
  const { isMobileMenuOpen, setMobileMenu, setSearchOpen } = useUIStore();

  // Load dynamic categories (instant from memory if already loaded)
  useEffect(() => {
    if (cachedCategoriesData && cachedCategoriesData.length > 0) return;

    async function loadCategories() {
      try {
        const categories = await getCategoriesAction();
        cachedCategoriesData = categories || [];
        setCategories(cachedCategoriesData || []);
      } catch {
        // Use empty list if API fails
      }
    }
    loadCategories();
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

            {/* Brand Title */}
            <Link
              href="/"
              className="group flex items-center gap-2 sm:gap-2.5 no-underline shrink-0"
            >
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
                className="group-hover:text-[#9E3B2B] sm:text-[18px] md:text-[19px] truncate max-w-[200px] sm:max-w-none inline-block align-bottom"
              >
                NOBLE TEXTILE <span className="hidden sm:inline" style={{ fontSize: "13px", opacity: 0.9, fontWeight: 500, fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "normal", marginLeft: "4px" }}>(Wholesale Shopee)</span>
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
            {/* Static links */}
            {STATIC_NAV.map((link) => (
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
            ))}

            {/* Dynamic Categories Mega Menu */}
            {categories.length > 0 && (
              <div
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
                  Categories
                  <ChevronDown
                    size={14}
                    style={{
                      transform: megaMenuOpen ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {/* Mega Menu Dropdown */}
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
                        maxHeight: "70vh",
                        overflowY: "auto",
                        overscrollBehavior: "contain",
                        padding: "8px",
                        animation: "fadeIn 0.2s ease-out",
                      }}
                    >
                      {categories.map((cat) => (
                        <div key={cat.id}>
                          <Link
                            href={`/category/${cat.slug}`}
                            prefetch={true}
                            onClick={() => setMegaMenuOpen(false)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 16px",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#1A1918",
                              textDecoration: "none",
                              borderRadius: "10px",
                              transition: "all 0.15s ease",
                              fontFamily: "var(--font-sans)",
                            }}
                            className="hover:bg-[#FAF7F2] hover:text-[#9E3B2B]"
                          >
                            {cat.name}
                            {cat.children && cat.children.length > 0 && (
                              <ChevronRight size={14} style={{ opacity: 0.5 }} />
                            )}
                          </Link>
                          {cat.children && cat.children.length > 0 && (
                            <div style={{ paddingLeft: "16px" }}>
                              {cat.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/category/${child.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  style={{
                                    display: "block",
                                    padding: "7px 16px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#8A8279",
                                    textDecoration: "none",
                                    borderRadius: "8px",
                                    fontFamily: "var(--font-sans)",
                                  }}
                                  className="hover:bg-[#FAF7F2] hover:text-[#9E3B2B]"
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <div style={{ borderTop: "1px solid #E4DDD3", margin: "4px 0" }} />
                      <Link
                        href="/shop"
                        onClick={() => setMegaMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#9E3B2B",
                          textDecoration: "none",
                          borderRadius: "10px",
                          fontFamily: "var(--font-sans)",
                        }}
                        className="hover:bg-[#FAF7F2]"
                      >
                        View All →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* ─── Right: Search Button Only ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Search Button */}
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
                alignItems: "center",
                justifyContent: "center",
                color: "#1A1918",
                transition: "all 0.2s ease",
              }}
              className="flex hover:bg-black/10 active:scale-95 sm:w-[38px] sm:h-[38px]"
            >
              <Search size={18} />
            </button>

            {/* WhatsApp Contact Button */}
            <a
              href="https://wa.me/919764313958"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact on WhatsApp"
              style={{
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                backgroundColor: "#25D366",
                color: "white",
                borderRadius: "9999px",
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "background-color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              className="hidden md:flex hover:bg-[#128C7E] active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              Inquiry
            </a>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-In Drawer ─── */}
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

            {/* Dynamic Categories in Mobile */}
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
                <Link
                  href="/shop"
                  onClick={() => setMobileMenu(false)}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#9E3B2B",
                    textDecoration: "none",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E4DDD3",
                    marginBottom: "6px",
                  }}
                >
                  ✨ All Products
                </Link>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
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
                        marginBottom: "4px",
                      }}
                    >
                      {cat.name}
                    </Link>
                    {cat.children && cat.children.length > 0 && (
                      <div style={{ paddingLeft: "12px", marginBottom: "4px" }}>
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/category/${child.slug}`}
                            onClick={() => setMobileMenu(false)}
                            style={{
                              display: "block",
                              padding: "8px 14px",
                              fontSize: "13px",
                              fontWeight: 400,
                              color: "#8A8279",
                              textDecoration: "none",
                              borderRadius: "6px",
                              marginBottom: "2px",
                            }}
                          >
                            → {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
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
                  {[
                    { href: "/about", label: "About Noble Textile" },
                    { href: "/contact", label: "Store Location & Contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenu(false)}
                      style={{ fontSize: "14px", color: "#1A1918", textDecoration: "none" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #E4DDD3",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <a
                href="https://wa.me/919764313958"
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
                <span>💬 WhatsApp Inquiry</span>
              </a>
              <a
                href="tel:+919764313958"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px",
                  backgroundColor: "#1A1918",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                <span>📞 Call Us</span>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
