

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/ui/SortSelect";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products — NOBLE TEXTILE",
  description:
    "Browse quality fabrics, sarees, dress materials, kurtis, and menswear at Noble Textile.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const sort = params.sort || "newest";
  const search = params.search;
  const page = parseInt(params.page || "1");

  const where: Record<string, any> = {
    isPublished: true,
    isArchived: false,
    AND: [
      {
        OR: [
          { tags: null },
          { NOT: { tags: { contains: "WHOLESALE" } } }
        ]
      }
    ]
  };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.AND.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { fabric: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ]
    });
  }

  let orderBy: Record<string, string> = {};
  switch (sort) {
    case "price-low":
      orderBy = { price: "asc" };
      break;
    case "price-high":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const limit = 20;
  let products: Prisma.ProductGetPayload<{
    include: { images: { orderBy: { sortOrder: "asc" } }; category: true };
  }>[] = [];
  let total = 0;
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];

  try {
    [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where: where as never,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
        },
        orderBy: orderBy as never,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where: where as never }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
  } catch {
    // DB unreachable during build — render shell, data loads at runtime
  }

  const totalPages = Math.ceil(total / limit);


  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  const currentCategory = category
    ? categories.find((c) => c.slug === category)
    : null;

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh" }}>
      <div className="container-main" style={{ paddingTop: "105px", paddingBottom: "64px" }}>
        {/* Breadcrumb */}
        <nav
          style={{
            fontSize: "13px",
            color: "#8A8279",
            marginBottom: "24px",
            fontFamily: "var(--font-sans)",
            display: "flex",
            gap: "8px",
          }}
        >
          <Link href="/" style={{ color: "#8A8279", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          {currentCategory ? (
            <>
              <Link
                href="/shop"
                style={{ color: "#8A8279", textDecoration: "none" }}
              >
                Shop
              </Link>
              <span>/</span>
              <span style={{ color: "#1A1918" }}>{currentCategory.name}</span>
            </>
          ) : (
            <span style={{ color: "#1A1918" }}>
              {search ? `Search: "${search}"` : "Shop"}
            </span>
          )}
        </nav>

        {/* Page Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 500,
                color: "#1A1918",
                marginBottom: "4px",
              }}
            >
              {currentCategory
                ? currentCategory.name
                : search
                ? `Results for "${search}"`
                : "All Products"}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#8A8279",
                fontFamily: "var(--font-sans)",
              }}
            >
              {total} {total === 1 ? "product" : "products"}
            </p>
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label
              style={{
                fontSize: "13px",
                color: "#8A8279",
                fontFamily: "var(--font-sans)",
              }}
            >
              Sort by:
            </label>
            <SortSelect currentSort={sort} />
          </div>
        </div>

        <style>{`
          .shop-layout {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 48px;
            align-items: start;
          }
          @media (max-width: 768px) {
            .shop-layout {
              grid-template-columns: 1fr;
            }
            .shop-sidebar {
              display: none;
            }
          }
        `}</style>
        <div className="shop-layout">
          {/* ─── Sidebar Filters (Desktop) ─── */}
          <aside className="shop-sidebar">
            <div style={{ position: "sticky", top: "100px" }}>
              <h3
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#1A1918",
                  marginBottom: "16px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Categories
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  marginBottom: "32px",
                }}
              >
                <Link
                  href="/shop"
                  style={{
                    fontSize: "14px",
                    color: !category ? "#9E3B2B" : "#1A1918",
                    fontWeight: !category ? 600 : 500,
                    backgroundColor: !category ? "rgba(224, 169, 109, 0.15)" : "transparent",
                    textDecoration: "none",
                    fontFamily: "var(--font-sans)",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  }}
                  className="hover:bg-black/5"
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}${sort !== "newest" ? `&sort=${sort}` : ""}`}
                    style={{
                      fontSize: "14px",
                      color: category === cat.slug ? "#9E3B2B" : "#1A1918",
                      fontWeight: category === cat.slug ? 600 : 500,
                      backgroundColor: category === cat.slug ? "rgba(224, 169, 109, 0.15)" : "transparent",
                      textDecoration: "none",
                      fontFamily: "var(--font-sans)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    className="hover:bg-black/5"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div
                style={{
                  borderTop: "1px solid #E4DDD3",
                  paddingTop: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#1A1918",
                    marginBottom: "16px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Fabric Type
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {[
                    "Cotton",
                    "Silk",
                    "Rayon",
                    "Linen",
                    "Georgette",
                    "Chiffon",
                  ].map((fab) => (
                    <Link
                      key={fab}
                      href={`/shop?${new URLSearchParams({
                        ...(category ? { category } : {}),
                        sort,
                        search: fab,
                      }).toString()}`}
                      style={{
                        fontSize: "14px",
                        color: search === fab ? "#9E3B2B" : "#1A1918",
                        fontWeight: search === fab ? 600 : 500,
                        backgroundColor: search === fab ? "rgba(224, 169, 109, 0.15)" : "transparent",
                        textDecoration: "none",
                        fontFamily: "var(--font-sans)",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        transition: "all 0.2s ease",
                      }}
                      className="hover:bg-black/5"
                    >
                      {fab}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Product Grid ─── */}
          <div>
            {products.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  color: "#8A8279",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                  No products found
                </p>
                <p style={{ fontSize: "14px", marginBottom: "24px" }}>
                  Try adjusting your filters or search terms.
                </p>
                <Link href="/shop" className="btn btn-secondary">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      image={
                        product.images[0]?.url ||
                        "/images/products/premium-cotton-fabric.jpg"
                      }
                      fabric={product.fabric}
                      unitType={product.unitType}
                      stock={product.stock}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "48px",
                    }}
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Link
                          key={p}
                          href={`/shop?${new URLSearchParams({
                            ...(category ? { category } : {}),
                            sort,
                            ...(search ? { search } : {}),
                            page: p.toString(),
                          }).toString()}`}
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: p === page ? 600 : 400,
                            color: p === page ? "white" : "#1A1918",
                            backgroundColor:
                              p === page ? "#1A1918" : "transparent",
                            border: "1px solid #E4DDD3",
                            textDecoration: "none",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {p}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

