import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer,
      address,
      items,
      paymentMethod,
      deliveryMethod,
      notes,
    } = body;



    if (!address?.house || !address?.street || !address?.city || !address?.state || !address?.pinCode) {
      return NextResponse.json(
        { error: "Complete shipping address with PIN code is required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Verify Authenticated User
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in or register before placing an order." },
        { status: 401 }
      );
    }

    const userId = session.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.name || !user.phone) {
      return NextResponse.json(
        { error: "User profile is incomplete. Name and phone are required." },
        { status: 400 }
      );
    }

    // 2. Save/Resolve Address
    const savedAddress = await prisma.address.create({
      data: {
        userId,
        fullName: user.name.trim(),
        phone: user.phone.trim(),
        altPhone: customer?.altPhone?.trim() || null,
        house: address.house.trim(),
        street: address.street.trim(),
        area: address.area?.trim() || address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pinCode: address.pinCode.trim(),
        landmark: address.landmark?.trim() || null,
        type: address.type || "HOME",
        isDefault: false,
      },
    });

    // 3. Re-verify all item prices server-side
    let calculatedSubtotal = 0;
    const validatedItems: Array<{
      productId: string;
      variantId?: string;
      name: string;
      sku: string;
      price: number;
      quantity: number;
      unitType: string;
      total: number;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isPublished || product.isArchived) {
        return NextResponse.json(
          { error: `Product "${item.name}" is no longer available` },
          { status: 400 }
        );
      }

      let unitPrice = product.price;
      let sku = product.sku;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          if (variant.price) unitPrice = variant.price;
          if (variant.sku) sku = variant.sku;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variantId || undefined,
        name: product.name,
        sku,
        price: unitPrice,
        quantity: item.quantity,
        unitType: product.unitType,
        total: itemTotal,
      });
    }

    let discountAmount = 0;

    // 5. Calculate Shipping
    let shippingCharge = 79;
    if (deliveryMethod === "EXPRESS") {
      shippingCharge += 70; // Express surcharge
    }

    // Removed COD charge

    const calculatedTotal = Math.round(calculatedSubtotal - discountAmount + shippingCharge);
    const orderNumber = generateOrderNumber();

    // 6. Create Order + Deduct Stock in a SINGLE TRANSACTION (prevents overselling race conditions)
    const order = await prisma.$transaction(async (tx) => {
      // Verify stock availability inside transaction
      for (const item of validatedItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true },
        });
        const needed = item.unitType === "PER_METER" ? Math.ceil(item.quantity) : item.quantity;
        if (!product || product.stock < needed) {
          throw new Error(`"${product?.name || item.name}" is out of stock or has insufficient quantity.`);
        }
      }

      // Create the order
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: savedAddress.id,
          status: "PENDING",
          subtotal: calculatedSubtotal,
          discount: discountAmount,
          shippingCharge,
          tax: Math.round(calculatedSubtotal * 0.05), // GST 5% included breakdown
          total: calculatedTotal,
          paymentMethod: "OFFLINE",
          deliveryMethod: deliveryMethod || "STANDARD",
          notes: notes?.trim() || null,
          estimatedDelivery: "7-10 Days",
          items: {
            create: validatedItems.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              name: i.name,
              sku: i.sku,
              price: i.price,
              quantity: i.quantity,
              unitType: i.unitType,
              total: i.total,
            })),
          },
        },
        include: {
          items: true,
          address: true,
        },
      });

      // Deduct inventory inside same transaction
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.unitType === "PER_METER" ? Math.ceil(item.quantity) : item.quantity,
            },
          },
        });
      }

      return created;
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalAmount: calculatedTotal,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
