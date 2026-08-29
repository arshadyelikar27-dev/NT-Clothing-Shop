"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useUIStore } from "@/lib/store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";
  const { showNotification } = useUIStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        showNotification(`Welcome back, ${data.user.name}!`, "success");
        if (data.user.role !== "CUSTOMER") {
          window.location.href = "/admin";
        } else {
          window.location.href = redirectTarget;
        }
      } else {
        setError(data.error || "Invalid email or password");
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
        maxWidth: "440px",
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
          Sign In to Your Account
        </h1>
        <p style={{ fontSize: "13px", color: "#8A8279" }}>
          {redirectTarget.includes("checkout")
            ? "Sign in to complete your order and track delivery"
            : "Access your orders and saved addresses"}
        </p>
      </div>

      {redirectTarget.includes("checkout") && (
        <div
          style={{
            backgroundColor: "#F3EFEA",
            border: "1px solid #E4DDD3",
            padding: "10px 14px",
            fontSize: "12px",
            color: "#1A1918",
            marginBottom: "20px",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          🔒 Please sign in or create an account to proceed with checkout.
        </div>
      )}

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
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
            <input
              type="email"
              required
              className="input"
              style={{ paddingLeft: "40px" }}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600 }}>Password</label>
          </div>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
            <input
              type="password"
              required
              className="input"
              style={{ paddingLeft: "40px" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", marginTop: "8px" }}
        >
          {isLoading ? "Signing In..." : "Sign In & Continue"}
        </button>
      </form>

      <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#8A8279", borderTop: "1px solid #E4DDD3", paddingTop: "20px" }}>
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${redirectTarget !== "/account" ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
          style={{ color: "#9E3B2B", fontWeight: 600, textDecoration: "none" }}
        >
          Create one here
        </Link>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "85vh", display: "flex", alignItems: "center", padding: "110px 20px 60px" }}>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "40px", color: "#8A8279" }}>Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
