"use client";

import Navbar from "@/components/navBar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedFooterSection } from "./features/root";
import { isAppSubdomain as checkIsAppSubdomain } from "@/lib/utils";

function useIsAppSubdomain() {
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    setIsSubdomain(checkIsAppSubdomain());
  }, []);

  return isSubdomain;
}

export function ConditionalNavbar() {
  const pathname = usePathname();
  const isOnAppSubdomain = useIsAppSubdomain();

  // Hide navbar when in /app routes or on app subdomain
  if (
    pathname?.startsWith("/app") ||
    pathname?.startsWith("/auth") ||
    isOnAppSubdomain
  ) {
    return null;
  }

  return <Navbar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isOnAppSubdomain = useIsAppSubdomain();

  // Hide footer when in /app routes or on app subdomain
  if (
    pathname?.startsWith("/app") ||
    pathname?.startsWith("/auth") ||
    isOnAppSubdomain
  ) {
    return null;
  }

  return (
    <div className="relative z-10 w-full">
      <AnimatedFooterSection />
    </div>
  );
}
