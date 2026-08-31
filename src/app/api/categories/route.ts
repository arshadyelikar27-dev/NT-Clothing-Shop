import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
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
