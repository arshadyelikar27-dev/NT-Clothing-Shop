import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

// PATCH /api/admin/reviews/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // "approve" | "reject" | "hide" | "unhide"

    const updateData: Record<string, boolean> = {};

    if (action === "approve") {
      updateData.isApproved = true;
      updateData.isHidden = false;
    } else if (action === "reject") {
      updateData.isApproved = false;
      updateData.isHidden = false;
    } else if (action === "hide") {
      updateData.isHidden = true;
    } else if (action === "unhide") {
      updateData.isHidden = false;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Admin review update error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE /api/admin/reviews/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin review delete error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
