"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { useUIStore } from "@/lib/store";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";
  const { showNotification } = useUIStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        showNotification(`Welcome to NOBLE TEXTILE, ${data.user.name}!`, "success");
        router.push(redirectTarget);
        router.refresh();
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "460px",
        margin: "0 auto",
        backgroundColor: "white",
        border: "1px solid #E4DDD3",
        padding: "36px 32px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9E3B2B",
            marginBottom: "6px",
          }}
        >
          NOBLE TEXTILE
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "26px",
            fontWeight: 500,
            color: "#1A1918",
            marginBottom: "8px",
          }}
        >
          Create Your Account
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8279" }}>
          {redirectTarget.includes("checkout")
            ? "Create an account to complete checkout and track delivery"
            : "Track your textile orders, save addresses, and save favorites"}
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #DC2626",
            color: "#991B1B",
            padding: "10px 14px",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Full Name *
          </label>
          <div style={{ position: "relative" }}>
            <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
            <input
              type="text"
              required
              className="input"
              style={{ paddingLeft: "40px" }}
              placeholder="e.g. Ramesh Kulkarni"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Email Address *
          </label>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
            <input
              type="email"
              required
              className="input"
              style={{ paddingLeft: "40px" }}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Mobile Phone (10-digit)
          </label>
          <div style={{ position: "relative" }}>
            <Phone size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
            <input
              type="tel"
              className="input"
              style={{ paddingLeft: "40px" }}
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Password (min 6 characters) *
          </label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
            <input
              type="password"
              required
              className="input"
              style={{ paddingLeft: "40px" }}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", marginTop: "8px" }}
        >
          {isLoading ? "Creating Account..." : "Create Account & Continue"}
        </button>
      </form>

      <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#8A8279", borderTop: "1px solid #E4DDD3", paddingTop: "20px" }}>
        Already have an account?{" "}
        <Link
          href={`/login${redirectTarget !== "/account" ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
          style={{ color: "#9E3B2B", fontWeight: 600, textDecoration: "none" }}
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "85vh", display: "flex", alignItems: "center", padding: "110px 20px 60px" }}>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "40px", color: "#8A8279" }}>Loading register...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
