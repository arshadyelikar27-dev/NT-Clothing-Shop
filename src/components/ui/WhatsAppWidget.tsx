"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function WhatsAppWidget() {
  // Pre-filled message and phone number
  const phoneNumber = "919764313958";
  const message = encodeURIComponent("Hi NOBLE TEXTILE, I need some help from your online store.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
      }}
      className="whatsapp-widget"
    >
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          backgroundColor: "#25D366", // WhatsApp Green
          color: "white",
          borderRadius: "50%",
          boxShadow: "0 4px 14px rgba(37, 211, 102, 0.4)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 211, 102, 0.4)";
        }}
      >
        <MessageCircle size={28} />
      </Link>
      
      {/* Optional: Add custom CSS for mobile positioning to avoid overlapping with bottom nav */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .whatsapp-widget {
            bottom: 84px !important; /* Above the mobile bottom nav */
            right: 16px !important;
          }
        }
      `}} />
    </div>
  );
}
