"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCartStore, useUIStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { showNotification } = useUIStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharge = subtotal === 0 ? 0 : 79;
  const finalTotal = subtotal + shippingCharge;

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: "#FAF7F2", minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div className="container-main" style={{ textAlign: "center", padding: "80px 20px" }}>
          <ShoppingBag size={54} style={{ margin: "0 auto 16px", color: "#8A8279" }} />
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "32px",
              fontWeight: 500,
              color: "#1A1918",
              marginBottom: "12px",
            }}
          >
            Your Bag is Empty
          </h1>
          <p style={{ fontSize: "15px", color: "#8A8279", maxWidth: "400px", margin: "0 auto 28px" }}>
            Explore our curated textiles, Paithani sarees, dress materials, and cotton weaves from Latur.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
      <div className="container-main">
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 500,
            color: "#1A1918",
            marginBottom: "8px",
          }}
        >
          Shopping Bag
        </h1>
        <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "32px" }}>
          Review your fabrics and clothing before checkout ({items.length} {items.length === 1 ? "item" : "items"})
        </p>



        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "36px",
          }}
          className="lg:grid-cols-[1.5fr_1fr]"
        >
          {/* ════ LEFT: Item List ════ */}
          <div>
            <div style={{ borderTop: "1px solid #E4DDD3" }}>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: "20px",
                    padding: "24px 0",
                    borderBottom: "1px solid #E4DDD3",
                  }}
                  className="sm:grid-cols-[100px_1fr_auto]"
                >
                  {/* Image */}
                  <div style={{ backgroundColor: "#F3EFEA", overflow: "hidden", aspectRatio: "3/4" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1A1918", marginBottom: "4px" }}>
                      {item.name}
                    </h3>
                    {item.variantName && (
                      <p style={{ fontSize: "13px", color: "#8A8279", marginBottom: "6px" }}>
                        Variant: {item.variantName}
                      </p>
                    )}
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>
                      {formatPrice(item.price)}
                      {item.unitType === "PER_METER" ? " / meter" : ""}
                    </p>

                    {/* Quantity Selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #E4DDD3" }}>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - (item.unitType === "PER_METER" ? 0.5 : 1),
                              item.variantId
                            )
                          }
                          aria-label="Decrease"
                          style={{ padding: "6px 12px", background: "none", border: "none", cursor: "pointer" }}
                        >
                          <Minus size={13} />
                        </button>
                        <span
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            fontWeight: 600,
                            minWidth: "40px",
                            textAlign: "center",
                            borderLeft: "1px solid #E4DDD3",
                            borderRight: "1px solid #E4DDD3",
                          }}
                        >
                          {item.quantity}
                          {item.unitType === "PER_METER" ? "m" : ""}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + (item.unitType === "PER_METER" ? 0.5 : 1),
                              item.variantId
                            )
                          }
                          aria-label="Increase"
                          style={{ padding: "6px 12px", background: "none", border: "none", cursor: "pointer" }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label="Remove item"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#8A8279",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "13px",
                        }}
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Subtotal Per Item */}
                  <div style={{ textAlign: "right" }} className="hidden sm:block">
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918" }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
              <Link href="/shop" className="btn btn-secondary btn-sm">
                ← Continue Shopping
              </Link>
              <button
                onClick={() => {
                  clearCart();
                  showNotification("Shopping bag cleared", "info");
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
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* ════ RIGHT: Order Summary ════ */}
          <div>
            <div
              style={{
                backgroundColor: "#F3EFEA",
                border: "1px solid #E4DDD3",
                padding: "28px 24px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#1A1918",
                  marginBottom: "20px",
                }}
              >
                Order Summary
              </h2>



              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#8A8279" }}>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(subtotal)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#8A8279" }}>Estimated Shipping</span>
                  <span style={{ fontWeight: 500 }}>
                    {formatPrice(shippingCharge)}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #E4DDD3",
                    paddingTop: "16px",
                    marginTop: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  <span>Total Amount</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#8A8279", textAlign: "right" }}>
                  (Includes GST & applicable taxes)
                </p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push("/checkout")}
                className="btn btn-accent"
                style={{ width: "100%", padding: "16px", fontSize: "14px" }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "16px", fontSize: "12px", color: "#8A8279" }}>
                <ShieldCheck size={14} color="#2C6E3F" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
