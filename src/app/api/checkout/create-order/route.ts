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

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Customer name, email and mobile number are required" },
        { status: 400 }
      );
    }

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

    // 2. Save/Resolve Address
    const savedAddress = await prisma.address.create({
      data: {
        userId,
        fullName: customer.name.trim(),
        phone: customer.phone.trim(),
        altPhone: customer.altPhone?.trim() || null,
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

    // Add COD charge if applicable
    if (paymentMethod === "COD") {
      shippingCharge += 50;
    }

    const calculatedTotal = Math.round(calculatedSubtotal - discountAmount + shippingCharge);
    const orderNumber = generateOrderNumber();

    // 6. Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: savedAddress.id,
        status: paymentMethod === "COD" ? "CONFIRMED" : "PAYMENT_PENDING",
        subtotal: calculatedSubtotal,
        discount: discountAmount,
        shippingCharge,
        tax: Math.round(calculatedSubtotal * 0.05), // GST 5% included breakdown
        total: calculatedTotal,
        paymentMethod,
        deliveryMethod: deliveryMethod || "STANDARD",
        notes: notes?.trim() || null,
        estimatedDelivery:
          address.pinCode.startsWith("413") || address.pinCode.startsWith("41")
            ? "1-2 Business Days (Maharashtra)"
            : "3-5 Business Days",
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
        payment: {
          create: {
            method: paymentMethod,
            status: paymentMethod === "COD" ? "PENDING" : "PENDING",
            amount: calculatedTotal,
            currency: "INR",
          },
        },
        timeline: {
          create: [
            {
              status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
              message:
                paymentMethod === "COD"
                  ? "Order placed successfully with Cash on Delivery"
                  : "Order initiated, awaiting Razorpay payment verification",
            },
          ],
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    // 7. Deduct Inventory
    for (const item of validatedItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.unitType === "PER_METER" ? Math.ceil(item.quantity) : item.quantity,
          },
        },
      });
    }

    // 8. Razorpay Order Creation (if Online Payment)
    let razorpayOrderData = null;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (paymentMethod === "RAZORPAY") {
      if (razorpayKeyId && razorpayKeySecret) {
        try {
          const authString = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
          const rzRes = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${authString}`,
            },
            body: JSON.stringify({
              amount: calculatedTotal * 100, // in paise
              currency: "INR",
              receipt: order.orderNumber,
              notes: {
                orderNumber: order.orderNumber,
                store: "NOBLE TEXTILE Latur",
              },
            }),
          });

          if (rzRes.ok) {
            const rzOrder = await rzRes.json();
            await prisma.payment.update({
              where: { orderId: order.id },
              data: { gatewayOrderId: rzOrder.id },
            });
            razorpayOrderData = {
              id: rzOrder.id,
              amount: rzOrder.amount,
              currency: rzOrder.currency,
              keyId: razorpayKeyId,
            };
          }
        } catch (rzErr) {
          console.error("Razorpay API error:", rzErr);
        }
      }

      // If Razorpay keys not yet provided, provide a seamless simulated gateway order id for testing
      if (!razorpayOrderData) {
        const mockRzId = `order_sim_${Date.now()}`;
        await prisma.payment.update({
          where: { orderId: order.id },
          data: { gatewayOrderId: mockRzId },
        });
        razorpayOrderData = {
          id: mockRzId,
          amount: calculatedTotal * 100,
          currency: "INR",
          keyId: razorpayKeyId || "rzp_test_simulation",
        };
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: calculatedTotal,
      razorpayOrder: razorpayOrderData,
      isCOD: paymentMethod === "COD",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
