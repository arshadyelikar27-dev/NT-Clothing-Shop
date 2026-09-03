"use client";

import { useState, useEffect } from "react";
import { Truck, Save, RefreshCw, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { getShippingSettingsAction, saveShippingSettingsAction } from "@/app/actions/shipping";

interface ShippingSettings {
  shipping_base_charge: string;
  shipping_express_surcharge: string;
  shipping_cod_charge: string;
  shipping_free_threshold: string;
  cod_enabled: string;
  cod_max_amount: string;
  cod_serviceable_pincodes: string;
}


export default function AdminShippingPage() {
  const [settings, setSettings] = useState<ShippingSettings>({
    shipping_base_charge: "79",
    shipping_express_surcharge: "70",
    shipping_cod_charge: "50",
    shipping_free_threshold: "0",
    cod_enabled: "true",
    cod_max_amount: "10000",
    cod_serviceable_pincodes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getShippingSettingsAction();
      setSettings(data as any);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveShippingSettingsAction(settings);
      setMessage({ type: "success", text: "Shipping settings saved successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  }

  const set = (key: keyof ShippingSettings, value: string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "48px", color: "#8A8279" }}>
        <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
        Loading shipping settings...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "#1A1918", display: "flex", alignItems: "center", gap: "10px" }}>
            <Truck size={22} color="#9E3B2B" /> Shipping Configuration
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px" }}>
            Configure shipping charges, free shipping thresholds, and COD settings
          </p>
        </div>
      </div>

      {message && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 18px",
            borderRadius: "8px",
            marginBottom: "24px",
            backgroundColor: message.type === "success" ? "#E8F5E9" : "#FEF2F2",
            border: `1px solid ${message.type === "success" ? "#A5D6A7" : "#FCA5A5"}`,
            color: message.type === "success" ? "#2C6E3F" : "#B91C1C",
            fontSize: "14px",
          }}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Shipping Charges */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", padding: "28px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1918", marginBottom: "6px", fontFamily: "var(--font-serif)" }}>
            Delivery Charges
          </h2>
          <p style={{ fontSize: "13px", color: "#8A8279", marginBottom: "20px" }}>
            Set the base shipping charges and free shipping threshold.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <SettingField
              label="Base Shipping Charge (₹)"
              hint="Applied to all standard orders"
              id="s-base"
            >
              <input
                id="s-base"
                type="number"
                min="0"
                value={settings.shipping_base_charge}
                onChange={(e) => set("shipping_base_charge", e.target.value)}
                style={inputStyle}
              />
            </SettingField>

            <SettingField
              label="Free Shipping Threshold (₹)"
              hint="Set 0 to disable free shipping"
              id="s-free"
            >
              <input
                id="s-free"
                type="number"
                min="0"
                value={settings.shipping_free_threshold}
                onChange={(e) => set("shipping_free_threshold", e.target.value)}
                style={inputStyle}
              />
            </SettingField>
          </div>
        </div>



        {/* Preview */}
        <div style={{ backgroundColor: "#1A1918", color: "white", borderRadius: "12px", padding: "24px 28px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Info size={16} color="#E0A96D" /> Current Configuration Preview
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {[
              { label: "Standard Shipping", value: `₹${settings.shipping_base_charge}` },
              {
                label: "Free Shipping",
                value: parseFloat(settings.shipping_free_threshold) > 0 ? `Above ₹${settings.shipping_free_threshold}` : "Disabled",
              },

            ]
              .filter(Boolean)
              .map((item, i) => (
                <div key={i}>
                  <p style={{ fontSize: "11px", color: "#8A8279", marginBottom: "2px" }}>{item!.label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>{item!.value}</p>
                </div>
              ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 28px",
              backgroundColor: saving ? "#8A8279" : "#1A1918",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-sans)",
            }}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={load}
            style={{ padding: "12px 20px", border: "1px solid #E4DDD3", borderRadius: "8px", background: "white", cursor: "pointer", fontSize: "14px", color: "#1A1918", fontFamily: "var(--font-sans)" }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingField({ label, hint, id, children }: { label: string; hint?: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#1A1918", display: "block", marginBottom: "4px" }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: "11px", color: "#8A8279", marginBottom: "8px" }}>{hint}</p>}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #E4DDD3",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "#FAF7F2",
  color: "#1A1918",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};
