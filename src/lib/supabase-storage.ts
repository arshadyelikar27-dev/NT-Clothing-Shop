import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Prefer service role key on server for elevated storage permissions, fall back to anon key
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/**
 * Checks whether Supabase Storage credentials are configured.
 */
export function isSupabaseStorageConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a Buffer to Supabase Storage and return the public URL.
 * @param buffer - Buffer of the file
 * @param mimeType - Content type (e.g. image/jpeg, video/mp4)
 * @param bucket - The Supabase Storage bucket name (default: "nt-shop-media")
 * @param folder - Folder path inside the bucket (default: "products")
 */
export async function uploadBufferToSupabase(
  buffer: Buffer,
  mimeType: string,
  bucket = "nt-shop-media",
  folder = "products"
): Promise<string> {
  if (!isSupabaseStorageConfigured()) {
    throw new Error("Supabase Storage URL or Key is not configured in environment variables.");
  }

  const isVideo = mimeType.startsWith("video/");
  const subfolder = isVideo ? `${folder}/videos` : `${folder}/images`;

  // Determine file extension
  let fileExt = "jpg";
  if (mimeType.includes("png")) fileExt = "png";
  else if (mimeType.includes("webp")) fileExt = "webp";
  else if (mimeType.includes("avif")) fileExt = "avif";
  else if (mimeType.includes("mp4")) fileExt = "mp4";
  else if (mimeType.includes("webm")) fileExt = "webm";
  else if (mimeType.includes("mov") || mimeType.includes("quicktime")) fileExt = "mov";

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${subfolder}/${fileName}`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: mimeType,
      cacheControl: "31536000",
      upsert: true,
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage using its public URL.
 * @param fileUrl - The public URL of the file to delete
 * @param bucket - The Supabase Storage bucket name (default: "nt-shop-media")
 */
export async function deleteFromSupabaseStorage(
  fileUrl: string,
  bucket = "nt-shop-media"
): Promise<boolean> {
  if (!isSupabaseStorageConfigured() || !fileUrl) return false;

  try {
    const baseUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
    if (!fileUrl.startsWith(baseUrl)) {
      // If URL has query params or custom Supabase domain
      const urlObj = new URL(fileUrl);
      const match = urlObj.pathname.match(new RegExp(`/storage/v1/object/public/${bucket}/(.+)`));
      if (!match || !match[1]) return false;
      const filePath = match[1];
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      return !error;
    }

    const filePath = fileUrl.replace(baseUrl, "");
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Supabase Storage Delete Error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to delete from Supabase:", error);
    return false;
  }
}
