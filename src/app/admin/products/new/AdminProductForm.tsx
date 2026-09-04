"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { parsePriceAndCombo, formatPrice } from "@/lib/utils";
import { Sparkles, Tag, Layers, Shirt, HelpCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export function AdminProductForm({ categories, initialData }: { categories: Category[], initialData?: any }) {
  const router = useRouter();
  
  const [name, setName] = useState(initialData?.name || "");
  const [priceInput, setPriceInput] = useState(initialData?.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(initialData?.compareAtPrice?.toString() || "");
  const [unitType, setUnitType] = useState<"PER_PIECE" | "PER_SET" | "PER_METER">(initialData?.unitType || "PER_PIECE");
  const [comboOfferText, setComboOfferText] = useState(initialData?.shortDescription || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isFreeDelivery, setIsFreeDelivery] = useState(initialData?.deliveryCharge === 0);
  const [deliveryChargeInput, setDeliveryChargeInput] = useState(initialData?.deliveryCharge ? initialData.deliveryCharge.toString() : "");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Variants State
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<{ name: string; file: File | null }[]>([]);

  const toggleSize = (size: string) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const addColor = () => setColors([...colors, { name: "", file: null }]);
  const updateColor = (index: number, field: "name" | "file", value: any) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };
  const removeColor = (index: number) => setColors(colors.filter((_, i) => i !== index));
  
  // Image files state
  const [imageFront, setImageFront] = useState<File | null>(null);
  const [imageRight, setImageRight] = useState<File | null>(null);
  const [imageLeft, setImageLeft] = useState<File | null>(null);
  const [imageBack, setImageBack] = useState<File | null>(null);

  const getExistingImg = (sort: number) => initialData?.images?.find((i: any) => i.sortOrder === sort)?.url || null;
  const [existingFront, setExistingFront] = useState(getExistingImg(0));
  const [existingRight, setExistingRight] = useState(getExistingImg(1));
  const [existingLeft, setExistingLeft] = useState(getExistingImg(2));
  const [existingBack, setExistingBack] = useState(getExistingImg(3));


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Live parsed price & combo offer detection
  const parsedPriceInfo = useMemo(() => {
    return parsePriceAndCombo(priceInput, unitType);
  }, [priceInput, unitType]);

  // Handle Price Input Change with Smart Auto-Detection
  const handlePriceChange = (val: string) => {
    setPriceInput(val);
    const parsed = parsePriceAndCombo(val, unitType);
    if (parsed.comboLabel) {
      setUnitType("PER_SET");
      setComboOfferText(parsed.comboLabel);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !priceInput.trim() || !categoryId) {
      setError("Please fill in all required fields (Name, Price, Category)");
      return;
    }

    if (!parsedPriceInfo.numericPrice || parsedPriceInfo.numericPrice <= 0) {
      setError("Please enter a valid price amount (e.g. 1000 or '4 in 1000')");
      return;
    }
    
    if (!imageFront && !existingFront) {
      setError("Front Image is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Upload files directly to storage
      const uploadViaApi = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!r.ok) {
          const errData = await r.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed (${r.status})`);
        }
        const { url } = await r.json();
        return url;
      };

      const imageFrontUrl = imageFront ? await uploadViaApi(imageFront) : existingFront;
      const imageRightUrl = imageRight ? await uploadViaApi(imageRight) : existingRight;
      const imageLeftUrl = imageLeft ? await uploadViaApi(imageLeft) : existingLeft;
      const imageBackUrl = imageBack ? await uploadViaApi(imageBack) : existingBack;
      const uploadedVideoUrl = videoFile ? await uploadViaApi(videoFile) : null;

      const uploadedColors = [];
      for (let i = 0; i < colors.length; i++) {
        const c = colors[i];
        if (c.file && c.name) {
          const url = await uploadViaApi(c.file);
          uploadedColors.push({ name: c.name, imageUrl: url });
        }
      }

      // 2. Send JSON payload to API
      const deliveryCharge = isFreeDelivery
        ? 0
        : deliveryChargeInput
        ? parseFloat(deliveryChargeInput)
        : null;

      const payload = {
        name: name.trim(),
        price: parsedPriceInfo.numericPrice,
        unitType: unitType,
        shortDescription: comboOfferText.trim() || parsedPriceInfo.comboLabel || null,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        categoryId,
        description,
        imageFrontUrl,
        imageRightUrl,
        imageLeftUrl,
        imageBackUrl,
        videoUrl: uploadedVideoUrl,
        sizes,
        colors: uploadedColors,
        deliveryCharge,
      };

      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = `Server Error (${res.status}): ${res.statusText}.`;
        if (res.status === 413) errorMessage = "File too large. Vercel limits uploads to 4.5MB.";
        if (res.status === 504) errorMessage = "Upload timed out (took longer than 10s).";
        
        try {
          const data = await res.json();
          setError(data.error || "Failed to create product");
        } catch {
          setError(errorMessage);
        }
        return;
      }

      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(data.error || "Failed to create product");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px", borderRadius: "4px" }}>
      {error && (
        <div style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "12px 16px", fontSize: "13px", marginBottom: "24px", borderRadius: "4px", border: "1px solid #FECACA" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        
        {/* ════ Basic Details ════ */}
        <div style={{ paddingBottom: "24px", borderBottom: "1px solid #F3EFEA" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>Basic Details</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "6px" }}>
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Readymade Cotton Shirt (Combo Set)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  border: "1px solid #E4DDD3",
                  borderRadius: "4px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
              {/* Category */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "6px" }}>
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "13px",
                    border: "1px solid #E4DDD3",
                    borderRadius: "4px",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing Unit Mode */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "6px" }}>
                  Pricing Type / Unit
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setUnitType("PER_PIECE");
                      if (comboOfferText.includes("in")) setComboOfferText("");
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      fontSize: "12px",
                      fontWeight: unitType === "PER_PIECE" ? 600 : 500,
                      backgroundColor: unitType === "PER_PIECE" ? "#1A1918" : "#F3EFEA",
                      color: unitType === "PER_PIECE" ? "white" : "#6E675F",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    👕 Single Piece
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnitType("PER_SET");
                      if (!comboOfferText) setComboOfferText("4 in 1000");
                      if (!priceInput) setPriceInput("1000");
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      fontSize: "12px",
                      fontWeight: unitType === "PER_SET" ? 600 : 500,
                      backgroundColor: unitType === "PER_SET" ? "#9E3B2B" : "#F3EFEA",
                      color: unitType === "PER_SET" ? "white" : "#6E675F",
                      border: unitType === "PER_SET" ? "1px solid #9E3B2B" : "1px solid #E4DDD3",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    🎁 Combo / Pack
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitType("PER_METER")}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      fontSize: "12px",
                      fontWeight: unitType === "PER_METER" ? 600 : 500,
                      backgroundColor: unitType === "PER_METER" ? "#1A1918" : "#F3EFEA",
                      color: unitType === "PER_METER" ? "white" : "#6E675F",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    📏 Per Meter
                  </button>
                </div>
              </div>
            </div>

            {/* Price & Combo Input Section */}
            <div
              style={{
                backgroundColor: unitType === "PER_SET" ? "#FAF7F2" : "transparent",
                border: unitType === "PER_SET" ? "1px solid #E4DDD3" : "none",
                padding: unitType === "PER_SET" ? "16px" : "0",
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918" }}>
                      {unitType === "PER_SET" ? "Combo Price (₹) / Expression *" : "Retail Price (₹) *"}
                    </label>
                    <span style={{ fontSize: "11px", color: "#8A8279" }}>
                      Supports text like <strong>4 in 1000</strong> or <strong>1000</strong>
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1000 or 4 in 1000"
                    value={priceInput}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "6px" }}>
                    {unitType === "PER_SET" ? "Combo Offer Label / Badge" : "Offer Badge (Optional)"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4 in 1000, Pack of 4, Buy 4 @ ₹1000"
                    value={comboOfferText}
                    onChange={(e) => setComboOfferText(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              </div>

              {/* Live Preview of Price and Combo Structure */}
              {parsedPriceInfo.numericPrice > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 14px",
                    backgroundColor: unitType === "PER_SET" ? "#FFF8F0" : "#F3EFEA",
                    border: unitType === "PER_SET" ? "1px solid #FED7AA" : "1px solid #E4DDD3",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} color={unitType === "PER_SET" ? "#C2410C" : "#1A1918"} />
                    <span style={{ fontSize: "13px", color: "#1A1918", fontWeight: 600 }}>
                      Effective Checkout Price: {formatPrice(parsedPriceInfo.numericPrice)}
                    </span>
                    {unitType === "PER_SET" && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: "#9E3B2B",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          textTransform: "uppercase",
                        }}
                      >
                        {comboOfferText || parsedPriceInfo.comboLabel || "Combo Set"}
                      </span>
                    )}
                  </div>
                  
                  {unitType === "PER_SET" && parsedPriceInfo.packQuantity > 1 && (
                    <span style={{ fontSize: "12px", color: "#8A8279" }}>
                      ({formatPrice(Math.round(parsedPriceInfo.numericPrice / parsedPriceInfo.packQuantity))} / piece)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Charge */}
            <div style={{ backgroundColor: "#F3EFEA", border: "1px solid #E4DDD3", padding: "16px", borderRadius: "4px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "12px" }}>
                🚚 Delivery Charge
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <input
                  type="checkbox"
                  id="freeDeliveryCheck"
                  checked={isFreeDelivery}
                  onChange={(e) => {
                    setIsFreeDelivery(e.target.checked);
                    if (e.target.checked) setDeliveryChargeInput("");
                  }}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="freeDeliveryCheck" style={{ fontSize: "14px", fontWeight: 600, color: "#2C6E3F", cursor: "pointer" }}>
                  Free Delivery
                </label>
              </div>
              {!isFreeDelivery && (
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#8A8279", marginBottom: "6px" }}>
                    Delivery Charge (₹) — leave empty if not applicable
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={deliveryChargeInput}
                    onChange={(e) => setDeliveryChargeInput(e.target.value)}
                    style={{
                      width: "160px",
                      padding: "8px 12px",
                      fontSize: "14px",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              )}
              <p style={{ fontSize: "11px", color: "#8A8279", marginTop: "8px" }}>
                {isFreeDelivery
                  ? "✅ Will show FREE Delivery on product page"
                  : deliveryChargeInput
                  ? `Will show +₹${deliveryChargeInput} Delivery on product page`
                  : "Will show 'Delivery charge on inquiry'"
                }
              </p>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "6px" }}>
                Product Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the product material, fit, stitching, and combo contents..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "13px",
                  border: "1px solid #E4DDD3",
                  borderRadius: "4px",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
          </div>
        </div>

        {/* ════ Product Variants (Sizes & Colors) ════ */}
        <div style={{ paddingBottom: "24px", borderBottom: "1px solid #F3EFEA" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>Product Variants (Optional)</h3>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "#1A1918" }}>
              Available Sizes
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  style={{
                    padding: "8px 16px",
                    border: sizes.includes(size) ? "2px solid #1A1918" : "1px solid #E4DDD3",
                    backgroundColor: sizes.includes(size) ? "#1A1918" : "transparent",
                    color: sizes.includes(size) ? "white" : "#1A1918",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    borderRadius: "4px",
                    transition: "all 0.15s",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918" }}>Color Swatches & Images</label>
              <button
                type="button"
                onClick={addColor}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#9E3B2B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                + Add Color Swatch
              </button>
            </div>
            
            {colors.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#8A8279", fontStyle: "italic" }}>
                No color swatches added yet. Click &quot;+ Add Color Swatch&quot; to add color options with image previews.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {colors.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="Color Name (e.g. Navy Blue)"
                      value={c.name}
                      onChange={(e) => updateColor(i, "name", e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        fontSize: "13px",
                        border: "1px solid #E4DDD3",
                        borderRadius: "4px",
                        outline: "none",
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateColor(i, "file", e.target.files ? e.target.files[0] : null)}
                      style={{ flex: 1, fontSize: "13px" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      style={{
                        color: "#991B1B",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════ Media Uploads ════ */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>Product Images (Cloudinary CDN)</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }} className="sm:grid-cols-2 lg:grid-cols-4">
            {/* Front View */}
            <div>
              <span style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#1A1918" }}>
                Front View *
              </span>
              <label htmlFor="imageFrontInput" style={{ cursor: "pointer", display: "block" }}>
                <div style={{ position: "relative", width: "100%", height: "260px", backgroundColor: "#F3EFEA", border: "1px dashed #E4DDD3", borderRadius: "4px", marginBottom: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>
                  {imageFront ? (
                    <img src={URL.createObjectURL(imageFront)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : existingFront ? (
                    <img src={existingFront} alt="Existing Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "12px", color: "#8A8279", textAlign: "center", padding: "8px" }}>+ Add Image<br/><small>(Front View)</small></span>
                  )}
                </div>
              </label>
              <input
                id="imageFrontInput"
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImageFront(e.target.files ? e.target.files[0] : null)}
                style={{ display: "none" }}
              />
            </div>

            {/* Right View */}
            <div>
              <span style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#1A1918" }}>
                Right Angle View
              </span>
              <label htmlFor="imageRightInput" style={{ cursor: "pointer", display: "block" }}>
                <div style={{ position: "relative", width: "100%", height: "260px", backgroundColor: "#F3EFEA", border: "1px dashed #E4DDD3", borderRadius: "4px", marginBottom: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>
                  {imageRight ? (
                    <img src={URL.createObjectURL(imageRight)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : existingRight ? (
                    <img src={existingRight} alt="Existing Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "12px", color: "#8A8279", textAlign: "center", padding: "8px" }}>+ Add Image<br/><small>(Right View)</small></span>
                  )}
                </div>
              </label>
              <input
                id="imageRightInput"
                type="file"
                accept="image/*"
                onChange={(e) => setImageRight(e.target.files ? e.target.files[0] : null)}
                style={{ display: "none" }}
              />
            </div>

            {/* Left View */}
            <div>
              <span style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#1A1918" }}>
                Left Angle View
              </span>
              <label htmlFor="imageLeftInput" style={{ cursor: "pointer", display: "block" }}>
                <div style={{ position: "relative", width: "100%", height: "260px", backgroundColor: "#F3EFEA", border: "1px dashed #E4DDD3", borderRadius: "4px", marginBottom: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>
                  {imageLeft ? (
                    <img src={URL.createObjectURL(imageLeft)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : existingLeft ? (
                    <img src={existingLeft} alt="Existing Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "12px", color: "#8A8279", textAlign: "center", padding: "8px" }}>+ Add Image<br/><small>(Left View)</small></span>
                  )}
                </div>
              </label>
              <input
                id="imageLeftInput"
                type="file"
                accept="image/*"
                onChange={(e) => setImageLeft(e.target.files ? e.target.files[0] : null)}
                style={{ display: "none" }}
              />
            </div>

            {/* Back View */}
            <div>
              <span style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#1A1918" }}>
                Back View
              </span>
              <label htmlFor="imageBackInput" style={{ cursor: "pointer", display: "block" }}>
                <div style={{ position: "relative", width: "100%", height: "260px", backgroundColor: "#F3EFEA", border: "1px dashed #E4DDD3", borderRadius: "4px", marginBottom: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>
                  {imageBack ? (
                    <img src={URL.createObjectURL(imageBack)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : existingBack ? (
                    <img src={existingBack} alt="Existing Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "12px", color: "#8A8279", textAlign: "center", padding: "8px" }}>+ Add Image<br/><small>(Back View)</small></span>
                  )}
                </div>
              </label>
              <input
                id="imageBackInput"
                type="file"
                accept="image/*"
                onChange={(e) => setImageBack(e.target.files ? e.target.files[0] : null)}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#1A1918" }}>
              Product Video (Optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
              style={{ width: "100%", fontSize: "12px" }}
            />
            <span style={{ fontSize: "11px", color: "#8A8279", display: "block", marginTop: "4px" }}>
              Upload an MP4 or WebM video to showcase texture and drape.
            </span>
          </div>
        </div>

        {/* ════ Submit Action ════ */}
        <div style={{ paddingTop: "16px", borderTop: "1px solid #E4DDD3", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 32px",
              backgroundColor: "#1A1918",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Save & Publish Product"}
          </button>
        </div>

      </div>
    </form>
  );
}
