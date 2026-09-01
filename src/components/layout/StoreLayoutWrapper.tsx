"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ClientOverlays } from "@/components/layout/ClientOverlays";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // If it's an admin page, only render the children (which uses admin/layout.tsx)
    // We don't render the Store Header, Footer, etc.
    return (
      <>
        {children}
        <ClientOverlays />
      </>
    );
  }

  // Regular Storefront Layout
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <ClientOverlays />
      <MobileBottomNav />
      <WhatsAppWidget />
    </>
  );
}
