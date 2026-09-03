export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Sliders, AlertTriangle } from "lucide-react";
import { AdminStockAdjuster } from "./AdminStockAdjuster";
import RealtimeRefresher from "@/components/admin/RealtimeRefresher";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { stock: "asc" },
  });

  return (
    <div>
      <RealtimeRefresher events={["inventory-update"]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
            Inventory Management
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            Track stock levels, monitor low stock thresholds, and adjust inventory
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Product</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Category</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Unit</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Current Stock</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Stock Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Quick Adjust</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLow = p.stock <= p.lowStockThreshold;
              const isOut = p.stock <= 0;

              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                  <td style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={p.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      style={{ width: "36px", height: "45px", objectFit: "cover" }}
                    />
                    <div>
                      <p style={{ fontWeight: 500, color: "#1A1918" }}>{p.name}</p>
                      <span style={{ fontSize: "11px", color: "#8A8279" }}>SKU: {p.sku}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#8A8279" }}>{p.category.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11px", backgroundColor: "#F3EFEA", padding: "2px 6px" }}>
                      {p.unitType === "PER_METER" ? "Meters" : "Pieces"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                    {p.stock} {p.unitType === "PER_METER" ? "m" : "pcs"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        backgroundColor: isOut ? "#FEE2E2" : isLow ? "#FFF3E0" : "#E8F5E9",
                        color: isOut ? "#991B1B" : isLow ? "#B8860B" : "#2C6E3F",
                      }}
                    >
                      {isOut ? "Out of Stock" : isLow ? "Low Stock Alert" : "In Stock"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <AdminStockAdjuster productId={p.id} initialStock={p.stock} />
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

