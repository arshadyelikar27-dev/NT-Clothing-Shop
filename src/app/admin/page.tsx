export const revalidate = 3600; // Cache for 1 hour, updated via revalidatePath

import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  Plus,
  TrendingUp,
  Layers,
} from "lucide-react";
import RealtimeRefresher from "@/components/admin/RealtimeRefresher";

export default async function AdminOverviewPage() {
  const [
    totalProductsCount,
    publishedProductsCount,
    totalCategoriesCount,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { isArchived: false } }),
    prisma.product.count({ where: { isArchived: false, isPublished: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
      },
    }),
  ]);

  return (
    <div>
      <RealtimeRefresher events={["inventory-update"]} />

      {/* Page Title & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 500, color: "#1A1918" }}>
            Store Overview
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            Catalog management for NOBLE TEXTILE (Hatte Nagar, Latur)
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </div>

      {/* ════ KPI Cards ════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {/* Total Products */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "20px", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A8279" }}>Total Products</p>
            <Package size={18} color="#9E3B2B" />
          </div>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "#1A1918" }}>{totalProductsCount}</p>
          <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "4px" }}>{publishedProductsCount} published</p>
        </div>

        {/* Categories */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "20px", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A8279" }}>Categories</p>
            <Layers size={18} color="#2C6E3F" />
          </div>
          <p style={{ fontSize: "28px", fontWeight: 700, color: "#1A1918" }}>{totalCategoriesCount}</p>
          <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "4px" }}>Active categories</p>
        </div>



        {/* Inquiry Channel */}
        <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "20px", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A8279" }}>Inquiry Channel</p>
            <TrendingUp size={18} color="#2C6E3F" />
          </div>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#2C6E3F" }}>WhatsApp + Call</p>
          <a
            href="https://wa.me/919764313958"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "12px", color: "#2C6E3F", textDecoration: "underline", marginTop: "4px", display: "block" }}
          >
            +91 97643 13958
          </a>
        </div>
      </div>



      {/* ════ Recent Products ════ */}
      <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #E4DDD3" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>Recent Products</h2>
          <Link href="/admin/products" style={{ fontSize: "12px", color: "#9E3B2B", textDecoration: "none", fontWeight: 500 }}>
            View All →
          </Link>
        </div>
        <div>
          {recentProducts.map((product, idx) => (
            <div
              key={product.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 20px",
                borderBottom: idx < recentProducts.length - 1 ? "1px solid #E4DDD3" : "none",
              }}
            >
              {product.images[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  style={{ width: "44px", height: "56px", objectFit: "cover", borderRadius: "4px", border: "1px solid #E4DDD3", flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: "44px", height: "56px", backgroundColor: "#F3EFEA", borderRadius: "4px", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {product.name}
                </p>
                <p style={{ fontSize: "11px", color: "#8A8279" }}>{product.category.name}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A1918" }}>₹{product.price.toLocaleString("en-IN")}</p>
                <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 6px", borderRadius: "3px", backgroundColor: product.isPublished ? "#D1FAE5" : "#FEE2E2", color: product.isPublished ? "#065F46" : "#991B1B" }}>
                  {product.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <Link
                href={`/admin/products/${product.id}/edit`}
                style={{ fontSize: "12px", color: "#9E3B2B", textDecoration: "none", fontWeight: 500, flexShrink: 0 }}
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
