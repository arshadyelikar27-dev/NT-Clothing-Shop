"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Eye } from "lucide-react";
import { useCartStore, useUIStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  hoverImage?: string | null;
  fabric?: string | null;
  unitType: string;
  stock: number;
  isNew?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  hoverImage,
  fabric,
  unitType,
  stock,
  isNew,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = stock <= 0;
  const { showNotification } = useUIStore();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;

    addItem({
      productId: id,
      name,
      image,
      price,
      quantity: 1,
      unitType,
      sku: slug,
      maxStock: stock,
    });
    showNotification(`${name} added to bag`, "success");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <Link
          href={`/product/${slug}`}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          {/* Image */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#F3EFEA",
            }}
            className="aspect-product group"
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                transition: "opacity 0.4s ease",
              }}
              className="primary-img"
            />
            
            {hoverImage && (
              <Image
                src={hoverImage}
                alt={`${name} alternate view`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                  transition: "opacity 0.4s ease",
                }}
                className="hover-img"
              />
            )}

            {/* Badges */}
            <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {isNew && (
                <span style={{ background: "#1A1918", color: "white", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.06em" }}>
                  NEW
                </span>
              )}
              {discount && (
                <span style={{ background: "#9E3B2B", color: "white", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px" }}>
                  -{discount}%
                </span>
              )}
            </div>

            {/* Action Buttons on Hover */}
            <div
              className="card-actions"
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                display: "flex",
                opacity: 0,
                transition: "opacity 0.2s ease",
              }}
            >
              {/* Quick View */}
              <button
                onClick={handleQuickView}
                style={{
                  flex: 1,
                  padding: "11px 8px",
                  backgroundColor: "rgba(250, 247, 242, 0.95)",
                  color: "#1A1918",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontFamily: "var(--font-sans)",
                  borderRight: "1px solid #E4DDD3",
                }}
              >
                <Eye size={13} />
                Quick View
              </button>

              {/* Quick Add */}
              {!outOfStock && (
                <button
                  onClick={handleQuickAdd}
                  style={{
                    flex: 1,
                    padding: "11px 8px",
                    backgroundColor: "rgba(26, 25, 24, 0.92)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <ShoppingBag size={13} />
                  Quick Add
                </button>
              )}
            </div>

            {/* Out of stock overlay */}
            {outOfStock && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    background: "white",
                    border: "1px solid #E4DDD3",
                    padding: "6px 14px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#8A8279",
                    textTransform: "uppercase",
                  }}
                >
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: "12px 0 0" }}>
            {fabric && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#8A8279",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {fabric}
              </p>
            )}
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: 1.4,
                marginBottom: "6px",
                fontFamily: "var(--font-sans)",
                color: "#1A1918",
              }}
            >
              {name}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1918" }}>
                {formatPrice(price)}
                {unitType === "PER_METER" ? "/m" : ""}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span style={{ fontSize: "12px", color: "#8A8279", textDecoration: "line-through" }}>
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>

        <style>{`
          .aspect-product:hover .card-actions {
            opacity: 1 !important;
          }
          .hover-img {
            opacity: 0;
          }
          .aspect-product:hover .hover-img {
            opacity: 1;
          }
        `}</style>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          productSlug={slug}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
