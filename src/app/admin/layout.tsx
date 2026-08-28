import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Tag,
  Settings,
  BarChart3,
  Sliders,
  LogOut,
  Store,
  FileText,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Guard: Must be authenticated and have an admin role
  if (!session || session.role === "CUSTOMER") {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={18} /> },
    { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
    { href: "/admin/categories", label: "Categories", icon: <Layers size={18} /> },
    { href: "/admin/inventory", label: "Inventory", icon: <Sliders size={18} /> },
    { href: "/admin/customers", label: "Customers", icon: <Users size={18} /> },
    { href: "/admin/settings", label: "Store Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F3EFEA" }}>
      {/* ════ SIDEBAR ════ */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#1A1918",
          color: "#E4DDD3",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
        className="hidden md:flex"
      >
        {/* Brand Header */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #2D2B29" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9E3B2B" }}>
            Store Management
          </span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "white", marginTop: "2px" }}>
            NOBLE TEXTILE
          </h2>
          <p style={{ fontSize: "11px", color: "#8A8279" }}>Hatte Nagar, Latur Store</p>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#E4DDD3",
                textDecoration: "none",
                borderRadius: "2px",
                transition: "background-color 0.15s",
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer User Info */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #2D2B29", backgroundColor: "#141312" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>{session.name}</p>
              <span style={{ fontSize: "10px", color: "#9E3B2B", fontWeight: 700, textTransform: "uppercase" }}>
                {session.role.replace(/_/g, " ")}
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Link href="/" target="_blank" title="View Storefront" style={{ color: "#8A8279", padding: "4px" }}>
                <Store size={16} />
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" title="Logout" style={{ background: "none", border: "none", color: "#8A8279", cursor: "pointer", padding: "4px" }}>
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* ════ MAIN ADMIN CONTENT ════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: "60px",
            backgroundColor: "white",
            borderBottom: "1px solid #E4DDD3",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>
              Admin Portal
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1A1918",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                border: "1px solid #E4DDD3",
              }}
            >
              <Store size={13} /> View Live Storefront
            </Link>
          </div>
        </header>

        {/* Main Body View */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
