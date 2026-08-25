"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useWishlistStore, useCartStore, useUIStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const { showNotification } = useUIStore();

  const handleMoveToCart = (item: {
    productId: string;
    name: string;
    image: string;
    price: number;
    compareAtPrice?: number;
    slug: string;
  }) => {
    addItemToCart({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      quantity: 1,
      unitType: "PER_PIECE",
      sku: item.slug,
      maxStock: 50,
    });
    removeItem(item.productId);
    showNotification(`${item.name} moved to bag`, "success");
  };

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main">
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Link
            href="/account"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#8A8279",
              textDecoration: "none",
              marginBottom: "12px",
            }}
          >
            <ArrowLeft size={14} /> Back to Account
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "#1A1918" }}>
                My Wishlist
              </h1>
              <p style={{ fontSize: "14px", color: "#8A8279" }}>
                {items.length} {items.length === 1 ? "saved item" : "saved items"}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={() => {
                  clearWishlist();
                  showNotification("Wishlist cleared", "info");
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "13px",
                  color: "#8A8279",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear Wishlist
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "60px 20px", textAlign: "center" }}>
            <Heart size={44} style={{ margin: "0 auto 16px", color: "#8A8279" }} />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "24px" }}>
              Tap the heart icon on any textile or garment to save it for later.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {items.map((item) => (
              <div
                key={item.productId}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E4DDD3",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ aspectRatio: "3/4", position: "relative", backgroundColor: "#F3EFEA" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(250,247,242,0.9)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={14} color="#9E3B2B" />
                  </button>
                </div>

                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      style={{ textDecoration: "none", color: "#1A1918", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "4px" }}
                    >
                      {item.name}
                    </Link>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <ShoppingBag size={14} /> Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
