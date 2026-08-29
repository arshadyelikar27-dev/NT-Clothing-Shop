import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, canManageOrders } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !canManageOrders(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, trackingNumber, courierPartner, adminNotes } = body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (courierPartner !== undefined) updates.courierPartner = courierPartner;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    // If status changed, record a timeline event
    if (status && status !== order.status) {
      let timelineMsg = `Order status updated to ${status.replace(/_/g, " ")}`;
      if (trackingNumber) {
        timelineMsg += ` with tracking #${trackingNumber} via ${courierPartner || "Courier"}`;
      }

      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status,
          message: timelineMsg,
        },
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
