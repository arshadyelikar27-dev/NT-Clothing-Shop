import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

// GET /api/admin/shipping
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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

    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });

    return NextResponse.json({
      shipping_base_charge: map["shipping_base_charge"] ?? "79",
      shipping_express_surcharge: map["shipping_express_surcharge"] ?? "70",
      shipping_cod_charge: map["shipping_cod_charge"] ?? "50",
      shipping_free_threshold: map["shipping_free_threshold"] ?? "0",
      cod_enabled: map["cod_enabled"] ?? "true",
      cod_max_amount: map["cod_max_amount"] ?? "10000",
      cod_serviceable_pincodes: map["cod_serviceable_pincodes"] ?? "",
    });
  } catch (error) {
    console.error("Admin shipping settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch shipping settings" }, { status: 500 });
  }
}

// POST /api/admin/shipping
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validKeys = [
      "shipping_base_charge",
      "shipping_express_surcharge",
      "shipping_cod_charge",
      "shipping_free_threshold",
      "cod_enabled",
      "cod_max_amount",
      "cod_serviceable_pincodes",
    ];

    const updates = validKeys.filter((key) => body[key] !== undefined);

    await Promise.all(
      updates.map((key) =>
        prisma.storeSetting.upsert({
          where: { key },
          update: { value: String(body[key]) },
          create: { key, value: String(body[key]) },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin shipping settings POST error:", error);
    return NextResponse.json({ error: "Failed to save shipping settings" }, { status: 500 });
  }
}
