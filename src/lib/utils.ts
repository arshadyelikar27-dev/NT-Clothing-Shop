

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}



export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const prefix = "NT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getDiscountPercentage(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}



export function getUnitLabel(unitType: string, quantity: number): string {
  switch (unitType) {
    case "PER_METER":
      return quantity === 1 ? "meter" : "meters";
    case "PER_SET":
      return quantity === 1 ? "set (combo)" : "sets (combo)";
    case "PER_PIECE":
    default:
      return quantity === 1 ? "piece" : "pieces";
  }
}

export interface ParsedPriceInfo {
  numericPrice: number;
  unitType: "PER_PIECE" | "PER_SET" | "PER_METER";
  comboLabel: string | null;
  packQuantity: number;
}

/**
 * Parses flexible price inputs such as "4 in 1000", "4 for 1000", "1000", "1000 for 4", etc.
 */
export function parsePriceAndCombo(
  input: string | number,
  fallbackUnit: "PER_PIECE" | "PER_SET" | "PER_METER" = "PER_PIECE"
): ParsedPriceInfo {
  if (typeof input === "number") {
    return {
      numericPrice: isNaN(input) ? 0 : input,
      unitType: fallbackUnit,
      comboLabel: null,
      packQuantity: 1,
    };
  }

  const clean = (input || "").trim();
  if (!clean) {
    return {
      numericPrice: 0,
      unitType: fallbackUnit,
      comboLabel: null,
      packQuantity: 1,
    };
  }

  // Check pattern "4 in 1000", "4 for 1000", "4 mein 1000", "4 in ₹1000", "4 @ 1000"
  const comboPattern1 = clean.match(/^([0-9]+)\s*(?:in|for|mein|pe|@|\/)\s*(?:rs\.?|₹)?\s*([0-9,.]+)/i);
  if (comboPattern1) {
    const qty = parseInt(comboPattern1[1]) || 1;
    const priceVal = parseFloat(comboPattern1[2].replace(/,/g, ""));
    return {
      numericPrice: isNaN(priceVal) ? 0 : priceVal,
      unitType: "PER_SET",
      comboLabel: `${qty} in ${priceVal}`,
      packQuantity: qty,
    };
  }

  // Check reverse pattern "1000 for 4", "1000 mein 4", "1000 in 4"
  const comboPattern2 = clean.match(/^(?:rs\.?|₹)?\s*([0-9,.]+)\s*(?:for|in|mein|pe|@|\/)\s*([0-9]+)/i);
  if (comboPattern2) {
    const priceVal = parseFloat(comboPattern2[1].replace(/,/g, ""));
    const qty = parseInt(comboPattern2[2]) || 1;
    return {
      numericPrice: isNaN(priceVal) ? 0 : priceVal,
      unitType: "PER_SET",
      comboLabel: `${qty} in ${priceVal}`,
      packQuantity: qty,
    };
  }

  // Plain numeric string e.g. "1000", "₹1,000", "350.50"
  const numStr = clean.replace(/[^0-9.]/g, "");
  const num = parseFloat(numStr);
  return {
    numericPrice: isNaN(num) ? 0 : num,
    unitType: fallbackUnit,
    comboLabel: null,
    packQuantity: 1,
  };
}
