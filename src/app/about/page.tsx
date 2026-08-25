import Link from "next/link";
import { ShieldCheck, Package, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — NOBLE TEXTILE | Latur Textile Store",
  description:
    "Learn about NOBLE TEXTILE, our heritage in Hatte Nagar, Latur, and our passion for quality cotton, silk, and unstitched dress materials.",
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
      <div className="container-main" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9E3B2B",
              marginBottom: "8px",
            }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(30px, 4.5vw, 44px)",
              fontWeight: 500,
              color: "#1A1918",
              marginBottom: "16px",
            }}
          >
            Fabric Selected for How It Wears.
          </h1>
          <p style={{ fontSize: "16px", color: "#8A8279", lineHeight: 1.7, maxWidth: "680px", margin: "0 auto" }}>
            NOBLE TEXTILE was founded with a straightforward standard: provide honest, high-quality fabrics that feel right on the skin and stand the test of time.
          </p>
        </div>

        {/* Feature Image / Story */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E4DDD3",
            padding: "40px 32px",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918", marginBottom: "16px" }}>
            Rooted in Hatte Nagar, Latur
          </h2>
          <p style={{ fontSize: "15px", color: "#2D2B29", lineHeight: 1.8, marginBottom: "16px" }}>
            Operating from our physical store in <strong>Hatte Nagar, Latur, Maharashtra</strong>, NOBLE TEXTILE serves both local families looking for festive and daily fabrics as well as customers across India looking for reliable, unstitched dress materials, pure cambric cottons, Paithani sarees, and custom shirtings.
          </p>
          <p style={{ fontSize: "15px", color: "#2D2B29", lineHeight: 1.8, marginBottom: "24px" }}>
            We work directly with certified textile mills, handloom clusters, and experienced weavers. Every roll of fabric that enters our shop is checked for count, colour-fastness, and hand-feel before being offered by the meter or as ready garments.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "20px",
              borderTop: "1px solid #E4DDD3",
              paddingTop: "24px",
            }}
            className="sm:grid-cols-3"
          >
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>
                Direct Sourcing
              </h4>
              <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.6 }}>
                Eliminating middlemen to ensure pure mill-quality textiles at fair retail prices.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>
                Per-Meter Precision
              </h4>
              <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.6 }}>
                Order exact meter lengths tailored for your tailor or bespoke fashion requirements.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>
                Physical Store Trust
              </h4>
              <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.6 }}>
                A brick-and-mortar storefront in Latur with real staff, genuine support, and direct contact.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/shop" className="btn btn-primary" style={{ marginRight: "12px" }}>
            Explore Our Catalog
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Visit Us in Latur
          </Link>
        </div>
      </div>
    </div>
  );
}
