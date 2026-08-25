"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function AdminSettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    store_name: initialSettings.store_name || "NOBLE TEXTILE",
    store_phone: initialSettings.store_phone || "+917821059350",
    store_email: initialSettings.store_email || "contact@nobletextile.com",
    store_address: initialSettings.store_address || "Hatte Nagar, Latur, Maharashtra 413512, India",
    store_whatsapp: initialSettings.store_whatsapp || "917821059350",
    free_shipping_threshold: initialSettings.free_shipping_threshold || "999",
    standard_shipping_charge: initialSettings.standard_shipping_charge || "79",
    express_shipping_charge: initialSettings.express_shipping_charge || "149",
    cod_charge: initialSettings.cod_charge || "50",
    gst_rate: initialSettings.gst_rate || "5",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      }
    } catch {
      // Ignored
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px" }}>
      {saved && (
        <div style={{ backgroundColor: "#E8F5E9", color: "#2C6E3F", padding: "10px 14px", fontSize: "13px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Check size={16} /> Store settings updated successfully!
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Store Info */}
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#9E3B2B", marginBottom: "12px" }}>
            1. Store Business Details (Latur)
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Store Name
              </label>
              <input
                type="text"
                value={form.store_name}
                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                className="input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Store Phone Number
                </label>
                <input
                  type="text"
                  value={form.store_phone}
                  onChange={(e) => setForm({ ...form, store_phone: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  WhatsApp Contact (without +)
                </label>
                <input
                  type="text"
                  value={form.store_whatsapp}
                  onChange={(e) => setForm({ ...form, store_whatsapp: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Physical Store Address (Google Maps Location)
              </label>
              <input
                type="text"
                value={form.store_address}
                onChange={(e) => setForm({ ...form, store_address: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Thresholds */}
        <div style={{ borderTop: "1px solid #E4DDD3", paddingTop: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#9E3B2B", marginBottom: "12px" }}>
            2. Shipping Rates & Thresholds
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={form.free_shipping_threshold}
                onChange={(e) => setForm({ ...form, free_shipping_threshold: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={form.standard_shipping_charge}
                onChange={(e) => setForm({ ...form, standard_shipping_charge: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Priority Express Surcharge (₹)
              </label>
              <input
                type="number"
                value={form.express_shipping_charge}
                onChange={(e) => setForm({ ...form, express_shipping_charge: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                Cash on Delivery (COD) Fee (₹)
              </label>
              <input
                type="number"
                value={form.cod_charge}
                onChange={(e) => setForm({ ...form, cod_charge: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "14px 28px" }}>
          {isSaving ? "Saving Settings..." : "Save Store Configuration"}
        </button>
      </div>
    </form>
  );
}
