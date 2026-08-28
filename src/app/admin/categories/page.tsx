export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Layers } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
            Category Management
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            {categories.length} active categories across store catalog
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#F3EFEA", borderBottom: "1px solid #E4DDD3", textAlign: "left", color: "#1A1918" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Category Name</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Slug</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Description</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "center" }}>Products Count</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid #F3EFEA" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1A1918" }}>
                  <Link href={`/category/${cat.slug}`} target="_blank" style={{ textDecoration: "none", color: "inherit" }}>
                    {cat.name} ↗
                  </Link>
                </td>
                <td style={{ padding: "14px 16px", color: "#8A8279" }}>{cat.slug}</td>
                <td style={{ padding: "14px 16px", color: "#8A8279" }}>{cat.description || "—"}</td>
                <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: 600 }}>
                  {cat._count.products}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      backgroundColor: cat.isActive ? "#E8F5E9" : "#FEE2E2",
                      color: cat.isActive ? "#2C6E3F" : "#991B1B",
                    }}
                  >
                    {cat.isActive ? "Active" : "Disabled"}
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

