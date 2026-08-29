import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// POST /api/wholesale/register
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check if already applied
    const existing = await prisma.wholesaleProfile.findUnique({
      where: { userId: session.userId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a wholesale application", status: existing.status },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { businessName, shopName, gstNumber, businessAddress, whatsapp, interestedCategories } = body;

    if (!businessName?.trim() || !businessAddress?.trim() || !whatsapp?.trim()) {
      return NextResponse.json(
        { error: "Business name, address, and WhatsApp number are required" },
        { status: 400 }
      );
    }

    const profile = await prisma.wholesaleProfile.create({
      data: {
        userId: session.userId,
        businessName: businessName.trim(),
        shopName: shopName?.trim() || null,
        gstNumber: gstNumber?.trim() || null,
        businessAddress: businessAddress.trim(),
        whatsapp: whatsapp.trim(),
        interestedCategories: interestedCategories
          ? JSON.stringify(interestedCategories)
          : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Wholesale register error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
