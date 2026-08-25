import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Printer, Truck, MapPin, User, CheckCircle2 } from "lucide-react";
import { AdminOrderStatusUpdater } from "./AdminOrderStatusUpdater";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
      payment: true,
      timeline: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) notFound();

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <Link
            href="/admin/orders"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#8A8279",
              textDecoration: "none",
              marginBottom: "8px",
            }}
          >
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
            Order #{order.orderNumber}
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          href={`/order-success/${order.orderNumber}`}
          target="_blank"
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Printer size={14} /> Print Customer Invoice
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "28px",
        }}
        className="lg:grid-cols-[1.6fr_1fr]"
      >
        {/* ════ LEFT: Order Items & Customer Data ════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Order Items Table */}
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "16px" }}>
              Order Line Items ({order.items.length})
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Fabric / Garment</th>
                  <th style={{ padding: "10px 12px" }}>SKU</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Rate</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Qty</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #E4DDD3" }}>
                    <td style={{ padding: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
                      <img
                        src={item.product?.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "40px", height: "50px", objectFit: "cover" }}
                      />
                      <div>
                        <p style={{ fontWeight: 500, color: "#1A1918" }}>{item.name}</p>
                        <span style={{ fontSize: "11px", color: "#8A8279" }}>
                          Unit: {item.unitType === "PER_METER" ? "Meterage" : "Piece/Set"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px", color: "#8A8279" }}>{item.sku}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{formatPrice(item.price)}</td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: 600 }}>
                      {item.quantity} {item.unitType === "PER_METER" ? "m" : "pcs"}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>
                      {formatPrice(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotals */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <div style={{ width: "260px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
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
                  <span style={{ color: "#8A8279" }}>Shipping:</span>
                  <span>{order.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingCharge)}</span>
                </div>
                <div style={{ borderTop: "2px solid #1A1918", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 700 }}>
                  <span>Total:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "20px", fontSize: "13px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <User size={16} color="#9E3B2B" /> Customer Info
              </h3>
              <p style={{ fontWeight: 600, color: "#1A1918" }}>{order.user.name}</p>
              <p style={{ color: "#8A8279" }}>{order.user.email}</p>
              <p style={{ color: "#8A8279" }}>Phone: +91 {order.user.phone || order.address.phone}</p>
            </div>

            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "20px", fontSize: "13px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} color="#9E3B2B" /> Shipping Destination
              </h3>
              <p style={{ fontWeight: 600 }}>{order.address.fullName}</p>
              <p style={{ color: "#8A8279", lineHeight: 1.6 }}>
                {order.address.house}, {order.address.street}
                <br />
                {order.address.city}, {order.address.state} - {order.address.pinCode}
              </p>
            </div>
          </div>
        </div>

        {/* ════ RIGHT: Status Update Form & Timeline ════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Status Update Card */}
          <AdminOrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            trackingNumber={order.trackingNumber || ""}
            courierPartner={order.courierPartner || ""}
            adminNotes={order.adminNotes || ""}
          />

          {/* Timeline Audit Log */}
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", marginBottom: "16px" }}>
              Order Lifecycle History
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              {order.timeline.map((log) => (
                <div key={log.id} style={{ borderLeft: "2px solid #9E3B2B", paddingLeft: "12px" }}>
                  <p style={{ fontWeight: 600, color: "#1A1918" }}>{log.status.replace(/_/g, " ")}</p>
                  <p style={{ color: "#8A8279", fontSize: "12px" }}>{log.message}</p>
                  <span style={{ fontSize: "11px", color: "#8A8279" }}>
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
