import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges — NOBLE TEXTILE",
  description: "Learn about NOBLE TEXTILE 7-day return and exchange policy for fabrics and garments.",
};

export default function ReturnsPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "8px" }}>
          Returns & Exchange Policy
        </h1>
        <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "32px" }}>
          Fair, transparent terms for our textile customers
        </p>

        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px", fontSize: "14px", lineHeight: 1.8, color: "#2D2B29" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            1. 7-Day Hassle-Free Returns
          </h2>
          <p style={{ marginBottom: "20px" }}>
            We want you to be completely satisfied with your fabric and garment selections. You may request a return or exchange within <strong>7 days of delivery</strong> for all readymade kurtis, sarees, unstitched suit sets, and men&apos;s shirts.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            2. Policy on Cut Fabrics (Per-Meter Orders)
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Because running fabrics sold by the meter are custom-cut from master rolls according to your specific requested meterage, returns on cut fabrics are accepted in cases of manufacturing defects, weaving flaws, incorrect meter length received, or transit damage.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            3. Condition of Returned Items
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Items must be unused, unwashed, unaltered, and returned in their original packaging with all tags attached.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            4. Refund Process
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Once the returned package is received and inspected at our Hatte Nagar, Latur facility, refunds will be initiated within 48 hours to the original payment method (or via UPI/Bank transfer for Cash on Delivery orders).
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            5. How to Initiate a Return
          </h2>
          <p>
            To initiate a return, contact our support team via WhatsApp at <strong>+91 78210 59350</strong> or email <strong>contact@nobletextile.com</strong> with your Order Number and photos of the item.
          </p>
        </div>
      </div>
    </div>
  );
}
