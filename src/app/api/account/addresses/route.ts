import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        fullName: data.fullName,
        phone: data.phone,
        altPhone: data.altPhone || null,
        house: data.house,
        street: data.street,
        area: data.area || null,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        landmark: data.landmark || null,
        type: data.type || "HOME",
        isDefault: data.isDefault || false,
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.address.findUnique({ where: { id: data.id } });
    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    const address = await prisma.address.update({
      where: { id: data.id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        altPhone: data.altPhone || null,
        house: data.house,
        street: data.street,
        area: data.area || null,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        landmark: data.landmark || null,
        type: data.type || "HOME",
        isDefault: data.isDefault || false,
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
