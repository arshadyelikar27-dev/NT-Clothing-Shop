import { NextRequest, NextResponse } from "next/server";
import { getSession, canManageProducts } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

    // Convert file to Buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Organized folder: images → noble-textile/products/images, videos → noble-textile/products/videos
    const folder = isVideo
      ? "noble-textile/products/videos"
      : "noble-textile/products/images";

    // Upload to Cloudinary — auto WebP/AVIF conversion + global CDN
    const url = await uploadToCloudinary(buffer, file.type, folder);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
