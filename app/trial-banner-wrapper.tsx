"use client";

import { usePathname } from "next/navigation";
import { TrialBanner } from "@/components/TrialBanner";

export function TrialBannerWrapper() {
  const pathname = usePathname();

  // Don't show banner on welcome/home page or pricing page
  const hideBannerOn = ["/", "/pricing"];
  if (hideBannerOn.includes(pathname)) {
    return null;
  }

  return <TrialBanner />;
}
