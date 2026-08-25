import { prisma } from "@/lib/db";
import { AdminContentForm } from "./AdminContentForm";

export default async function AdminContentPage() {
  const contentItems = await prisma.homepageContent.findMany();
  const contentMap: Record<string, string> = {};
  for (const item of contentItems) {
    contentMap[item.section] = item.content;
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
          Homepage Content & Banners (CMS)
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8279" }}>
          Update hero headlines, announcement bar text, and promotional banners
        </p>
      </div>

      <AdminContentForm initialContent={contentMap} />
    </div>
  );
}
