"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string; // Optional URL to use if there's no history
  className?: string;
  style?: React.CSSProperties;
}

export function BackButton({ 
  label = "Back", 
  fallbackUrl = "/",
  className = "",
  style
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if we can safely go back in history
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 hover:opacity-75 transition-opacity ${className}`}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: "14px",
        fontWeight: 500,
        color: "inherit",
        ...style
      }}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
