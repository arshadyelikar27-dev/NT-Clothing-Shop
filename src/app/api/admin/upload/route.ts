import { NextRequest, NextResponse } from "next/server";
import { getSession, canManageProducts } from "@/lib/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { uploadBufferToSupabase, isSupabaseStorageConfigured } from "@/lib/supabase-storage";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // File type validation
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only image and video files are allowed" },
        { status: 400 }
      );
    }

    // File size validation: 15MB for images, 100MB for videos
    const maxSize = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max: ${isVideo ? "100MB for videos" : "15MB for images"}` },
        { status: 413 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Organized folder: images → noble-textile/products/images, videos → noble-textile/products/videos
    const folder = isVideo
      ? "noble-textile/products/videos"
      : "noble-textile/products/images";

    let url: string | null = null;
    let uploadError: any = null;

    // 1. Try Cloudinary first if configured
    if (isCloudinaryConfigured()) {
      try {
        url = await uploadToCloudinary(buffer, file.type, folder);
      } catch (err: any) {
        console.warn("Cloudinary upload failed, attempting fallback to Supabase Storage:", err?.message);
        uploadError = err;
      }
    }

    // 2. Fallback to Supabase Storage if Cloudinary is not configured or failed
    if (!url && isSupabaseStorageConfigured()) {
      try {
        url = await uploadBufferToSupabase(buffer, file.type, "nt-shop-media", "products");
      } catch (err: any) {
        console.error("Supabase Storage fallback also failed:", err?.message);
        uploadError = err;
      }
    }

    // 3. If no storage provider was able to upload
    if (!url) {
      if (!isCloudinaryConfigured() && !isSupabaseStorageConfigured()) {
        return NextResponse.json(
          {
            error:
              "Media storage is not configured. Please add CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, and CLOUDINARY_API_SECRET (or Supabase Storage credentials) to your Vercel Project Environment Variables.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: uploadError?.message || "Upload failed across configured storage providers.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
