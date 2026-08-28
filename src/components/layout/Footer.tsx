"use client";

import Link from "next/link";
import { Phone, MapPin, Mail, ArrowRight } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "All Collection" },
  { href: "/category/mens-wear", label: "Men's Wear" },
  { href: "/category/womens-wear", label: "Women's Wear" },
  { href: "/category/dress-materials", label: "Dress Materials" },
  { href: "/category/kurtis", label: "Kurtis" },
  { href: "/category/sarees", label: "Sarees" },
  { href: "/category/suits", label: "Suits" },
  { href: "/category/fabrics", label: "Fabrics" },
];

const SUPPORT_LINKS = [
  { href: "/shipping", label: "Shipping Information" },
  { href: "/returns", label: "Returns & Exchanges" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#11100F",
        color: "#B8AFA4",
        fontFamily: "var(--font-sans)",
        borderTop: "1px solid #2D2B29",
      }}
    >
      <div className="container-main" style={{ padding: "80px 20px 60px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "60px",
          }}
        >
          {/* Brand Column */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "24px",
                fontWeight: 500,
                color: "#FAF7F2",
                letterSpacing: "0.06em",
                marginBottom: "24px",
              }}
            >
              NOBLE TEXTILE
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                marginBottom: "32px",
                maxWidth: "320px",
                color: "#8A8279",
              }}
            >
              Curated fabrics, handwoven sarees, and premium clothing. Quality over quantity, always.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                fontSize: "13px",
              }}
            >
              <a
                href="https://wa.me/917821059350"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 20px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#FAF7F2",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  width: "max-content",
                }}
                className="hover:bg-white hover:text-black"
              >
                <Phone size={14} /> Chat on WhatsApp
              </a>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px", color: "#8A8279" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Mail size={14} /> contact@nobletextile.com
                </span>
                <span style={{ display: "flex", alignItems: "flex-start", gap: "8px", lineHeight: 1.5 }}>
                  <MapPin size={14} style={{ marginTop: "3px", flexShrink: 0 }} />
                  Hatte Nagar, Latur, Maharashtra 413512, India
                </span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#E0A96D",
                marginBottom: "24px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Collections
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {SHOP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "#B8AFA4",
                    textDecoration: "none",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "color 0.2s, transform 0.2s",
                  }}
                  className="group hover:text-white"
                >
                  <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#E0A96D",
                marginBottom: "24px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Support & Legal
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {SUPPORT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "#B8AFA4",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.2s",
                  }}
                  className="hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div
        style={{
          borderTop: "1px solid #2D2B29",
          backgroundColor: "#0A0909",
          padding: "24px 0",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "12px",
            color: "#8A8279",
          }}
        >
          <p>
            © {new Date().getFullYear()} Noble Textile. All rights reserved.
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              fontSize: "11px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            <span>Secure Payments via Razorpay & UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
