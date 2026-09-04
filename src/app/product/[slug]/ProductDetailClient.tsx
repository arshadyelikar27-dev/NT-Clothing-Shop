"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Truck,
  ShieldCheck,
  ChevronRight,
  ZoomIn,
  Download,
  Phone,
} from "lucide-react";
import { useUIStore } from "@/lib/store";
import { formatPrice, getUnitLabel } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { BackButton } from "@/components/ui/BackButton";

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface ProductVariant {
  id: string;
  name: string;
  type: string;
  value: string;
  imageUrl?: string | null;
  price?: number | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  sku: string;
  price: number;
  fabric?: string | null;
  weave?: string | null;
  gsm?: string | null;
  widthInches?: string | null;
  careInstructions?: string | null;
  unitType: string;
  minQuantity: number;
  maxQuantity: number;
  quantityStep: number;
  deliveryCharge?: number | null;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  videoUrl?: string | null;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    fabric?: string | null;
    unitType: string;
    images: ProductImage[];
    deliveryCharge?: number | null;
  }>;
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const colorVariants = product.variants.filter((v) => v.type === "COLOR");
  const sizeVariants = product.variants.filter((v) => v.type === "SIZE");

  const [selectedColor, setSelectedColor] = useState<ProductVariant | null>(colorVariants[0] || null);
  const [selectedSize, setSelectedSize] = useState<ProductVariant | null>(sizeVariants[0] || null);
  const [displayImage, setDisplayImage] = useState<string | null>(selectedColor?.imageUrl || null);
  const [quantity, setQuantity] = useState<number>(product.unitType === "PER_METER" ? 1.0 : 1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "care" | "shipping">("desc");
  const [isZoomed, setIsZoomed] = useState(false);

  const { showNotification } = useUIStore();

  const currentPrice = selectedColor?.price || selectedSize?.price || product.price;
  const totalPrice = currentPrice * quantity;

  const handleColorSelect = (color: ProductVariant) => {
    setSelectedColor(color);
    if (color.imageUrl) {
      setDisplayImage(color.imageUrl);
    }
  };

  const handleThumbnailClick = (url: string, index: number) => {
    setSelectedImageIndex(index);
    setDisplayImage(url);
  };

  const primaryImage =
    displayImage ||
    product.images[selectedImageIndex]?.url ||
    product.images[0]?.url ||
    "/images/products/premium-cotton-fabric.jpg";

  const handleDownloadMedia = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const isVideo = displayImage === "video" && product.videoUrl;
      const mediaUrl = isVideo ? product.videoUrl! : primaryImage;
      const extension = isVideo ? "mp4" : "jpg";
      const filename = `${product.slug}-${isVideo ? "video" : "image"}.${extension}`;

      showNotification("Starting download...", "info");

      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      const isVideo = displayImage === "video" && product.videoUrl;
      const mediaUrl = isVideo ? product.videoUrl! : primaryImage;
      window.open(mediaUrl, "_blank");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} from NOBLE TEXTILE, Latur`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("Product link copied to clipboard", "info");
    }
  };

  const buildWhatsAppMessage = () => {
    const productUrl = window.location.href;
    const qtyLine =
      product.unitType === "PER_METER"
        ? `Quantity: ${quantity} meter(s)`
        : `Quantity: ${quantity}`;
    return encodeURIComponent(
      `Hi NOBLE TEXTILE,\nI'm interested in:\n📌 *${product.name}*\n💰 Price: ${formatPrice(currentPrice)}${product.unitType === "PER_METER" ? "/m" : ""}\n${qtyLine}\n🔗 ${productUrl}\n\nPlease let me know availability.`
    );
  };

  // Delivery charge display
  const deliveryCharge = product.deliveryCharge;
  const isFreeDelivery = deliveryCharge === 0;
  const hasPaidDelivery = deliveryCharge !== null && deliveryCharge !== undefined && deliveryCharge > 0;

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh" }}>
      {/* ─── Breadcrumb ─── */}
      <div className="container-main" style={{ paddingTop: "105px", paddingBottom: "16px" }}>
        <nav
          style={{
            fontSize: "13px",
            color: "#8A8279",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <BackButton
            label="Back"
            fallbackUrl="/shop"
            className="mr-2 text-[#1A1918]"
          />
          <Link href="/" style={{ color: "#8A8279", textDecoration: "none" }}>
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" style={{ color: "#8A8279", textDecoration: "none" }}>
            Shop
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/category/${product.category.slug}`}
            style={{ color: "#8A8279", textDecoration: "none" }}
          >
            {product.category.name}
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#1A1918", fontWeight: 500 }}>{product.name}</span>
        </nav>
      </div>

      {/* ─── Main Product Section ─── */}
      <div className="container-main" style={{ paddingBottom: "80px" }}>
        <div
          style={{
            display: "grid",
            gap: "48px",
          }}
          className="lg:grid-cols-[450px_1fr] md:grid-cols-[380px_1fr] grid-cols-1"
        >
          {/* ════ LEFT: Image Gallery ════ */}
          <div>
            <div style={{ display: "flex", gap: "16px", flexDirection: "column" }} className="md:flex-row-reverse">
              {/* Main Image or Video */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  backgroundColor: "#F3EFEA",
                  border: "1px solid #E4DDD3",
                  overflow: "hidden",
                  cursor: displayImage === "video" ? "default" : (isZoomed ? "zoom-out" : "zoom-in"),
                }}
                className="aspect-product"
                onClick={() => {
                  if (displayImage !== "video") setIsZoomed(!isZoomed);
                }}
              >
                {displayImage === "video" && product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={primaryImage}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: isZoomed ? "scale(1.5)" : "scale(1)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                )}

                {/* Badge Overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                </div>

                {/* Download Button (Top Right) */}
                <button
                  onClick={handleDownloadMedia}
                  aria-label="Download Media"
                  title="Download Image/Video"
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    backgroundColor: "rgba(250,247,242,0.9)",
                    border: "1px solid #E4DDD3",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#1A1918",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Download size={18} />
                </button>

                {displayImage !== "video" && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      backgroundColor: "rgba(250,247,242,0.85)",
                      padding: "6px 10px",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: "#1A1918",
                    }}
                  >
                    <ZoomIn size={12} /> {isZoomed ? "Click to reset" : "Click to zoom"}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {(product.images.length > 1 || product.videoUrl) && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                  }}
                  className="md:flex-col md:w-20"
                >
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => handleThumbnailClick(img.url, idx)}
                      style={{
                        width: "70px",
                        height: "85px",
                        padding: 0,
                        border: displayImage !== "video" && selectedImageIndex === idx ? "2px solid #9E3B2B" : "1px solid #E4DDD3",
                        backgroundColor: "#F3EFEA",
                        cursor: "pointer",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || `${product.name} angle ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </button>
                  ))}
                  {product.videoUrl && (
                    <button
                      onClick={() => {
                        setDisplayImage("video");
                        setIsZoomed(false);
                      }}
                      style={{
                        width: "70px",
                        height: "85px",
                        padding: 0,
                        border: displayImage === "video" ? "2px solid #9E3B2B" : "1px solid #E4DDD3",
                        backgroundColor: "#F3EFEA",
                        cursor: "pointer",
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative"
                      }}
                    >
                      <img
                        src={product.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                        alt="Video Thumbnail"
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
                      />
                      <div style={{ position: "absolute", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "50%", padding: "6px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ════ RIGHT: Product Info ════ */}
          <div>
            {/* Header info */}
            <div style={{ borderBottom: "1px solid #E4DDD3", paddingBottom: "24px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#9E3B2B",
                      marginBottom: "6px",
                    }}
                  >
                    {product.fabric ? `${product.fabric} • ` : ""}
                    {product.category.name}
                  </p>
                  <h1
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(24px, 3.5vw, 34px)",
                      fontWeight: 500,
                      lineHeight: 1.2,
                      color: "#1A1918",
                      marginBottom: "8px",
                    }}
                  >
                    {product.name}
                  </h1>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleShare}
                    aria-label="Share"
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "1px solid #E4DDD3",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#1A1918",
                    }}
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px" }}>
                <span style={{ fontSize: "12px", color: "#8A8279" }}>SKU: {product.sku}</span>
              </div>

              {/* Pricing Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "12px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 600,
                    color: "#1A1918",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {formatPrice(currentPrice)}
                </span>
                {product.unitType === "PER_METER" && (
                  <span style={{ fontSize: "14px", color: "#8A8279" }}>per meter</span>
                )}
                {product.unitType === "PER_SET" && (
                  <span style={{ fontSize: "14px", color: "#8A8279" }}>per set</span>
                )}
                {product.shortDescription && (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      backgroundColor: "#FAF0EE",
                      color: "#9E3B2B",
                      border: "1px solid #F3DDD8",
                      padding: "3px 8px",
                      borderRadius: "3px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {product.shortDescription}
                  </span>
                )}
              </div>

              {/* Delivery Charge Display */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                <Truck size={15} color={isFreeDelivery ? "#2C6E3F" : hasPaidDelivery ? "#8A8279" : "#8A8279"} />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isFreeDelivery ? "#2C6E3F" : "#8A8279",
                  }}
                >
                  {isFreeDelivery
                    ? "FREE Delivery"
                    : hasPaidDelivery
                    ? `+₹${deliveryCharge} Delivery Charge`
                    : "Delivery charge on inquiry"}
                </span>
              </div>

              <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "4px" }}>
                Inclusive of all taxes.
              </p>
            </div>

            {/* ════ Color Selector ════ */}
            {colorVariants.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "10px",
                    color: "#1A1918",
                  }}
                >
                  Color: <span style={{ fontWeight: 400 }}>{selectedColor?.value}</span>
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {colorVariants.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color)}
                      style={{
                        width: "50px",
                        height: "65px",
                        padding: 0,
                        border: selectedColor?.id === color.id ? "2px solid #9E3B2B" : "1px solid #E4DDD3",
                        backgroundColor: "#F3EFEA",
                        cursor: "pointer",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                      title={color.value}
                    >
                      {color.imageUrl ? (
                        <img
                          src={color.imageUrl}
                          alt={color.value}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: "10px", padding: "4px" }}>{color.value}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ════ Size Selector ════ */}
            {sizeVariants.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "10px",
                    color: "#1A1918",
                  }}
                >
                  Size: <span style={{ fontWeight: 400 }}>{selectedSize?.value}</span>
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {sizeVariants.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: "45px",
                        height: "45px",
                        padding: "0 12px",
                        border: selectedSize?.id === size.id ? "1.5px solid #1A1918" : "1px solid #E4DDD3",
                        backgroundColor: selectedSize?.id === size.id ? "#1A1918" : "white",
                        color: selectedSize?.id === size.id ? "white" : "#1A1918",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ════ Quantity Selector ════ */}
            <div
              style={{
                backgroundColor: "#F3EFEA",
                padding: "20px",
                border: "1px solid #E4DDD3",
                marginBottom: "24px",
              }}
            >
              {product.unitType === "PER_METER" ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <label
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      Select Fabric Length (Meters):
                    </label>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#9E3B2B" }}>
                      Total: {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {/* Preset meter buttons */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                    {[1, 1.5, 2, 2.5, 3, 4, 5].map((m) => (
                      <button
                        key={m}
                        onClick={() => setQuantity(m)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: quantity === m ? 600 : 400,
                          backgroundColor: quantity === m ? "#1A1918" : "white",
                          color: quantity === m ? "white" : "#1A1918",
                          border: "1px solid #E4DDD3",
                          cursor: "pointer",
                        }}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>

                  {/* Custom meter stepper */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#8A8279" }}>Custom length:</span>
                    <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #E4DDD3" }}>
                      <button
                        onClick={() => setQuantity(Math.max(product.minQuantity, quantity - product.quantityStep))}
                        style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={product.quantityStep}
                        min={product.minQuantity}
                        max={product.maxQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(product.minQuantity, parseFloat(e.target.value) || product.minQuantity))}
                        style={{
                          width: "60px",
                          textAlign: "center",
                          border: "none",
                          fontWeight: 600,
                          fontSize: "14px",
                          padding: "6px",
                        }}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.maxQuantity, quantity + product.quantityStep))}
                        style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontSize: "13px", color: "#8A8279" }}>
                      ({quantity} {quantity === 1 ? "meter" : "meters"})
                    </span>
                  </div>
                </div>
              ) : (
                /* Regular Piece/Set Quantity */
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Quantity ({product.unitType === "PER_SET" ? "Sets" : "Pieces"}):
                    </label>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", border: "1px solid #E4DDD3" }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer" }}
                      >
                        -
                      </button>
                      <span style={{ padding: "8px 16px", fontWeight: 600, fontSize: "14px", minWidth: "40px", textAlign: "center" }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer" }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918" }}>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ════ Inquiry Action Buttons ════ */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {/* WhatsApp Inquiry */}
              <button
                onClick={() => {
                  window.open(`https://wa.me/919764313958?text=${buildWhatsAppMessage()}`, '_blank');
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "15px 20px",
                  backgroundColor: "#25D366",
                  border: "none",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                  borderRadius: "4px",
                  letterSpacing: "0.02em",
                }}
                className="hover:bg-[#128C7E]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                <span>Inquire on WhatsApp</span>
              </button>

              {/* Call to Order */}
              <a
                href="tel:+919764313958"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "13px 20px",
                  backgroundColor: "#1A1918",
                  border: "2px solid #1A1918",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  borderRadius: "4px",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  boxSizing: "border-box",
                }}
                className="hover:bg-[#9E3B2B] hover:border-[#9E3B2B]"
              >
                <Phone size={18} />
                <span>Call to Order</span>
              </a>
            </div>

            {/* ════ Trust Badges ════ */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                padding: "16px 0",
                borderTop: "1px solid #E4DDD3",
                borderBottom: "1px solid #E4DDD3",
                marginBottom: "28px",
              }}
            >
              <div style={{ textAlign: "center", fontSize: "12px", color: "#8A8279" }}>
                <Truck size={18} style={{ margin: "0 auto 6px", color: "#1A1918" }} />
                <span>Fast Nationwide Dispatch</span>
              </div>
              <div style={{ textAlign: "center", fontSize: "12px", color: "#8A8279" }}>
                <ShieldCheck size={18} style={{ margin: "0 auto 6px", color: "#1A1918" }} />
                <span>100% Genuine Mill Fabric</span>
              </div>
            </div>

            {/* ════ Specification & Details Tabs ════ */}
            <div>
              {/* Tab Navigation */}
              <div style={{ display: "flex", borderBottom: "1px solid #E4DDD3", marginBottom: "16px" }}>
                {[
                  { id: "desc", label: "Description" },
                  { id: "specs", label: "Specifications" },
                  { id: "care", label: "Care Guide" },
                  { id: "shipping", label: "Shipping & Store" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    style={{
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === tab.id ? "2px solid #9E3B2B" : "2px solid transparent",
                      color: activeTab === tab.id ? "#1A1918" : "#8A8279",
                      fontWeight: activeTab === tab.id ? 600 : 400,
                      fontSize: "13px",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#2D2B29" }}>
                {activeTab === "desc" && (
                  <div>
                    <p style={{ marginBottom: "12px" }}>{product.description}</p>
                    {product.shortDescription && (
                      <p style={{ color: "#8A8279", fontSize: "13px" }}>
                        Highlight: {product.shortDescription}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "specs" && (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <tbody>
                      {product.fabric && (
                        <tr style={{ borderBottom: "1px solid #E4DDD3" }}>
                          <td style={{ padding: "8px 0", color: "#8A8279", width: "40%" }}>Fabric / Material</td>
                          <td style={{ padding: "8px 0", fontWeight: 500 }}>{product.fabric}</td>
                        </tr>
                      )}
                      {product.weave && (
                        <tr style={{ borderBottom: "1px solid #E4DDD3" }}>
                          <td style={{ padding: "8px 0", color: "#8A8279" }}>Weave Type</td>
                          <td style={{ padding: "8px 0", fontWeight: 500 }}>{product.weave}</td>
                        </tr>
                      )}
                      {product.gsm && (
                        <tr style={{ borderBottom: "1px solid #E4DDD3" }}>
                          <td style={{ padding: "8px 0", color: "#8A8279" }}>Count / Weight (GSM)</td>
                          <td style={{ padding: "8px 0", fontWeight: 500 }}>{product.gsm}</td>
                        </tr>
                      )}
                      {product.widthInches && (
                        <tr style={{ borderBottom: "1px solid #E4DDD3" }}>
                          <td style={{ padding: "8px 0", color: "#8A8279" }}>Fabric Width</td>
                          <td style={{ padding: "8px 0", fontWeight: 500 }}>{product.widthInches}</td>
                        </tr>
                      )}
                      <tr style={{ borderBottom: "1px solid #E4DDD3" }}>
                        <td style={{ padding: "8px 0", color: "#8A8279" }}>Selling Unit</td>
                        <td style={{ padding: "8px 0", fontWeight: 500 }}>
                          {product.unitType === "PER_METER"
                            ? "Sold by the meter"
                            : product.unitType === "PER_SET"
                            ? "Complete Unstitched Set"
                            : "Per Piece"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 0", color: "#8A8279" }}>Store Origin</td>
                        <td style={{ padding: "8px 0", fontWeight: 500 }}>NOBLE TEXTILE, Hatte Nagar, Latur</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {activeTab === "care" && (
                  <div>
                    <p style={{ marginBottom: "12px" }}>
                      {product.careInstructions ||
                        "Gentle hand wash in cold water with mild detergent. Dry in shade. Warm iron on reverse."}
                    </p>
                    <ul style={{ paddingLeft: "20px", color: "#8A8279", fontSize: "13px" }}>
                      <li>Do not soak natural dyed fabrics for long durations.</li>
                      <li>Avoid direct harsh sunlight when drying.</li>
                      <li>For embroidered & silk garments, dry cleaning is recommended.</li>
                    </ul>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div>
                    <p style={{ marginBottom: "8px" }}>
                      Orders are packed and dispatched directly from our store in <strong>Hatte Nagar, Latur</strong> within 24–48 hours.
                    </p>
                    <p style={{ color: "#8A8279", fontSize: "13px" }}>
                      • Local pickup available at our Latur retail store.
                    </p>
                    {isFreeDelivery && (
                      <p style={{ color: "#2C6E3F", fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>
                        🚚 FREE Delivery on this product.
                      </p>
                    )}
                    {hasPaidDelivery && (
                      <p style={{ color: "#8A8279", fontSize: "13px", marginTop: "8px" }}>
                        Delivery charge: ₹{deliveryCharge} for this product.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* ════ Related Products Section ════ */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "80px", borderTop: "1px solid #E4DDD3", paddingTop: "48px" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "24px",
                fontWeight: 500,
                color: "#1A1918",
                marginBottom: "28px",
              }}
            >
              You May Also Like
            </h2>
            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  id={rel.id}
                  name={rel.name}
                  slug={rel.slug}
                  price={rel.price}
                  image={rel.images[0]?.url || "/images/products/premium-cotton-fabric.jpg"}
                  fabric={rel.fabric}
                  unitType={rel.unitType}
                  deliveryCharge={rel.deliveryCharge}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
