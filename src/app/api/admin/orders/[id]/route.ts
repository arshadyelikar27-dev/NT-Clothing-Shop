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
      const statusMessages: Record<string, string> = {
        CONFIRMED: "Order confirmed by store. Your fabric is being prepared.",
        PROCESSING: "Your order is being processed and packed.",
        PAYMENT_RECEIVED: "Payment received. Order will be dispatched soon.",
        SHIPPED: trackingNumber
          ? `Order shipped via ${courierPartner || "Courier"} — Tracking #${trackingNumber}`
          : "Order has been handed over to the courier.",
        OUT_FOR_DELIVERY: "Your order is out for delivery today.",
        DELIVERED: "Order delivered successfully. Thank you for shopping with Noble Textile!",
        CANCELLED: "Order has been cancelled.",
        RETURNED: "Order return has been initiated.",
      };

      const timelineMsg =
        statusMessages[status] ||
        `Order status updated to ${status.replace(/_/g, " ")}`;

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
