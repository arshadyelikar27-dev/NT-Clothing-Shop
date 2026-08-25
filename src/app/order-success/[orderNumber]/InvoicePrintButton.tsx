"use client";

import { Printer } from "lucide-react";

export function InvoicePrintButton({ order }: { order: unknown }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="btn btn-primary btn-sm"
      style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
    >
      <Printer size={14} /> Print / Save Tax Invoice
    </button>
  );
}
