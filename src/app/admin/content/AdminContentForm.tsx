"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function AdminContentForm({
  initialContent,
}: {
  initialContent: Record<string, string>;
}) {
  const router = useRouter();

  let heroParsed = {
    headline: "Fabric that feels right.",
    subtext: "Textiles selected for how they look, feel and wear. From everyday cotton to occasion-ready silk.",
  };
  try {
    if (initialContent.HERO) heroParsed = JSON.parse(initialContent.HERO);
  } catch {
    // Ignored
  }

  const [headline, setHeadline] = useState(heroParsed.headline || "Fabric that feels right.");
  const [subtext, setSubtext] = useState(heroParsed.subtext || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "HERO",
          content: {
            headline,
            subtext,
            primaryCta: { text: "Shop Collection", href: "/shop" },
            secondaryCta: { text: "Explore Textiles", href: "/category/fabrics" },
          },
        }),
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
          <Check size={16} /> Homepage hero copy updated successfully!
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Hero Main Headline
          </label>
          <input
            type="text"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Hero Supporting Text
          </label>
          <textarea
            rows={3}
            required
            value={subtext}
            onChange={(e) => setSubtext(e.target.value)}
            className="input"
          />
        </div>

        <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "14px 28px" }}>
          {isSaving ? "Saving..." : "Update Hero Section"}
        </button>
      </div>
    </form>
  );
}
