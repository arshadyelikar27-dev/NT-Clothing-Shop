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
    store_phone: initialSettings.store_phone || "+919764313958",
    store_email: initialSettings.store_email || "contact@nobletextile.com",
    store_address: initialSettings.store_address || "Hatte Nagar, Latur, Maharashtra 413512, India",
    store_whatsapp: initialSettings.store_whatsapp || "919764313958",
    free_shipping_threshold:
      initialSettings.shipping_free_threshold || initialSettings.free_shipping_threshold || "999",
    standard_shipping_charge:
      initialSettings.shipping_base_charge || initialSettings.standard_shipping_charge || "79",
    express_shipping_charge:
      initialSettings.shipping_express_surcharge || initialSettings.express_shipping_charge || "149",
    cod_charge:
      initialSettings.shipping_cod_charge || initialSettings.cod_charge || "50",
    cod_enabled: initialSettings.cod_enabled || "true",
    estimated_delivery: initialSettings.estimated_delivery || "5-7 Days",
    gst_rate: initialSettings.gst_rate || "5",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Sync both key conventions so shipping API and store settings always match
      const payload = {
        ...form,
        shipping_base_charge: form.standard_shipping_charge,
        shipping_free_threshold: form.free_shipping_threshold,
        shipping_express_surcharge: form.express_shipping_charge,
        shipping_cod_charge: form.cod_charge,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <form onSubmit={handleSubmit} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px", borderRadius: "8px" }}>
      {saved && (
        <div style={{ backgroundColor: "#E8F5E9", color: "#2C6E3F", padding: "10px 14px", fontSize: "13px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px", borderRadius: "6px" }}>
          <Check size={16} /> Store settings updated and synced successfully!
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* 1. Store Info */}
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#9E3B2B", marginBottom: "16px" }}>
            1. Store Business Details (Latur)
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
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



        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary"
          style={{ alignSelf: "flex-start", padding: "14px 32px", fontSize: "13px", fontWeight: 600 }}
        >
          {isSaving ? "Saving Settings..." : "Save Store Configuration"}
        </button>
      </div>
    </form>
  );
}
