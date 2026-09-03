export const dynamic = "force-dynamic";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddressesClient from "./AddressesClient";

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

        <AddressesClient initialAddresses={addresses} />
      </div>
    </div>
  );
}

