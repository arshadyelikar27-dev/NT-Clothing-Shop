"use server";

import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth";

export async function getShippingSettingsAction() {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    throw new Error("Unauthorized");
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

  return {
    shipping_base_charge: map["shipping_base_charge"] ?? "79",
    shipping_express_surcharge: map["shipping_express_surcharge"] ?? "70",
    shipping_cod_charge: map["shipping_cod_charge"] ?? "50",
    shipping_free_threshold: map["shipping_free_threshold"] ?? "0",
    cod_enabled: map["cod_enabled"] ?? "true",
    cod_max_amount: map["cod_max_amount"] ?? "10000",
    cod_serviceable_pincodes: map["cod_serviceable_pincodes"] ?? "",
  };
}

export async function saveShippingSettingsAction(body: any) {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) {
    throw new Error("Unauthorized");
  }

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

  return { success: true };
}
