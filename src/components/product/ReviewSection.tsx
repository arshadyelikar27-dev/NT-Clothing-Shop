"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, CheckCircle2, AlertCircle } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { name: string };
}

interface ReviewSectionProps {
  productId: string;
  productName: string;
}

function StarRating({
  rating,
  interactive = false,
  onChange,
  size = 16,
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: interactive ? "pointer" : "default",
            padding: "0 1px",
            color:
              star <= (hovered || rating) ? "#E0A96D" : "#E4DDD3",
            transition: "color 0.1s",
            fontSize: 0,
            lineHeight: 0,
          }}
        >
          <Star
            size={size}
            fill={star <= (hovered || rating) ? "#E0A96D" : "none"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewSection({ productId, productName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setCount(data.count || 0);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRating === 0) {
      setFormMessage({ type: "error", text: "Please select a rating." });
      return;
    }
    setSubmitting(true);
    setFormMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: formRating,
          title: formTitle.trim() || undefined,
          comment: formComment.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormMessage({ type: "error", text: data.error || "Failed to submit review." });
      } else {
        setFormMessage({
          type: "success",
          text: "Thank you! Your review has been submitted and will be visible after moderation.",
        });
        setShowForm(false);
        setFormRating(5);
        setFormTitle("");
        setFormComment("");
      }
    } catch {
      setFormMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rv) => rv.rating === r).length,
  }));

  return (
    <section
      style={{ borderTop: "1px solid #E4DDD3", paddingTop: "48px", marginTop: "48px" }}
      aria-label="Customer reviews"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "24px",
              fontWeight: 500,
              color: "#1A1918",
              marginBottom: "8px",
            }}
          >
            Customer Reviews
          </h2>
          {count > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <StarRating rating={Math.round(avgRating)} size={18} />
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#1A1918" }}>
                {avgRating.toFixed(1)}
              </span>
              <span style={{ fontSize: "13px", color: "#8A8279" }}>
                ({count} {count === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            backgroundColor: showForm ? "#F3EFEA" : "#1A1918",
            color: showForm ? "#1A1918" : "white",
            border: "1px solid #E4DDD3",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            transition: "all 0.2s",
          }}
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Rating Distribution */}
      {count > 0 && (
        <div style={{ marginBottom: "32px", maxWidth: "320px" }}>
          {ratingCounts.map(({ rating, count: cnt }) => (
            <div key={rating} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#8A8279", width: "8px" }}>{rating}</span>
              <Star size={12} fill="#E0A96D" color="#E0A96D" />
              <div style={{ flex: 1, height: "6px", backgroundColor: "#F3EFEA", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: count > 0 ? `${(cnt / count) * 100}%` : "0%",
                    backgroundColor: "#E0A96D",
                    borderRadius: "3px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: "12px", color: "#8A8279", width: "20px", textAlign: "right" }}>{cnt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#FAF7F2",
            border: "1px solid #E4DDD3",
            borderRadius: "12px",
            padding: "28px",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "#1A1918", marginBottom: "20px" }}>
            Review {productName}
          </h3>

          {formMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                backgroundColor: formMessage.type === "success" ? "#E8F5E9" : "#FEF2F2",
                border: `1px solid ${formMessage.type === "success" ? "#A5D6A7" : "#FCA5A5"}`,
                color: formMessage.type === "success" ? "#2C6E3F" : "#B91C1C",
                fontSize: "13px",
              }}
            >
              {formMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {formMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Rating */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#1A1918", display: "block", marginBottom: "8px" }}>
                Your Rating *
              </label>
              <StarRating rating={formRating} interactive onChange={setFormRating} size={24} />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="review-title" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#1A1918", display: "block", marginBottom: "6px" }}>
                Review Title
              </label>
              <input
                id="review-title"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Excellent quality fabric"
                maxLength={120}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E4DDD3",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1A1918",
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="review-comment" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#1A1918", display: "block", marginBottom: "6px" }}>
                Your Review
              </label>
              <textarea
                id="review-comment"
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product..."
                maxLength={1000}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E4DDD3",
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#1A1918",
                  fontFamily: "var(--font-sans)",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <p style={{ fontSize: "12px", color: "#8A8279" }}>
              * You can only submit a review after your order has been delivered. Reviews are visible after admin approval.
            </p>

            <button
              type="submit"
              disabled={submitting}
              style={{
                alignSelf: "flex-start",
                padding: "12px 24px",
                backgroundColor: submitting ? "#8A8279" : "#1A1918",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
                transition: "background 0.2s",
              }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "32px", color: "#8A8279", fontSize: "13px" }}>
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#FAF7F2",
            borderRadius: "12px",
          }}
        >
          <Star size={32} color="#E4DDD3" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#1A1918", marginBottom: "6px" }}>
            No reviews yet
          </p>
          <p style={{ fontSize: "13px", color: "#8A8279" }}>
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: "24px",
                border: "1px solid #E4DDD3",
                borderRadius: "12px",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>
                      {review.user.name}
                    </span>
                    {review.isVerified && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#2C6E3F",
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle2 size={12} />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <span style={{ fontSize: "12px", color: "#8A8279" }}>
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {review.title && (
                <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918", marginBottom: "6px" }}>
                  {review.title}
                </h4>
              )}
              {review.comment && (
                <p style={{ fontSize: "14px", color: "#3A3630", lineHeight: 1.6 }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
