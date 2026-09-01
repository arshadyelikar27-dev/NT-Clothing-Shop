import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — NOBLE TEXTILE",
  description: "Terms and conditions of sale for NOBLE TEXTILE retail and online orders.",
};

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "8px" }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "32px" }}>
          NOBLE TEXTILE • Hatte Nagar, Latur, Maharashtra
        </p>

        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px", fontSize: "14px", lineHeight: 1.8, color: "#2D2B29" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            1. General Terms
          </h2>
          <p style={{ marginBottom: "20px" }}>
            By placing an order on NOBLE TEXTILE or visiting our retail premises in Hatte Nagar, Latur, you agree to these terms of service and our shipping and return policies.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            2. Product Pricing & Descriptions
          </h2>
          <p style={{ marginBottom: "20px" }}>
            We strive to display exact fabric colours and weave specifications. Due to individual screen settings and natural dye variations in handloom fabrics, minor shade differences may occur. All prices listed are in Indian Rupees (INR) and are inclusive of applicable GST.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            3. Order Placement & Cancellation
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Orders may be cancelled before cutting and dispatch by calling our store at +91 97643 13958. Once cut or handed to courier partners, cancellations are subject to our standard return policy.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            4. Jurisdiction
          </h2>
          <p>
            Any disputes arising out of online or in-store purchases shall be subject to the exclusive jurisdiction of the competent courts in <strong>Latur, Maharashtra, India</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
