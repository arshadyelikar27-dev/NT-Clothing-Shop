"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function RefreshStatusButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    
    // Reset state after a short delay to show the animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        color: "#8A8279",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        padding: "4px",
      }}
      className="hover:text-black transition-colors"
    >
      <RefreshCw 
        size={14} 
        style={{ 
          animation: isRefreshing ? "spin 1s linear infinite" : "none" 
        }} 
      />
      Refresh Status
    </button>
  );
}
