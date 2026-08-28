export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft, Plus } from "lucide-react";

export default async function CustomerAddressesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ backgroundColor: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container-main" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Link
            href="/account"
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
            <ArrowLeft size={14} /> Back to Account
          </Link>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "#1A1918" }}>
            Saved Addresses
          </h1>
          <p style={{ fontSize: "14px", color: "#8A8279" }}>
            Manage delivery locations for quick checkout
          </p>
        </div>

        {addresses.length === 0 ? (
          <div style={{ backgroundColor: "white", border: "1px solid #E4DDD3", padding: "60px 20px", textAlign: "center" }}>
            <MapPin size={44} style={{ margin: "0 auto 16px", color: "#8A8279" }} />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>
              No Saved Addresses
            </h2>
            <p style={{ fontSize: "14px", color: "#8A8279", marginBottom: "24px" }}>
              Your addresses are automatically saved whenever you place an order.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Explore Fabrics
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }} className="sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E4DDD3",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#F3EFEA", color: "#1A1918" }}>
                    {addr.type}
                  </span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1918", marginBottom: "4px" }}>
                  {addr.fullName}
                </h3>
                <p style={{ fontSize: "13px", color: "#8A8279", lineHeight: 1.6 }}>
                  {addr.house}, {addr.street}
                  <br />
                  {addr.area && `${addr.area}, `}
                  {addr.city}, {addr.state} - {addr.pinCode}
                  {addr.landmark && <br />}
                  {addr.landmark && `Landmark: ${addr.landmark}`}
                </p>
                <p style={{ fontSize: "13px", color: "#1A1918", marginTop: "8px", fontWeight: 500 }}>
                  Phone: +91 {addr.phone}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

