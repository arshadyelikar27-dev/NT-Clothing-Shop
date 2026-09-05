export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
            Inventory Management
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            Manage pricing, SKUs, and order quantities.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Product</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>SKU</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Unit</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Selling Price</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "center" }}>Min Qty</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "center" }}>Max Qty</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                <td style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={product.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                    alt={product.name}
                    loading="lazy"
                    style={{ width: "32px", height: "40px", objectFit: "cover", backgroundColor: "#F3EFEA", borderRadius: "4px" }}
                  />
                  <div>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      style={{ fontWeight: 500, color: "#1A1918", textDecoration: "none", display: "block" }}
                    >
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#8A8279", fontFamily: "monospace" }}>{product.sku}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 6px", backgroundColor: "#F3EFEA", color: "#1A1918", borderRadius: "4px" }}>
                    {product.unitType === "PER_METER" ? "Per Meter" : product.unitType === "PER_SET" ? "Per Set" : "Per Piece"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#1A1918" }}>
                  {formatPrice(product.price)}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center", color: "#1A1918" }}>
                  {product.minQuantity}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center", color: "#1A1918" }}>
                  {product.maxQuantity}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      backgroundColor: product.isPublished ? "#E8F5E9" : "#FEE2E2",
                      color: product.isPublished ? "#2C6E3F" : "#991B1B",
                    }}
                  >
                    {product.isPublished ? "Active" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "#8A8279" }}>
            No products found in inventory.
          </div>
        )}
      </div>
    </div>
  );
}
