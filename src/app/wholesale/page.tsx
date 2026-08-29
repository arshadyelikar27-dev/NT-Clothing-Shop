import type { Metadata } from "next";
import { WholesalePageClient } from "./WholesalePageClient";

export const metadata: Metadata = {
  title: "Wholesale Account — NOBLE TEXTILE | Bulk Fabric & Clothing",
  description:
    "Apply for a wholesale account at Noble Textile. Get access to wholesale pricing on fabrics, dress materials, sarees, kurtis, and more. Based in Latur, Maharashtra.",
};

export default function WholesalePage() {
  return <WholesalePageClient />;
}

