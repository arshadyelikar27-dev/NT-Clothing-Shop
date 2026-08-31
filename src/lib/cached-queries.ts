import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

// ─── 1. All Active Categories (MegaMenu, Filters, Header) ───
export const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  },
  ["all-active-categories"],
  { revalidate: 300, tags: ["categories"] }
);

// ─── 2. Homepage Categories with 8 Products Each ───
export const getCachedCategoriesWithProducts = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { isPublished: true, isArchived: false },
          take: 8,
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },
  ["homepage-categories-products"],
  { revalidate: 300, tags: ["products", "categories"] }
);

// ─── 3. Homepage Discover Collection (12 items) ───
export const getCachedDiscoverCollection = unstable_cache(
  async () => {
    return prisma.product.findMany({
      where: { isPublished: true, isArchived: false },
      take: 12,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, category: true },
      orderBy: { updatedAt: "desc" },
    });
  },
  ["homepage-discover-collection"],
  { revalidate: 300, tags: ["products"] }
);

// ─── 4. Single Product by Slug (Product Detail Page) ───
export const getCachedProductBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      return prisma.product.findUnique({
        where: { slug, isPublished: true, isArchived: false },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          variants: { where: { isActive: true } },
          reviews: {
            where: { isApproved: true },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });
    },
    [`product-${slug}`],
    { revalidate: 300, tags: ["products", `product-${slug}`] }
  )();

// ─── 5. Related Products for Product Detail Page ───
export const getCachedRelatedProducts = (categoryId: string, excludeId: string) =>
  unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
          categoryId,
          id: { not: excludeId },
          isPublished: true,
          isArchived: false,
        },
        include: { images: { orderBy: { sortOrder: "asc" } } },
        take: 4,
      });
    },
    [`related-${categoryId}-${excludeId}`],
    { revalidate: 300, tags: ["products"] }
  )();

// ─── 6. Single Category by Slug (Category Page) ───
export const getCachedCategoryBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      return prisma.category.findUnique({
        where: { slug, isActive: true },
        include: {
          children: true,
          parent: true,
        },
      });
    },
    [`category-${slug}`],
    { revalidate: 300, tags: ["categories", `category-${slug}`] }
  )();
