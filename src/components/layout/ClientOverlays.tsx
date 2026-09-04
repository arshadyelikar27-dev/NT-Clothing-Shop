"use client";

import dynamic from "next/dynamic";

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
      <SearchModal />
      <Notification />
    </>
  );
}
