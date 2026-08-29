"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, RefreshCw, Building2, Phone, FileText, MapPin } from "lucide-react";

interface WholesaleProfile {
  id: string;
  businessName: string;
  shopName: string | null;
  gstNumber: string | null;
  businessAddress: string;
  whatsapp: string;
  status: string;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export default function WholesaleStatusPage() {
  const [profile, setProfile] = useState<WholesaleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/wholesale/status");
        if (res.status === 401) {
          setError("Please sign in to check your wholesale application status.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProfile(data.profile);
      } catch {
        setError("Failed to load status. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusConfig = {
    PENDING: {
      icon: <Clock size={40} color="#B8860B" />,
      label: "Under Review",
      bg: "#FFFDE7",
      border: "#F9A825",
      color: "#B8860B",
      message: "Your application is being reviewed by our team. We'll contact you on WhatsApp within 1–2 business days.",
    },
    APPROVED: {
      icon: <CheckCircle2 size={40} color="#2C6E3F" />,
      label: "Approved!",
      bg: "#E8F5E9",
      border: "#66BB6A",
      color: "#2C6E3F",
      message: "Congratulations! Your wholesale account is active. You now have access to wholesale pricing when logged in.",
    },
    REJECTED: {
      icon: <XCircle size={40} color="#B91C1C" />,
      label: "Application Not Approved",
      bg: "#FEF2F2",
      border: "#FCA5A5",
      color: "#B91C1C",
      message: "Unfortunately your application was not approved at this time.",
    },
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "100px" }}>
        <div style={{ textAlign: "center", color: "#8A8279" }}>
          <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          <p>Loading your application status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "100px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "20px" }}>
          <XCircle size={40} color="#B91C1C" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "#B91C1C", marginBottom: "20px" }}>{error}</p>
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "100px", padding: "100px 20px 60px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <Building2 size={48} color="#E4DDD3" style={{ margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 500, color: "#1A1918", marginBottom: "12px" }}>
            No Application Found
          </h1>
          <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "28px", lineHeight: 1.6 }}>
            You haven&apos;t submitted a wholesale application yet. Apply now to get access to wholesale pricing.
          </p>
          <Link href="/wholesale" className="btn btn-primary">
            Apply for Wholesale Account
          </Link>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[profile.status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" }}>
      <div className="container-main" style={{ maxWidth: "680px" }}>
        {/* Status Card */}
        <div
          style={{
            backgroundColor: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>{cfg.icon}</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "28px",
              fontWeight: 500,
              color: cfg.color,
              marginBottom: "12px",
            }}
          >
            {cfg.label}
          </h1>
          <p style={{ fontSize: "15px", color: cfg.color, lineHeight: 1.6, maxWidth: "400px", margin: "0 auto" }}>
            {cfg.message}
          </p>
          {profile.adminNote && profile.status === "REJECTED" && (
            <div style={{ marginTop: "16px", padding: "12px 16px", backgroundColor: "white", borderRadius: "8px", textAlign: "left" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#B91C1C", marginBottom: "4px" }}>Admin Note:</p>
              <p style={{ fontSize: "13px", color: "#3A3630" }}>{profile.adminNote}</p>
            </div>
          )}
          {profile.status === "APPROVED" && (
            <div style={{ marginTop: "24px" }}>
              <Link href="/shop" className="btn btn-primary">
                Shop with Wholesale Pricing →
              </Link>
            </div>
          )}
          {profile.status === "REJECTED" && (
            <div style={{ marginTop: "24px" }}>
              <a href="https://wa.me/917821059350" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Contact Us on WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Application Details */}
        <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", borderRadius: "12px", padding: "28px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500, color: "#1A1918", marginBottom: "20px" }}>
            Application Details
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Row icon={<Building2 size={16} />} label="Business Name" value={profile.businessName} />
            {profile.shopName && <Row icon={<Building2 size={16} />} label="Shop Name" value={profile.shopName} />}
            <Row icon={<Phone size={16} />} label="WhatsApp" value={profile.whatsapp} />
            {profile.gstNumber && <Row icon={<FileText size={16} />} label="GST Number" value={profile.gstNumber} />}
            <Row icon={<MapPin size={16} />} label="Business Address" value={profile.businessAddress} />
            <Row
              icon={<Clock size={16} />}
              label="Applied On"
              value={new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            />
            {profile.reviewedAt && (
              <Row
                icon={<CheckCircle2 size={16} />}
                label="Reviewed On"
                value={new Date(profile.reviewedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              />
            )}
          </div>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link href="/account" style={{ fontSize: "13px", color: "#8A8279", textDecoration: "none" }}>
            ← Back to My Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", paddingBottom: "16px", borderBottom: "1px solid #F3EFEA" }}>
      <span style={{ color: "#9E3B2B", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <div>
        <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8279", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "14px", color: "#1A1918" }}>{value}</p>
      </div>
    </div>
  );
}
