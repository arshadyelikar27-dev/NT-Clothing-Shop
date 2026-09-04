"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Check your credentials.");
        return;
      }

      // Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1918",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "var(--font-sans, 'Inter', sans-serif)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          padding: "40px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#1A1918",
              letterSpacing: "0.05em",
              marginBottom: "4px",
            }}
          >
            NOBLE TEXTILE
          </h1>
          <p style={{ fontSize: "12px", color: "#8A8279", fontWeight: 500 }}>
            Admin Management Portal
          </p>
          <div
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "#9E3B2B",
              margin: "12px auto 0",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#991B1B",
              padding: "10px 14px",
              fontSize: "13px",
              borderRadius: "4px",
              border: "1px solid #FECACA",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              htmlFor="admin-identifier"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#1A1918",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Phone / Email
            </label>
            <input
              id="admin-identifier"
              type="text"
              required
              placeholder="9764313958"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: "14px",
                border: "1px solid #E4DDD3",
                borderRadius: "4px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1A1918")}
              onBlur={(e) => (e.target.style.borderColor = "#E4DDD3")}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#1A1918",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 14px",
                  fontSize: "14px",
                  border: "1px solid #E4DDD3",
                  borderRadius: "4px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1A1918")}
                onBlur={(e) => (e.target.style.borderColor = "#E4DDD3")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8A8279",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#8A8279" : "#1A1918",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              marginTop: "8px",
              letterSpacing: "0.04em",
            }}
          >
            {loading ? "Signing In..." : "Sign In to Admin"}
          </button>
        </form>

        <p
          style={{
            fontSize: "11px",
            color: "#8A8279",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
