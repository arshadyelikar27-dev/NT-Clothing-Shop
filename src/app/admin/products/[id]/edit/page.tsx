import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminProductForm } from "../../new/AdminProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    }
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918", marginBottom: "8px" }}>
          Edit Product
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8279" }}>
          Update the details for "{product.name}".
        </p>
      </div>
      <AdminProductForm categories={categories} initialData={product} />
    </div>
  );
}
