import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  LogOut,
  User,
  ChevronRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { BackButton } from "@/components/ui/BackButton";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          items: true,
          payment: true,
        },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
      <div className="container-main" style={{ maxWidth: "1000px" }}>
        <div style={{ marginBottom: "20px" }}>
          <BackButton 
            label="Back to Shop" 
            fallbackUrl="/shop"
            className="text-[#8A8279]"
          />
        </div>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid #E4DDD3",
            paddingBottom: "24px",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9E3B2B" }}>
              Customer Dashboard
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 500, color: "#1A1918", marginTop: "8px" }}>
              Hello, {user.name}
            </h1>
            <p style={{ fontSize: "13px", color: "#8A8279" }}>{user.email} • {user.phone || "No phone added"}</p>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </form>
        </div>

        {/* Quick Links Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginBottom: "40px",
          }}
          className="sm:grid-cols-2"
        >
          <Link
            href="/account/orders"
            style={{
              backgroundColor: "white",
              border: "1px solid #E4DDD3",
              padding: "20px",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <Package size={24} color="#9E3B2B" />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>My Orders</p>
              <p style={{ fontSize: "12px", color: "#8A8279" }}>View past and active orders</p>
            </div>
          </Link>



          <Link
            href="/account/addresses"
            style={{
              backgroundColor: "white",
              border: "1px solid #E4DDD3",
              padding: "20px",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <MapPin size={24} color="#9E3B2B" />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>Addresses</p>
              <p style={{ fontSize: "12px", color: "#8A8279" }}>{user.addresses.length} saved addresses</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "28px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500 }}>
              Recent Orders
            </h2>
            <Link href="/account/orders" style={{ fontSize: "13px", color: "#9E3B2B", fontWeight: 600, textDecoration: "none" }}>
              View All Orders →
            </Link>
          </div>

          {user.orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#8A8279" }}>
              <Package size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ fontSize: "14px", marginBottom: "12px" }}>You haven&apos;t placed any orders yet</p>
              <Link href="/shop" className="btn btn-primary btn-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid #E4DDD3",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>
                        #{order.orderNumber}
                      </span>
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
                    </div>
                    <p style={{ fontSize: "12px", color: "#8A8279" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })} • {order.items.length} {order.items.length === 1 ? "item" : "items"} • {formatPrice(order.total)}
                    </p>
                  </div>

                  <Link href={`/order-success/${order.orderNumber}`} className="btn btn-secondary btn-sm">
                    View Invoice & Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
