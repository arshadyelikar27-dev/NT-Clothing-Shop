import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isPublished: true,
          isArchived: false,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { fabric: { contains: q, mode: "insensitive" } },
            { tags: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
        },
        take: 6,
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: q, mode: "insensitive" },
        },
        take: 4,
      }),
    ]);

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search query failed" },
      { status: 500 }
    );
  }
}
