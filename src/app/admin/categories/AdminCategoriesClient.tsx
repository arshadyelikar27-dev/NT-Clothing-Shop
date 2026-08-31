"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderTree,
  Package,
  ArrowUpDown,
  X,
  Loader2,
  Check,
  RefreshCw,
} from "lucide-react";
import { slugify } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _count: {
    products: number;
    children?: number;
  };
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  children?: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  }[];
}

interface ToastState {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

export function AdminCategoriesClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "DISABLED">("ALL");

  // Loading / Action states
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Modals state
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  // Form states for Edit / Add
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    sortOrder: 0,
    isActive: true,
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ─── Filtered Categories ───
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Status filter
      if (filterStatus === "ACTIVE" && !cat.isActive) return false;
      if (filterStatus === "DISABLED" && cat.isActive) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const matchName = cat.name.toLowerCase().includes(query);
      const matchSlug = cat.slug.toLowerCase().includes(query);
      const matchDesc = cat.description?.toLowerCase().includes(query);
      const matchParent = cat.parent?.name.toLowerCase().includes(query);
      return matchName || matchSlug || matchDesc || matchParent;
    });
  }, [categories, searchQuery, filterStatus]);

  // Metric summaries
  const totalCategories = categories.length;
  const activeCategoriesCount = categories.filter((c) => c.isActive).length;
  const disabledCategoriesCount = categories.filter((c) => !c.isActive).length;
  const totalMappedProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);

  // ─── Real-Time Status Toggle ───
  const handleToggleStatus = async (cat: CategoryItem) => {
    if (togglingId) return;
    const newStatus = !cat.isActive;
    setTogglingId(cat.id);

    // Optimistic UI update
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, isActive: newStatus } : c))
    );

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update category status");
      }

      // Update with server returned object
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, ...data.category } : c))
      );

      showToast(
        `"${cat.name}" is now ${newStatus ? "Active" : "Disabled"}`,
        "success"
      );
    } catch (err: any) {
      // Revert optimistic update
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: cat.isActive } : c))
      );
      showToast(err.message || "Failed to change status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Open Edit Modal ───
  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "",
      sortOrder: cat.sortOrder || 0,
      isActive: cat.isActive,
    });
    setAutoSlug(false);
    setFormError(null);
  };

  // ─── Open Add Modal ───
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setFormData({
      name: "",
      slug: "",
      description: "",
      parentId: "",
      sortOrder: categories.length * 10,
      isActive: true,
    });
    setAutoSlug(true);
    setFormError(null);
  };

  // ─── Handle Name Change with Auto-Slug ───
  const handleNameChange = (newName: string) => {
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: autoSlug ? slugify(newName) : prev.slug,
    }));
  };

  // ─── Submit Edit (PATCH) ───
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!formData.name.trim()) {
      setFormError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim() ? slugify(formData.slug) : slugify(formData.name),
          description: formData.description.trim() || null,
          parentId: formData.parentId || null,
          sortOrder: Number(formData.sortOrder) || 0,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update category");
      }

      // Real-time update state
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data.category } : c))
      );

      showToast(`Category "${data.category.name}" updated in real-time`, "success");
      setEditingCategory(null);
    } catch (err: any) {
      setFormError(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Submit Add (POST) ───
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim() ? slugify(formData.slug) : slugify(formData.name),
          description: formData.description.trim() || null,
          parentId: formData.parentId || null,
          sortOrder: Number(formData.sortOrder) || 0,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      // Real-time add to state
      setCategories((prev) => [data.category, ...prev]);

      showToast(`Category "${data.category.name}" created successfully!`, "success");
      setIsAddModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Real-Time Delete (DELETE) ───
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeletingId(deletingCategory.id);

    try {
      const res = await fetch(`/api/admin/categories/${deletingCategory.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      // Real-time remove from state
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      showToast(
        data.message || `Category "${deletingCategory.name}" removed in real-time`,
        "success"
      );
      setDeletingCategory(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete category", "error");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* ════ HEADER & STATS BANNER ════ */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9E3B2B",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Catalog & Taxonomy
            </span>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "26px",
                fontWeight: 600,
                color: "#1A1918",
                margin: 0,
              }}
            >
              Category Management
            </h1>
            <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px" }}>
              Edit and organize store categories, configure URL slugs, and manage catalog hierarchy in real-time.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={openAddModal}
              className="btn btn-primary btn-sm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                backgroundColor: "#1A1918",
                color: "white",
                border: "none",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                borderRadius: "2px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>

        {/* ── Metric Summary Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #E4DDD3",
              padding: "16px 20px",
              borderRadius: "4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#8A8279", fontWeight: 500 }}>
                Total Categories
              </span>
              <Layers size={18} color="#8A8279" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#1A1918", marginTop: "6px" }}>
              {totalCategories}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #E4DDD3",
              padding: "16px 20px",
              borderRadius: "4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#8A8279", fontWeight: 500 }}>
                Active Categories
              </span>
              <CheckCircle2 size={18} color="#2C6E3F" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#2C6E3F", marginTop: "6px" }}>
              {activeCategoriesCount}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #E4DDD3",
              padding: "16px 20px",
              borderRadius: "4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#8A8279", fontWeight: 500 }}>
                Disabled Categories
              </span>
              <XCircle size={18} color="#991B1B" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#991B1B", marginTop: "6px" }}>
              {disabledCategoriesCount}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #E4DDD3",
              padding: "16px 20px",
              borderRadius: "4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#8A8279", fontWeight: 500 }}>
                Products Mapped
              </span>
              <Package size={18} color="#9E3B2B" />
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#1A1918", marginTop: "6px" }}>
              {totalMappedProducts}
            </div>
          </div>
        </div>
      </div>

      {/* ════ SEARCH & FILTER TOOLBAR ════ */}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #E4DDD3",
          borderBottom: "none",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Search Box */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px", maxWidth: "420px" }}>
          <Search
            size={16}
            color="#8A8279"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category name, slug, description..."
            style={{
              width: "100%",
              padding: "9px 36px 9px 36px",
              fontSize: "13px",
              border: "1px solid #E4DDD3",
              backgroundColor: "#FAF7F2",
              borderRadius: "4px",
              outline: "none",
              color: "#1A1918",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#8A8279",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#8A8279", marginRight: "4px", fontWeight: 500 }}>
            Status:
          </span>
          {(["ALL", "ACTIVE", "DISABLED"] as const).map((status) => {
            const isSelected = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: "5px 12px",
                  fontSize: "12px",
                  fontWeight: isSelected ? 600 : 500,
                  backgroundColor: isSelected ? "#1A1918" : "#F3EFEA",
                  color: isSelected ? "white" : "#6E675F",
                  border: isSelected ? "1px solid #1A1918" : "1px solid #E4DDD3",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {status === "ALL" ? `All (${categories.length})` : status === "ACTIVE" ? `Active (${activeCategoriesCount})` : `Disabled (${disabledCategoriesCount})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ════ CATEGORIES TABLE ════ */}
      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "#F3EFEA",
                borderBottom: "1px solid #E4DDD3",
                textAlign: "left",
                color: "#1A1918",
              }}
            >
              <th style={{ padding: "12px 18px", fontWeight: 600, width: "24%" }}>
                Category Name
              </th>
              <th style={{ padding: "12px 18px", fontWeight: 600, width: "18%" }}>
                URL Slug
              </th>
              <th style={{ padding: "12px 18px", fontWeight: 600, width: "26%" }}>
                Description
              </th>
              <th style={{ padding: "12px 18px", fontWeight: 600, textAlign: "center", width: "10%" }}>
                Products
              </th>
              <th style={{ padding: "12px 18px", fontWeight: 600, textAlign: "center", width: "10%" }}>
                Status
              </th>
              <th style={{ padding: "12px 18px", fontWeight: 600, textAlign: "right", width: "12%" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#8A8279" }}>
                  <Layers size={36} color="#B8AFA4" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918" }}>
                    No categories found
                  </p>
                  <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "4px" }}>
                    {searchQuery
                      ? `No category matches "${searchQuery}". Try a different keyword.`
                      : "Click 'Add Category' above to create your first store category."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => {
                const isToggling = togglingId === cat.id;
                const productCount = cat._count?.products || 0;

                return (
                  <tr
                    key={cat.id}
                    style={{
                      borderBottom: "1px solid #F3EFEA",
                      transition: "background-color 0.15s",
                    }}
                    className="hover:bg-[#FAF7F2]"
                  >
                    {/* Name + Parent / Storefront link */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontWeight: 600, color: "#1A1918", fontSize: "14px" }}>
                              {cat.name}
                            </span>
                            <Link
                              href={`/category/${cat.slug}`}
                              target="_blank"
                              title="View category on storefront"
                              style={{
                                color: "#8A8279",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                              className="hover:text-[#9E3B2B]"
                            >
                              <ExternalLink size={12} />
                            </Link>
                          </div>

                          {cat.parent && (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                marginTop: "3px",
                                fontSize: "11px",
                                color: "#8A8279",
                                backgroundColor: "#F3EFEA",
                                padding: "1px 6px",
                                borderRadius: "3px",
                              }}
                            >
                              <FolderTree size={10} />
                              <span>Subcategory of: <strong>{cat.parent.name}</strong></span>
                            </div>
                          )}

                          {cat.children && cat.children.length > 0 && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#6E675F",
                                marginTop: "3px",
                              }}
                            >
                              {cat.children.length} subcategory{cat.children.length > 1 ? "ies" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td style={{ padding: "14px 18px" }}>
                      <code
                        style={{
                          fontSize: "12px",
                          backgroundColor: "#FAF7F2",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          border: "1px solid #E4DDD3",
                          color: "#6E675F",
                          fontFamily: "monospace",
                        }}
                      >
                        /{cat.slug}
                      </code>
                    </td>

                    {/* Description */}
                    <td style={{ padding: "14px 18px", color: "#6E675F" }}>
                      {cat.description ? (
                        <span
                          title={cat.description}
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontSize: "12px",
                            lineHeight: 1.4,
                          }}
                        >
                          {cat.description}
                        </span>
                      ) : (
                        <span style={{ color: "#B8AFA4", fontSize: "12px" }}>— No description —</span>
                      )}
                    </td>

                    {/* Products Count */}
                    <td style={{ padding: "14px 18px", textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: "12px",
                          backgroundColor: productCount > 0 ? "#F3EFEA" : "#FAF7F2",
                          color: productCount > 0 ? "#1A1918" : "#8A8279",
                          border: "1px solid #E4DDD3",
                          display: "inline-block",
                        }}
                      >
                        {productCount} {productCount === 1 ? "item" : "items"}
                      </span>
                    </td>

                    {/* Real-Time Active Toggle */}
                    <td style={{ padding: "14px 18px", textAlign: "center" }}>
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        disabled={isToggling}
                        title={`Click to ${cat.isActive ? "disable" : "enable"} category in real-time`}
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "14px",
                          backgroundColor: cat.isActive ? "#E8F5E9" : "#FEE2E2",
                          color: cat.isActive ? "#2C6E3F" : "#991B1B",
                          border: cat.isActive ? "1px solid #C8E6C9" : "1px solid #FECACA",
                          cursor: isToggling ? "wait" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.15s",
                        }}
                        className="hover:opacity-80"
                      >
                        {isToggling ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : cat.isActive ? (
                          <Check size={11} />
                        ) : (
                          <X size={11} />
                        )}
                        <span>{cat.isActive ? "Active" : "Disabled"}</span>
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(cat)}
                          title="Edit Category in real-time"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 600,
                            backgroundColor: "#FAF7F2",
                            border: "1px solid #E4DDD3",
                            color: "#1A1918",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          className="hover:bg-[#1A1918] hover:text-white"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          title="Delete Category"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "6px",
                            fontSize: "12px",
                            backgroundColor: "#FFF5F5",
                            border: "1px solid #FECACA",
                            color: "#991B1B",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          className="hover:bg-[#991B1B] hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ════ EDIT CATEGORY MODAL ════ */}
      {editingCategory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setEditingCategory(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              maxWidth: "560px",
              borderRadius: "6px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E4DDD3",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #E4DDD3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#FAF7F2",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E3B2B", textTransform: "uppercase" }}>
                  Real-Time Editor
                </span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", color: "#1A1918", margin: 0 }}>
                  Edit Category: {editingCategory.name}
                </h2>
              </div>
              <button
                onClick={() => !isSubmitting && setEditingCategory(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  color: "#8A8279",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} style={{ padding: "24px" }}>
              {formError && (
                <div
                  style={{
                    backgroundColor: "#FEE2E2",
                    border: "1px solid #F87171",
                    color: "#991B1B",
                    padding: "10px 14px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    marginBottom: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1A1918",
                      marginBottom: "6px",
                    }}
                  >
                    Category Name <span style={{ color: "#9E3B2B" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Sarees, Fabrics, Kurtis"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Slug */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918" }}>
                      URL Slug
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoSlug(true);
                        setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "11px",
                        color: "#9E3B2B",
                        cursor: "pointer",
                        fontWeight: 600,
                        textDecoration: "underline",
                      }}
                    >
                      Regenerate from name
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "13px",
                        color: "#8A8279",
                        fontFamily: "monospace",
                      }}
                    >
                      /category/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => {
                        setAutoSlug(false);
                        setFormData((prev) => ({ ...prev, slug: e.target.value }));
                      }}
                      placeholder="sarees"
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 92px",
                        fontSize: "13px",
                        border: "1px solid #E4DDD3",
                        borderRadius: "4px",
                        outline: "none",
                        fontFamily: "monospace",
                        color: "#1A1918",
                      }}
                    />
                  </div>
                </div>

                {/* Parent Category & Sort Order */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "12px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A1918",
                        marginBottom: "6px",
                      }}
                    >
                      Parent Category (Optional)
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "13px",
                        border: "1px solid #E4DDD3",
                        borderRadius: "4px",
                        outline: "none",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">None (Top-level Category)</option>
                      {categories
                        .filter((c) => c.id !== editingCategory.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A1918",
                        marginBottom: "6px",
                      }}
                    >
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "13px",
                        border: "1px solid #E4DDD3",
                        borderRadius: "4px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1A1918",
                      marginBottom: "6px",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description for SEO and category banner..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "13px",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Active Checkbox */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    backgroundColor: "#FAF7F2",
                    borderRadius: "4px",
                    border: "1px solid #E4DDD3",
                  }}
                >
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#1A1918" }}
                  />
                  <label htmlFor="editIsActive" style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918", cursor: "pointer" }}>
                    Active (visible on storefront and navigation menus)
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "24px",
                  paddingTop: "16px",
                  borderTop: "1px solid #E4DDD3",
                }}
              >
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingCategory(null)}
                  style={{
                    padding: "10px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "1px solid #E4DDD3",
                    color: "#6E675F",
                    borderRadius: "4px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "10px 22px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "#1A1918",
                    border: "none",
                    color: "white",
                    borderRadius: "4px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ ADD CATEGORY MODAL ════ */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setIsAddModalOpen(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              maxWidth: "560px",
              borderRadius: "6px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              border: "1px solid #E4DDD3",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #E4DDD3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#FAF7F2",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#9E3B2B", textTransform: "uppercase" }}>
                  Catalog Addition
                </span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", color: "#1A1918", margin: 0 }}>
                  Create New Category
                </h2>
              </div>
              <button
                onClick={() => !isSubmitting && setIsAddModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  color: "#8A8279",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAdd} style={{ padding: "24px" }}>
              {formError && (
                <div
                  style={{
                    backgroundColor: "#FEE2E2",
                    border: "1px solid #F87171",
                    color: "#991B1B",
                    padding: "10px 14px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    marginBottom: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1A1918",
                      marginBottom: "6px",
                    }}
                  >
                    Category Name <span style={{ color: "#9E3B2B" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Sarees, Fabrics, Kurtis"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "6px" }}>
                    URL Slug
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "13px",
                        color: "#8A8279",
                        fontFamily: "monospace",
                      }}
                    >
                      /category/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => {
                        setAutoSlug(false);
                        setFormData((prev) => ({ ...prev, slug: e.target.value }));
                      }}
                      placeholder="sarees"
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 92px",
                        fontSize: "13px",
                        border: "1px solid #E4DDD3",
                        borderRadius: "4px",
                        outline: "none",
                        fontFamily: "monospace",
                        color: "#1A1918",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "12px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A1918",
                        marginBottom: "6px",
                      }}
                    >
                      Parent Category (Optional)
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "13px",
                        border: "1px solid #E4DDD3",
                        borderRadius: "4px",
                        outline: "none",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">None (Top-level Category)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A1918",
                        marginBottom: "6px",
                      }}
                    >
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "13px",
                        border: "1px solid #E4DDD3",
                        borderRadius: "4px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1A1918",
                      marginBottom: "6px",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Category description..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "13px",
                      border: "1px solid #E4DDD3",
                      borderRadius: "4px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    backgroundColor: "#FAF7F2",
                    borderRadius: "4px",
                    border: "1px solid #E4DDD3",
                  }}
                >
                  <input
                    type="checkbox"
                    id="addIsActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#1A1918" }}
                  />
                  <label htmlFor="addIsActive" style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918", cursor: "pointer" }}>
                    Active (visible on storefront immediately)
                  </label>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "24px",
                  paddingTop: "16px",
                  borderTop: "1px solid #E4DDD3",
                }}
              >
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: "10px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "1px solid #E4DDD3",
                    color: "#6E675F",
                    borderRadius: "4px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "10px 22px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "#1A1918",
                    border: "none",
                    color: "white",
                    borderRadius: "4px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ DELETE CONFIRMATION MODAL ════ */}
      {deletingCategory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeletingId) {
              setDeletingCategory(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              maxWidth: "480px",
              borderRadius: "6px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              border: "1px solid #E4DDD3",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #E4DDD3",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: (deletingCategory._count?.products || 0) > 0 ? "#FEF3C7" : "#FEE2E2",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: (deletingCategory._count?.products || 0) > 0 ? "#FDE68A" : "#FECACA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: (deletingCategory._count?.products || 0) > 0 ? "#B45309" : "#991B1B",
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 700,
                    color: (deletingCategory._count?.products || 0) > 0 ? "#92400E" : "#991B1B",
                  }}
                >
                  {(deletingCategory._count?.products || 0) > 0
                    ? "Cannot Delete Category"
                    : `Delete "${deletingCategory.name}"?`}
                </h3>
                <span style={{ fontSize: "12px", color: "#6E675F" }}>
                  Category ID: {deletingCategory.id}
                </span>
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {(deletingCategory._count?.products || 0) > 0 ? (
                <div>
                  <p style={{ fontSize: "14px", color: "#1A1918", lineHeight: 1.5, marginBottom: "14px" }}>
                    This category currently has <strong>{deletingCategory._count.products} product(s)</strong> attached to it.
                  </p>
                  <div
                    style={{
                      backgroundColor: "#FFFBEB",
                      border: "1px solid #FCD34D",
                      padding: "12px",
                      borderRadius: "4px",
                      fontSize: "13px",
                      color: "#92400E",
                      lineHeight: 1.4,
                    }}
                  >
                    To prevent broken product records, you must reassign or remove all products from this category before deleting it.
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: "14px", color: "#1A1918", lineHeight: 1.5, marginBottom: "12px" }}>
                    Are you sure you want to permanently delete <strong>{deletingCategory.name}</strong>?
                  </p>
                  <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.4 }}>
                    This action is permanent and cannot be undone. The category will be removed from navigation and filters immediately.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  disabled={Boolean(isDeletingId)}
                  onClick={() => setDeletingCategory(null)}
                  style={{
                    padding: "9px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "1px solid #E4DDD3",
                    color: "#6E675F",
                    borderRadius: "4px",
                    cursor: isDeletingId ? "not-allowed" : "pointer",
                  }}
                >
                  {(deletingCategory._count?.products || 0) > 0 ? "Close" : "Cancel"}
                </button>

                {(deletingCategory._count?.products || 0) === 0 && (
                  <button
                    type="button"
                    disabled={Boolean(isDeletingId)}
                    onClick={handleConfirmDelete}
                    style={{
                      padding: "9px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      backgroundColor: "#991B1B",
                      border: "none",
                      color: "white",
                      borderRadius: "4px",
                      cursor: isDeletingId ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {isDeletingId ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Deleting...
                      </>
                    ) : (
                      "Delete Category"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ FLOATING TOAST NOTIFICATIONS ════ */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 110,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              minWidth: "280px",
              maxWidth: "400px",
              padding: "12px 16px",
              backgroundColor: t.type === "error" ? "#991B1B" : "#1A1918",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "4px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              animation: "fadeInUp 0.2s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {t.type === "error" ? (
                <AlertTriangle size={16} color="#FECACA" />
              ) : (
                <CheckCircle2 size={16} color="#86EFAC" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
