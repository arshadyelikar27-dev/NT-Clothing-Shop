import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession, canManageProducts } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/admin/categories - List all categories with product counts and hierarchy
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true, children: true } },
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true, isActive: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug: customSlug,
      description,
      image,
      parentId,
      sortOrder,
      isActive,
    } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    let finalSlug = customSlug && typeof customSlug === "string" && customSlug.trim() !== ""
      ? slugify(customSlug)
      : slugify(trimmedName);

    if (!finalSlug) {
      finalSlug = `cat-${Date.now()}`;
    }

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Category with slug "${finalSlug}" already exists. Please choose a different name or slug.` },
        { status: 409 }
      );
    }

    // Verify parentId if supplied
    let validParentId: string | null = null;
    if (parentId && typeof parentId === "string" && parentId.trim() !== "") {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (parentCategory) {
        validParentId = parentId;
      }
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        slug: finalSlug,
        description: description?.trim() || null,
        image: image?.trim() || null,
        parentId: validParentId,
        sortOrder: typeof sortOrder === "number" ? sortOrder : parseInt(sortOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      include: {
        _count: { select: { products: true, children: true } },
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true, isActive: true } },
      },
    });

    // Invalidate Next.js caches
    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/admin/categories");
      revalidatePath(`/category/${finalSlug}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("Category creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
