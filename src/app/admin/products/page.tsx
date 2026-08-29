export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Package, Edit } from "lucide-react";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function AdminProductsPage() {
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
            Product Catalog
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            {products.length} textiles & clothing items in catalog
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href="/admin/products/new"
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={14} /> Add Retail Product
          </Link>
          <Link
            href="/admin/wholesale/products/new"
            className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={14} /> Add Wholesale Product
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Product</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Category</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Unit Type</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Fabric / Material</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Stock</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Price</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Actions</th>
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
                    decoding="async"
                    style={{ width: "40px", height: "50px", objectFit: "cover", backgroundColor: "#F3EFEA" }}
                  />
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      style={{ fontWeight: 500, color: "#1A1918", textDecoration: "none", display: "block" }}
                    >
                      {product.name}
                    </Link>
                    <span style={{ fontSize: "11px", color: "#8A8279" }}>SKU: {product.sku}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#1A1918" }}>{product.category.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 6px",
                      backgroundColor: "#F3EFEA",
                      color: "#1A1918",
                    }}
                  >
                    {product.unitType === "PER_METER" ? "Per Meter" : product.unitType === "PER_SET" ? "Per Set" : "Per Piece"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#8A8279" }}>{product.fabric || "—"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: product.stock <= 10 ? "#B91C1C" : "#1A1918",
                    }}
                  >
                    {product.stock} {product.unitType === "PER_METER" ? "m" : "pcs"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>
                  {formatPrice(product.price)}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      backgroundColor: product.isPublished ? "#E8F5E9" : "#FEE2E2",
                      color: product.isPublished ? "#2C6E3F" : "#991B1B",
                    }}
                  >
                    {product.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

