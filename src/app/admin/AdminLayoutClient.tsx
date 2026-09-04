"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  Sliders,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react";


const navItems = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
  { href: "/admin/categories", label: "Categories", icon: <Layers size={18} /> },
  { href: "/admin/inventory", label: "Inventory", icon: <Sliders size={18} /> },
  { href: "/admin/settings", label: "Store Settings", icon: <Settings size={18} /> },
];


export default function AdminLayoutClient({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="admin-root-container">
      {/* Dynamic Style block to guarantee flawless sidebar positioning and spacing */}
      <style>{`
        .admin-root-container {
          display: flex;
          min-height: 100vh;
          background-color: #F3EFEA;
        }
        .admin-sidebar {
          width: 260px;
          background-color: #1A1918;
          color: #E4DDD3;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
          transition: transform 0.25s ease-in-out;
        }
        .admin-main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          margin-left: 260px;
          width: calc(100% - 260px);
          min-height: 100vh;
        }
        .admin-content-view {
          flex: 1;
          padding: 32px 36px;
          overflow-y: auto;
          min-height: 0;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main-wrapper {
            margin-left: 0;
            width: 100%;
          }
          .admin-content-view {
            padding: 16px 14px;
          }
          .admin-top-header {
            padding: 0 14px !important;
          }
        }
        @media (max-width: 480px) {
          .admin-content-view {
            padding: 12px 10px;
          }
        }
      `}</style>

      {/* ════ MOBILE OVERLAY ════ */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ════ SIDEBAR ════ */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #2D2B29", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9E3B2B" }}>
              Store Management
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "white", marginTop: "2px" }}>
              NOBLE TEXTILE
            </h2>
            <p style={{ fontSize: "11px", color: "#8A8279" }}>Hatte Nagar, Latur Store</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-[#8A8279]"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: isActive ? "white" : "#E4DDD3",
                  backgroundColor: isActive ? "#2D2B29" : "transparent",
                  textDecoration: "none",
                  borderRadius: "4px",
                  transition: "background-color 0.15s",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer User Info */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #2D2B29", backgroundColor: "#141312" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>{session?.name}</p>
              <span style={{ fontSize: "10px", color: "#9E3B2B", fontWeight: 700, textTransform: "uppercase" }}>
                {session?.role?.replace(/_/g, " ")}
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
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header
          className="admin-top-header"
          style={{
            height: "60px",
            backgroundColor: "white",
            borderBottom: "1px solid #E4DDD3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            gap: "12px",
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden"
              style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", flexShrink: 0 }}
            >
              <Menu size={24} color="#1A1918" />
            </button>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Admin Portal
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
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
                borderRadius: "4px",
                whiteSpace: "nowrap",
              }}
            >
              <Store size={13} /> <span className="hidden sm:inline">View Live Storefront</span><span className="sm:hidden">Store</span>
            </Link>
          </div>
        </header>

        {/* Main Body View */}
        <main className="admin-content-view">
          {children}
        </main>
      </div>
    </div>
  );
}
