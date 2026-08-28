export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { BackButton } from "@/components/ui/BackButton";
import { AdminProductForm } from "./AdminProductForm";

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "24px" }}>
        <BackButton 
          label="Back to Products" 
          fallbackUrl="/admin/products"
          className="mb-2 text-[#8A8279]"
        />
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

