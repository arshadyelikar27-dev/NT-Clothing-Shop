"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Phone, FileText, MapPin, MessageSquare, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export function BulkEnquiryClient() {
  const [form, setForm] = useState({
    productName: "",
    quantity: "",
    size: "",
    color: "",
    businessName: "",
    whatsapp: "",
    gstNumber: "",
    location: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/bulk-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ type: "error", message: data.error || "Failed to submit enquiry." });
      } else {
        setResult({
          type: "success",
          message:
            "Your bulk order enquiry has been received! Our team will contact you on WhatsApp within 24 hours with pricing and availability.",
        });
        setForm({ productName: "", quantity: "", size: "", color: "", businessName: "", whatsapp: "", gstNumber: "", location: "", message: "" });
      }
    } catch {
      setResult({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}>
      <div className="container-main" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9E3B2B", marginBottom: "8px", fontFamily: "var(--font-sans)" }}>
            For Businesses & Retailers
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, color: "#1A1918", marginBottom: "12px" }}>
            Bulk Order Enquiry
          </h1>
          <p style={{ fontSize: "15px", color: "#8A8279", lineHeight: 1.7, fontFamily: "var(--font-sans)", maxWidth: "560px" }}>
            Ordering in large quantities? Fill in the form below and our team will get back to you with custom pricing and availability within 24 hours.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="md:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "36px 32px" }}>
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
                  lineHeight: 1.5,
                }}
              >
                {result.type === "success" ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "1px" }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />}
                {result.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Product Details */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A8279", marginBottom: "16px", fontFamily: "var(--font-sans)" }}>
                  Product Details
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <FormField label="Product Name / Type" id="be-product" icon={<Package size={14} />}>
                    <input
                      id="be-product"
                      type="text"
                      value={form.productName}
                      onChange={(e) => set("productName", e.target.value)}
                      placeholder="e.g. Cotton Kurti Fabric, Georgette Saree..."
                      style={inputStyle}
                    />
                  </FormField>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    <FormField label="Quantity *" id="be-qty">
                      <input id="be-qty" type="text" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} required placeholder="e.g. 50 pcs" style={inputStyle} />
                    </FormField>
                    <FormField label="Size" id="be-size">
                      <input id="be-size" type="text" value={form.size} onChange={(e) => set("size", e.target.value)} placeholder="e.g. M, L, XL" style={inputStyle} />
                    </FormField>
                    <FormField label="Color" id="be-color">
                      <input id="be-color" type="text" value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="e.g. Red, Navy" style={inputStyle} />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A8279", marginBottom: "16px", fontFamily: "var(--font-sans)" }}>
                  Your Business Details
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <FormField label="Business Name *" id="be-business" icon={<FileText size={14} />}>
                    <input id="be-business" type="text" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required placeholder="Your shop or company name" style={inputStyle} />
                  </FormField>
                  <FormField label="WhatsApp Number *" id="be-wa" icon={<Phone size={14} />}>
                    <input id="be-wa" type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} required placeholder="+91 98765 43210" style={inputStyle} />
                  </FormField>
                  <FormField label="GST Number" id="be-gst">
                    <input id="be-gst" type="text" value={form.gstNumber} onChange={(e) => set("gstNumber", e.target.value.toUpperCase())} placeholder="27XXXXX1234X1Z5" style={inputStyle} />
                  </FormField>
                  <FormField label="City / Location *" id="be-location" icon={<MapPin size={14} />}>
                    <input id="be-location" type="text" value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="City, State" style={inputStyle} />
                  </FormField>
                  <FormField label="Additional Message" id="be-msg" icon={<MessageSquare size={14} />}>
                    <textarea
                      id="be-msg"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={3}
                      placeholder="Any specific requirements, design preferences, or questions..."
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </FormField>
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.2s",
                }}
              >
                {submitting ? "Submitting..." : <>Send Enquiry <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ backgroundColor: "#1A1918", color: "white", padding: "28px 24px", borderRadius: "12px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500, marginBottom: "16px" }}>
                What happens next?
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { step: "1", text: "We receive your enquiry" },
                  { step: "2", text: "Our team reviews availability & pricing" },
                  { step: "3", text: "We contact you on WhatsApp within 24h" },
                  { step: "4", text: "Finalize details & place your order" },
                ].map((s) => (
                  <div key={s.step} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span style={{ backgroundColor: "#9E3B2B", color: "white", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                      {s.step}
                    </span>
                    <span style={{ fontSize: "13px", color: "#B8AFA4", lineHeight: 1.5 }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "24px", borderRadius: "12px" }}>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "#1A1918", marginBottom: "12px" }}>
                Prefer to WhatsApp directly?
              </h4>
              <p style={{ fontSize: "13px", color: "#8A8279", marginBottom: "16px", lineHeight: 1.6 }}>
                Send us a message on WhatsApp and we'll respond immediately during business hours.
              </p>
              <a
                href="https://wa.me/917821059350?text=Hi%2C%20I%27m%20interested%20in%20placing%20a%20bulk%20order%20from%20Noble%20Textile."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "11px",
                  backgroundColor: "#25D366",
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                💬 WhatsApp Us Now
              </a>
            </div>

            <div style={{ backgroundColor: "#FAF7F2", border: "1px solid #E4DDD3", padding: "20px", borderRadius: "12px" }}>
              <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.6 }}>
                Want wholesale pricing on a regular basis?{" "}
                <Link href="/wholesale" style={{ color: "#9E3B2B", fontWeight: 600 }}>
                  Apply for a Wholesale Account →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, id, icon, children }: { label: string; id: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#1A1918",
          marginBottom: "6px",
          fontFamily: "var(--font-sans)",
        }}
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #E4DDD3",
  borderRadius: "8px",
  fontSize: "13px",
  backgroundColor: "white",
  color: "#1A1918",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};
