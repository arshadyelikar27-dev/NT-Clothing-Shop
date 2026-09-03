"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/store";

interface RealtimeRefresherProps {
  events: string[];
}

export default function RealtimeRefresher({ events }: RealtimeRefresherProps) {
  const router = useRouter();
  const showNotification = useUIStore((state) => state.showNotification);

  useEffect(() => {
    // Vercel-friendly polling: silently refresh data every 10 seconds
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  // Render nothing, this is purely a functional component
  return null;
}
