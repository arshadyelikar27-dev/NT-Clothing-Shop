"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, ExternalLink, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ... existing interfaces ...

interface OrderTimeline {
  id: string;
  status: string;
  message: string;
  createdAt: string;
}

interface TrackedOrder {
  orderNumber: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string | null;
  trackingNumber: string | null;
  courierPartner: string | null;
  total: number;
  subtotal: number;
  shippingCharge: number;
  paymentMethod: string;
  timeline: OrderTimeline[];
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    product: { name: string; slug: string; images: Array<{ url: string }> };
  }>;
  address: {
    fullName: string;
    city: string;
    state: string;
    pinCode: string;
  };
  payment: { status: string; method: string } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDING: { label: "Pending", color: "#B8860B", bg: "#FFFDE7", icon: <Clock size={16} /> },
  PAYMENT_PENDING: { label: "Payment Pending", color: "#B8860B", bg: "#FFFDE7", icon: <Clock size={16} /> },
  CONFIRMED: { label: "Confirmed", color: "#1565C0", bg: "#E3F2FD", icon: <CheckCircle2 size={16} /> },
  PROCESSING: { label: "Processing", color: "#6A1B9A", bg: "#F3E5F5", icon: <Package size={16} /> },
  PACKED: { label: "Packed", color: "#E65100", bg: "#FFF3E0", icon: <Package size={16} /> },
  SHIPPED: { label: "Shipped", color: "#0277BD", bg: "#E1F5FE", icon: <Truck size={16} /> },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "#2E7D32", bg: "#E8F5E9", icon: <Truck size={16} /> },
  DELIVERED: { label: "Delivered", color: "#2C6E3F", bg: "#E8F5E9", icon: <CheckCircle2 size={16} /> },
  CANCELLED: { label: "Cancelled", color: "#B91C1C", bg: "#FEF2F2", icon: <XCircle size={16} /> },
};

const ORDER_STEPS = [
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlOrder = params.get("order");
      if (urlOrder) {
        setQuery(urlOrder);
        trackOrder(urlOrder);
      }
    }
  }, []);

  const trackOrder = async (orderId: string) => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId.trim().toUpperCase()}/track`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found. Please check your order number.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    trackOrder(query);
  };

  const statusCfg = order ? STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING : null;

  const currentStepIndex = order ? ORDER_STEPS.indexOf(order.status) : -1;

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}>
      <div className="container-main" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9E3B2B", marginBottom: "8px", fontFamily: "var(--font-sans)" }}>
            Order Status
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, color: "#1A1918", marginBottom: "12px" }}>
            Track Your Order
          </h1>
          <p style={{ fontSize: "14px", color: "#8A8279", fontFamily: "var(--font-sans)" }}>
            Enter your order number to see the current status and timeline.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleTrack}
          style={{
            display: "flex",
            gap: "12px",
            backgroundColor: "white",
            border: "1px solid #E4DDD3",
            padding: "20px 24px",
            borderRadius: "12px",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label htmlFor="order-number" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8279", display: "block", marginBottom: "6px", fontFamily: "var(--font-sans)" }}>
              Order Number
            </label>
            <input
              id="order-number"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. NT-20240829-001234"
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1px solid #E4DDD3",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "var(--font-sans)",
                color: "#1A1918",
                backgroundColor: "#FAF7F2",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              style={{
                padding: "11px 24px",
                backgroundColor: loading ? "#8A8279" : "#1A1918",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
              }}
            >
              <Search size={16} />
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", color: "#B91C1C", fontSize: "14px", marginBottom: "24px" }}>
            <XCircle size={18} />
            {error}
          </div>
        )}

        {/* Order Result */}
        {order && statusCfg && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Status Banner */}
            <div
              style={{
                backgroundColor: statusCfg.bg,
                border: `1px solid`,
                borderColor: statusCfg.color + "44",
                borderRadius: "12px",
                padding: "24px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: statusCfg.color, marginBottom: "4px", fontFamily: "var(--font-sans)" }}>
                  {statusCfg.icon} Current Status
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 500, color: statusCfg.color }}>
                  {statusCfg.label}
                </p>
                <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px", fontFamily: "var(--font-sans)" }}>
                  Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              {order.estimatedDelivery && (
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "11px", color: "#8A8279", fontFamily: "var(--font-sans)", marginBottom: "2px" }}>Estimated Delivery</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", fontFamily: "var(--font-sans)" }}>7-10 Days</p>
                </div>
              )}
            </div>

            {/* Custom Pending / Enquiry Message */}
            {order.status === "PENDING" && (
              <div style={{ backgroundColor: "#FDF8F6", border: "1px solid #F5E6E1", borderRadius: "12px", padding: "28px", textAlign: "center" }}>
                <CheckCircle2 size={48} color="#9E3B2B" style={{ margin: "0 auto 16px" }} />
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#9E3B2B", marginBottom: "12px" }}>
                  Thank You For Ordering!
                </h2>
                <p style={{ fontSize: "15px", color: "#1A1918", marginBottom: "24px", lineHeight: 1.6 }}>
                  Please wait some time until your order is confirmed by the Shop Owner. 
                  Once confirmed, your order will be shipped and you can expect delivery within 7 days.
                </p>

                <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", display: "inline-block", textAlign: "left", border: "1px solid #E4DDD3", maxWidth: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FAF7F2", padding: "10px", borderRadius: "50%" }}>
                      <Phone size={24} color="#9E3B2B" />
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>For Inquiry Contact Owner</p>
                      <p style={{ fontSize: "18px", fontWeight: 700, color: "#1A1918" }}>+91 78210 59350</p>
                    </div>
                  </div>

                  <hr style={{ border: "none", borderTop: "1px solid #E4DDD3", margin: "16px 0" }} />

                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "13px", color: "#8A8279", marginBottom: "12px" }}>
                      <strong>Optional:</strong> Want to pay in advance? Scan the QR code below and send a screenshot to the owner on WhatsApp.
                    </p>
                    {/* Placeholder QR Code Image */}
                    <div style={{ width: "160px", height: "160px", margin: "0 auto", backgroundColor: "#F3EFEA", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "1px solid #E4DDD3" }}>
                      <p style={{ fontSize: "12px", color: "#8A8279", padding: "20px" }}>[Your UPI QR Code Here]</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {order.status !== "CANCELLED" && (
              <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", padding: "24px 28px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "20px", fontFamily: "var(--font-sans)" }}>Order Progress</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                  {ORDER_STEPS.map((step, i) => {
                    const cfg = STATUS_CONFIG[step];
                    const isCompleted = currentStepIndex >= i;
                    const isCurrent = currentStepIndex === i;
                    return (
                      <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                        {/* Line */}
                        {i < ORDER_STEPS.length - 1 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "14px",
                              left: "50%",
                              width: "100%",
                              height: "2px",
                              backgroundColor: isCompleted ? "#2C6E3F" : "#E4DDD3",
                              zIndex: 0,
                            }}
                          />
                        )}
                        {/* Circle */}
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            backgroundColor: isCompleted ? "#2C6E3F" : "#E4DDD3",
                            border: isCurrent ? "3px solid #E0A96D" : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            position: "relative",
                            flexShrink: 0,
                            color: isCompleted ? "white" : "#8A8279",
                            transition: "all 0.3s",
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={14} /> : <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#B8AFA4" }} />}
                        </div>
                        <p style={{ fontSize: "10px", fontWeight: isCompleted ? 600 : 400, color: isCompleted ? "#1A1918" : "#8A8279", marginTop: "8px", textAlign: "center", lineHeight: 1.3, maxWidth: "60px", fontFamily: "var(--font-sans)" }}>
                          {cfg?.label || step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", padding: "24px 28px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "16px", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Truck size={16} color="#9E3B2B" /> Shipping & Tracking
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {order.courierPartner && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", color: "#8A8279", fontFamily: "var(--font-sans)" }}>Courier</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918", fontFamily: "var(--font-sans)" }}>{order.courierPartner}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "#8A8279", fontFamily: "var(--font-sans)" }}>Tracking No.</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1918", fontFamily: "var(--font-mono, monospace)" }}>{order.trackingNumber}</span>
                      <a
                        href={`https://www.google.com/search?q=${order.courierPartner}+tracking+${order.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#9E3B2B", display: "flex", alignItems: "center" }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", padding: "24px 28px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "20px", fontFamily: "var(--font-sans)" }}>Order Timeline</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[...order.timeline].reverse().map((event, i, arr) => (
                  <div key={event.id} style={{ display: "flex", gap: "16px", paddingBottom: i < arr.length - 1 ? "20px" : "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: i === 0 ? "#9E3B2B" : "#E4DDD3", flexShrink: 0 }} />
                      {i < arr.length - 1 && <div style={{ width: "2px", flex: 1, backgroundColor: "#E4DDD3", marginTop: "4px" }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: "4px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918", fontFamily: "var(--font-sans)", marginBottom: "2px" }}>
                        {STATUS_CONFIG[event.status]?.label || event.status.replace(/_/g, " ")}
                      </p>
                      <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.5, fontFamily: "var(--font-sans)", marginBottom: "4px" }}>
                        {event.message}
                      </p>
                      <p style={{ fontSize: "11px", color: "#B8AFA4", fontFamily: "var(--font-sans)" }}>
                        {new Date(event.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", padding: "24px 28px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "16px", fontFamily: "var(--font-sans)" }}>Order Items</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3EFEA" }}>
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0].url}
                        alt={item.name}
                        style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "6px", flexShrink: 0, backgroundColor: "#F3EFEA" }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1918", fontFamily: "var(--font-sans)" }}>{item.name}</p>
                      <p style={{ fontSize: "12px", color: "#8A8279", fontFamily: "var(--font-sans)" }}>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1918", fontFamily: "var(--font-sans)" }}>{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E4DDD3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#8A8279", fontFamily: "var(--font-sans)" }}>Shipping</span>
                  <span style={{ fontSize: "13px", color: "#1A1918", fontFamily: "var(--font-sans)" }}>{order.shippingCharge > 0 ? formatPrice(order.shippingCharge) : "Free"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1918", fontFamily: "var(--font-sans)" }}>Total</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1918", fontFamily: "var(--font-sans)" }}>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", padding: "24px 28px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-sans)" }}>
                <MapPin size={16} color="#9E3B2B" /> Delivering To
              </h3>
              <p style={{ fontSize: "14px", color: "#3A3630", fontFamily: "var(--font-sans)" }}>
                {order.address.fullName} — {order.address.city}, {order.address.state} {order.address.pinCode}
              </p>
            </div>

            {/* Need help */}
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px" }}>
              <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "12px", fontFamily: "var(--font-sans)" }}>
                Need help with your order?
              </p>
              <a
                href={`https://wa.me/917821059350?text=Hi%2C%20I%20need%20help%20with%20order%20${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  backgroundColor: "#25D366",
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                💬 WhatsApp Support
              </a>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!order && !loading && !error && (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px" }}>
            <Package size={48} color="#E4DDD3" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#1A1918", marginBottom: "8px" }}>Enter your order number above</p>
            <p style={{ fontSize: "13px", color: "#8A8279", marginBottom: "20px" }}>Your order number is in your confirmation message, e.g. NT-20240829-001234</p>
            <Link href="/account/orders" style={{ fontSize: "13px", color: "#9E3B2B", fontWeight: 600, textDecoration: "none" }}>
              View my orders in account →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
