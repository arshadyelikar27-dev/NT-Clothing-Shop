import Link from "next/link";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy — NOBLE TEXTILE",
  description: "Learn about NOBLE TEXTILE shipping rates, delivery timelines, and order dispatch from Latur.",
};

export default function ShippingPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "8px" }}>
          Shipping & Delivery Policy
        </h1>
        <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "32px" }}>
          Last updated: August 2026 • NOBLE TEXTILE, Hatte Nagar, Latur
        </p>

        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px", fontSize: "14px", lineHeight: 1.8, color: "#2D2B29" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            1. Order Dispatch & Location
          </h2>
          <p style={{ marginBottom: "20px" }}>
            All orders placed on our website are cut, inspected, and dispatched directly from our physical retail store located in <strong>Hatte Nagar, Latur, Maharashtra 413512, India</strong>. Orders are processed within 24 to 48 business hours after confirmation.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            2. Shipping Rates
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li><strong>Standard Surface Shipping:</strong> A flat charge of ₹79 applies on all orders.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            3. Estimated Delivery Times
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Delivery timelines depend on your PIN code and location:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "32px" }}>
            <li><strong>All Across India:</strong> Standard delivery time is 7 to 10 days.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            4. Order Tracking
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Once your package is handed over to our courier partner (DTDC, Delhivery, or Speed Post), you will receive a tracking number and courier link via email and your account dashboard.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "12px", color: "#1A1918" }}>
            5. Inquiries & Support
          </h2>
          <p>
            For any shipping inquiries or urgent local pickups in Latur, please call <strong>+91 78210 59350</strong> or email <strong>contact@nobletextile.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
