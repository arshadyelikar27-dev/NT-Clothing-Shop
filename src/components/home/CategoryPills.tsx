import Link from "next/link";
import Image from "next/image";
import { getCachedCategories } from "@/lib/cached-queries";

function getCategoryImage(categoryName: string, categoryId: string, dbImage: string | null): string {
  // Try to use a tag based on the category name for better relevance
  let tag = "fashion,model";
  const name = categoryName.toLowerCase();
  
  if (name.includes("saree")) tag = "saree,indian";
  else if (name.includes("kurti") || name.includes("kurtas") || name.includes("top")) tag = "kurti,indian";
  else if (name.includes("lehenga") || name.includes("festive")) tag = "lehenga,indian";
  else if (name.includes("men") || name.includes("shirt")) tag = "menswear,shirt";
  else if (name.includes("fabric") || name.includes("material")) tag = "fabric,textile";
  
  // Return a unique image URL for each category based on its ID
  return `https://loremflickr.com/400/400/${tag}?random=${categoryId}`;
}

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

        {/* Removed hide-scrollbar and added padding so the last item isn't cut off */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "16px",
            paddingRight: "24px",
          }}
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
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#E4DDD3",
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  position: "relative",
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105 transition-transform"
              >
                <Image
                  src={getCategoryImage(category.name, category.id, category.image)}
                  alt={category.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100px"
                />
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1A1918",
                  fontFamily: "var(--font-sans)",
                  textAlign: "center",
                  lineHeight: "1.2",
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
