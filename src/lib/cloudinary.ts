import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  "";

const apiKey = process.env.CLOUDINARY_API_KEY || "";

const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

/**
 * Checks whether Cloudinary credentials are fully present.
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

// Always configure Cloudinary with credentials (environment variables or verified defaults)
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * Upload a file buffer to Cloudinary and return the optimized public URL.
 * Images are auto-converted to WebP/AVIF and served via Cloudinary's global CDN.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder = "noble-textile/products/images"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const isVideo = mimeType.startsWith("video/");

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
        quality: "auto",
        fetch_format: "auto",
        invalidate: false,
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload stream error:", error);
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary using its public URL.
 */
export async function deleteFromCloudinary(url: string): Promise<boolean> {
  try {
    if (!url || !url.includes("res.cloudinary.com")) {
      return false;
    }

    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return false;

    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
    const resourceType = url.includes("/video/") ? "video" : "image";

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result.result === "ok";
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
}

export { cloudinary };
