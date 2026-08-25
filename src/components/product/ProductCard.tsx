"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore, useWishlistStore, useUIStore } from "@/lib/store";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

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
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } =
    useWishlistStore();
  const { showNotification } = useUIStore();

  const wishlisted = isInWishlist(id);
  const discount = compareAtPrice
    ? getDiscountPercentage(price, compareAtPrice)
    : 0;
  const outOfStock = stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;

    addItem({
      productId: id,
      name,
      image,
      price,
      compareAtPrice: compareAtPrice || undefined,
      quantity: 1,
      unitType,
      sku: slug,
      maxStock: stock,
    });
    showNotification(`${name} added to bag`, "success");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeWishlist(id);
      showNotification("Removed from wishlist", "info");
    } else {
      addWishlist({ productId: id, name, image, price, compareAtPrice: compareAtPrice || undefined, slug });
      showNotification("Added to wishlist", "success");
    }
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

          {/* Badges */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {discount > 0 && (
              <span className="badge badge-sale">{discount}% off</span>
            )}
            {isNew && <span className="badge badge-new">New</span>}
            {outOfStock && (
              <span className="badge badge-out">Sold out</span>
            )}
          </div>

          {/* Actions */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(250, 247, 242, 0.9)",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              <Heart
                size={16}
                fill={wishlisted ? "#9E3B2B" : "none"}
                color={wishlisted ? "#9E3B2B" : "#1A1918"}
              />
            </button>
          </div>

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
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1A1918",
              }}
            >
              {formatPrice(price)}
              {unitType === "PER_METER" ? "/m" : ""}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span
                style={{
                  fontSize: "13px",
                  color: "#B8AFA4",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(compareAtPrice)}
              </span>
            )}
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
