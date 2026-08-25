"use client";

import { useUIStore } from "@/lib/store";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function Notification() {
  const { notification, clearNotification } = useUIStore();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
  };

  const colors = {
    success: { bg: "#2C6E3F", border: "#3D8C54" },
    error: { bg: "#B91C1C", border: "#DC2626" },
    info: { bg: "#1E5F8A", border: "#2980B9" },
  };

  const style = colors[notification.type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        backgroundColor: style.bg,
        borderLeft: `3px solid ${style.border}`,
        color: "white",
        fontSize: "14px",
        fontFamily: "var(--font-sans)",
        maxWidth: "400px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        animation: "slideInRight 0.3s ease",
      }}
      role="alert"
    >
      {icons[notification.type]}
      <span style={{ flex: 1 }}>{notification.message}</span>
      <button
        onClick={clearNotification}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          padding: "2px",
          opacity: 0.7,
        }}
      >
        <X size={16} />
      </button>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
