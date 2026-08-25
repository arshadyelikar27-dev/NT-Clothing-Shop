import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role === "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, type, value, minCartValue, maxDiscount, usageLimit } = await request.json();

    if (!code || !value) {
      return NextResponse.json({ error: "Coupon code and discount value are required" }, { status: 400 });
    }

    const created = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type: type || "PERCENTAGE",
        value: parseFloat(value),
        minCartValue: minCartValue ? parseFloat(minCartValue) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, coupon: created }, { status: 201 });
  } catch (error) {
    console.error("Coupon creation error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
