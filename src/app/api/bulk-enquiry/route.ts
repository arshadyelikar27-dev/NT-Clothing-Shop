import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/bulk-enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productName,
      productId,
      quantity,
      size,
      color,
      businessName,
      whatsapp,
      gstNumber,
      location,
      message,
    } = body;

    if (!quantity?.trim() || !businessName?.trim() || !whatsapp?.trim() || !location?.trim()) {
      return NextResponse.json(
        { error: "Quantity, business name, WhatsApp number, and location are required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.bulkOrderEnquiry.create({
      data: {
        productName: productName?.trim() || null,
        productId: productId?.trim() || null,
        quantity: quantity.trim(),
        size: size?.trim() || null,
        color: color?.trim() || null,
        businessName: businessName.trim(),
        whatsapp: whatsapp.trim(),
        gstNumber: gstNumber?.trim() || null,
        location: location.trim(),
        message: message?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    console.error("Bulk enquiry error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
