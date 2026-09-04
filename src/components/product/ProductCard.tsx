"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  hoverImage?: string | null;
  fabric?: string | null;
  shortDescription?: string | null;
  tags?: string | null;
  unitType: string;
  isNew?: boolean;
  deliveryCharge?: number | null;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  hoverImage,
  fabric,
  shortDescription,
  tags,
  unitType,
  isNew,
  deliveryCharge,
}: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const freeDelivery = deliveryCharge === 0 || deliveryCharge === null || deliveryCharge === undefined ? false : false;
  const showFreeDelivery = deliveryCharge === 0;
  const showDeliveryCharge = deliveryCharge !== null && deliveryCharge !== undefined && deliveryCharge > 0;

  return (
    <>
      <div
        className="group"
        style={{
          position: "relative",
          backgroundColor: "#FAF7F2",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <Link
          href={`/product/${slug}`}
          prefetch={true}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          {/* Image Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3 / 4",
              overflow: "hidden",
              backgroundColor: "#F3EFEA",
            }}
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              className="group-hover:scale-105"
            />

            {hoverImage && (
              <Image
                src={hoverImage}
                alt={`${name} hover`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                style={{
                  objectFit: "cover",
                  transition: "opacity 0.4s ease",
                }}
                className="opacity-0 group-hover:opacity-100"
              />
            )}

            {/* Badges (Top Left) */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                zIndex: 2,
              }}
            >
              {discount && (
                <span
                  style={{
                    backgroundColor: "#9E3B2B",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 6px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {discount}% OFF
                </span>
              )}
              {isNew && (
                <span
                  style={{
                    backgroundColor: "#1A1918",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 6px",
                    letterSpacing: "0.04em",
                  }}
                >
                  NEW
                </span>
              )}
            </div>

            {/* Combo Offer Badge (Top Right) */}
            {(shortDescription || unitType === "PER_SET" || tags?.includes("COMBO")) && (
              <span
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  backgroundColor: "#9E3B2B",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "2px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  zIndex: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                {shortDescription || "COMBO DEAL"}
              </span>
            )}

            {/* Hover Actions Bar */}
            <div
              className="hidden md:flex opacity-0 group-hover:opacity-100"
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                right: "8px",
                gap: "6px",
                transition: "opacity 0.25s ease, transform 0.25s ease",
                zIndex: 2,
              }}
            >
              {/* WhatsApp Inquiry */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const productUrl = `${window.location.origin}/product/${slug}`;
                  const message = encodeURIComponent(`Hi NOBLE TEXTILE, I'm interested in "${name}" for ${formatPrice(price)}. Link: ${productUrl}`);
                  window.open(`https://wa.me/919764313958?text=${message}`, '_blank');
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#25D366",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                className="hover:bg-[#128C7E]"
                title="Inquire on WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                <span>Inquire</span>
              </button>

              {/* Quick View */}
              <button
                type="button"
                onClick={handleQuickView}
                style={{
                  backgroundColor: "#FAF7F2",
                  color: "#1A1918",
                  border: "1px solid #E4DDD3",
                  padding: "8px 12px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                className="hover:bg-white"
                title="Quick View"
              >
                <Eye size={14} />
                <span>Quick View</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "12px 4px 4px" }}>
            {fabric && (
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#8A8279",
                  marginBottom: "3px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {fabric}
              </p>
            )}
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: 1.4,
                marginBottom: "6px",
                fontFamily: "var(--font-sans)",
                color: "#1A1918",
              }}
            >
              {name}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1918" }}>
                {formatPrice(price)}
                {unitType === "PER_METER" ? "/m" : unitType === "PER_SET" ? " / set" : ""}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span style={{ fontSize: "12px", color: "#8A8279", textDecoration: "line-through" }}>
                  {formatPrice(compareAtPrice)}
                </span>
              )}
              {shortDescription && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#9E3B2B",
                    backgroundColor: "#FAF0EE",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    border: "1px solid #F3DDD8",
                    textTransform: "uppercase",
                  }}
                >
                  {shortDescription}
                </span>
              )}
            </div>
            {/* Delivery Charge Badge */}
            {(showDeliveryCharge || deliveryCharge === 0) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "5px",
                }}
              >
                <Truck size={11} color={deliveryCharge === 0 ? "#2C6E3F" : "#8A8279"} />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: deliveryCharge === 0 ? "#2C6E3F" : "#8A8279",
                  }}
                >
                  {deliveryCharge === 0 ? "FREE Delivery" : `+₹${deliveryCharge} Delivery`}
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          productSlug={slug}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
