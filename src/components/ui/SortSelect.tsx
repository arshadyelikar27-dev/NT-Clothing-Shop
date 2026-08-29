"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function SortSelect({ 
  currentSort 
}: { 
  currentSort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={currentSort}
        onChange={handleSortChange}
        style={{
          appearance: "none",
          backgroundColor: "white",
          border: "1px solid #E4DDD3",
          padding: "8px 36px 8px 16px",
          fontSize: "13px",
          color: "#1A1918",
          fontFamily: "var(--font-sans)",
          cursor: "pointer",
          outline: "none",
          borderRadius: "4px",
          minWidth: "160px",
        }}
      >
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
      <ChevronDown 
        size={14} 
        style={{ 
          position: "absolute", 
          right: "12px", 
          top: "50%", 
          transform: "translateY(-50%)", 
          pointerEvents: "none",
          color: "#8A8279"
        }} 
      />
    </div>
  );
}
