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
  const [videoUrl, setVideoUrl] = useState("");
  
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
      if (videoUrl) formData.append("videoUrl", videoUrl);
      
      if (imageFront) formData.append("imageFront", imageFront);
      if (imageRight) formData.append("imageRight", imageRight);
      if (imageLeft) formData.append("imageLeft", imageLeft);
      if (imageBack) formData.append("imageBack", imageBack);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData, // fetch will automatically set Content-Type to multipart/form-data
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(data.error || "Failed to create product");
      }
    } catch {
      setError("Connection error");
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
              Video URL (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="input"
            />
            <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "4px" }}>
              Paste a link to showcase a video of this product.
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
