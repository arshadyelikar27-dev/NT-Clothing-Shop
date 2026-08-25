import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminProductForm } from "./AdminProductForm";

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/admin/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#8A8279",
            textDecoration: "none",
            marginBottom: "8px",
          }}
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
          Add New Textile / Product
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8279" }}>
          Configure pricing, unit calculations (meterage vs piece), and fabric specifications
        </p>
      </div>

      <AdminProductForm categories={categories} />
    </div>
  );
}
