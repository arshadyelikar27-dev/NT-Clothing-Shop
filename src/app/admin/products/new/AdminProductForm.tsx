"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export function AdminProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [description, setDescription] = useState("");
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      setError("Please fill in all required fields (Name, Price, Category)");
      return;
    }
    
    if (!imageFront) {
      setError("Front Image is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("categoryId", categoryId);
      formData.append("description", description);
      if (videoFile) formData.append("videoFile", videoFile);
      
      // Append Variants
      if (sizes.length > 0) formData.append("sizes", JSON.stringify(sizes));
      
      const colorNames = colors.map(c => c.name);
      if (colorNames.length > 0) formData.append("colorNames", JSON.stringify(colorNames));
      colors.forEach((c, i) => {
        if (c.file) {
          formData.append(`colorImage_${i}`, c.file);
        }
      });
      if (imageFront) formData.append("imageFront", imageFront);
      if (imageRight) formData.append("imageRight", imageRight);
      if (imageLeft) formData.append("imageLeft", imageLeft);
      if (imageBack) formData.append("imageBack", imageBack);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData, // fetch will automatically set Content-Type to multipart/form-data
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
    } catch (err) {
      console.error(err);
      setError("Network or Connection error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px" }}>
      {error && (
        <div style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "10px 14px", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Basic Info */}
        <div style={{ paddingBottom: "24px", borderBottom: "1px solid #F3EFEA" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>Basic Details</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pure Cambric Cotton Fabric"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Retail Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="e.g. 350"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Product Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the product..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Product Variants (Sizes & Colors) */}
        <div style={{ paddingBottom: "24px", borderBottom: "1px solid #F3EFEA" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>Product Variants (Optional)</h3>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Available Sizes</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  style={{
                    padding: "8px 16px",
                    border: sizes.includes(size) ? "2px solid #1A1918" : "1px solid #E4DDD3",
                    backgroundColor: sizes.includes(size) ? "#1A1918" : "white",
                    color: sizes.includes(size) ? "white" : "#1A1918",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600 }}>Available Colors</label>
              <button type="button" onClick={addColor} className="btn btn-secondary btn-sm">
                + Add Color
              </button>
            </div>
            
            {colors.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#FAF7F2", border: "1px dashed #E4DDD3", fontSize: "13px", color: "#8A8279" }}>
                No colors added.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {colors.map((color, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-end", backgroundColor: "#FAF7F2", padding: "16px", border: "1px solid #E4DDD3" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Color Name</label>
                      <input type="text" required value={color.name} onChange={(e) => updateColor(idx, "name", e.target.value)} className="input" placeholder="e.g. Ruby Red" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Color Image (Required)</label>
                      <input type="file" accept="image/*" required onChange={(e) => updateColor(idx, "file", e.target.files?.[0] || null)} style={{ fontSize: "12px", width: "100%" }} />
                    </div>
                    <button type="button" onClick={() => removeColor(idx)} style={{ padding: "10px", backgroundColor: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Media Uploads */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "16px" }}>Product Media</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            
            {/* Front Image (Required) */}
            <div style={{ border: "1px dashed #E0A96D", padding: "16px", backgroundColor: "#FAF7F2", textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                Front Image *
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImageFront(e.target.files?.[0] || null)}
                style={{ fontSize: "12px", width: "100%" }}
              />
            </div>

            {/* Right Side */}
            <div style={{ border: "1px dashed #E4DDD3", padding: "16px", textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "#8A8279" }}>
                Right Side (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageRight(e.target.files?.[0] || null)}
                style={{ fontSize: "12px", width: "100%" }}
              />
            </div>

            {/* Left Side */}
            <div style={{ border: "1px dashed #E4DDD3", padding: "16px", textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "#8A8279" }}>
                Left Side (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageLeft(e.target.files?.[0] || null)}
                style={{ fontSize: "12px", width: "100%" }}
              />
            </div>

            {/* Back Side */}
            <div style={{ border: "1px dashed #E4DDD3", padding: "16px", textAlign: "center" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "#8A8279" }}>
                Back Side (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageBack(e.target.files?.[0] || null)}
                style={{ fontSize: "12px", width: "100%" }}
              />
            </div>
            
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Video Upload (Optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="input"
            />
            <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "4px" }}>
              Upload a video to showcase this product.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "16px", paddingTop: "24px", borderTop: "1px solid #F3EFEA" }}>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: "14px 32px" }}>
            {isSubmitting ? "Uploading & Saving..." : "Save & Publish Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
