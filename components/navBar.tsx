"use client";
import { signOut } from "@/lib/supabase/auth";
import Link from "next/link";
import { useState } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  NavBody,
  NavItems,
  NavbarLogo,
  Navbar as ResizableNavbar,
} from "./ui/resizable-navbar";
const navItems = [
  { name: "HOME", link: "/" },
  { name: "ABOUT US", link: "/company" },
  { name: "EARN", link: "/app/earn", soon: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const { user, profile } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  // const displayName = profile?.first_name
  //   ? `${profile.first_name} ${profile.last_name ?? ""}`
  //   : user?.email;

  return (
    <ResizableNavbar className="border-b-2 border-[#F3F4F6] font-dm-sans sticky top-0 bg-white z-50">
      <NavBody className="flex justify-between h-[68px]">
        <NavbarLogo />
        <div className="flex items-center gap-[64px]">
          <NavItems items={navItems} className="" />
          <Link
            href="/app"
            className="not-italic mr-4 p-[10px] w-[114px] h-[32px] flex items-center justify-center text-sm bg-[#004040] hover:bg-[#003030] text-white font-semibold transition-colors z-50 relative rounded-md text-[14px] leading-5 font-noto-sans"
          >
            Get Started
          </Link>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          {/* <MobileNavToggle
            isOpen={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          /> */}
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          <NavItems items={navItems} onItemClick={() => setMobileOpen(false)} />
          <Link
            href="/app"
            className="px-6 py-2 bg-[#004040] hover:bg-[#003030] text-white font-semibold transition-colors block text-center mt-4 rounded-md"
          >
            Get Started
          </Link>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
