"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore, useUIStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
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



  return (
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
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.4s ease",
            }}
            onMouseEnter={(e) => {
              if (hoverImage) {
                (e.currentTarget as HTMLImageElement).src = hoverImage;
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).src = image;
            }}
          />


          {/* Quick Add */}
          {!outOfStock && (
            <button
              onClick={handleQuickAdd}
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                padding: "12px",
                backgroundColor: "rgba(26, 25, 24, 0.9)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "var(--font-sans)",
                opacity: 0,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              className="quick-add-btn"
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
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
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1918", fontFamily: "var(--font-sans)" }}>
              {formatPrice(price)}
              {unitType === "PER_METER" ? "/m" : ""}
            </span>
          </div>
        </div>
      </Link>

      <style jsx global>{`
        .aspect-product:hover .quick-add-btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
