"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  FileText,
  MapPin,
  Package,
  CheckCircle2,
  AlertCircle,
  Tag,
  Users,
  ArrowRight,
  Layers,
} from "lucide-react";

const BENEFITS = [
  {
    icon: <Tag size={24} />,
    title: "Tiered Wholesale Pricing",
    desc: "The more you order, the better your rate. Unlocks automatically after approval.",
  },
  {
    icon: <Package size={24} />,
    title: "Bulk Order Support",
    desc: "Dedicated support for large fabric and clothing orders for businesses and boutiques.",
  },
  {
    icon: <Users size={24} />,
    title: "Exclusive Business Terms",
    desc: "Payment terms, priority fulfillment, and dedicated account support for approved wholesale partners.",
  },
  {
    icon: <Layers size={24} />,
    title: "Full Catalog Access",
    desc: "Access our complete catalog of fabrics, dress materials, sarees, kurtis, and menswear.",
  },
];

export function WholesalePageClient() {
  const [form, setForm] = useState({
    businessName: "",
    shopName: "",
    gstNumber: "",
    businessAddress: "",
    whatsapp: "",
    interestedCategories: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const CATEGORIES = [
    "Fabrics",
    "Dress Materials",
    "Sarees",
    "Kurtis",
    "Suits",
    "Men's Wear",
    "Women's Wear",
    "Kids",
  ];

  const toggleCategory = (cat: string) => {
    setForm((f) => ({
      ...f,
      interestedCategories: f.interestedCategories.includes(cat)
        ? f.interestedCategories.filter((c) => c !== cat)
        : [...f.interestedCategories, cat],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/wholesale/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setResult({ type: "error", message: "Please sign in to submit a wholesale application." });
        } else if (res.status === 409) {
          setResult({ type: "error", message: `You have already submitted an application. Current status: ${data.status}. Check your status on the status page.` });
        } else {
          setResult({ type: "error", message: data.error || "Failed to submit application." });
        }
      } else {
        setResult({
          type: "success",
          message:
            "Your wholesale application has been submitted! We'll review it within 1–2 business days and contact you on WhatsApp.",
        });
        setForm({ businessName: "", shopName: "", gstNumber: "", businessAddress: "", whatsapp: "", interestedCategories: [] });
      }
    } catch {
      setResult({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: "#1A1918", color: "white", padding: "60px 20px" }}>
        <div className="container-main" style={{ maxWidth: "900px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E0A96D", marginBottom: "16px", fontFamily: "var(--font-sans)" }}>
            Business Partnership
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, color: "white", marginBottom: "20px", lineHeight: 1.15 }}>
            Noble Textile Wholesale
          </h1>
          <p style={{ fontSize: "16px", color: "#B8AFA4", maxWidth: "600px", margin: "0 auto 32px", fontFamily: "var(--font-sans)", lineHeight: 1.7 }}>
            Partner with us for access to premium fabrics and clothing at wholesale prices.
            We work with boutiques, tailors, retailers, and bulk buyers across India.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a href="#apply" className="btn btn-primary">
              Apply for Wholesale Account
            </a>
            <Link href="/wholesale/status" className="btn btn-secondary" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
              Check Application Status
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-spacing">
        <div className="container-main" style={{ maxWidth: "1000px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 500, color: "#1A1918", textAlign: "center", marginBottom: "40px" }}>
            Wholesale Partner Benefits
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }} className="md:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E4DDD3",
                  padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#9E3B2B", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "8px", fontFamily: "var(--font-sans)" }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale Pricing Tiers */}
      <section style={{ backgroundColor: "white", padding: "60px 20px" }}>
        <div className="container-main" style={{ maxWidth: "800px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 500, color: "#1A1918", marginBottom: "12px" }}>
            Wholesale Pricing Tiers
          </h2>
          <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "36px", fontFamily: "var(--font-sans)" }}>
            Pricing is calculated server-side based on approved wholesale status and quantity ordered.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", backgroundColor: "#E4DDD3", border: "1px solid #E4DDD3" }} className="md:grid-cols-4">
            {[
              { label: "Retail", qty: "1–4 pieces", icon: "🛍️" },
              { label: "Tier 1", qty: "5–9 pieces", icon: "📦" },
              { label: "Tier 2", qty: "10–24 pieces", icon: "🏭" },
              { label: "Tier 3", qty: "25+ pieces", icon: "🤝" },
            ].map((tier, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i === 3 ? "#1A1918" : "white",
                  padding: "24px 16px",
                  color: i === 3 ? "white" : "#1A1918",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{tier.icon}</div>
                <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px", fontFamily: "var(--font-serif)" }}>{tier.label}</p>
                <p style={{ fontSize: "12px", color: i === 3 ? "#B8AFA4" : "#8A8279", fontFamily: "var(--font-sans)" }}>{tier.qty}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "16px", fontFamily: "var(--font-sans)" }}>
            Actual prices are set per product. Apply below to unlock wholesale rates.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="section-spacing">
        <div className="container-main" style={{ maxWidth: "680px" }}>
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "40px 36px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 500, color: "#1A1918", marginBottom: "8px" }}>
              Apply for Wholesale Account
            </h2>
            <p style={{ fontSize: "13px", color: "#8A8279", marginBottom: "32px", fontFamily: "var(--font-sans)" }}>
              Fill in your business details below. You must be logged in to apply.
              Applications are reviewed within 1–2 business days.
            </p>

            {result && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 18px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  backgroundColor: result.type === "success" ? "#E8F5E9" : "#FEF2F2",
                  border: `1px solid ${result.type === "success" ? "#A5D6A7" : "#FCA5A5"}`,
                  color: result.type === "success" ? "#2C6E3F" : "#B91C1C",
                  fontSize: "14px",
                }}
              >
                {result.type === "success" ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "1px" }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />}
                <div>
                  {result.message}
                  {result.type === "error" && result.message.includes("sign in") && (
                    <div style={{ marginTop: "8px" }}>
                      <Link href="/login" style={{ color: "#9E3B2B", fontWeight: 600, textDecoration: "underline" }}>
                        Sign in / Register →
                      </Link>
                    </div>
                  )}
                  {result.type === "error" && result.message.includes("already submitted") && (
                    <div style={{ marginTop: "8px" }}>
                      <Link href="/wholesale/status" style={{ color: "#9E3B2B", fontWeight: 600, textDecoration: "underline" }}>
                        Check your status →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Business Name */}
              <div>
                <label style={labelStyle} htmlFor="wh-businessName">
                  <Building2 size={14} /> Business / Company Name *
                </label>
                <input
                  id="wh-businessName"
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                  required
                  placeholder="Noble Trading Co."
                  style={inputStyle}
                />
              </div>

              {/* Shop Name */}
              <div>
                <label style={labelStyle} htmlFor="wh-shopName">
                  Shop / Store Name (if different)
                </label>
                <input
                  id="wh-shopName"
                  type="text"
                  value={form.shopName}
                  onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
                  placeholder="Noble Textiles Shop"
                  style={inputStyle}
                />
              </div>

              {/* GST */}
              <div>
                <label style={labelStyle} htmlFor="wh-gst">
                  <FileText size={14} /> GST Number (if registered)
                </label>
                <input
                  id="wh-gst"
                  type="text"
                  value={form.gstNumber}
                  onChange={(e) => setForm((f) => ({ ...f, gstNumber: e.target.value.toUpperCase() }))}
                  placeholder="27XXXXX1234X1Z5"
                  style={inputStyle}
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label style={labelStyle} htmlFor="wh-whatsapp">
                  <Phone size={14} /> WhatsApp / Mobile Number *
                </label>
                <input
                  id="wh-whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                  required
                  placeholder="+91 98765 43210"
                  style={inputStyle}
                />
              </div>

              {/* Business Address */}
              <div>
                <label style={labelStyle} htmlFor="wh-address">
                  <MapPin size={14} /> Business Address *
                </label>
                <textarea
                  id="wh-address"
                  value={form.businessAddress}
                  onChange={(e) => setForm((f) => ({ ...f, businessAddress: e.target.value }))}
                  required
                  rows={3}
                  placeholder="Shop No., Street, City, State, Pincode"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {/* Interested Categories */}
              <div>
                <label style={labelStyle}>
                  <Package size={14} /> Interested Categories
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      style={{
                        padding: "6px 14px",
                        border: `1px solid ${form.interestedCategories.includes(cat) ? "#1A1918" : "#E4DDD3"}`,
                        borderRadius: "20px",
                        fontSize: "13px",
                        background: form.interestedCategories.includes(cat) ? "#1A1918" : "white",
                        color: form.interestedCategories.includes(cat) ? "white" : "#1A1918",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "14px",
                  backgroundColor: submitting ? "#8A8279" : "#1A1918",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {submitting ? "Submitting..." : <>Submit Application <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#1A1918",
  marginBottom: "8px",
  fontFamily: "var(--font-sans)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid #E4DDD3",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#1A1918",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};
