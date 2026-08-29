import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, canManageProducts } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, newStock } = await request.json();

    if (!productId || newStock === undefined) {
      return NextResponse.json({ error: "Product ID and new stock value are required" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { stock: parseInt(newStock) },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
