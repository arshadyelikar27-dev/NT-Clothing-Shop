import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  Package,
  ArrowRight,
  Plus,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminOverviewPage() {
  // Fetch real database metrics
  const [
    totalOrdersCount,
    pendingOrdersCount,
    paidOrders,
    totalProductsCount,
    lowStockProducts,
    customersCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: { status: { in: ["PENDING", "PAYMENT_PENDING", "PROCESSING", "CONFIRMED"] } },
    }),
    prisma.order.findMany({
      select: { total: true },
    }),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.product.findMany({
      where: { stock: { lte: 10 }, isArchived: false },
      include: { category: true },
      take: 6,
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    }),
  ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  return (
    <div>
      {/* Page Title & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 500, color: "#1A1918" }}>
            Store Overview & Operations
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            Real-time sales, order fulfillment, and inventory for NOBLE TEXTILE (Latur)
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Plus size={14} /> Add Product
          </Link>
          <Link href="/admin/orders" className="btn btn-secondary btn-sm">
            Manage Orders
          </Link>
        </div>
      </div>

      {/* ════ KPI Metrics Cards ════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
        className="md:grid-cols-3 lg:grid-cols-6"
      >
        {/* Total Revenue */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "18px" }}>
          <span style={{ fontSize: "11px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Total Revenue
          </span>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#1A1918", marginTop: "4px" }}>
            {formatPrice(totalRevenue)}
          </p>
          <span style={{ fontSize: "11px", color: "#2C6E3F", fontWeight: 500 }}>
            From {totalOrdersCount} orders
          </span>
        </div>

        {/* Total Orders */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "18px" }}>
          <span style={{ fontSize: "11px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Total Orders
          </span>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#1A1918", marginTop: "4px" }}>
            {totalOrdersCount}
          </p>
          <span style={{ fontSize: "11px", color: "#8A8279" }}>Lifetime volume</span>
        </div>

        {/* Pending Orders */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "18px" }}>
          <span style={{ fontSize: "11px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Pending Orders
          </span>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#9E3B2B", marginTop: "4px" }}>
            {pendingOrdersCount}
          </p>
          <span style={{ fontSize: "11px", color: "#9E3B2B", fontWeight: 500 }}>Needs fulfillment</span>
        </div>

        {/* Average Order Value */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "18px" }}>
          <span style={{ fontSize: "11px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Avg. Order Value
          </span>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#1A1918", marginTop: "4px" }}>
            {formatPrice(averageOrderValue)}
          </p>
          <span style={{ fontSize: "11px", color: "#8A8279" }}>Per basket</span>
        </div>

        {/* Active Products */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "18px" }}>
          <span style={{ fontSize: "11px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Live Products
          </span>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#1A1918", marginTop: "4px" }}>
            {totalProductsCount}
          </p>
          <span style={{ fontSize: "11px", color: "#8A8279" }}>In catalog</span>
        </div>

        {/* Customers Count */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "18px" }}>
          <span style={{ fontSize: "11px", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Registered Users
          </span>
          <p style={{ fontSize: "22px", fontWeight: 700, color: "#1A1918", marginTop: "4px" }}>
            {customersCount}
          </p>
          <span style={{ fontSize: "11px", color: "#8A8279" }}>Customer CRM</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "28px",
        }}
        className="lg:grid-cols-[1.6fr_1fr]"
      >
        {/* ════ LEFT: Recent Orders Table ════ */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "#1A1918" }}>
              Recent Orders
            </h2>
            <Link href="/admin/orders" style={{ fontSize: "12px", fontWeight: 600, color: "#9E3B2B", textDecoration: "none" }}>
              View All Orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#8A8279", padding: "24px 0", textAlign: "center" }}>
              No orders placed yet.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#8A8279" }}>
                  <th style={{ padding: "8px 0" }}>Order #</th>
                  <th style={{ padding: "8px" }}>Customer</th>
                  <th style={{ padding: "8px" }}>Status</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>Total</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                    <td style={{ padding: "12px 0", fontWeight: 600 }}>#{order.orderNumber}</td>
                    <td style={{ padding: "12px 8px" }}>{order.user.name}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 8px",
                          backgroundColor:
                            order.status === "DELIVERED"
                              ? "#E8F5E9"
                              : order.status === "CONFIRMED"
                              ? "#E3F2FD"
                              : "#FFF3E0",
                          color:
                            order.status === "DELIVERED"
                              ? "#2C6E3F"
                              : order.status === "CONFIRMED"
                              ? "#1565C0"
                              : "#B8860B",
                        }}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: 600 }}>
                      {formatPrice(order.total)}
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        style={{ fontSize: "12px", color: "#9E3B2B", fontWeight: 600, textDecoration: "none" }}
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

        {/* ════ RIGHT: Low Stock Alerts ════ */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "#1A1918", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={18} color="#B8860B" /> Low Stock Alerts
            </h2>
            <Link href="/admin/inventory" style={{ fontSize: "12px", fontWeight: 600, color: "#9E3B2B", textDecoration: "none" }}>
              Manage Stock →
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#2C6E3F", padding: "24px 0", textAlign: "center" }}>
              ✓ All products have healthy inventory levels.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    backgroundColor: "#FAF7F2",
                    border: "1px solid #E4DDD3",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#1A1918" }}>{p.name}</p>
                    <span style={{ fontSize: "11px", color: "#8A8279" }}>{p.category.name} • SKU: {p.sku}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: p.stock <= 5 ? "#B91C1C" : "#B8860B",
                      padding: "2px 8px",
                      backgroundColor: "white",
                      border: "1px solid #E4DDD3",
                    }}
                  >
                    {p.stock} {p.unitType === "PER_METER" ? "meters" : "left"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
