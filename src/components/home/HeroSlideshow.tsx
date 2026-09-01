"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const SLIDES = [
  {
    id: "sarees",
    headline: "Handwoven Silk & Premium Drapery.",
    subtext:
      "Pure Banarasi zari, lustrous Paithani borders, and heritage sarees handpicked directly from master artisan clusters.",
    cta: { text: "Shop Sarees", href: "/category/sarees" },
    image: "/images/hero/hero-sarees.jpg",
  },
  {
    id: "fabrics",
    headline: "Finest Cottons & Running Yardage.",
    subtext:
      "Counted 60s Cambric, breathable pure linens, and rich shirtings cut to your exact meterage.",
    cta: { text: "Shop by Meter", href: "/category/fabrics" },
    image: "/images/hero/hero-fabrics.jpg",
  },
  {
    id: "kurtis",
    headline: "Designer Kurtis & Unstitched Sets.",
    subtext:
      "Handcrafted block-print kurtis, chikankari embroidery, and daily ethnic luxury designed for effortless comfort.",
    cta: { text: "Shop Kurtis", href: "/category/kurtis" },
    image: "/images/hero/hero-kurtis.jpg",
  },
  {
    id: "linens",
    headline: "Natural Linens & Formal Menswear.",
    subtext:
      "Structured Oxford shirtings, premium suiting fabrics, and breathable European linen weaves crafted for all seasons.",
    cta: { text: "Shop Men's Wear", href: "/category/mens-wear" },
    image: "/images/hero/hero-linens.jpg",
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
