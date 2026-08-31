export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { AdminCategoriesClient, CategoryItem } from "./AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true, children: true } },
      parent: { select: { id: true, name: true, slug: true } },
      children: { select: { id: true, name: true, slug: true, isActive: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return <AdminCategoriesClient initialCategories={categories as CategoryItem[]} />;
}
