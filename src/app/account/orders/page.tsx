export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
      payment: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main" style={{ maxWidth: "900px" }}>
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
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "#1A1918" }}>
            My Orders
          </h1>
          <p style={{ fontSize: "14px", color: "#8A8279" }}>
            Track and view invoices for all your purchases
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "60px 20px", textAlign: "center" }}>
            <Package size={48} style={{ margin: "0 auto 16px", color: "#8A8279" }} />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>
              No Orders Found
            </h2>
            <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "24px" }}>
              Looks like you haven&apos;t placed any textile orders yet.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Browse Our Catalog
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E4DDD3",
                  padding: "24px",
                }}
              >
                {/* Top status bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #E4DDD3",
                    paddingBottom: "16px",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918" }}>
                        Order #{order.orderNumber}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "2px" }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <Link href={`/order-success/${order.orderNumber}`} className="btn btn-secondary btn-sm">
                    View Invoice & Details
                  </Link>
                </div>

                {/* Items preview */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <img
                        src={item.product?.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "45px", height: "55px", objectFit: "cover", backgroundColor: "#F3EFEA" }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1918" }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#8A8279" }}>
                          {item.quantity} {item.unitType === "PER_METER" ? "meters" : "pcs"} • {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom summary */}
                <div
                  style={{
                    borderTop: "1px solid #E4DDD3",
                    marginTop: "16px",
                    paddingTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#8A8279" }}>
                    Payment: Shop Owner
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: 600 }}>
                    Total: {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

