"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${productName}"? This will also delete all associated images from storage. This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Product deleted successfully");
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "Failed to delete product"}`);
      }
    } catch (error) {
      alert("Network error occurred while deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Product"
      style={{
        background: "none",
        border: "none",
        cursor: isDeleting ? "not-allowed" : "pointer",
        color: isDeleting ? "#ccc" : "#991B1B",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
      }}
      className="hover:bg-red-50 transition-colors"
    >
      <Trash2 size={16} />
    </button>
  );
}
