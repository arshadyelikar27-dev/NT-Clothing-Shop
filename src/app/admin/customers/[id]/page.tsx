import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import RealtimeRefresher from "@/components/admin/RealtimeRefresher";

export const dynamic = "force-dynamic";

export default async function CustomerManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      addresses: true,
    },
  });

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <RealtimeRefresher events={["new-order", "order-update"]} />
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/admin/customers"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#8A8279",
            textDecoration: "none",
            marginBottom: "16px",
          }}
        >
          <ArrowLeft size={14} /> Back to Customers
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "#1A1918", marginBottom: "8px" }}>
              {customer.name}
            </h1>
            <div style={{ fontSize: "14px", color: "#8A8279", display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} /> {customer.email}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={14} /> {customer.phone || "No Phone"}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={14} /> Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{ textAlign: "right", backgroundColor: "white", padding: "16px 24px", border: "1px solid #E4DDD3", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#8A8279", marginBottom: "4px", fontWeight: 600 }}>Lifetime Spend</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: "#9E3B2B" }}>{formatPrice(totalSpent)}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="lg:grid-cols-[1fr_300px]">
        {/* Left: Orders */}
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "#1A1918", marginBottom: "16px" }}>
            Order History ({customer.orders.length})
          </h2>
          
          {customer.orders.length === 0 ? (
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "40px 20px", textAlign: "center", color: "#8A8279" }}>
              No orders placed by this customer yet.
            </div>
          ) : (
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Order #</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Date</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Products</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1A1918" }}>
                        #{order.orderNumber}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#8A8279" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#5A5249", fontSize: "12px" }}>
                        <ul style={{ margin: 0, paddingLeft: "16px" }}>
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.name} ({item.quantity} {item.unitType === "PER_METER" ? "m" : "pcs"})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "#1A1918" }}>
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Saved Addresses */}
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "#1A1918", marginBottom: "16px" }}>
            Saved Addresses
          </h2>
          
          {customer.addresses.length === 0 ? (
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px 20px", textAlign: "center", color: "#8A8279", fontSize: "13px" }}>
              No addresses saved.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {customer.addresses.map((address) => (
                <div key={address.id} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "#F3EFEA", padding: "4px 8px", borderRadius: "4px", color: "#1A1918" }}>
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span style={{ fontSize: "11px", color: "#2C6E3F", fontWeight: 600 }}>Default</span>
                    )}
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>
                    {address.fullName}
                  </p>
                  <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: "1.5" }}>
                    {address.house}, {address.street}<br/>
                    {address.city}, {address.state} {address.pinCode}
                  </p>
                  <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={12} /> {address.phone}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
