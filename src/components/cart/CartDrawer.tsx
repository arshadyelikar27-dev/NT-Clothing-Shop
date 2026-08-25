"use client";

import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity } =
    useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => setCartOpen(false)} />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "420px",
          maxWidth: "100vw",
          backgroundColor: "#FAF7F2",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid #E4DDD3",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #E4DDD3",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "18px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShoppingBag size={20} />
            Your Bag
            <span
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "#8A8279",
                fontFamily: "var(--font-sans)",
              }}
            >
              ({items.length})
            </span>
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
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

        {/* Items */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: items.length === 0 ? "40px 24px" : "0",
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#8A8279",
                fontFamily: "var(--font-sans)",
              }}
            >
              <ShoppingBag
                size={48}
                style={{ margin: "0 auto 16px", opacity: 0.3 }}
              />
              <p style={{ fontSize: "15px", marginBottom: "8px" }}>
                Your bag is empty
              </p>
              <p style={{ fontSize: "13px" }}>
                Add some fabrics to get started.
              </p>
              <Link
                href="/shop"
                className="btn btn-primary"
                onClick={() => setCartOpen(false)}
                style={{ marginTop: "24px" }}
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "20px 24px",
                    borderBottom: "1px solid #E4DDD3",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "80px",
                      height: "100px",
                      backgroundColor: "#F3EFEA",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "var(--font-sans)",
                        marginBottom: "4px",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#8A8279",
                          marginBottom: "8px",
                        }}
                      >
                        {item.variantName}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "12px",
                      }}
                    >
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #E4DDD3",
                        }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - (item.unitType === "PER_METER" ? 0.5 : 1),
                              item.variantId
                            )
                          }
                          aria-label="Decrease quantity"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "6px 10px",
                            color: "#1A1918",
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            fontWeight: 500,
                            minWidth: "40px",
                            textAlign: "center",
                            borderLeft: "1px solid #E4DDD3",
                            borderRight: "1px solid #E4DDD3",
                            fontFamily: "var(--font-sans)",
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
                          aria-label="Increase quantity"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "6px 10px",
                            color: "#1A1918",
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        aria-label="Remove item"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "#8A8279",
                          textDecoration: "underline",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderTop: "1px solid #E4DDD3",
              backgroundColor: "#F3EFEA",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
                fontSize: "14px",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(total)}</span>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#8A8279",
                marginBottom: "16px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Shipping calculated at checkout
            </p>
            <Link
              href="/cart"
              className="btn btn-secondary"
              onClick={() => setCartOpen(false)}
              style={{
                width: "100%",
                marginBottom: "8px",
              }}
            >
              View Bag
            </Link>
            <Link
              href="/checkout"
              className="btn btn-primary"
              onClick={() => setCartOpen(false)}
              style={{ width: "100%" }}
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
