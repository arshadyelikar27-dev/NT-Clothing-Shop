import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import RealtimeRefresher from "@/components/admin/RealtimeRefresher";
import Link from "next/link";
import { Package, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
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
    },
  });

  return (
    <div>
      <RealtimeRefresher events={["new-order"]} />
      
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "#1A1918", marginBottom: "8px" }}>
            Orders Overview
          </h1>
          <p style={{ fontSize: "14px", color: "#8A8279" }}>
            {orders.length} total orders received
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        {orders.length === 0 ? (
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "60px 20px", textAlign: "center", color: "#8A8279" }}>
            <Package size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div key={order.id} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F3EFEA", paddingBottom: "16px", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>
                      Order #{order.orderNumber}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#8A8279" }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "18px", fontWeight: 700, color: "#9E3B2B" }}>
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="md:grid-cols-2">
                  {/* Customer Info */}
                  <div>
                    <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#8A8279", fontWeight: 600, marginBottom: "8px" }}>
                      Customer Details
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1918" }}>
                      {order.user.name}
                    </p>
                    <p style={{ fontSize: "13px", color: "#8A8279" }}>{order.user.email}</p>
                    <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "8px" }}>
                      <strong>Shipping Address:</strong><br/>
                      {order.address.fullName}<br/>
                      {order.address.house}, {order.address.street}<br/>
                      {order.address.city}, {order.address.state} {order.address.pinCode}<br/>
                      Phone: {order.address.phone}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#8A8279", fontWeight: 600, marginBottom: "8px" }}>
                      Items Ordered
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <img
                            src={item.product?.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                            alt={item.name}
                            style={{ width: "40px", height: "40px", objectFit: "cover", backgroundColor: "#F3EFEA", borderRadius: "4px" }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "13px", fontWeight: 500, color: "#1A1918" }}>{item.name}</p>
                            <p style={{ fontSize: "12px", color: "#8A8279" }}>
                              {item.quantity} {item.unitType === "PER_METER" ? "meters" : "pcs"} • {formatPrice(item.total)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
