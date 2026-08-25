"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

const SearchModal = dynamic(
  () => import("@/components/search/SearchModal").then((mod) => mod.SearchModal),
  { ssr: false }
);

const Notification = dynamic(
  () => import("@/components/ui/Notification").then((mod) => mod.Notification),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <CartDrawer />
      <SearchModal />
      <Notification />
    </>
  );
}
