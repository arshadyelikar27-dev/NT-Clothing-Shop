"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  MapPin,
  Star,
  Ruler,
  Info,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { useCartStore, useUIStore } from "@/lib/store";
import { formatPrice, getDiscountPercentage, getUnitLabel } from "@/lib/utils";
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
  stock: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    name: string;
  };
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
  stock: number;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
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
    stock: number;
    images: ProductImage[];
  }>;
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const colorVariants = product.variants.filter((v) => v.type === "COLOR");
  const sizeVariants = product.variants.filter((v) => v.type === "SIZE");

  const [selectedColor, setSelectedColor] = useState<ProductVariant | null>(colorVariants[0] || null);
  const [selectedSize, setSelectedSize] = useState<ProductVariant | null>(sizeVariants[0] || null);
  const [displayImage, setDisplayImage] = useState<string | null>(selectedColor?.imageUrl || null);
  const [quantity, setQuantity] = useState<number>(product.unitType === "PER_METER" ? 1.0 : 1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "care" | "shipping">("desc");
  const [isZoomed, setIsZoomed] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { showNotification } = useUIStore();

  const currentPrice = selectedColor?.price || selectedSize?.price || product.price;
  const totalPrice = currentPrice * quantity;
  const inStock = product.stock > 0;

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

  const handleAddToCart = () => {
    if (!inStock) return;
    const variantName = [selectedColor?.value, selectedSize?.value].filter(Boolean).join(" - ");
    const variantId = selectedColor?.id || selectedSize?.id;

    addItem({
      productId: product.id,
      variantId: variantId,
      name: product.name,
      image: primaryImage,
      price: currentPrice,
      quantity,
      unitType: product.unitType,
      sku: variantName ? `${product.sku}-${variantName}` : product.sku,
      variantName: variantName || undefined,
      maxStock: product.stock,
    });
    showNotification(
      `${quantity} ${getUnitLabel(product.unitType, quantity)} of ${product.name} added to bag`,
      "success"
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };



  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    // Realistic delivery time simulation for Indian PIN codes
    setPincodeStatus("Standard Delivery: 7-10 Days");
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
              {/* Main Image */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  backgroundColor: "#F3EFEA",
                  border: "1px solid #E4DDD3",
                  overflow: "hidden",
                  cursor: isZoomed ? "zoom-out" : "zoom-in",
                }}
                className="aspect-product"
                onClick={() => setIsZoomed(!isZoomed)}
              >
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

                  {!inStock && <span className="badge badge-out">Out of stock</span>}
                </div>

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
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
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
                        border: selectedImageIndex === idx ? "2px solid #9E3B2B" : "1px solid #E4DDD3",
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
                </div>
              )}
            </div>
          </div>

          {/* ════ RIGHT: Product Info & Purchase ════ */}
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

            {/* ════ Unit & Quantity Selector ════ */}
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
                      <Ruler size={15} /> Select Fabric Length (Meters):
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
                    <span style={{ fontSize: "13px", color: product.stock > 0 ? "#2C6E3F" : "#B91C1C", fontWeight: 500 }}>
                      {product.stock > 0 ? "In Stock" : "Out of stock"}
                    </span>
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
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
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

            {/* ════ Action Buttons ════ */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="btn btn-secondary"
                style={{ flex: 1, padding: "16px 20px" }}
              >
                <ShoppingBag size={18} />
                {inStock ? "Add to Bag" : "Out of Stock"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="btn btn-accent"
                style={{ flex: 1, padding: "16px 20px" }}
              >
                Buy Now
              </button>
            </div>

            {/* Direct WhatsApp Store Chat */}
            <a
              href={`https://wa.me/917821059350?text=Hi%20Noble%20Textile%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(SKU%3A%20${product.sku})%20from%20your%20online%20store.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 16px",
                backgroundColor: "#F3EFEA",
                border: "1px solid #E4DDD3",
                color: "#1A1918",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "28px",
                transition: "background-color 0.15s",
              }}
            >
              <span>💬 Ask Latur Store Staff on WhatsApp (+91 78210 59350)</span>
            </a>

            {/* ════ PIN code delivery estimator ════ */}
            <div
              style={{
                border: "1px solid #E4DDD3",
                padding: "16px 20px",
                backgroundColor: "white",
                marginBottom: "28px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <MapPin size={16} color="#9E3B2B" />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Delivery Check</span>
              </div>
              <form onSubmit={handleCheckPincode} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 413512)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    fontSize: "13px",
                    border: "1px solid #E4DDD3",
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "10px",
                    color: pincodeStatus.includes("Please") ? "#B91C1C" : "#2C6E3F",
                    fontWeight: 500,
                  }}
                >
                  {pincodeStatus}
                </p>
              )}
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
                  stock={rel.stock}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
