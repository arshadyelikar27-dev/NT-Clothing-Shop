"use client";

import { useState, useEffect } from "react";
import { Building2, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw, ExternalLink } from "lucide-react";

interface WholesaleApplication {
  id: string;
  businessName: string;
  shopName: string | null;
  gstNumber: string | null;
  businessAddress: string;
  whatsapp: string;
  interestedCategories: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    createdAt: string;
  };
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: "#FFFDE7", text: "#B8860B", border: "#F9A825" },
  APPROVED: { bg: "#E8F5E9", text: "#2C6E3F", border: "#66BB6A" },
  REJECTED: { bg: "#FEF2F2", text: "#B91C1C", border: "#FCA5A5" },
};

export default function AdminWholesalePage() {
  const [applications, setApplications] = useState<WholesaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/wholesale");
      const data = await res.json();
      setApplications(data.profiles || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, status: string) {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/wholesale/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: actionNote[id] || undefined }),
      });
      if (res.ok) {
        await load();
        setExpanded(null);
      }
    } finally {
      setActionLoading(null);
    }
  }

  const filtered =
    filter === "ALL"
      ? applications
      : applications.filter((a) => a.status === filter);

  const counts = {
    ALL: applications.length,
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    APPROVED: applications.filter((a) => a.status === "APPROVED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "#1A1918" }}>
            Wholesale Applications
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px" }}>
            Review and manage business wholesale account requests
          </p>
        </div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1px solid #E4DDD3", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "13px", color: "#1A1918" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "8px 16px",
              border: `1px solid ${filter === tab ? "#1A1918" : "#E4DDD3"}`,
              borderRadius: "6px",
              backgroundColor: filter === tab ? "#1A1918" : "white",
              color: filter === tab ? "white" : "#1A1918",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#8A8279" }}>Loading applications...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "8px" }}>
          <Building2 size={36} color="#E4DDD3" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#8A8279" }}>No {filter !== "ALL" ? filter.toLowerCase() : ""} applications found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((app) => {
            const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.PENDING;
            const isExpanded = expanded === app.id;
            const categories = app.interestedCategories ? JSON.parse(app.interestedCategories) : [];

            return (
              <div key={app.id} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "8px", overflow: "hidden" }}>
                {/* Row Header */}
                <div
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }}
                  onClick={() => setExpanded(isExpanded ? null : app.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918" }}>{app.businessName}</span>
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#8A8279", marginTop: "3px" }}>
                      {app.user.name} · {app.user.email} · {app.whatsapp}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <p style={{ fontSize: "12px", color: "#8A8279" }}>
                      {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} color="#8A8279" /> : <ChevronDown size={16} color="#8A8279" />}
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #F3EFEA", padding: "20px 24px", backgroundColor: "#FAF7F2" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                      <Detail label="Shop Name" value={app.shopName || "—"} />
                      <Detail label="GST Number" value={app.gstNumber || "—"} />
                      <Detail label="WhatsApp" value={app.whatsapp} />
                      <Detail label="Customer Since" value={new Date(app.user.createdAt).toLocaleDateString("en-IN")} />
                      <div style={{ gridColumn: "1 / -1" }}>
                        <Detail label="Business Address" value={app.businessAddress} />
                      </div>
                      {categories.length > 0 && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8279", marginBottom: "6px" }}>Interested Categories</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {categories.map((cat: string) => (
                              <span key={cat} style={{ padding: "3px 10px", backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", fontSize: "12px", color: "#1A1918" }}>{cat}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Admin Note */}
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8279", display: "block", marginBottom: "6px" }}>
                        Admin Note (optional, shown to customer on rejection)
                      </label>
                      <textarea
                        value={actionNote[app.id] || ""}
                        onChange={(e) => setActionNote((prev) => ({ ...prev, [app.id]: e.target.value }))}
                        rows={2}
                        placeholder="e.g. Documents required, or reason for rejection..."
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #E4DDD3", borderRadius: "6px", fontSize: "13px", backgroundColor: "white", color: "#1A1918", fontFamily: "var(--font-sans)", resize: "vertical", boxSizing: "border-box" }}
                      />
                    </div>

                    {/* Actions */}
                    {app.status !== "APPROVED" && (
                      <button
                        onClick={() => handleAction(app.id, "APPROVED")}
                        disabled={!!actionLoading}
                        style={{ marginRight: "10px", padding: "9px 20px", backgroundColor: "#2C6E3F", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <CheckCircle2 size={14} /> {actionLoading === app.id + "APPROVED" ? "Approving..." : "Approve"}
                      </button>
                    )}
                    {app.status !== "REJECTED" && (
                      <button
                        onClick={() => handleAction(app.id, "REJECTED")}
                        disabled={!!actionLoading}
                        style={{ marginRight: "10px", padding: "9px 20px", backgroundColor: "#B91C1C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <XCircle size={14} /> {actionLoading === app.id + "REJECTED" ? "Rejecting..." : "Reject"}
                      </button>
                    )}
                    {app.status !== "PENDING" && (
                      <button
                        onClick={() => handleAction(app.id, "PENDING")}
                        disabled={!!actionLoading}
                        style={{ padding: "9px 20px", backgroundColor: "white", color: "#1A1918", border: "1px solid #E4DDD3", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Clock size={14} /> Set Pending
                      </button>
                    )}
                    <a
                      href={`https://wa.me/${app.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: "10px", padding: "9px 20px", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                    >
                      <ExternalLink size={14} /> WhatsApp
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8279", marginBottom: "3px" }}>{label}</p>
      <p style={{ fontSize: "14px", color: "#1A1918" }}>{value}</p>
    </div>
  );
}
