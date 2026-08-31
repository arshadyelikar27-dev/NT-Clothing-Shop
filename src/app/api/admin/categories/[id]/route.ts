import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession, canManageProducts } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// Helper to check if potentialParentId is a descendant of categoryId
async function isDescendant(categoryId: string, potentialParentId: string): Promise<boolean> {
  if (categoryId === potentialParentId) return true;
  let currentId: string | null = potentialParentId;
  while (currentId) {
    const parent: { parentId: string | null } | null = await prisma.category.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });
    if (!parent || !parent.parentId) break;
    if (parent.parentId === categoryId) return true;
    currentId = parent.parentId;
  }
  return false;
}

// GET /api/admin/categories/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true, children: true } },
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true, isActive: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/categories/[id] - Edit category
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData: any = {};

    // 1. Name update
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim() === "") {
        return NextResponse.json({ error: "Category name cannot be empty" }, { status: 400 });
      }
      updateData.name = body.name.trim();
    }

    // 2. Slug update
    if (body.slug !== undefined) {
      let nextSlug = slugify(body.slug);
      if (!nextSlug && updateData.name) {
        nextSlug = slugify(updateData.name);
      }
      if (!nextSlug) {
        nextSlug = existingCategory.slug;
      }

      if (nextSlug !== existingCategory.slug) {
        const slugConflict = await prisma.category.findFirst({
          where: {
            slug: nextSlug,
            id: { not: id },
          },
        });
        if (slugConflict) {
          return NextResponse.json(
            { error: `Slug "${nextSlug}" is already in use by category "${slugConflict.name}".` },
            { status: 409 }
          );
        }
        updateData.slug = nextSlug;
      }
    }

    // 3. Description update
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    // 4. Image update
    if (body.image !== undefined) {
      updateData.image = body.image?.trim() || null;
    }

    // 5. Parent Category update
    if (body.parentId !== undefined) {
      const pId = body.parentId?.trim() || null;
      if (pId === id) {
        return NextResponse.json(
          { error: "A category cannot be its own parent category." },
          { status: 400 }
        );
      }

      if (pId) {
        const isDesc = await isDescendant(id, pId);
        if (isDesc) {
          return NextResponse.json(
            { error: "Cannot set a child subcategory as parent (circular dependency)." },
            { status: 400 }
          );
        }
      }
      updateData.parentId = pId;
    }

    // 6. Sort Order update
    if (body.sortOrder !== undefined) {
      updateData.sortOrder = typeof body.sortOrder === "number" ? body.sortOrder : parseInt(body.sortOrder) || 0;
    }

    // 7. Active Status update
    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: { select: { products: true, children: true } },
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true, isActive: true } },
      },
    });

    // Revalidate Next.js paths
    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/admin/categories");
      revalidatePath(`/category/${existingCategory.slug}`);
      if (updatedCategory.slug !== existingCategory.slug) {
        revalidatePath(`/category/${updatedCategory.slug}`);
      }
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error: any) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete category
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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if category has any products attached
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete "${category.name}" because it has ${productCount} product(s) associated with it. Please reassign or delete the products first.`,
          productCount,
        },
        { status: 400 }
      );
    }

    // Unparent any child categories safely so they don't break
    await prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });

    // Delete category from database
    await prisma.category.delete({
      where: { id },
    });

    // Revalidate paths
    try {
      revalidatePath("/", "layout");
      revalidatePath("/shop");
      revalidatePath("/admin/categories");
      revalidatePath(`/category/${category.slug}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" has been permanently deleted.`,
    });
  } catch (error: any) {
    console.error("Category delete error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
