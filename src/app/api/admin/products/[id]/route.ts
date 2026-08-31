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
    // delete related ProductImage, ProductVariant, and WholesaleTier records in the DB.
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
