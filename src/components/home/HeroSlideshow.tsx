"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const SLIDES = [
  {
    id: "sarees",
    headline: "Lustrous Silk & Royal Zari Sarees.",
    subtext:
      "Exquisite lilac Banarasi silk, rich golden zari borders, and festive drapery handpicked directly from master artisan clusters.",
    cta: { text: "Shop Sarees", href: "/category/sarees" },
    image: "/images/hero/hero-sarees.jpg",
  },
  {
    id: "dress-materials",
    headline: "Floral Dress Materials & Designer Suits.",
    subtext:
      "Graceful floral prints, delicate embroidered necklines, and matching organza dupattas crafted for effortless ethnic elegance.",
    cta: { text: "Shop Dress Materials", href: "/category/dress-materials" },
    image: "/images/hero/hero-kurtis.jpg",
  },
  {
    id: "menswear",
    headline: "Crisp Formal Shirts & Men's Wear.",
    subtext:
      "Impeccable tailored fits, premium cotton shirtings, and structured formal wear crafted for all-day comfort and distinction.",
    cta: { text: "Shop Men's Wear", href: "/category/readymade-shirts" },
    image: "/images/hero/hero-linens.jpg",
  },
  {
    id: "fabrics",
    headline: "Pure Linens & Premium Cotton Yardage.",
    subtext:
      "Authentic breathable textures, earth-toned weaves, and wholesale running fabrics cut to your exact meterage.",
    cta: { text: "Shop Fabrics", href: "/category/fabrics" },
    image: "/images/hero/hero-fabrics.jpg",
  },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  // Simple auto-advance — always runs, never pauses
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="hero-slider-wrap">
      {/* ─── Background Images ─── */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: idx === current ? 1 : 0,
            transition: "opacity 0.9s ease-in-out",
            zIndex: 1,
          }}
        >
          <Image
            src={s.image}
            alt={s.headline}
            fill
            priority={idx === 0}
            quality={85}
            sizes="100vw"
            className="hero-img-cover"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}

      {/* ─── Gradient Overlay ─── */}
      <div
        className="hero-gradient-overlay"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ─── Text Content ─── */}
      <div
        className="container-main hero-text-container"
        style={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ maxWidth: "560px", padding: "40px 0" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "#FFFFFF",
              marginBottom: "16px",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {slide.headline}
          </h1>

          <p
            style={{
              fontSize: "clamp(13px, 1.4vw, 16px)",
              lineHeight: 1.65,
              color: "#D6CFC7",
              maxWidth: "480px",
              fontFamily: "var(--font-sans)",
            }}
          >
            {slide.subtext}
          </p>
        </div>
      </div>
    </div>
  );
}
