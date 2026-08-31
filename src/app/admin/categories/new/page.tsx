import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { BackButton } from "@/components/ui/BackButton";
import { slugify } from "@/lib/utils";

export default async function AdminNewCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  async function createCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!name || name.trim() === "") {
      return;
    }

    let slug = slugify(name);
    if (!slug) slug = `cat-${Date.now()}`;

    // Check unique slug
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        slug,
        parentId: parentId && parentId !== "" ? parentId : null,
        sortOrder,
        isActive: true,
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/categories");
      revalidatePath("/shop");
    } catch (e) {
      console.warn("Revalidate error:", e);
    }

    redirect("/admin/categories");
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "24px" }}>
        <BackButton 
          label="Back to Categories" 
          fallbackUrl="/admin/categories"
          className="mb-2 text-[#8A8279]"
        />
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "#1A1918" }}>
          Add New Category
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px" }}>
          Create a new category for products in the catalog.
        </p>
      </div>

      <div style={{ backgroundColor: "white", padding: "28px", border: "1px solid #E4DDD3", borderRadius: "4px" }}>
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
                padding: "10px 12px",
                border: "1px solid #E4DDD3",
                fontSize: "14px",
                outline: "none",
                borderRadius: "4px",
              }}
              placeholder="e.g. Sarees, Fabrics, Kurtis"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "8px" }}>
                Parent Category (Optional)
              </label>
              <select
                name="parentId"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #E4DDD3",
                  fontSize: "13px",
                  outline: "none",
                  backgroundColor: "white",
                  borderRadius: "4px",
                }}
              >
                <option value="">None (Top-level Category)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "8px" }}>
                Sort Order
              </label>
              <input
                type="number"
                name="sortOrder"
                defaultValue={0}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #E4DDD3",
                  fontSize: "13px",
                  outline: "none",
                  borderRadius: "4px",
                }}
              />
            </div>
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
                padding: "10px 12px",
                border: "1px solid #E4DDD3",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                borderRadius: "4px",
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
              borderRadius: "4px",
            }}
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}
