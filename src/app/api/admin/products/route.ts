import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role === "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      compareAtPrice,
      categoryId,
      fabric,
      weave,
      gsm,
      widthInches,
      careInstructions,
      unitType,
      stock,
      imageUrl,
      isFeatured,
      tags,
    } = body;

    if (!name || !price || !categoryId || !sku) {
      return NextResponse.json(
        { error: "Product name, SKU, price, and category are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    // Check unique SKU
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return NextResponse.json({ error: "A product with this SKU already exists" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description || name,
        shortDescription: shortDescription || null,
        sku: sku.trim().toUpperCase(),
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        categoryId,
        fabric: fabric || null,
        weave: weave || null,
        gsm: gsm || null,
        widthInches: widthInches || null,
        careInstructions: careInstructions || null,
        unitType: unitType || "PER_PIECE",
        stock: parseInt(stock) || 0,
        isFeatured: Boolean(isFeatured),
        tags: tags || null,
        images: {
          create: [
            {
              url: imageUrl || "/images/products/premium-cotton-fabric.jpg",
              alt: name,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
