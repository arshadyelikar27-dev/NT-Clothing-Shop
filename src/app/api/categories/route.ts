import { NextResponse } from "next/server";
import { getCachedCategories } from "@/lib/cached-queries";

export const revalidate = 60;

export async function GET() {
  try {
    const categories = await getCachedCategories();
    return NextResponse.json(
      { categories },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json(
      { categories: [] },
      { headers: { "Cache-Control": "public, s-maxage=30" } }
    );
  }
}
