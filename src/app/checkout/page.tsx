"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Phone,
  Lock,
  Mail,
  User,
  LogOut,
} from "lucide-react";
import { useCartStore, useUIStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface AuthenticatedUser {
  userId: string;
  name: string;
  phone: string;
  role: string;
}

declare global {
  interface Window {
    Razorpay?: unknown;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { showNotification } = useUIStore();

  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);

  // Inline Auth Form state (if not logged in)
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: Customer Contact
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    altPhone: "",
  });

  // Step 2: Shipping Address
  const [address, setAddress] = useState({
    house: "",
    street: "",
    area: "",
    city: "Latur",
    state: "Maharashtra",
    pinCode: "413512",
    landmark: "",
    type: "HOME",
  });

  // Step 3: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<"STANDARD" | "EXPRESS">("STANDARD");

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");

  const [notes, setNotes] = useState("");

  // Check authenticated session
  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setAuthUser(data.user);
          setCustomer((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            phone: data.user.phone || prev.phone,
          }));
        } else {
          setAuthUser(null);
        }
      }
    } catch {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPhone || !authPassword) {
      setAuthError("Please enter your mobile number and password");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: authPhone, password: authPassword }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        showNotification(`Welcome, ${data.user.name}! You can now complete checkout.`, "success");
        setAuthUser({
          userId: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          role: data.user.role,
        });
        setCustomer((prev) => ({
          ...prev,
          name: data.user.name,
          phone: data.user.phone || prev.phone,
        }));
        window.dispatchEvent(new Event("auth-change"));
      } else {
        setAuthError(data.error || "Invalid mobile number or password");
      }
    } catch {
      setAuthError("Error connecting to server");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName || !authPhone || !authPassword) {
      setAuthError("Please fill in name, mobile number and password");
      return;
    }

    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authName,
          phone: authPhone,
          password: authPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        showNotification(`Account created! Welcome, ${data.user.name}.`, "success");
        setAuthUser({
          userId: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          role: data.user.role,
        });
        setCustomer((prev) => ({
          ...prev,
          name: data.user.name,
          phone: data.user.phone || prev.phone,
        }));
        window.dispatchEvent(new Event("auth-change"));
      } else {
        setAuthError(data.error || "Registration failed");
      }
    } catch {
      setAuthError("Error creating account");
    } finally {
      setAuthLoading(false);
    }
  };

  // Auto PIN code resolution
  const handlePinCodeChange = (pincodeVal: string) => {
    const cleaned = pincodeVal.replace(/\D/g, "").slice(0, 6);
    setAddress((prev) => ({ ...prev, pinCode: cleaned }));

    if (cleaned.length === 6) {
      if (cleaned.startsWith("413512") || cleaned.startsWith("4135")) {
        setAddress((prev) => ({ ...prev, city: "Latur", state: "Maharashtra" }));
      } else if (cleaned.startsWith("411")) {
        setAddress((prev) => ({ ...prev, city: "Pune", state: "Maharashtra" }));
      } else if (cleaned.startsWith("400")) {
        setAddress((prev) => ({ ...prev, city: "Mumbai", state: "Maharashtra" }));
      } else if (cleaned.startsWith("431")) {
        setAddress((prev) => ({ ...prev, city: "Chhatrapati Sambhajinagar", state: "Maharashtra" }));
      } else if (cleaned.startsWith("416")) {
        setAddress((prev) => ({ ...prev, city: "Kolhapur", state: "Maharashtra" }));
      }
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let shippingCharge = subtotal === 0 ? 0 : 79;
  if (deliveryMethod === "EXPRESS") {
    shippingCharge += 70;
  }
  const codCharge = 0;
  const finalTotal = subtotal + shippingCharge;

  // Validation
  const validateStep1 = () => {
    if (!customer.name.trim()) return "Please enter your full name";
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, "").length < 10)
      return "Please enter a valid 10-digit mobile number";
    return "";
  };

  const validateStep2 = () => {
    if (!address.house.trim()) return "Please enter Flat / House / Building name";
    if (!address.street.trim()) return "Please enter Street or Road name";
    if (!address.city.trim()) return "Please enter City";
    if (!address.state.trim()) return "Please enter State";
    if (!address.pinCode.trim() || address.pinCode.length !== 6) return "Please enter a 6-digit PIN code";
    return "";
  };

  const handleNext = () => {
    setErrorMessage("");
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    if (!authUser) {
      setErrorMessage("Please sign in or register to place your order.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          address,
          items,
          paymentMethod,
          deliveryMethod,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Manual Order Confirmation Flow
      setOrderCreated(true);
      clearCart();
      showNotification("Order submitted successfully!", "success");
      router.push(`/track?order=${data.orderNumber}`);
    } catch (err) {
      console.error("Checkout submission failed", err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCreated) {
    return (
      <div style={{ backgroundColor: "#FAF7F2", minHeight: "70vh", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "24px", height: "24px", border: "2px solid #9E3B2B", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ fontSize: "14px", color: "#8A8279" }}>Redirecting to order tracking...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: "#FAF7F2", minHeight: "70vh", display: "flex", alignItems: "center" }}>
        <div className="container-main" style={{ textAlign: "center", padding: "60px 20px" }}>
          <ShoppingBag size={48} style={{ margin: "0 auto 16px", color: "#8A8279" }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "12px" }}>
            No Items in Checkout
          </h2>
          <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "24px" }}>
            Please add textiles to your shopping bag before proceeding to checkout.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Browse Textiles
          </Link>
        </div>
      </div>
    );
  }

  if (isCheckingAuth) {
    return (
      <div style={{ backgroundColor: "#FAF7F2", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "14px", color: "#8A8279" }}>Loading secure checkout...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px" }}>
        <div className="container-main">
        {/* Checkout Header */}
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/cart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#8A8279",
              textDecoration: "none",
              marginBottom: "12px",
            }}
          >
            <ArrowLeft size={14} /> Back to Bag
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "12px" }}>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 500,
                color: "#1A1918",
              }}
            >
              Checkout
            </h1>

            {authUser && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#2C6E3F",
                  backgroundColor: "#E8F5E9",
                  padding: "6px 12px",
                  border: "1px solid #C8E6C9",
                }}
              >
                <CheckCircle2 size={15} />
                <span>Signed in as <strong>{authUser.name}</strong> ({authUser.phone})</span>
              </div>
            )}
          </div>
        </div>

        {/* ════ IF NOT LOGGED IN: AUTHENTICATION REQUIREMENT GATE ════ */}
        {!authUser ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "36px",
              marginTop: "20px",
            }}
            className="lg:grid-cols-[1.5fr_1fr]"
          >
            {/* Left Auth Form */}
            <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "36px 28px" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9E3B2B", marginBottom: "4px" }}>
                  Account Verification Required
                </p>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "#1A1918" }}>
                  Sign In or Create Account to Checkout
                </h2>
                <p style={{ fontSize: "13px", color: "#8A8279", marginTop: "4px" }}>
                  Your items are safely reserved in your bag. Sign in with your credentials to complete delivery details and tax invoice.
                </p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #E4DDD3", marginBottom: "24px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError("");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "none",
                    border: "none",
                    borderBottom: authTab === "login" ? "2px solid #9E3B2B" : "2px solid transparent",
                    fontWeight: authTab === "login" ? 600 : 400,
                    color: authTab === "login" ? "#1A1918" : "#8A8279",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Existing Customer (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError("");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "none",
                    border: "none",
                    borderBottom: authTab === "register" ? "2px solid #9E3B2B" : "2px solid transparent",
                    fontWeight: authTab === "register" ? 600 : 400,
                    color: authTab === "register" ? "#1A1918" : "#8A8279",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  New Customer (Register)
                </button>
              </div>

              {authError && (
                <div style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "10px 14px", fontSize: "13px", marginBottom: "20px" }}>
                  {authError}
                </div>
              )}

              {authTab === "login" ? (
                <form onSubmit={handleInlineLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                      Mobile Number
                    </label>
                    <div style={{ position: "relative" }}>
                      <Phone size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
                      <input
                        type="tel"
                        required
                        className="input"
                        style={{ paddingLeft: "40px" }}
                        placeholder="10-digit mobile number"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                      Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8A8279" }} />
                      <input
                        type="password"
                        required
                        className="input"
                        style={{ paddingLeft: "40px" }}
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px", marginTop: "8px" }}
                  >
                    {authLoading ? "Verifying Credentials..." : "Sign In & Proceed to Address"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleInlineRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
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
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
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
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px", marginTop: "8px" }}
                  >
                    {authLoading ? "Creating Account..." : "Create Account & Continue"}
                  </button>
                </form>
              )}
            </div>

            {/* Right Summary */}
            <div>
              <div style={{ backgroundColor: "#F3EFEA", border: "1px solid #E4DDD3", padding: "24px" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "16px" }}>
                  Bag Summary ({items.length} items)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || "default"}`} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <img src={item.image} alt={item.name} loading="lazy" decoding="async" style={{ width: "40px", height: "50px", objectFit: "cover" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.name}
                        </p>
                        <span style={{ fontSize: "12px", color: "#8A8279" }}>
                          {item.quantity} {item.unitType === "PER_METER" ? "m" : "pcs"} × {formatPrice(item.price)}
                        </span>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #E4DDD3", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 600 }}>
                  <span>Total Payable</span>
                  <span style={{ color: "#9E3B2B" }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ════ LOGGED IN: MULTI-STEP CHECKOUT ════ */
          <>
            {/* Step Progress Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
                marginBottom: "36px",
              }}
            >
              {[
                { num: 1, label: "Contact" },
                { num: 2, label: "Address" },
                { num: 3, label: "Delivery" },
                { num: 4, label: "Payment" },
              ].map((s) => (
                <div
                  key={s.num}
                  style={{
                    borderTop: `3px solid ${step >= s.num ? "#9E3B2B" : "#E4DDD3"}`,
                    paddingTop: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: step >= s.num ? "#9E3B2B" : "#8A8279",
                    }}
                  >
                    Step {s.num}: {s.label}
                  </span>
                </div>
              ))}
            </div>

            {errorMessage && (
              <div
                style={{
                  backgroundColor: "#FEE2E2",
                  border: "1px solid #DC2626",
                  color: "#991B1B",
                  padding: "12px 16px",
                  fontSize: "14px",
                  marginBottom: "24px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "36px",
              }}
              className="lg:grid-cols-[1.5fr_1fr]"
            >
              {/* ════ LEFT: Multi-Step Forms ════ */}
              <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px 24px" }}>
                {/* ────── STEP 1: CONTACT DETAILS ────── */}
                {step === 1 && (
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "20px",
                        fontWeight: 500,
                        marginBottom: "20px",
                      }}
                    >
                      1. Contact Information
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Ramesh Kulkarni"
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        />
                      </div>

                      <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                            Mobile Number (10-digit) *
                          </label>
                          <input
                            type="tel"
                            className="input"
                            placeholder="e.g. 9876543210"
                            maxLength={10}
                            value={customer.phone}
                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, "") })}
                          />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Alternate Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          className="input"
                          placeholder="e.g. Landline or second mobile"
                          value={customer.altPhone}
                          onChange={(e) => setCustomer({ ...customer, altPhone: e.target.value })}
                        />
                      </div>

                      <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={handleNext} className="btn btn-primary">
                          Continue to Shipping Address <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ────── STEP 2: SHIPPING ADDRESS ────── */}
                {step === 2 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500 }}>
                        2. Shipping Address
                      </h2>
                      <button onClick={() => setStep(1)} style={{ background: "none", border: "none", fontSize: "13px", color: "#9E3B2B", cursor: "pointer" }}>
                        Edit Contact
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-3">
                        <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g. 413512"
                            maxLength={6}
                            value={address.pinCode}
                            onChange={(e) => handlePinCodeChange(e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                            City *
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="City / Town"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                            State *
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="State"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Flat, House no., Building, Apartment *
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Plot No. 42, Shanti Niwas"
                          value={address.house}
                          onChange={(e) => setAddress({ ...address, house: e.target.value })}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Street, Sector, Area *
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Main Market Road, Hatte Nagar"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Near Water Tank or Ganpati Temple"
                          value={address.landmark}
                          onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                        />
                      </div>

                      {/* Address Type */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                          Address Type
                        </label>
                        <div style={{ display: "flex", gap: "12px" }}>
                          {["HOME", "WORK", "OTHER"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setAddress({ ...address, type })}
                              style={{
                                padding: "8px 16px",
                                fontSize: "12px",
                                fontWeight: address.type === type ? 600 : 400,
                                border: address.type === type ? "1.5px solid #1A1918" : "1px solid #E4DDD3",
                                backgroundColor: address.type === type ? "#1A1918" : "white",
                                color: address.type === type ? "white" : "#1A1918",
                                cursor: "pointer",
                              }}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
                        <button onClick={() => setStep(1)} className="btn btn-secondary btn-sm">
                          ← Back
                        </button>
                        <button onClick={handleNext} className="btn btn-primary">
                          Continue to Delivery <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ────── STEP 3: DELIVERY METHOD ────── */}
                {step === 3 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500 }}>
                        3. Delivery Speed
                      </h2>
                      <button onClick={() => setStep(2)} style={{ background: "none", border: "none", fontSize: "13px", color: "#9E3B2B", cursor: "pointer" }}>
                        Edit Address
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <label
                        onClick={() => setDeliveryMethod("STANDARD")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          border: deliveryMethod === "STANDARD" ? "2px solid #9E3B2B" : "1px solid #E4DDD3",
                          backgroundColor: deliveryMethod === "STANDARD" ? "#FAF7F2" : "white",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <input
                            type="radio"
                            checked={deliveryMethod === "STANDARD"}
                            onChange={() => setDeliveryMethod("STANDARD")}
                          />
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918" }}>
                              Standard Courier Delivery
                            </p>
                            <p style={{ fontSize: "12px", color: "#8A8279" }}>
                              Estimated: 7-10 days
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>
                          ₹79
                        </span>
                      </label>
                      {/* Order notes */}
                      <div style={{ marginTop: "12px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                          Order Notes or Cutting Instructions (Optional)
                        </label>
                        <textarea
                          rows={2}
                          className="input"
                          placeholder="e.g. Please cut the 4m cotton fabric into two 2m pieces, or delivery instructions..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
                        <button onClick={() => setStep(2)} className="btn btn-secondary btn-sm">
                          ← Back
                        </button>
                        <button onClick={handlePlaceOrder} disabled={isSubmitting} className="btn btn-primary">
                          {isSubmitting ? "Processing..." : "Confirm Order"} <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ────── STEP 4: PAYMENT SELECTION ────── */}
                {step === 4 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500 }}>
                        4. Select Payment Method
                      </h2>
                      <button onClick={() => setStep(3)} style={{ background: "none", border: "none", fontSize: "13px", color: "#9E3B2B", cursor: "pointer" }}>
                        Edit Delivery
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                      {/* Razorpay Online */}
                      <label
                        onClick={() => setPaymentMethod("RAZORPAY")}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          border: paymentMethod === "RAZORPAY" ? "2px solid #9E3B2B" : "1px solid #E4DDD3",
                          backgroundColor: paymentMethod === "RAZORPAY" ? "#FAF7F2" : "white",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                          <input
                            type="radio"
                            checked={paymentMethod === "RAZORPAY"}
                            onChange={() => setPaymentMethod("RAZORPAY")}
                            style={{ marginTop: "3px" }}
                          />
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "2px" }}>
                              Online Payment (Razorpay Secure)
                            </p>
                            <p style={{ fontSize: "12px", color: "#8A8279" }}>
                              UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking & Wallets
                            </p>
                            <div style={{ display: "flex", gap: "8px", marginTop: "8px", fontSize: "11px", color: "#2C6E3F", fontWeight: 600 }}>
                              <span>✓ Instant Confirmation</span>
                              <span>✓ 100% Encrypted</span>
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: "12px", color: "#2C6E3F", fontWeight: 600, backgroundColor: "#E8F5E9", padding: "2px 8px" }}>
                          RECOMMENDED
                        </span>
                      </label>

                      {/* Cash on Delivery */}
                      <label
                        onClick={() => setPaymentMethod("COD")}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          border: paymentMethod === "COD" ? "2px solid #9E3B2B" : "1px solid #E4DDD3",
                          backgroundColor: paymentMethod === "COD" ? "#FAF7F2" : "white",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                          <input
                            type="radio"
                            checked={paymentMethod === "COD"}
                            onChange={() => setPaymentMethod("COD")}
                            style={{ marginTop: "3px" }}
                          />
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1918", marginBottom: "2px" }}>
                              Cash on Delivery (COD)
                            </p>
                            <p style={{ fontSize: "12px", color: "#8A8279" }}>
                              Pay with cash when courier delivers to your doorstep. +₹50 COD handling fee.
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1918" }}>
                          +₹50
                        </span>
                      </label>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button onClick={() => setStep(3)} className="btn btn-secondary btn-sm">
                        ← Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="btn btn-accent"
                        style={{ padding: "16px 32px", fontSize: "15px" }}
                      >
                        {isSubmitting ? "Processing Order..." : `Place Order • ${formatPrice(finalTotal)}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ════ RIGHT: Order Summary Sidebar ════ */}
              <div>
                <div style={{ backgroundColor: "#F3EFEA", border: "1px solid #E4DDD3", padding: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "16px" }}>
                    Order Items ({items.length})
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto", marginBottom: "20px", borderBottom: "1px solid #E4DDD3", paddingBottom: "16px" }}>
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId || "default"}`} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          style={{ width: "44px", height: "55px", objectFit: "cover", backgroundColor: "#E4DDD3" }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 500, color: "#1A1918", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "12px", color: "#8A8279" }}>
                            {item.quantity} {item.unitType === "PER_METER" ? "meters" : "pcs"} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price Calculation */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#8A8279" }}>Items Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#8A8279" }}>Shipping</span>
                      <span>{formatPrice(shippingCharge)}</span>
                    </div>
                    <div style={{ borderTop: "1px solid #E4DDD3", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 600 }}>
                      <span>Final Payable Total</span>
                      <span style={{ color: "#9E3B2B" }}>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Delivery location reminder */}
                  {customer.name && address.pinCode && (
                    <div style={{ backgroundColor: "white", padding: "12px", border: "1px solid #E4DDD3", fontSize: "12px", color: "#8A8279" }}>
                      <p style={{ fontWeight: 600, color: "#1A1918", marginBottom: "2px" }}>Delivering to:</p>
                      <p>{customer.name} ({customer.phone})</p>
                      <p>{address.house}, {address.street}, {address.city} - {address.pinCode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
