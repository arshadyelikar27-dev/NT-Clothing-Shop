import { AdminWholesaleProductForm } from "./AdminWholesaleProductForm";
import { prisma } from "@/lib/db";
import { BackButton } from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

export default async function NewWholesaleProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "24px" }}>
        <BackButton fallbackUrl="/admin/products" />
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "28px",
            fontWeight: 500,
            color: "#1A1918",
            marginTop: "16px",
          }}
        >
          Add New Wholesale Product
        </h1>
        <p style={{ color: "#8A8279", marginTop: "4px" }}>
          Create a new product specifically designed for wholesale customers, with bulk pricing tiers.
        </p>
      </div>

      <AdminWholesaleProductForm categories={categories} />
    </div>
  );
}
