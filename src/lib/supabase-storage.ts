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

  // Generate a unique filename using timestamp and random string
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
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
