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
  addresses?: any[];
}



export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { showNotification } = useUIStore();

  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [orderConfirmedData, setOrderConfirmedData] = useState<any>(null);
  const [orderedItems, setOrderedItems] = useState<any[]>([]);

  // Inline Auth Form state (if not logged in)
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

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

  const [notes, setNotes] = useState("");
  const storePhone = "919307771777"; // Example store number, can be changed later.

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

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
          if (data.user.addresses && data.user.addresses.length > 0) {
            setSelectedAddressId(data.user.addresses[0].id);
          }
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
          addresses: data.user.addresses || [],
        });
        setCustomer((prev) => ({
          ...prev,
          name: data.user.name,
          phone: data.user.phone || prev.phone,
        }));
        if (data.user.addresses && data.user.addresses.length > 0) {
          setSelectedAddressId(data.user.addresses[0].id);
        }
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
          addresses: data.user.addresses || [],
        });
        setCustomer((prev) => ({
          ...prev,
          name: data.user.name,
          phone: data.user.phone || prev.phone,
        }));
        if (data.user.addresses && data.user.addresses.length > 0) {
          setSelectedAddressId(data.user.addresses[0].id);
        }
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
  const shippingCharge = subtotal === 0 ? 0 : 79;
  const finalTotal = subtotal + shippingCharge;

  // Validation
  const validateAddress = () => {
    if (selectedAddressId) return ""; // valid if selected
    if (!address.house.trim()) return "Please enter Flat / House / Building name";
    if (!address.street.trim()) return "Please enter Street or Road name";
    if (!address.city.trim()) return "Please enter City";
    if (!address.state.trim()) return "Please enter State";
    if (!address.pinCode.trim() || address.pinCode.length !== 6) return "Please enter a 6-digit PIN code";
    return "";
  };

  const handlePlaceOrder = async () => {
    if (!authUser) {
      setErrorMessage("Please sign in or register to place your order.");
      return;
    }

    const err = validateAddress();
    if (err) {
      setErrorMessage(err);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          address: selectedAddressId ? undefined : address,
          addressId: selectedAddressId,
          items,
          paymentMethod: "COD",
          deliveryMethod: "STANDARD",
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Manual Order Confirmation Flow
      setOrderConfirmedData(data);
      setOrderedItems([...items]); // Save items before clearing cart
      clearCart();
      showNotification("Order saved! Please contact us via WhatsApp to complete.", "success");
    } catch (err: any) {
      console.error("Checkout submission failed", err);
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!orderConfirmedData) return "";
    
    let productDetails = orderedItems.map((item, index) => 
      `${index + 1}. ${item.name} (${item.quantity} ${item.unitType === "PER_METER" ? "meters" : "pcs"}) - ${formatPrice(item.price * item.quantity)}`
    ).join("\n");

    const text = `Hello NOBLE TEXTILE,\n\nI want to buy the following order:\nOrder Number: *${orderConfirmedData.orderNumber}*\nTotal Amount: *${formatPrice(orderConfirmedData.totalAmount)}*\n\n*Products:*\n${productDetails}\n\nPlease confirm my order.`;
    return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
  };

  if (orderConfirmedData) {
    return (
      <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", paddingTop: "110px", paddingBottom: "80px", display: "flex", flexDirection: "column", alignItems: "center", padding: "110px 20px 80px" }}>
        <div className="p-6 md:p-10" style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E4DDD3", maxWidth: "600px", width: "100%", textAlign: "center" }}>
          <CheckCircle2 size={56} style={{ color: "#2C6E3F", margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "#1A1918", marginBottom: "8px" }}>
            Order Saved!
          </h2>
          <p style={{ fontSize: "15px", color: "#8A8279", marginBottom: "24px" }}>
            Your order <strong>#{orderConfirmedData.orderNumber}</strong> has been saved. To complete your purchase and arrange payment, please contact us on WhatsApp or call us directly.
          </p>
          
          <div style={{ backgroundColor: "#F3EFEA", padding: "20px", borderRadius: "4px", marginBottom: "32px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px", borderBottom: "1px solid #E4DDD3", paddingBottom: "12px" }}>
              <p style={{ fontSize: "16px", fontWeight: 600 }}>Order Summary</p>
              <p style={{ fontSize: "14px", color: "#8A8279" }}>Customer: {customer.name}</p>
            </div>
            
            {/* Ordered Items List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {orderedItems.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "48px", height: "60px", objectFit: "cover", backgroundColor: "#E4DDD3", borderRadius: "4px" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1918", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "13px", color: "#8A8279" }}>
                      {item.quantity} {item.unitType === "PER_METER" ? "meters" : "pcs"} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #E4DDD3", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <p style={{ fontSize: "14px", fontWeight: 600 }}>Total Amount:</p>
               <p style={{ fontSize: "18px", fontWeight: 700, color: "#9E3B2B" }}>{formatPrice(orderConfirmedData.totalAmount)}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn"
              style={{ backgroundColor: "#25D366", color: "white", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 600, textDecoration: "none", borderRadius: "4px" }}
            >
              Contact on WhatsApp to Buy
            </a>
            
            <a 
              href={`tel:+${storePhone}`}
              className="btn btn-secondary"
              style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 600, textDecoration: "none" }}
            >
              Call {storePhone} To Buy
            </a>
          </div>
        </div>
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
          /* ════ LOGGED IN: CHECKOUT ════ */
          <>
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
              {/* ════ LEFT: Forms ════ */}
              <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "32px 24px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500 }}>
                        Shipping Address
                      </h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      
                      {/* Saved Addresses Section */}
                      {authUser?.addresses && authUser.addresses.length > 0 && (
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                            Select Saved Address
                          </label>
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {authUser.addresses.map((savedAddr: any) => (
                              <div
                                key={savedAddr.id}
                                onClick={() => setSelectedAddressId(savedAddr.id)}
                                style={{
                                  border: selectedAddressId === savedAddr.id ? "2px solid #2C6E3F" : "1px solid #E4DDD3",
                                  padding: "12px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  backgroundColor: selectedAddressId === savedAddr.id ? "#F2F9F3" : "white"
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                  <span style={{ fontWeight: 600, fontSize: "14px" }}>{savedAddr.type}</span>
                                  {selectedAddressId === savedAddr.id && <CheckCircle2 size={16} color="#2C6E3F" />}
                                </div>
                                <p style={{ fontSize: "13px", color: "#5A5249", margin: "2px 0" }}>{savedAddr.house}, {savedAddr.street}</p>
                                <p style={{ fontSize: "13px", color: "#5A5249", margin: "2px 0" }}>{savedAddr.city}, {savedAddr.state} - {savedAddr.pinCode}</p>
                              </div>
                            ))}
                            <button 
                              type="button" 
                              onClick={() => setSelectedAddressId(null)}
                              style={{ textAlign: "left", fontSize: "13px", color: "#9E3B2B", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}
                            >
                              + Add New Address
                            </button>
                          </div>
                        </div>
                      )}

                      {!selectedAddressId && (
                        <>
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
                      </>
                    )}

                      <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={handlePlaceOrder} disabled={isSubmitting} className="btn btn-accent" style={{ padding: "12px 24px" }}>
                          {isSubmitting ? "Processing..." : "Place Order"} <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
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
