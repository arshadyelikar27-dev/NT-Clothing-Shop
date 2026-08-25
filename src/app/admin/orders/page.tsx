import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Search, Filter, ShoppingBag } from "lucide-react";

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status, search } = await searchParams;

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
    ];
  }

  const orders = await prisma.order.findMany({
    where: where as never,
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: true,
      payment: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const statuses = [
    { id: "ALL", label: "All Orders" },
    { id: "PENDING", label: "Pending" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "PROCESSING", label: "Processing" },
    { id: "PACKED", label: "Packed" },
    { id: "SHIPPED", label: "Shipped" },
    { id: "DELIVERED", label: "Delivered" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
            Order Management
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          marginBottom: "20px",
          borderBottom: "1px solid #E4DDD3",
          paddingBottom: "8px",
        }}
      >
        {statuses.map((s) => {
          const isActive = (status || "ALL") === s.id;
          return (
            <Link
              key={s.id}
              href={`/admin/orders${s.id === "ALL" ? "" : `?status=${s.id}`}`}
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? "#1A1918" : "white",
                color: isActive ? "white" : "#1A1918",
                border: "1px solid #E4DDD3",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#8A8279" }}>
            <ShoppingBag size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <p style={{ fontSize: "14px" }}>No orders matching current filter.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Order #</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Customer</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Location</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Items</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Payment</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Total</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>#{order.orderNumber}</td>
                  <td style={{ padding: "14px 16px", color: "#8A8279" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontWeight: 500, color: "#1A1918" }}>{order.user.name}</p>
                    <span style={{ fontSize: "11px", color: "#8A8279" }}>{order.user.phone || order.user.email}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#8A8279" }}>
                    {order.address.city}, {order.address.state} ({order.address.pinCode})
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        backgroundColor: order.paymentMethod === "COD" ? "#FFF3E0" : "#E8F5E9",
                        color: order.paymentMethod === "COD" ? "#B8860B" : "#2C6E3F",
                      }}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        backgroundColor:
                          order.status === "DELIVERED"
                            ? "#E8F5E9"
                            : order.status === "CONFIRMED"
                            ? "#E3F2FD"
                            : order.status === "CANCELLED"
                            ? "#FEE2E2"
                            : "#FFF3E0",
                        color:
                          order.status === "DELIVERED"
                            ? "#2C6E3F"
                            : order.status === "CONFIRMED"
                            ? "#1565C0"
                            : order.status === "CANCELLED"
                            ? "#991B1B"
                            : "#B8860B",
                      }}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600 }}>
                    {formatPrice(order.total)}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "4px 10px", fontSize: "11px" }}
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
