import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/shipping/calculate?pincode=&subtotal=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("pincode") || "";
    const subtotal = parseFloat(searchParams.get("subtotal") || "0");
    const paymentMethod = searchParams.get("paymentMethod") || "RAZORPAY";
    const deliveryMethod = searchParams.get("deliveryMethod") || "STANDARD";

    // Fetch shipping settings from DB
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: {
          in: [
            "shipping_base_charge",
            "shipping_express_surcharge",
            "shipping_cod_charge",
            "shipping_free_threshold",
            "cod_enabled",
            "cod_max_amount",
            "cod_serviceable_pincodes",
          ],
        },
      },
    });

    const getSetting = (key: string, fallback: string) =>
      settings.find((s) => s.key === key)?.value ?? fallback;

    const baseCharge = parseFloat(getSetting("shipping_base_charge", "79"));
    const expressSurcharge = parseFloat(getSetting("shipping_express_surcharge", "70"));
    const codCharge = parseFloat(getSetting("shipping_cod_charge", "50"));
    const freeThreshold = parseFloat(getSetting("shipping_free_threshold", "0"));
    const codEnabled = getSetting("cod_enabled", "true") === "true";
    const codMaxAmount = parseFloat(getSetting("cod_max_amount", "10000"));
    const codPincodes = getSetting("cod_serviceable_pincodes", "");

    // Calculate shipping
    let shippingCharge = baseCharge;
    let isFreeShipping = false;

    if (freeThreshold > 0 && subtotal >= freeThreshold) {
      shippingCharge = 0;
      isFreeShipping = true;
    }

    if (!isFreeShipping && deliveryMethod === "EXPRESS") {
      shippingCharge += expressSurcharge;
    }

    // COD availability check
    let codAvailable = codEnabled;
    let codUnavailableReason = "";

    if (codEnabled && codPincodes) {
      const serviceablePincodes = codPincodes
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      if (serviceablePincodes.length > 0 && !serviceablePincodes.includes(pincode)) {
        codAvailable = false;
        codUnavailableReason = "COD is not available for this pincode";
      }
    }

    if (codEnabled && subtotal > codMaxAmount) {
      codAvailable = false;
      codUnavailableReason = `COD is not available for orders above ₹${codMaxAmount}`;
    }

    const codFinalCharge = codAvailable ? codCharge : 0;
    const totalWithCOD = shippingCharge + (paymentMethod === "COD" ? codFinalCharge : 0);

    return NextResponse.json({
      shippingCharge,
      codCharge: codAvailable ? codFinalCharge : 0,
      totalShipping: paymentMethod === "COD" ? totalWithCOD : shippingCharge,
      isFreeShipping,
      codAvailable,
      codUnavailableReason,
      freeThreshold,
    });
  } catch (error) {
    console.error("Shipping calculate error:", error);
    return NextResponse.json(
      { shippingCharge: 79, codCharge: 50, totalShipping: 79, codAvailable: true },
    );
  }
}
