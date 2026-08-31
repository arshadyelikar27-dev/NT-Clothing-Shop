import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a File object to Supabase Storage and return the public URL.
 * @param file - The File/Blob to upload
 * @param bucket - The Supabase Storage bucket name (default: "nt-shop-media")
 * @param folder - Folder path inside the bucket (default: "products")
 */
export async function uploadToSupabaseStorage(
  file: File,
  bucket = "nt-shop-media",
  folder = "products"
): Promise<string> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is not configured.");
  }

  // Auto-detect if it's a video or image, use organized subfolders
  const isVideo = file.type.startsWith("video/");
  const subfolder = isVideo ? `${folder}/videos` : `${folder}/images`;

  // Generate a unique filename using timestamp and random string
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${subfolder}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "31536000", // 1 year — uploaded files don't change
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  // Get the public URL for the uploaded file
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
  if (!supabaseUrl || !supabaseKey || !fileUrl) return false;

  try {
    // Extract the file path from the public URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[folder]/[filename]
    const baseUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
    if (!fileUrl.startsWith(baseUrl)) {
      console.warn(`URL does not match expected Supabase storage format: ${fileUrl}`);
      return false;
    }

    const filePath = fileUrl.replace(baseUrl, "");
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

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
