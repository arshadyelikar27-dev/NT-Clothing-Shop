"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export function AdminProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    categoryId: categories[0]?.id || "",
    unitType: "PER_PIECE",
    stock: "50",
    fabric: "",
    weave: "",
    gsm: "",
    widthInches: "44 inches",
    careInstructions: "",
    description: "",
    shortDescription: "",
    imageUrl: "/images/products/premium-cotton-fabric.jpg",
    isFeatured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.price || !form.categoryId) {
      setError("Please fill in all required fields (Name, SKU, Price, Category)");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Basic Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pure Cambric Cotton Fabric"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Unique SKU Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NT-COT-101"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="input"
            />
          </div>
        </div>

        {/* Category & Unit Type */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-3">
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
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
              Unit Type *
            </label>
            <select
              value={form.unitType}
              onChange={(e) => setForm({ ...form, unitType: e.target.value })}
              className="input"
            >
              <option value="PER_PIECE">Per Piece (Garment / Saree / Dupatta)</option>
              <option value="PER_METER">Per Meter (Running Fabric)</option>
              <option value="PER_SET">Per Set (Unstitched Salwar / Suit)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Stock Quantity ({form.unitType === "PER_METER" ? "Meters" : "Pieces"}) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input"
            />
          </div>
        </div>

        {/* Pricing */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Retail Price (₹) {form.unitType === "PER_METER" ? "/ meter" : ""} *
            </label>
            <input
              type="number"
              required
              min={0}
              placeholder="e.g. 350"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Original / Compare-at Price (₹) (Optional)
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 450"
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
              className="input"
            />
          </div>
        </div>

        {/* Fabric Specifications */}
        <div style={{ borderTop: "1px solid #E4DDD3", paddingTop: "20px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "14px", color: "#9E3B2B" }}>
            Textile & Fabric Attributes
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-4">
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Fabric Material
              </label>
              <input
                type="text"
                placeholder="e.g. 100% Pure Cotton"
                value={form.fabric}
                onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Weave Type
              </label>
              <input
                type="text"
                placeholder="e.g. Cambric / Plain"
                value={form.weave}
                onChange={(e) => setForm({ ...form, weave: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Count / GSM
              </label>
              <input
                type="text"
                placeholder="e.g. 60s Count / 110 GSM"
                value={form.gsm}
                onChange={(e) => setForm({ ...form, gsm: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Fabric Width
              </label>
              <input
                type="text"
                placeholder="e.g. 44 inches"
                value={form.widthInches}
                onChange={(e) => setForm({ ...form, widthInches: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Image & Description */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Primary Image Path / URL
          </label>
          <input
            type="text"
            placeholder="/images/products/..."
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="input"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Product Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe the fabric feel, drape, design, and suitability..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="checkbox"
            id="featured"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          <label htmlFor="featured" style={{ fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            Feature on Homepage
          </label>
        </div>

        {/* Submit */}
        <div style={{ marginTop: "16px" }}>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: "14px 32px" }}>
            {isSubmitting ? "Saving Product..." : "Save & Publish Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
