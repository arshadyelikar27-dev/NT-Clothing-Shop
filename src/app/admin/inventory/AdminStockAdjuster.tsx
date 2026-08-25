"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function AdminStockAdjuster({
  productId,
  initialStock,
}: {
  productId: string;
  initialStock: number;
}) {
  const router = useRouter();
  const [stock, setStock] = useState(initialStock);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newStock: stock }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    } catch {
      // Ignored
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <input
        type="number"
        min={0}
        value={stock}
        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
        style={{
          width: "70px",
          padding: "4px 8px",
          fontSize: "12px",
          border: "1px solid #E4DDD3",
          textAlign: "center",
        }}
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="btn btn-secondary btn-sm"
        style={{ padding: "4px 8px", fontSize: "11px" }}
      >
        {saved ? <Check size={12} color="#2C6E3F" /> : isSaving ? "..." : "Update"}
      </button>
    </div>
  );
}
