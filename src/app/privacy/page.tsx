import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NOBLE TEXTILE",
  description: "Privacy Policy for NOBLE TEXTILE, Hatte Nagar, Latur, Maharashtra.",
};

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "8px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "32px" }}>
          NOBLE TEXTILE, Hatte Nagar, Latur, Maharashtra 413512
        </p>

        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px", fontSize: "14px", lineHeight: 1.8, color: "#2D2B29" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: "20px" }}>
            We collect personal information necessary to process and dispatch your textile orders: your name, shipping address, contact phone number, and email address. Payment credentials (card numbers, UPI IDs) are processed securely through certified payment gateways and are never stored on our servers.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            2. How Your Information Is Used
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li>Processing, cutting, and delivering your orders.</li>
            <li>Sending order confirmations, tracking numbers, and tax invoices.</li>
            <li>Providing customer support via WhatsApp or phone.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            3. Data Protection
          </h2>
          <p style={{ marginBottom: "20px" }}>
            We do not sell, rent, or trade customer information with third parties. Your delivery details are shared solely with our shipping partners for delivery fulfillment.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            4. Contact
          </h2>
          <p>
            For privacy inquiries or data update requests, please write to <strong>contact@nobletextile.com</strong> or visit our store in Hatte Nagar, Latur.
          </p>
        </div>
      </div>
    </div>
  );
}
