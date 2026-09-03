"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle2, XCircle, EyeOff, Eye, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getReviewsAction, updateReviewAction, deleteReviewAction } from "@/app/actions/reviews";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isApproved: boolean;
  isHidden: boolean;
  createdAt: string;
  user: { name: string; email: string };
  product: { name: string; slug: string };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} fill={s <= rating ? "#E0A96D" : "none"} color={s <= rating ? "#E0A96D" : "#E4DDD3"} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getReviewsAction();
      setReviews(data as any);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: string) {
    setActionLoading(id + action);
    try {
      if (action === "delete") {
        await deleteReviewAction(id);
      } else {
        await updateReviewAction(id, action);
      }
      await load();
    } catch {
      alert("Failed to perform action");
    } finally {
      setActionLoading(null);
    }
  }

  const getFiltered = () => {
    if (filter === "PENDING") return reviews.filter((r) => !r.isApproved && !r.isHidden);
    if (filter === "APPROVED") return reviews.filter((r) => r.isApproved && !r.isHidden);
    if (filter === "HIDDEN") return reviews.filter((r) => r.isHidden);
    return reviews;
  };

  const filtered = getFiltered();

  const counts = {
    PENDING: reviews.filter((r) => !r.isApproved && !r.isHidden).length,
    APPROVED: reviews.filter((r) => r.isApproved && !r.isHidden).length,
    HIDDEN: reviews.filter((r) => r.isHidden).length,
    ALL: reviews.length,
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "#1A1918" }}>
            Review Moderation
          </h1>
          <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px" }}>
            Approve, hide or delete customer product reviews
          </p>
        </div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: "1px solid #E4DDD3", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "13px", color: "#1A1918" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {(["PENDING", "APPROVED", "HIDDEN", "ALL"] as const).map((tab) => (
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

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#8A8279" }}>Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "8px" }}>
          <Star size={36} color="#E4DDD3" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#8A8279" }}>No reviews in this category</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((review) => (
            <div key={review.id} style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "8px", padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Top: Product & User */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <Link
                      href={`/product/${review.product.slug}`}
                      target="_blank"
                      style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", textDecoration: "none" }}
                    >
                      {review.product.name}
                    </Link>
                    <Stars rating={review.rating} />
                    <span style={{ fontSize: "12px", color: "#8A8279" }}>{review.user.name} · {review.user.email}</span>
                    {review.isVerified && (
                      <span style={{ fontSize: "11px", color: "#2C6E3F", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" }}>
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    )}
                  </div>

                  {/* Status badges */}
                  <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                    {review.isApproved ? (
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#E8F5E9", color: "#2C6E3F", borderRadius: "4px" }}>APPROVED</span>
                    ) : (
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#FFFDE7", color: "#B8860B", borderRadius: "4px" }}>PENDING</span>
                    )}
                    {review.isHidden && (
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#F3EFEA", color: "#8A8279", borderRadius: "4px" }}>HIDDEN</span>
                    )}
                  </div>

                  {/* Content */}
                  {review.title && (
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>{review.title}</p>
                  )}
                  {review.comment && (
                    <p style={{ fontSize: "13px", color: "#3A3630", lineHeight: 1.5 }}>{review.comment}</p>
                  )}
                  <p style={{ fontSize: "11px", color: "#B8AFA4", marginTop: "8px" }}>
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" } as Intl.DateTimeFormatOptions)}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                  {!review.isApproved && (
                    <button
                      onClick={() => handleAction(review.id, "approve")}
                      disabled={!!actionLoading}
                      style={{ padding: "7px 14px", backgroundColor: "#2C6E3F", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      <CheckCircle2 size={13} /> Approve
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleAction(review.id, "reject")}
                      disabled={!!actionLoading}
                      style={{ padding: "7px 14px", backgroundColor: "#B91C1C", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      <XCircle size={13} /> Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(review.id, review.isHidden ? "unhide" : "hide")}
                    disabled={!!actionLoading}
                    style={{ padding: "7px 14px", backgroundColor: "white", color: "#1A1918", border: "1px solid #E4DDD3", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    {review.isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                    {review.isHidden ? "Unhide" : "Hide"}
                  </button>
                  <button
                    onClick={() => confirm("Delete this review permanently?") && handleAction(review.id, "delete")}
                    disabled={!!actionLoading}
                    style={{ padding: "7px 14px", backgroundColor: "white", color: "#B91C1C", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
