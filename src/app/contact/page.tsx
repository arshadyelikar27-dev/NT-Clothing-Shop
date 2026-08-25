import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Visit Store in Latur — NOBLE TEXTILE",
  description:
    "Visit NOBLE TEXTILE in Hatte Nagar, Latur, Maharashtra 413512. Call +91 78210 59350 or chat with us on WhatsApp.",
};

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
      <div className="container-main">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9E3B2B",
              marginBottom: "8px",
            }}
          >
            Get In Touch
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 500,
              color: "#1A1918",
              marginBottom: "12px",
            }}
          >
            Visit Our Store or Contact Us
          </h1>
          <p style={{ fontSize: "15px", color: "#8A8279", lineHeight: 1.6 }}>
            Located in Hatte Nagar, Latur. We welcome walk-in customers and deliver carefully packaged textiles across India.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "36px",
            marginBottom: "48px",
          }}
          className="lg:grid-cols-[1fr_1.2fr]"
        >
          {/* ════ LEFT: Store Information Cards ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Store Location Card */}
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F3EFEA", color: "#9E3B2B" }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "4px" }}>
                    Physical Store Address
                  </h3>
                  <p style={{ fontSize: "14px", color: "#1A1918", fontWeight: 500, lineHeight: 1.6 }}>
                    NOBLE TEXTILE
                    <br />
                    Hatte Nagar, Latur,
                    <br />
                    Maharashtra 413512, India
                  </p>
                  <div style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Noble+Textile+Hatte+Nagar+Latur+Maharashtra+413512"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <MapPin size={14} /> Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F3EFEA", color: "#9E3B2B" }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "4px" }}>
                    Direct Phone & WhatsApp
                  </h3>
                  <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "8px" }}>
                    Call store staff or place custom inquiries:
                  </p>
                  <a
                    href="tel:+917821059350"
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1A1918",
                      textDecoration: "none",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    +91 78210 59350
                  </a>
                  <a
                    href="https://wa.me/917821059350?text=Hi%20Noble%20Textile%2C%20I%20have%20an%20inquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <MessageSquare size={14} /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Store Hours */}
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F3EFEA", color: "#9E3B2B" }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "4px" }}>
                    Store Timings
                  </h3>
                  <p style={{ fontSize: "14px", color: "#1A1918", lineHeight: 1.6 }}>
                    Monday – Saturday: 10:00 AM – 9:00 PM
                    <br />
                    Sunday: 10:30 AM – 8:00 PM
                  </p>
                  <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "8px" }}>
                    Email: contact@nobletextile.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ════ RIGHT: Interactive Google Maps Embed ════ */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #E4DDD3",
              overflow: "hidden",
              minHeight: "450px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E4DDD3", backgroundColor: "#F3EFEA" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918" }}>
                Live Store Location Map (Latur)
              </span>
            </div>
            <div style={{ flex: 1, minHeight: "400px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.0!2d76.56!3d18.40!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHatte+Nagar+Latur!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "420px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NOBLE TEXTILE store location in Hatte Nagar, Latur"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
