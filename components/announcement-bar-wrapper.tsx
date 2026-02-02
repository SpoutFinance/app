"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/features/root";
import { isAppSubdomain as checkIsAppSubdomain } from "@/lib/utils";

export function AnnouncementBarWrapper() {
  const pathname = usePathname();
  const [isOnAppSubdomain, setIsOnAppSubdomain] = useState(false);

  useEffect(() => {
    setIsOnAppSubdomain(checkIsAppSubdomain());
  }, []);

  // Only show on main domain homepage, not on app subdomain
  if (pathname !== "/" || isOnAppSubdomain) return null;
  return <AnnouncementBar />;
}
