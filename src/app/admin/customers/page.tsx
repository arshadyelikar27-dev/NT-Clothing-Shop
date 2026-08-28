export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Users, Mail, Phone, ShoppingBag } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { total: true } },
      addresses: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
            Customer CRM
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            {customers.length} registered customer accounts
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Customer</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Email</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Phone</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "center" }}>Orders Placed</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Lifetime Spend</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);

              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1A1918" }}>{c.name}</td>
                  <td style={{ padding: "14px 16px", color: "#8A8279" }}>{c.email}</td>
                  <td style={{ padding: "14px 16px", color: "#8A8279" }}>{c.phone || "—"}</td>
                  <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: 600 }}>
                    {c._count.orders}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "#1A1918" }}>
                    {formatPrice(totalSpent)}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#8A8279" }}>
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

