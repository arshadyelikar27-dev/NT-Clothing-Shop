import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Collection — NOBLE TEXTILE`,
    description:
      category.description ||
      `Explore premium ${category.name.toLowerCase()} at NOBLE TEXTILE, Hatte Nagar, Latur.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const sort = sParams.sort || "newest";

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      children: true,
    },
  });

  if (!category) notFound();

  let orderBy: Record<string, string> = {};
  switch (sort) {
    case "price-low":
      orderBy = { price: "asc" };
      break;
    case "price-high":
      orderBy = { price: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isPublished: true,
      isArchived: false,
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: orderBy as never,
  });

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh" }}>
      <div className="container-main" style={{ paddingTop: "105px", paddingBottom: "64px" }}>
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: "13px",
            color: "#8A8279",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <Link href="/" style={{ color: "#8A8279", textDecoration: "none" }}>
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" style={{ color: "#8A8279", textDecoration: "none" }}>
            Categories
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#1A1918", fontWeight: 500 }}>{category.name}</span>
        </nav>

        {/* Category Header */}
        <div
          style={{
            borderBottom: "1px solid #E4DDD3",
            paddingBottom: "24px",
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 500,
                color: "#1A1918",
                marginBottom: "8px",
              }}
            >
              {category.name}
            </h1>
            {category.description && (
              <p style={{ fontSize: "14px", color: "#8A8279", maxWidth: "600px" }}>
                {category.description} • {products.length} {products.length === 1 ? "item" : "items"} available
              </p>
            )}
          </div>

          {/* Sort Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#8A8279" }}>Sort:</span>
            {sortOptions.map((opt) => (
              <Link
                key={opt.value}
                href={`/category/${slug}?sort=${opt.value}`}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: sort === opt.value ? 600 : 400,
                  backgroundColor: sort === opt.value ? "#1A1918" : "transparent",
                  color: sort === opt.value ? "white" : "#1A1918",
                  border: "1px solid",
                  borderColor: sort === opt.value ? "#1A1918" : "#E4DDD3",
                  textDecoration: "none",
                }}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#8A8279" }}>
            <p style={{ fontSize: "16px", marginBottom: "12px" }}>No products in this category yet</p>
            <Link href="/shop" className="btn btn-primary">
              Browse All Textiles
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={product.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                fabric={product.fabric}
                unitType={product.unitType}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
