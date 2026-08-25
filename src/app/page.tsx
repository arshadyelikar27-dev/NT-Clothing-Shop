import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import {
  MapPin,
  Phone,
  Truck,
  Shield,
  CreditCard,
  Package,
  ArrowRight,
} from "lucide-react";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isPublished: true, isArchived: false, isFeatured: true },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    take: 8,
  });
}

async function getNewArrivals() {
  return prisma.product.findMany({
    where: { isPublished: true, isArchived: false },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

async function getHeroContent() {
  const content = await prisma.homepageContent.findUnique({
    where: { section: "HERO" },
  });
  if (!content) return null;
  return JSON.parse(content.content);
}

export default async function HomePage() {
  const [featured, newArrivals, categories, heroContent] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
    getHeroContent(),
  ]);

  // Category color mapping for visual tiles
  const categoryColors: Record<string, string> = {
    sarees: "#8B2252",
    "dress-materials": "#5B7553",
    fabrics: "#C4956A",
    kurtis: "#6B5B73",
    "mens-wear": "#3D4F5F",
    dupattas: "#B85442",
    "kids-wear": "#7B8F6B",
    seasonal: "#2A7B7B",
  };

  return (
    <>
      {/* ═══════════════ SECTION 1: HERO SLIDESHOW ═══════════════ */}
      <HeroSlideshow />

      {/* ═══════════════ SECTION 2: FEATURED CATEGORIES ═══════════════ */}
      <section className="section-spacing">
        <div className="container-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "36px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(24px, 3vw, 32px)",
                  fontWeight: 500,
                  color: "#1A1918",
                  marginBottom: "8px",
                }}
              >
                Shop by Category
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#8A8279",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Browse our collection by type
              </p>
            </div>
            <Link
              href="/shop"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#1A1918",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.02em",
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
            className="sm:grid-cols-3 md:grid-cols-4"
          >
            {categories.map((cat) => {
              const categoryImages: Record<string, string> = {
                sarees: "/images/products/paithani-silk-saree-blue.jpg",
                "dress-materials": "/images/products/chanderi-dress-material-green.jpg",
                fabrics: "/images/products/printed-cotton-fabric.jpg",
                kurtis: "/images/products/chikankari-kurti-pink.jpg",
                "mens-wear": "/images/products/mens-shirt-fabric-blue-check.jpg",
                dupattas: "/images/products/banarasi-silk-saree-maroon.jpg",
                "kids-wear": "/images/products/womens-kurti-olive.jpg",
                seasonal: "/images/products/linen-blend-fabric.jpg",
              };
              const bgImg =
                cat.image ||
                categoryImages[cat.slug] ||
                "/images/products/premium-cotton-fabric.jpg";

              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid #E4DDD3",
                    backgroundColor: "#1A1918",
                  }}
                  className="group"
                >
                  <div
                    style={{
                      position: "relative",
                      height: "230px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={bgImg}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        transition: "transform 0.5s ease",
                      }}
                      className="group-hover:scale-105"
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,14,13,0.3) 40%, rgba(15,14,13,0.85) 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "16px 18px",
                        zIndex: 2,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "20px",
                          fontWeight: 500,
                          color: "#FFFFFF",
                          marginBottom: "4px",
                        }}
                      >
                        {cat.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#E0A96D",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Explore Weaves <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3: NEW ARRIVALS ═══════════════ */}
      <section
        className="section-spacing"
        style={{ backgroundColor: "white" }}
      >
        <div className="container-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "36px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(24px, 3vw, 32px)",
                  fontWeight: 500,
                  color: "#1A1918",
                  marginBottom: "8px",
                }}
              >
                New Arrivals
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#8A8279",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Recently added to our collection
              </p>
            </div>
            <Link
              href="/shop?sort=newest"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#1A1918",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-sans)",
              }}
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                image={
                  product.images[0]?.url ||
                  "/images/products/premium-cotton-fabric.jpg"
                }
                fabric={product.fabric}
                unitType={product.unitType}
                stock={product.stock}
                isNew
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: FEATURED COLLECTION (MONSOON EDIT) ═══════════════ */}
      <section className="section-spacing">
        <div className="container-main">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              backgroundColor: "#1A1918",
              border: "1px solid #332F2B",
              overflow: "hidden",
              minHeight: "440px",
            }}
          >
            {/* Left Content */}
            <div
              style={{
                flex: "1 1 360px",
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#E0A96D",
                  marginBottom: "14px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Seasonal Capsule • Monsoon Edit
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                  marginBottom: "16px",
                }}
              >
                Quick-Dry Weaves & Rain-Washed Tones
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#B8AFA4",
                  marginBottom: "32px",
                  maxWidth: "460px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Breathable cotton-blend yardage, unstitched Chanderi sets with zari necklines, and lightweight chiffon dupattas crafted for comfort in humid weather.
              </p>
              <div>
                <Link
                  href="/category/seasonal"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 30px",
                    backgroundColor: "#9E3B2B",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(158, 59, 43, 0.4)",
                  }}
                  className="hover:scale-105 transition-transform"
                >
                  Shop the Edit <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div
              style={{
                flex: "1 1 360px",
                minHeight: "380px",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#2D2B29",
              }}
            >
              <img
                src="/images/products/chanderi-dress-material-green.jpg"
                alt="Monsoon Edit at Noble Textile"
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "380px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: BEST SELLERS ═══════════════ */}
      <section
        className="section-spacing"
        style={{ backgroundColor: "white" }}
      >
        <div className="container-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "36px",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(24px, 3vw, 32px)",
                  fontWeight: 500,
                  color: "#1A1918",
                  marginBottom: "8px",
                }}
              >
                Best Sellers
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#8A8279",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Our most popular textiles
              </p>
            </div>
            <Link
              href="/shop?sort=best-selling"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#1A1918",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-sans)",
              }}
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
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
        </div>
      </section>

      {/* ═══════════════ SECTION 6: WHY SHOP WITH US ═══════════════ */}
      <section className="section-spacing">
        <div className="container-main">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 500,
              color: "#1A1918",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            Why Shop With Noble Textile
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1px",
              backgroundColor: "#E4DDD3",
              border: "1px solid #E4DDD3",
            }}
            className="md:grid-cols-3"
          >
            {[
              {
                icon: <Package size={24} />,
                title: "Carefully Selected",
                desc: "Every fabric is inspected for quality, hand-feel, and colour before it reaches you.",
              },
              {
                icon: <Shield size={24} />,
                title: "Quality Focused",
                desc: "We work directly with mills and weavers to bring you textiles that last.",
              },
              {
                icon: <MapPin size={24} />,
                title: "Local Store + Online",
                desc: "Visit us in Hatte Nagar, Latur or shop from anywhere in India.",
              },
              {
                icon: <CreditCard size={24} />,
                title: "Multiple Payment Options",
                desc: "Pay via UPI, cards, net banking, wallets, or cash on delivery.",
              },
              {
                icon: <Truck size={24} />,
                title: "Reliable Delivery",
                desc: "Tracked shipping across India. Free delivery on orders above ₹999.",
              },
              {
                icon: <Phone size={24} />,
                title: "Easy Support",
                desc: "Call or WhatsApp us anytime. We're here to help.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#FAF7F2",
                  padding: "32px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#9E3B2B",
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1A1918",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "#8A8279",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7: STORE EXPERIENCE ═══════════════ */}
      <section
        className="section-spacing"
        style={{ backgroundColor: "white" }}
      >
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "40px",
              alignItems: "center",
            }}
            className="md:grid-cols-2"
          >
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9E3B2B",
                  marginBottom: "12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Visit Our Store
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 500,
                  color: "#1A1918",
                  lineHeight: 1.15,
                  marginBottom: "16px",
                }}
              >
                Noble Textile, Latur
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#8A8279",
                  marginBottom: "24px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                See and feel our fabrics in person. Our store in Hatte Nagar
                carries the full range — walk in, browse, and pick what works
                for you.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "28px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    fontSize: "14px",
                    color: "#1A1918",
                  }}
                >
                  <MapPin
                    size={18}
                    style={{
                      color: "#9E3B2B",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <span>
                    Hatte Nagar, Latur, Maharashtra 413512, India
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "14px",
                    color: "#1A1918",
                  }}
                >
                  <Phone
                    size={18}
                    style={{ color: "#9E3B2B", flexShrink: 0 }}
                  />
                  <a
                    href="tel:+917821059350"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    +91 78210 59350
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Noble+Textile+Hatte+Nagar+Latur+Maharashtra+413512"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <MapPin size={16} />
                  Get Directions
                </a>
                <a href="tel:+917821059350" className="btn btn-secondary">
                  <Phone size={16} />
                  Call Store
                </a>
              </div>
            </div>

            {/* Map Embed */}
            <div
              style={{
                width: "100%",
                height: "380px",
                backgroundColor: "#F3EFEA",
                border: "1px solid #E4DDD3",
                overflow: "hidden",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.0!2d76.56!3d18.40!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHatte+Nagar+Latur!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Noble Textile store location in Latur"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 8: FABRIC GALLERY ═══════════════ */}
      <section className="section-spacing">
        <div className="container-main">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 500,
              color: "#1A1918",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            From Our Collection
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#8A8279",
              fontFamily: "var(--font-sans)",
              textAlign: "center",
              marginBottom: "36px",
            }}
          >
            A closer look at our textiles
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "4px",
            }}
            className="md:grid-cols-4"
          >
            {[
              "premium-cotton-fabric",
              "banarasi-silk-saree-maroon",
              "womens-kurti-olive",
              "linen-blend-fabric",
            ].map((slug) => (
              <div
                key={slug}
                style={{
                  aspectRatio: "1/1",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`/images/products/${slug}.jpg`}
                  alt="Noble Textile product"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 9: NEWSLETTER / WHATSAPP ═══════════════ */}
      <section
        style={{
          backgroundColor: "#1A1918",
          padding: "64px 0",
        }}
      >
        <div
          className="container-main"
          style={{ textAlign: "center", maxWidth: "600px" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 500,
              color: "#FAF7F2",
              marginBottom: "12px",
            }}
          >
            Stay in the Loop
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "#B8AFA4",
              marginBottom: "32px",
              fontFamily: "var(--font-sans)",
            }}
          >
            New collections, fabric drops and offers.
          </p>

          <form
            action="#"
            style={{
              display: "flex",
              gap: "0",
              maxWidth: "460px",
              margin: "0 auto 24px",
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email for newsletter"
              style={{
                flex: 1,
                padding: "14px 16px",
                fontSize: "14px",
                backgroundColor: "#2D2B29",
                border: "1px solid #3D3B39",
                color: "#FAF7F2",
                fontFamily: "var(--font-sans)",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              style={{
                padding: "14px 24px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                backgroundColor: "#9E3B2B",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </form>

          <a
            href="https://wa.me/917821059350?text=Hi%2C%20I%27m%20interested%20in%20your%20textiles"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#FAF7F2",
              border: "1px solid #3D3B39",
              textDecoration: "none",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.02em",
            }}
          >
            Or reach us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
