export const dynamic = "force-dynamic"; // Always fetch fresh order status

import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Printer,
  ShoppingBag,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { InvoicePrintButton } from "./InvoicePrintButton";
import { RefreshStatusButton } from "./RefreshStatusButton";

interface OrderSuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: OrderSuccessPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmed #${orderNumber} — NOBLE TEXTILE`,
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
      address: true,
      payment: true,
      timeline: { orderBy: { createdAt: "asc" } },
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) notFound();

  const session = await getSession();
  if (!session || (session.userId !== order.userId && !isAdmin(session.role))) {
    redirect("/login");
  }

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main" style={{ maxWidth: "900px" }}>
        {/* Success Banner */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E4DDD3",
            padding: "36px 24px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <CheckCircle2 size={54} color="#2C6E3F" style={{ margin: "0 auto 16px" }} />
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#2C6E3F",
              marginBottom: "8px",
            }}
          >
            Thank you for shopping with NOBLE TEXTILE
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 500,
              color: "#1A1918",
              marginBottom: "12px",
            }}
          >
            Order #{order.orderNumber} Confirmed
          </h1>
          <p style={{ fontSize: "14px", color: "#8A8279", maxWidth: "540px", margin: "0 auto 24px" }}>
            Our team in Hatte Nagar, Latur is preparing your fabric.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <InvoicePrintButton order={JSON.parse(JSON.stringify(order))} />
            <Link href="/shop" className="btn btn-secondary btn-sm">
              <ShoppingBag size={14} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* ════ Order Timeline Tracker ════ */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E4DDD3",
            padding: "28px 24px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: 0 }}>
              Order Status & Timeline
            </h2>
            <RefreshStatusButton />
          </div>

          <div style={{ position: "relative", paddingLeft: "24px" }}>
            {/* Timeline track line */}
            <div
              style={{
                position: "absolute",
                left: "7px",
                top: "10px",
                bottom: "10px",
                width: "2px",
                backgroundColor: "#E4DDD3",
              }}
            />

            {order.timeline.map((item, index) => {
              const isLast = index === order.timeline.length - 1;
              const isDelivered = item.status === "DELIVERED";
              const isPaid = item.status === "PAYMENT_RECEIVED" || item.status === "PAID";
              // Green for all completed steps; amber for current last step if not delivered
              const dotColor = isDelivered ? "#2C6E3F" : isPaid ? "#B8860B" : isLast ? "#9E3B2B" : "#2C6E3F";
              return (
                <div key={item.id} style={{ position: "relative", marginBottom: "20px" }}>
                  {/* Node dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-24px",
                      top: "3px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: dotColor,
                      border: "3px solid white",
                      boxShadow: "0 0 0 1px #E4DDD3",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>
                      {item.status.replace(/_/g, " ")}
                    </p>
                    <span style={{ fontSize: "12px", color: "#8A8279" }}>
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "2px" }}>
                    {item.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Show estimated delivery only if order is still in transit */}
          {(() => {
            const finalStatuses = ["DELIVERED", "COMPLETED", "CANCELLED", "RETURNED", "REFUNDED"];
            const paymentStatuses = ["PAYMENT_RECEIVED", "PAID"];
            const isDelivered = finalStatuses.includes(order.status);
            const isPaidStatus = paymentStatuses.includes(order.status);
            const hasDeliveredInTimeline = order.timeline.some(t => t.status === "DELIVERED");

            if (isDelivered || hasDeliveredInTimeline) {
              return (
                <div style={{ backgroundColor: "#F0FDF4", padding: "12px 16px", border: "1px solid #86EFAC", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#2C6E3F", fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#2C6E3F" />
                  <span>✅ Order Successfully Delivered!</span>
                </div>
              );
            }
            if (isPaidStatus) {
              return (
                <div style={{ backgroundColor: "#FFF7ED", padding: "12px 16px", border: "1px solid #FED7AA", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#92400E" }}>
                  <Clock size={16} color="#92400E" />
                  <span>Payment received — Order will be dispatched soon.</span>
                </div>
              );
            }
            return (
              <div style={{ backgroundColor: "#FAF7F2", padding: "12px 16px", border: "1px solid #E4DDD3", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1A1918" }}>
                <Clock size={16} color="#9E3B2B" />
                <span>Estimated Delivery: <strong>7–10 Days</strong></span>
              </div>
            );
          })()}
        </div>

        {/* ════ Order Breakdown & Tax Invoice View ════ */}
        <div
          id="printable-invoice"
          style={{
            backgroundColor: "white",
            border: "1px solid #E4DDD3",
            padding: "36px",
          }}
        >
          {/* Invoice Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px solid #1A1918",
              paddingBottom: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#1A1918",
                  letterSpacing: "0.04em",
                }}
              >
                NOBLE TEXTILE
              </h2>
              <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "2px" }}>
                Hatte Nagar, Latur, Maharashtra 413512, India
              </p>
              <p style={{ fontSize: "12px", color: "#8A8279" }}>
                Phone: +91 97643 13958 • contact@nobletextile.com
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#9E3B2B",
                }}
              >
                TAX INVOICE / RECEIPT
              </span>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginTop: "2px" }}>
                #{order.orderNumber}
              </p>
              <p style={{ fontSize: "12px", color: "#8A8279" }}>
                Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "28px",
              fontSize: "13px",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, color: "#1A1918", marginBottom: "4px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" }}>
                Billed / Shipped To:
              </p>
              <p style={{ fontWeight: 500 }}>{order.address.fullName}</p>
              <p style={{ color: "#8A8279" }}>{order.address.house}, {order.address.street}</p>
              {order.address.area && <p style={{ color: "#8A8279" }}>{order.address.area}</p>}
              <p style={{ color: "#8A8279" }}>
                {order.address.city}, {order.address.state} - {order.address.pinCode}
              </p>
              <p style={{ color: "#8A8279", marginTop: "4px" }}>Mobile: +91 {order.address.phone}</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ fontWeight: 600, color: "#1A1918", marginBottom: "4px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" }}>
                Payment & Delivery Method:
              </p>
              <p style={{ fontWeight: 500 }}>
                Shop Owner
              </p>
              <p style={{ color: "#8A8279" }}>
                Payment Status:{" "}
                <strong
                  style={{
                    color:
                      order.payment?.status === "PAID" ||
                      order.status === "PAYMENT_RECEIVED" ||
                      order.timeline.some(t => t.status === "PAYMENT_RECEIVED" || t.status === "PAID")
                        ? "#2C6E3F"
                        : "#B8860B",
                  }}
                >
                  {order.payment?.status === "PAID" ||
                  order.status === "PAYMENT_RECEIVED" ||
                  order.timeline.some(t => t.status === "PAYMENT_RECEIVED")
                    ? "PAID ✅"
                    : order.payment?.status || "PENDING"}
                </strong>
              </p>
              <p style={{ color: "#8A8279" }}>
                Delivery: {order.deliveryMethod === "EXPRESS" ? "Express Priority" : "Standard Surface"}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "24px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left" }}>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>Item Description</th>
                <th style={{ padding: "10px 12px", fontWeight: 600 }}>SKU</th>
                <th style={{ padding: "10px 12px", fontWeight: 600, textAlign: "right" }}>Rate</th>
                <th style={{ padding: "10px 12px", fontWeight: 600, textAlign: "center" }}>Qty</th>
                <th style={{ padding: "10px 12px", fontWeight: 600, textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #E4DDD3" }}>
                  <td style={{ padding: "12px" }}>
                    <p style={{ fontWeight: 500, color: "#1A1918" }}>{item.name}</p>
                    <span style={{ fontSize: "11px", color: "#8A8279" }}>
                      Unit: {item.unitType === "PER_METER" ? "Per Meter" : "Per Piece/Set"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#8A8279" }}>{item.sku}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>{formatPrice(item.price)}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {item.quantity} {item.unitType === "PER_METER" ? "m" : "pcs"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>
                    {formatPrice(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "280px", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8A8279" }}>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#2C6E3F" }}>
                  <span>Discount:</span>
                  <span>- {formatPrice(order.discount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8A8279" }}>Shipping & Handling:</span>
                <span>{order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#8A8279", fontSize: "12px" }}>
                <span>GST (5% included):</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div
                style={{
                  borderTop: "2px solid #1A1918",
                  paddingTop: "8px",
                  marginTop: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1A1918",
                }}
              >
                <span>Grand Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ borderTop: "1px solid #E4DDD3", paddingTop: "16px", marginTop: "32px", fontSize: "11px", color: "#8A8279", textAlign: "center" }}>
            <p>This is a computer-generated tax invoice issued by NOBLE TEXTILE (Latur, Maharashtra).</p>
            <p>For order queries, contact us at +91 97643 13958 or email contact@nobletextile.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
