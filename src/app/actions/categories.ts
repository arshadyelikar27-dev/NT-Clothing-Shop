"use server";

import { prisma } from "@/lib/db";

export async function getCategoriesAction() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
}
