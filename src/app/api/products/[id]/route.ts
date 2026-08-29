import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products/[slug] — used by QuickViewModal
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { name: true, slug: true } },
        variants: { where: { isActive: true }, orderBy: { type: "asc" } },
      },
    });

    if (!product || !product.isPublished || product.isArchived) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product by slug error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
