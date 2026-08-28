import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role === "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;
    const videoUrl = formData.get("videoUrl") as string;

    if (!name || !priceStr || !categoryId) {
      return NextResponse.json(
        { error: "Product name, price, and category are required" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const uploadIfPresent = async (key: string): Promise<string | null> => {
      const file = formData.get(key) as File | null;
      if (!file || file.size === 0) return null;
      return await uploadToCloudinary(file, "noble-textile/products");
    };

    const imageFrontUrl = await uploadIfPresent("imageFront");
    const imageRightUrl = await uploadIfPresent("imageRight");
    const imageLeftUrl  = await uploadIfPresent("imageLeft");
    const imageBackUrl  = await uploadIfPresent("imageBack");

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

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description || name,
        sku,
        price,
        categoryId,
        videoUrl: videoUrl || null,
        stock: 100,
        isFeatured: false,
        images: {
          create: imagesToCreate,
        },
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
