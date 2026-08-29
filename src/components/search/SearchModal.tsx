"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  fabric?: string | null;
  images: Array<{ url: string }>;
}

interface SearchCategory {
  id: string;
  name: string;
  slug: string;
}

export function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setSearchOpen(false);
    setQuery("");
    setProducts([]);
    setCategories([]);
  };

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to fetch search suggestions", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <div className="overlay" onClick={handleClose} />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FAF7F2",
          zIndex: 60,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #E4DDD3",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div className="container-main" style={{ padding: "24px 20px" }}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8A8279", fontWeight: 600 }}>
              Search Catalog & Fabrics
            </span>
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#1A1918",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleSubmit} style={{ position: "relative", marginBottom: "24px" }}>
            <Search
              size={22}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#8A8279",
              }}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by fabric, saree, kurti, shirting, or color..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px 16px 52px",
                fontSize: "16px",
                backgroundColor: "white",
                border: "1px solid #E4DDD3",
                color: "#1A1918",
                fontFamily: "var(--font-sans)",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8A8279",
                }}
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Quick Suggestions & Results */}
          {query.trim().length < 2 ? (
            <div>
              <p style={{ fontSize: "12px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px", fontWeight: 600 }}>
                Popular Searches
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Cotton Fabric", "Banarasi Saree", "Rayon", "Linen Shirt", "Dress Material", "Chiffon"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      router.push(`/shop?search=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    style={{
                      padding: "6px 14px",
                      backgroundColor: "#F3EFEA",
                      border: "1px solid #E4DDD3",
                      fontSize: "13px",
                      color: "#1A1918",
                      cursor: "pointer",
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {isLoading && (
                <p style={{ fontSize: "14px", color: "#8A8279", padding: "12px 0" }}>Searching textiles...</p>
              )}

              {/* Categories Found */}
              {categories.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "12px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", fontWeight: 600 }}>
                    Matching Categories
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setSearchOpen(false)}
                        style={{
                          padding: "6px 14px",
                          backgroundColor: "#FAF7F2",
                          border: "1px solid #1A1918",
                          fontSize: "13px",
                          color: "#1A1918",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        {cat.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Found */}
              {products.length > 0 ? (
                <div>
                  <p style={{ fontSize: "12px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px", fontWeight: 600 }}>
                    Products ({products.length})
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "12px",
                    }}
                    className="sm:grid-cols-2 md:grid-cols-3"
                  >
                    {products.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => setSearchOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px",
                          backgroundColor: "white",
                          border: "1px solid #E4DDD3",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <div style={{ position: "relative", width: "50px", height: "65px", flexShrink: 0 }}>
                          <Image
                            src={item.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                            alt={item.name}
                            fill
                            sizes="50px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "13px", fontWeight: 500, color: "#1A1918", marginBottom: "2px" }}>
                            {item.name}
                          </h4>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#9E3B2B" }}>
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-secondary btn-sm"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      View all results for &ldquo;{query}&rdquo; <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                !isLoading && (
                  <p style={{ fontSize: "14px", color: "#8A8279", padding: "20px 0", textAlign: "center" }}>
                    No fabrics or clothing matched &ldquo;{query}&rdquo;.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
