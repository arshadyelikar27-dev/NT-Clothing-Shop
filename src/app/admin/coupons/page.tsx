import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Tag, Plus } from "lucide-react";
import { AdminCreateCouponModal } from "./AdminCreateCouponModal";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
            Promotional Coupons
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            Manage promotional discount codes and order thresholds
          </p>
        </div>

        <AdminCreateCouponModal />
      </div>

      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Code</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Discount</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Min. Order</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Max. Cap</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "center" }}>Times Used</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                <td style={{ padding: "14px 16px", fontWeight: 700, color: "#9E3B2B" }}>{c.code}</td>
                <td style={{ padding: "14px 16px" }}>
                  {c.type === "PERCENTAGE" ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                </td>
                <td style={{ padding: "14px 16px", color: "#8A8279" }}>
                  {c.minCartValue > 0 ? formatPrice(c.minCartValue) : "No minimum"}
                </td>
                <td style={{ padding: "14px 16px", color: "#8A8279" }}>
                  {c.maxDiscount ? formatPrice(c.maxDiscount) : "No limit"}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: 600 }}>
                  {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : ""}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      backgroundColor: c.isActive ? "#E8F5E9" : "#FEE2E2",
                      color: c.isActive ? "#2C6E3F" : "#991B1B",
                    }}
                  >
                    {c.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
