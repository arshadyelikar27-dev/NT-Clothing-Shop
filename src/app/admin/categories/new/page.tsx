import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";

export default function AdminNewCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    await prisma.category.create({
      data: {
        name,
        description,
        slug,
      },
    });

    redirect("/admin/categories");
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "24px" }}>
        <BackButton 
          label="Back to Categories" 
          fallbackUrl="/admin/categories"
          className="mb-2 text-[#8A8279]"
        />
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
          Add New Category
        </h1>
      </div>

      <div style={{ backgroundColor: "white", padding: "24px", border: "1px solid #E4DDD3" }}>
        <form action={createCategory} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "8px" }}>
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #E4DDD3",
                fontSize: "14px",
                outline: "none",
              }}
              placeholder="e.g. Sarees"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "8px" }}>
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #E4DDD3",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
              }}
              placeholder="Description of the category..."
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#1A1918",
              color: "white",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}
