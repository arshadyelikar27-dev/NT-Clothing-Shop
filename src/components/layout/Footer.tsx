"use client";

import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/category/sarees", label: "Sarees" },
  { href: "/category/dress-materials", label: "Dress Materials" },
  { href: "/category/fabrics", label: "Fabrics" },
  { href: "/category/kurtis", label: "Kurtis" },
  { href: "/category/mens-wear", label: "Men's Wear" },
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
        backgroundColor: "#1A1918",
        color: "#B8AFA4",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ─── Main Footer ─── */}
      <div className="container-main" style={{ padding: "64px 20px 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
          // Note: using CSS classes for responsive grid
        >
          {/* Brand Column */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "20px",
                fontWeight: 600,
                color: "#FAF7F2",
                letterSpacing: "0.04em",
                marginBottom: "16px",
              }}
            >
              NOBLE TEXTILE
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
                marginBottom: "24px",
                maxWidth: "280px",
              }}
            >
              Quality fabrics and clothing, carefully selected for how they look,
              feel and wear. Visit us at Hatte Nagar, Latur.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "13px",
              }}
            >
              <a
                href="tel:+917821059350"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Phone size={14} />
                +91 78210 59350
              </a>
              <a
                href="mailto:contact@nobletextile.com"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Mail size={14} />
                contact@nobletextile.com
              </a>
              <span
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <MapPin size={14} style={{ marginTop: "2px", flexShrink: 0 }} />
                Hatte Nagar, Latur, Maharashtra 413512, India
              </span>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                marginBottom: "20px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Shop
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
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
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#FAF7F2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#B8AFA4")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                marginBottom: "20px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Customer Support
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#FAF7F2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#B8AFA4")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                marginBottom: "20px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Stay Updated
            </h4>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}
            >
              New collections, fabric drops and offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{
                display: "flex",
                gap: "0",
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                aria-label="Email for newsletter"
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  fontSize: "13px",
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
                  padding: "12px 20px",
                  fontSize: "12px",
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
              href="https://wa.me/917821059350"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "20px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#FAF7F2",
                border: "1px solid #3D3B39",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div
        style={{
          borderTop: "1px solid #2D2B29",
          padding: "20px 0",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
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
              gap: "16px",
              fontSize: "11px",
              letterSpacing: "0.02em",
            }}
          >
            <span>UPI</span>
            <span>•</span>
            <span>Cards</span>
            <span>•</span>
            <span>Net Banking</span>
            <span>•</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
