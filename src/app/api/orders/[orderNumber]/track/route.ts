import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

// GET /api/orders/[orderNumber]/track
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        timeline: { orderBy: { createdAt: "asc" } },
        items: {
          include: {
            product: {
              select: { 
                name: true, 
                slug: true,
                images: { take: 1, orderBy: { sortOrder: "asc" } }
              },
            },
          },
        },
        address: {
          select: { fullName: true, city: true, state: true, pinCode: true },
        },
        payment: { select: { status: true, method: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const session = await getSession();
    if (!session || (session.userId !== order.userId && !isAdmin(session.role))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
