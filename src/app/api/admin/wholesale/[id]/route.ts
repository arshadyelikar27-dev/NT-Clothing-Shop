import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

// PATCH /api/admin/wholesale/[id]
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
    const { status, adminNote } = body;

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const profile = await prisma.wholesaleProfile.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote?.trim() || null,
        reviewedAt: new Date(),
      },
    });

    // If approved, update user role to WHOLESALE
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: profile.userId },
        data: { role: "WHOLESALE" },
      });
    } else if (status === "REJECTED") {
      // Revert to CUSTOMER if was wholesale
      await prisma.user.update({
        where: { id: profile.userId },
        data: { role: "CUSTOMER" },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Admin wholesale update error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
