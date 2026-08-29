import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, canManageProducts } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { uploadToSupabaseStorage } from "@/lib/supabase-storage";

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
      price: priceStr,
      categoryId,
      imageFrontUrl,
      imageRightUrl,
      imageLeftUrl,
      imageBackUrl,
      videoUrl: uploadedVideoUrl,
      sizes,
      colors,
      isWholesale,
      wholesaleTiers
    } = body;

    if (!name || !priceStr || !categoryId || !imageFrontUrl) {
      return NextResponse.json(
        { error: "Product name, price, category, and front image are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);
    const sku = "NT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const price = parseFloat(priceStr);

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

    const tags = isWholesale ? "WHOLESALE" : null;

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description || name,
        sku,
        price,
        categoryId,
        videoUrl: uploadedVideoUrl || null,
        stock: 100,
        isFeatured: false,
        tags,
        images: {
          create: imagesToCreate,
        },
        ...(variantsToCreate.length > 0 && {
          variants: {
            create: variantsToCreate,
          },
        }),
        ...((wholesaleTiers || []).length > 0 && {
          wholesalePrices: {
            create: (wholesaleTiers || []).map((t: any) => ({
              minQty: t.minQty,
              price: t.price,
            })),
          },
        }),
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
