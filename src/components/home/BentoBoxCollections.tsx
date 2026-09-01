import Link from "next/link";
import Image from "next/image";
import { getCachedCategories } from "@/lib/cached-queries";

export async function BentoBoxCollections() {
  const categories = await getCachedCategories();

  if (!categories || categories.length < 3) return null;

  // We take the first 3 categories for the bento layout
  const mainCategory = categories[0];
  const sideCategory1 = categories[1];
  const sideCategory2 = categories[2];

  return (
    <section className="section-spacing" style={{ backgroundColor: "white", padding: "60px 0" }}>
      <div className="container-main">
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 500,
            color: "#1A1918",
            marginBottom: "32px",
            textAlign: "center"
          }}
        >
          Curated For You
        </h2>

        <div className="bento-grid">
          {/* Main Large Box */}
          <Link href={`/category/${mainCategory.slug}`} className="bento-item main-bento relative group overflow-hidden">
            <Image
              src={mainCategory.image || "/images/hero/hero-sarees.jpg"}
              alt={mainCategory.name}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-3xl font-serif font-medium mb-2">{mainCategory.name}</h3>
              <span className="text-sm font-sans uppercase tracking-wider font-semibold border-b border-white pb-1 inline-block">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Side Stacked Boxes */}
          <div className="bento-side">
            <Link href={`/category/${sideCategory1.slug}`} className="bento-item side-bento relative group overflow-hidden">
              <Image
                src={sideCategory1.image || "/images/hero/hero-kurtis.jpg"}
                alt={sideCategory1.name}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-serif font-medium mb-1">{sideCategory1.name}</h3>
                <span className="text-xs font-sans uppercase tracking-wider font-semibold border-b border-white pb-1 inline-block">
                  Explore
                </span>
              </div>
            </Link>

            <Link href={`/category/${sideCategory2.slug}`} className="bento-item side-bento relative group overflow-hidden">
              <Image
                src={sideCategory2.image || "/images/hero/hero-fabrics.jpg"}
                alt={sideCategory2.name}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-serif font-medium mb-1">{sideCategory2.name}</h3>
                <span className="text-xs font-sans uppercase tracking-wider font-semibold border-b border-white pb-1 inline-block">
                  Discover
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
