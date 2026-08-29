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

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;
    const videoFile = formData.get("videoFile") as File | null;
    const sizesStr = formData.get("sizes") as string | null;
    const colorNamesStr = formData.get("colorNames") as string | null;
    const isWholesaleStr = formData.get("isWholesale") as string | null;
    const isWholesale = isWholesaleStr === "true";
    const wholesaleTiersStr = formData.get("wholesaleTiers") as string | null;

    if (!name || !priceStr || !categoryId) {
      return NextResponse.json(
        { error: "Product name, price, and category are required" },
        { status: 400 }
      );
    }

    // Upload images to Supabase Storage
    const uploadIfPresent = async (key: string): Promise<string | null> => {
      const file = formData.get(key) as File | null;
      if (!file || file.size === 0) return null;
      return await uploadToSupabaseStorage(file, "NT-SHOP-MEDIA", "products");
    };

    const imageFrontUrl = await uploadIfPresent("imageFront");
    const imageRightUrl = await uploadIfPresent("imageRight");
    const imageLeftUrl  = await uploadIfPresent("imageLeft");
    const imageBackUrl  = await uploadIfPresent("imageBack");
    const uploadedVideoUrl = await uploadIfPresent("videoFile");

    if (!imageFrontUrl) {
      return NextResponse.json(
        { error: "Front Image is required" },
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

    const sizes = sizesStr ? JSON.parse(sizesStr) : [];
    const colorNames = colorNamesStr ? JSON.parse(colorNamesStr) : [];

    const variantsToCreate: any[] = [];
    sizes.forEach((s: string) => {
      variantsToCreate.push({
        name: "Size",
        type: "SIZE",
        value: s,
      });
    });

    for (let i = 0; i < colorNames.length; i++) {
      const colorFileUrl = await uploadIfPresent(`colorImage_${i}`);
      if (colorFileUrl) {
        variantsToCreate.push({
          name: "Color",
          type: "COLOR",
          value: colorNames[i],
          imageUrl: colorFileUrl,
        });
      }
    }

    const tags = isWholesale ? "WHOLESALE" : null;
    const wholesaleTiers = wholesaleTiersStr ? JSON.parse(wholesaleTiersStr) : [];

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
        ...(wholesaleTiers.length > 0 && {
          wholesalePrices: {
            create: wholesaleTiers.map((t: any) => ({
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
