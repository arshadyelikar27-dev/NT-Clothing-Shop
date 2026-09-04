import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession, canManageProducts } from "@/lib/auth";
import { slugify, parsePriceAndCombo } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      shortDescription: customShortDesc,
      price: priceInput,
      compareAtPrice: compareAtPriceInput,
      unitType: explicitUnitType,
      categoryId,
      imageFrontUrl,
      imageRightUrl,
      imageLeftUrl,
      imageBackUrl,
      videoUrl: uploadedVideoUrl,
      sizes,
      colors,
      deliveryCharge: deliveryChargeInput,
    } = body;

    if (!name || !priceInput || !categoryId || !imageFrontUrl) {
      return NextResponse.json(
        { error: "Product name, price, category, and front image are required" },
        { status: 400 }
      );
    }

    // Smart parse price (handles "4 in 1000", "1000", "4 for 1000", etc.)
    const parsed = parsePriceAndCombo(priceInput, explicitUnitType || "PER_PIECE");
    const price = parsed.numericPrice;

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: "Please enter a valid price (e.g. 1000 or '4 in 1000')" },
        { status: 400 }
      );
    }

    const unitType = explicitUnitType || parsed.unitType || "PER_PIECE";
    const shortDescription = customShortDesc || parsed.comboLabel || null;
    const compareAtPrice = compareAtPriceInput ? parseFloat(compareAtPriceInput) : null;

    const slug = slugify(name);
    const sku = "NT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const imagesToCreate = [];
    if (imageFrontUrl) imagesToCreate.push({ url: imageFrontUrl, alt: `${name} Front`, sortOrder: 0, isPrimary: true });
    if (imageRightUrl) imagesToCreate.push({ url: imageRightUrl, alt: `${name} Right`, sortOrder: 1, isPrimary: false });
    if (imageLeftUrl)  imagesToCreate.push({ url: imageLeftUrl,  alt: `${name} Left`,  sortOrder: 2, isPrimary: false });
    if (imageBackUrl)  imagesToCreate.push({ url: imageBackUrl,  alt: `${name} Back`,  sortOrder: 3, isPrimary: false });

    const variantsToCreate: any[] = [];
    if (sizes && Array.isArray(sizes)) {
      sizes.forEach((s: string) => {
        variantsToCreate.push({
          name: "Size",
          type: "SIZE",
          value: s,
        });
      });
    }

    if (colors && Array.isArray(colors)) {
      colors.forEach((c: any) => {
        if (c.imageUrl) {
          variantsToCreate.push({
            name: "Color",
            type: "COLOR",
            value: c.name,
            imageUrl: c.imageUrl,
          });
        }
      });
    }

    const tagList: string[] = [];
    if (parsed.comboLabel || unitType === "PER_SET") tagList.push("COMBO");
    const tags = tagList.length > 0 ? tagList.join(",") : null;

    const deliveryCharge = deliveryChargeInput !== null && deliveryChargeInput !== undefined
      ? parseFloat(deliveryChargeInput)
      : null;

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description || name,
        shortDescription,
        sku,
        price,
        compareAtPrice,
        unitType,
        categoryId,
        videoUrl: uploadedVideoUrl || null,
        isFeatured: false,
        tags,
        deliveryCharge: isNaN(deliveryCharge as number) ? null : deliveryCharge,
        images: {
          create: imagesToCreate,
        },
        ...(variantsToCreate.length > 0 && {
          variants: {
            create: variantsToCreate,
          },
        }),
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath(`/product/${slug}`);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}
