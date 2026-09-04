import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, canManageProducts } from "@/lib/auth";
import { deleteFromSupabaseStorage } from "@/lib/supabase-storage";
import { deleteFromCloudinary } from "@/lib/cloudinary";

async function deleteMediaUrl(url: string | null | undefined): Promise<boolean> {
  if (!url) return false;
  if (url.includes("res.cloudinary.com")) {
    return deleteFromCloudinary(url);
  }
  return deleteFromSupabaseStorage(url);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch product to get image and video URLs before deletion
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true, // Some variants might have images (like color swatches)
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 1. Delete all associated images from Cloudinary or Supabase Storage
    const deletePromises: Promise<boolean>[] = [];

    // Main product images
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img.url) {
          deletePromises.push(deleteMediaUrl(img.url));
        }
      });
    }

    // Variant images (e.g. Color images)
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        if (variant.imageUrl) {
          deletePromises.push(deleteMediaUrl(variant.imageUrl));
        }
      });
    }

    // Product Video
    if (product.videoUrl) {
      deletePromises.push(deleteMediaUrl(product.videoUrl));
    }

    // Execute all storage deletion requests in parallel
    await Promise.allSettled(deletePromises);

    // 2. Delete product from database
    // Because of Prisma relations (onDelete: Cascade), this will automatically 
    // delete related ProductImage and ProductVariant records in the DB.
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product and media deleted successfully" });
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

import { parsePriceAndCombo, slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const parsed = parsePriceAndCombo(priceInput, explicitUnitType || "PER_PIECE");
    const price = parsed.numericPrice;

    if (!price || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const unitType = explicitUnitType || parsed.unitType || "PER_PIECE";
    const shortDescription = customShortDesc || parsed.comboLabel || null;
    const compareAtPrice = compareAtPriceInput ? parseFloat(compareAtPriceInput) : null;
    const slug = slugify(name);
    
    const deliveryCharge = deliveryChargeInput !== null && deliveryChargeInput !== undefined && deliveryChargeInput !== ""
      ? parseFloat(deliveryChargeInput)
      : null;

    // Update the basic fields
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        description: description || name,
        shortDescription,
        price,
        compareAtPrice,
        unitType,
        categoryId,
        videoUrl: uploadedVideoUrl || null,
        deliveryCharge: deliveryCharge === null || isNaN(deliveryCharge) ? null : deliveryCharge,
      }
    });

    // Handle Image updates if a new front image was uploaded
    // To keep this robust and avoid deleting everything on minor edits,
    // we assume existing images are kept unless overwritten.
    // If we wanted to perfectly sync, we would delete existing and re-create.
    
    if (imageFrontUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      const imagesToCreate = [];
      if (imageFrontUrl) imagesToCreate.push({ url: imageFrontUrl, alt: `${name} Front`, sortOrder: 0, isPrimary: true, productId: id });
      if (imageRightUrl) imagesToCreate.push({ url: imageRightUrl, alt: `${name} Right`, sortOrder: 1, isPrimary: false, productId: id });
      if (imageLeftUrl)  imagesToCreate.push({ url: imageLeftUrl,  alt: `${name} Left`,  sortOrder: 2, isPrimary: false, productId: id });
      if (imageBackUrl)  imagesToCreate.push({ url: imageBackUrl,  alt: `${name} Back`,  sortOrder: 3, isPrimary: false, productId: id });
      
      await prisma.productImage.createMany({ data: imagesToCreate });
    }

    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath(`/product/${slug}`);

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}
