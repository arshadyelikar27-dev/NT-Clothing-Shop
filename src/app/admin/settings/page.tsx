export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { AdminSettingsForm } from "./AdminSettingsForm";

export default async function AdminSettingsPage() {
  const settingsRecords = await prisma.storeSetting.findMany();
  const settings: Record<string, string> = {};
  for (const s of settingsRecords) {
    settings[s.key] = s.value;
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
          Store Settings & Configuration
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8279" }}>
          Configure NOBLE TEXTILE store details, shipping rates, and payment options
        </p>
      </div>

      <AdminSettingsForm initialSettings={settings} />
    </div>
  );
}

