"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SlideData {
  id: string;
  tag: string;
  headline: string;
  subtext: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
  image: string;
  badge: string;
  category: string;
}

const SLIDES: SlideData[] = [
  {
    id: "sarees",
    tag: "AUTHENTIC LATUR TEXTILES",
    headline: "Handwoven Silk & Premium Drapery.",
    subtext:
      "Pure Banarasi zari, lustrous Paithani borders, and heritage sarees handpicked directly from master artisan clusters.",
    primaryCta: { text: "Shop Sarees", href: "/category/sarees" },
    secondaryCta: { text: "Explore All", href: "/shop" },
    image: "/images/products/banarasi-silk-saree-maroon.jpg",
    badge: "100% Pure Silk Weaves",
    category: "Heritage Sarees",
  },
  {
    id: "fabrics",
    tag: "CUSTOM RUNNING FABRICS",
    headline: "Finest Cottons & Running Yardage.",
    subtext:
      "Counted 60s Cambric, breathable pure linens, and rich shirtings cut to your exact meterage with live price calculation.",
    primaryCta: { text: "Shop by Meter", href: "/category/fabrics" },
    secondaryCta: { text: "Meter Calculator", href: "/product/premium-cotton-fabric" },
    image: "/images/products/premium-cotton-fabric.jpg",
    badge: "Cut from 0.5m onwards",
    category: "Fabrics by Meter",
  },
  {
    id: "kurtis",
    tag: "DESIGNER COLLECTION",
    headline: "Designer Kurtis & Unstitched Sets.",
    subtext:
      "Handcrafted block-print kurtis, chikankari embroidery, and daily ethnic luxury designed for effortless comfort.",
    primaryCta: { text: "Explore Kurtis", href: "/category/kurtis" },
    secondaryCta: { text: "Shop Latest", href: "/shop" },
    image: "/images/products/womens-kurti-olive.jpg",
    badge: "Readymade & Dress Materials",
    category: "Kurtis & Suits",
  },
  {
    id: "linens",
    tag: "LUXURY NATURAL FIBERS",
    headline: "Natural Linens & Formal Menswear.",
    subtext:
      "Structured Oxford shirtings, premium suiting fabrics, and breathable European linen weaves crafted for all seasons.",
    primaryCta: { text: "Shop Men's Wear", href: "/category/mens-wear" },
    secondaryCta: { text: "Visit Latur Store", href: "/contact" },
    image: "/images/products/linen-blend-fabric.jpg",
    badge: "Hatte Nagar, Latur Store",
    category: "Linen & Suiting",
  },
];

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 5000;
  const PROGRESS_INTERVAL = 50;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "650px",
        maxHeight: "950px",
        backgroundColor: "#1A1918",
        overflow: "hidden",
      }}
    >
      {/* ─── Background Images with Cross-Fade Transition ─── */}
      {SLIDES.map((s, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1)" : "scale(1.05)",
              transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <img
              src={s.image}
              alt={s.headline}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={idx === 0 ? "high" : "low"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 25%",
              }}
            />
          </div>
        );
      })}

      {/* ─── Luxury Multi-Stop Gradient Overlay ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(15,14,13,0.92) 0%, rgba(15,14,13,0.85) 35%, rgba(15,14,13,0.5) 65%, rgba(15,14,13,0.15) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ─── Text & Content Overlay ─── */}
      <div
        className="container-main"
        style={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "60px",
        }}
      >
        <div style={{ maxWidth: "620px", padding: "40px 0" }}>
          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4.5vw, 52px)",
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

          {/* Subtext */}
          <p
            style={{
              fontSize: "clamp(14px, 1.6vw, 16px)",
              lineHeight: 1.65,
              color: "#D6CFC7",
              marginBottom: "32px",
              maxWidth: "520px",
              fontFamily: "var(--font-sans)",
            }}
          >
            {slide.subtext}
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
            <Link
              href={slide.primaryCta.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 30px",
                backgroundColor: "#E0A96D",
                color: "#1A1918",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(224, 169, 109, 0.3)",
                transition: "transform 0.15s, background-color 0.15s",
              }}
              className="hover:scale-105"
            >
              <span>{slide.primaryCta.text}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href={slide.secondaryCta.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 26px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.03em",
                textDecoration: "none",
                transition: "background-color 0.15s",
              }}
              className="hover:bg-white hover:text-black"
            >
              {slide.secondaryCta.text}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Bottom Slide Tabs & Progress Bar ─── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          backgroundColor: "rgba(10, 9, 8, 0.75)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${SLIDES.length}, 1fr)`,
            }}
          >
            {SLIDES.map((s, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  style={{
                    padding: "14px 12px",
                    background: "none",
                    border: "none",
                    borderRight: idx < SLIDES.length - 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  {/* Progress Line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          height: "100%",
                          backgroundColor: "#E0A96D",
                          width: `${progress}%`,
                          transition: "width 50ms linear",
                        }}
                      />
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: isActive ? "#E0A96D" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {s.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
