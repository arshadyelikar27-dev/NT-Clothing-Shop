"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface Variant {
  id: string;
  name: string;
  type: string;
  value: string;
  price: number | null;
  stock: number;
  isActive: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

interface QuickViewProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  fabric: string | null;
  description: string;
  shortDescription?: string | null;
  unitType: string;
  images: ProductImage[];
  variants: Variant[];
  category: { name: string; slug: string };
}

interface QuickViewModalProps {
  productSlug: string;
  onClose: () => void;
}

export function QuickViewModal({ productSlug, onClose }: QuickViewModalProps) {
  const [product, setProduct] = useState<QuickViewProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const { showNotification } = useUIStore();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${productSlug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data.product);
      } catch {
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productSlug]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product && loading) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: "60px", textAlign: "center", color: "#8A8279" }}>
            <div style={{ fontSize: "13px" }}>Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: "60px", textAlign: "center" }}>
            <p style={{ color: "#9E3B2B", marginBottom: "16px" }}>{error || "Product not found"}</p>
            <button onClick={onClose} style={{ ...btnSecondary }}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Group variants by type
  const variantTypes = Array.from(new Set(product.variants.map((v) => v.type)));

  // Find selected variant
  const findMatchingVariant = (): Variant | null => {
    if (product.variants.length === 0) return null;
    const selectedPairs = Object.entries(selectedVariants);
    if (selectedPairs.length === 0) return null;
    return (
      product.variants.find((v) =>
        selectedPairs.every(([type, value]) => v.type === type && v.value === value)
      ) || null
    );
  };

  const selectedVariant = findMatchingVariant();
  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectiveStock =
    selectedVariant !== undefined
      ? selectedVariant
        ? selectedVariant.stock
        : product.stock
      : product.stock;
  const outOfStock = effectiveStock <= 0;

  const images = product.images.length > 0 ? product.images : [{ id: "0", url: "/images/placeholder.jpg", alt: product.name, sortOrder: 0 }];
  const currentImage = images[imageIndex] || images[0];

  const discount =
    product.compareAtPrice && product.compareAtPrice > effectivePrice
      ? Math.round(((product.compareAtPrice - effectivePrice) / product.compareAtPrice) * 100)
      : null;

  const handleWhatsAppInquire = () => {
    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const message = encodeURIComponent(
      `Hi NOBLE TEXTILE,\nI'm interested in:\n📌 *${product.name}*\n💰 Price: ${formatPrice(effectivePrice)}${product.unitType === "PER_METER" ? "/m" : ""}\nQuantity: ${quantity}\n🔗 ${productUrl}\n\nPlease let me know availability.`
    );
    window.open(`https://wa.me/919764313958?text=${message}`, '_blank');
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            background: "rgba(0,0,0,0.08)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#1A1918",
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", height: "100%" }}
          className="quick-view-grid"
        >
          {/* ── Image Panel ── */}
          <div
            style={{
              position: "relative",
              backgroundColor: "#F3EFEA",
              overflow: "hidden",
              cursor: zoomed ? "zoom-out" : "zoom-in",
            }}
            onClick={() => setZoomed((z) => !z)}
          >
            <img
              src={currentImage.url}
              alt={currentImage.alt || product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: zoomed ? "contain" : "cover",
                transition: "transform 0.3s ease",
                transform: zoomed ? "scale(1.5)" : "scale(1)",
              }}
            />
            <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.85)",
                  padding: "4px 8px",
                  fontSize: "11px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#1A1918",
                }}
              >
                <ZoomIn size={12} /> {zoomed ? "Click to zoom out" : "Click to zoom"}
              </span>
            </div>
            {discount && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#9E3B2B",
                  color: "white",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "4px",
                }}
              >
                -{discount}%
              </div>
            )}

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setImageIndex((i) => (i - 1 + images.length) % images.length); }}
                  style={{ ...navBtnStyle, left: "8px" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setImageIndex((i) => (i + 1) % images.length); }}
                  style={{ ...navBtnStyle, right: "8px" }}
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
                <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setImageIndex(i); }}
                      style={{
                        width: i === imageIndex ? "20px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        backgroundColor: i === imageIndex ? "#9E3B2B" : "rgba(255,255,255,0.6)",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Details Panel ── */}
          <div
            style={{
              padding: "32px 28px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Category */}
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9E3B2B" }}>
              {product.category.name}
            </span>

            {/* Name */}
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 500, color: "#1A1918", lineHeight: 1.3 }}>
              {product.name}
            </h2>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#1A1918" }}>
                {formatPrice(effectivePrice)}
                {product.unitType === "PER_METER" ? "/m" : product.unitType === "PER_SET" ? " / set" : ""}
              </span>
              {product.compareAtPrice && product.compareAtPrice > effectivePrice && (
                <span style={{ fontSize: "16px", color: "#8A8279", textDecoration: "line-through" }}>
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {product.shortDescription && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    backgroundColor: "#FAF0EE",
                    color: "#9E3B2B",
                    border: "1px solid #F3DDD8",
                    padding: "3px 8px",
                    borderRadius: "3px",
                    textTransform: "uppercase",
                  }}
                >
                  {product.shortDescription}
                </span>
              )}
            </div>

            {/* Fabric */}
            {product.fabric && (
              <p style={{ fontSize: "13px", color: "#8A8279" }}>
                <strong style={{ color: "#1A1918" }}>Fabric:</strong> {product.fabric}
              </p>
            )}

            {/* Variants */}
            {variantTypes.map((type) => {
              const typeVariants = product.variants.filter((v) => v.type === type && v.isActive);
              return (
                <div key={type}>
                  <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", color: "#1A1918", marginBottom: "8px", letterSpacing: "0.06em" }}>
                    {type}: <span style={{ fontWeight: 400, textTransform: "none", color: "#8A8279" }}>{selectedVariants[type] || "—"}</span>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {typeVariants.map((v) => {
                      const isSelected = selectedVariants[type] === v.value;
                      const isOos = v.stock <= 0;
                      return (
                        <button
                          key={v.id}
                          onClick={() => !isOos && setSelectedVariants((prev) => ({ ...prev, [type]: v.value }))}
                          disabled={isOos}
                          style={{
                            padding: "6px 14px",
                            border: `1px solid ${isSelected ? "#1A1918" : "#E4DDD3"}`,
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: isSelected ? 600 : 400,
                            background: isSelected ? "#1A1918" : "white",
                            color: isSelected ? "white" : isOos ? "#C0B8B0" : "#1A1918",
                            cursor: isOos ? "not-allowed" : "pointer",
                            opacity: isOos ? 0.5 : 1,
                            position: "relative",
                            textDecoration: isOos ? "line-through" : "none",
                            transition: "all 0.15s",
                          }}
                        >
                          {v.value}
                          {v.price && v.price !== product.price && (
                            <span style={{ fontSize: "10px", marginLeft: "4px", color: isSelected ? "#E0A96D" : "#8A8279" }}>
                              +{formatPrice(v.price - product.price)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Quantity */}
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", color: "#1A1918", marginBottom: "8px", letterSpacing: "0.06em" }}>
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1px solid #E4DDD3", borderRadius: "6px", width: "fit-content" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#1A1918" }}
                >
                  −
                </button>
                <span style={{ padding: "8px 12px", fontSize: "14px", fontWeight: 600, minWidth: "36px", textAlign: "center", color: "#1A1918" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(effectiveStock || 99, q + 1))}
                  style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#1A1918" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status */}
            <p style={{ fontSize: "13px", color: outOfStock ? "#B91C1C" : effectiveStock <= 5 ? "#B8860B" : "#2C6E3F", fontWeight: 500 }}>
              {outOfStock
                ? "Out of Stock"
                : effectiveStock <= 5
                ? `Only ${effectiveStock} left!`
                : "In Stock"}
            </p>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              {/* WhatsApp Inquiry */}
              <button
                onClick={handleWhatsAppInquire}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "14px",
                  backgroundColor: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                Inquire on WhatsApp
              </button>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px",
                  border: "1px solid #E4DDD3",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#1A1918",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .quick-view-grid {
              grid-template-columns: 1fr !important;
              height: auto !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(8px)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  animation: "fadeIn 0.2s ease-out",
};

const modalStyle: React.CSSProperties = {
  position: "relative",
  backgroundColor: "white",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "880px",
  maxHeight: "90vh",
  overflow: "hidden",
  boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
  display: "flex",
  flexDirection: "column",
};

const navBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(255,255,255,0.85)",
  border: "none",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#1A1918",
  zIndex: 2,
};

const btnSecondary: React.CSSProperties = {
  padding: "10px 20px",
  border: "1px solid #E4DDD3",
  borderRadius: "8px",
  background: "white",
  cursor: "pointer",
  fontSize: "13px",
  color: "#1A1918",
};
