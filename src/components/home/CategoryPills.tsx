import Link from "next/link";
import Image from "next/image";
import { getCachedCategories } from "@/lib/cached-queries";

export async function CategoryPills() {
  const categories = await getCachedCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="section-spacing" style={{ backgroundColor: "#FAF7F2", padding: "40px 0" }}>
      <div className="container-main">
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(20px, 2.5vw, 24px)",
            fontWeight: 500,
            color: "#1A1918",
            marginBottom: "24px",
          }}
        >
          Shop by Category
        </h2>

        <div
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
            paddingBottom: "16px",
          }}
          className="hide-scrollbar" // ensure hide-scrollbar utility exists in global CSS
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                minWidth: "100px",
              }}
            >
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#E4DDD3",
                  border: "2px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  position: "relative",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105 transition-transform"
              >
                <Image
                  src={category.image || "/images/products/premium-cotton-fabric.jpg"}
                  alt={category.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="90px"
                />
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1A1918",
                  fontFamily: "var(--font-sans)",
                  textAlign: "center",
                }}
              >
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
