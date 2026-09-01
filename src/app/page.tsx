export const revalidate = 60;

import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { getCachedDiscoverCollection } from "@/lib/cached-queries";
import { CategoryPills } from "@/components/home/CategoryPills";
import { BentoBoxCollections } from "@/components/home/BentoBoxCollections";
import {
  MapPin,
  Phone,
  Truck,
  Shield,
  CreditCard,
  Package,
  ArrowRight,
} from "lucide-react";

export default async function HomePage() {
  let discoverProducts: Awaited<ReturnType<typeof getCachedDiscoverCollection>> = [];

  try {
    discoverProducts = await getCachedDiscoverCollection();
  } catch {
    // Render shell if DB error
  }

  return (
    <>
      {/* ═══════════════ SECTION 1: HERO SLIDESHOW ═══════════════ */}
      <HeroSlideshow />

      {/* ═══════════════ NEW CATEGORY NAVIGATION ═══════════════ */}
      <CategoryPills />

      {/* ═══════════════ BENTO BOX COLLECTIONS ═══════════════ */}
      <BentoBoxCollections />

      {/* ═══════════════ DISCOVER / MIXED COLLECTION ═══════════════ */}
      <section className="section-spacing" style={{ backgroundColor: "#1A1918", color: "white" }}>
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
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#E0A96D",
                  marginBottom: "8px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Curated Mix
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(24px, 3vw, 32px)",
                  fontWeight: 500,
                  color: "white",
                  marginBottom: "8px",
                }}
              >
                Discover Everything
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#B8AFA4",
                  fontFamily: "var(--font-sans)",
                }}
              >
                A random mix of our finest selections across all categories
              </p>
            </div>
            <Link
              href="/shop"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Shop Entire Store <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid">
            {discoverProducts.map((product) => (
              <div key={product.id} style={{ position: "relative" }}>
                {/* Wrap ProductCard in a dark-theme safe container if needed, or pass a prop. ProductCard is already relatively styling-agnostic but uses white backgrounds. That's fine, it provides contrast against the dark section background. */}
                <ProductCard
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY SHOP WITH US ═══════════════ */}
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
                title: "Easy Online Payment",
                desc: "Pay securely online — the shop owner will guide you through the payment process after your order.",
              },
              {
                icon: <Truck size={24} />,
                title: "Reliable Delivery",
                desc: "Tracked shipping across India.",
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

      {/* ═══════════════ STORE EXPERIENCE ═══════════════ */}
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
    </>
  );
}

