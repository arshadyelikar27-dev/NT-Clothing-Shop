"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Phone, MapPin, Package, RefreshCw, Check, Mail } from "lucide-react";

interface BulkEnquiry {
  id: string;
  productName: string | null;
  productId: string | null;
  quantity: string;
  size: string | null;
  color: string | null;
  businessName: string;
  whatsapp: string;
  gstNumber: string | null;
  location: string;
  message: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function AdminBulkEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<BulkEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("UNREAD");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bulk-enquiries");
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string, isRead: boolean) {
    await fetch("/api/admin/bulk-enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead }),
    });
    await load();
  }

  const filtered = filter === "UNREAD"
    ? enquiries.filter((e) => !e.isRead)
    : filter === "READ"
    ? enquiries.filter((e) => e.isRead)
    : enquiries;

  const unreadCount = enquiries.filter((e) => !e.isRead).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "#1A1918", display: "flex", alignItems: "center", gap: "12px" }}>
            Bulk Order Enquiries
            {unreadCount > 0 && (
              <span style={{ backgroundColor: "#9E3B2B", color: "white", fontSize: "12px", fontWeight: 700, padding: "2px 8px", borderRadius: "12px" }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px" }}>
            Bulk order enquiries from B2B customers and retailers
          </p>
        </div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1px solid #E4DDD3", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "13px", color: "#1A1918" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {(["UNREAD", "READ", "ALL"] as const).map((tab) => (
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
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#8A8279" }}>Loading enquiries...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "8px" }}>
          <MessageSquare size={36} color="#E4DDD3" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#8A8279" }}>No {filter !== "ALL" ? filter.toLowerCase() : ""} enquiries</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((enq) => (
            <div
              key={enq.id}
              style={{
                backgroundColor: "white",
                border: `1px solid ${!enq.isRead ? "#E0A96D" : "#E4DDD3"}`,
                borderLeft: `4px solid ${!enq.isRead ? "#E0A96D" : "#E4DDD3"}`,
                borderRadius: "8px",
                padding: "18px 22px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1918" }}>{enq.businessName}</span>
                    {!enq.isRead && (
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#FFF9EC", color: "#B8860B", borderRadius: "4px", border: "1px solid #F9A825" }}>
                        NEW
                      </span>
                    )}
                    <span style={{ fontSize: "12px", color: "#8A8279" }}>
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } as Intl.DateTimeFormatOptions)}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px", marginBottom: "12px" }}>
                    {enq.productName && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Package size={13} color="#9E3B2B" />
                        <span style={{ fontSize: "13px", color: "#3A3630" }}>{enq.productName}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#8A8279" }}>Qty:</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918" }}>{enq.quantity}</span>
                    </div>
                    {enq.size && <div style={{ fontSize: "13px", color: "#3A3630" }}>Size: {enq.size}</div>}
                    {enq.color && <div style={{ fontSize: "13px", color: "#3A3630" }}>Color: {enq.color}</div>}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={13} color="#9E3B2B" />
                      <span style={{ fontSize: "13px", color: "#3A3630" }}>{enq.whatsapp}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={13} color="#9E3B2B" />
                      <span style={{ fontSize: "13px", color: "#3A3630" }}>{enq.location}</span>
                    </div>
                    {enq.gstNumber && (
                      <div style={{ fontSize: "13px", color: "#3A3630" }}>GST: {enq.gstNumber}</div>
                    )}
                  </div>

                  {enq.message && (
                    <div style={{ backgroundColor: "#FAF7F2", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", color: "#3A3630", lineHeight: 1.5 }}>
                      {enq.message}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                  <a
                    href={`https://wa.me/${enq.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(enq.businessName)}%2C%20thank%20you%20for%20your%20bulk%20order%20enquiry%20at%20Noble%20Textile.%20We%20received%20your%20request%20for%20${encodeURIComponent(enq.productName || "your products")}%20(${encodeURIComponent(enq.quantity)}).%20Let%20us%20discuss%20the%20pricing!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "8px 14px", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}
                    onClick={() => !enq.isRead && markRead(enq.id, true)}
                  >
                    💬 WhatsApp Reply
                  </a>
                  {!enq.isRead ? (
                    <button
                      onClick={() => markRead(enq.id, true)}
                      style={{ padding: "8px 14px", backgroundColor: "white", color: "#1A1918", border: "1px solid #E4DDD3", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      <Check size={13} /> Mark Read
                    </button>
                  ) : (
                    <button
                      onClick={() => markRead(enq.id, false)}
                      style={{ padding: "8px 14px", backgroundColor: "white", color: "#8A8279", border: "1px solid #E4DDD3", borderRadius: "6px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      <Mail size={13} /> Mark Unread
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
