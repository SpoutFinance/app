"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isAppSubdomain, normalizePathname, cn } from "@/lib/utils";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { SvgIcon } from "@/components/ui/svg-icon";

import BorrowIcon from "@/assets/images/borrow.svg";
import DollarCaseIcon from "@/assets/images/dollar_case.svg";
import GraphIcon from "@/assets/images/graph.svg";
import KYCIcon from "@/assets/images/kyc.svg";
import LendIcon from "@/assets/images/lend.svg";
import SearchIcon from "@/assets/images/search.svg";
import SettingsIcon from "@/assets/images/setting.svg";
import SideBarToggle from "@/assets/images/sidebar_toggle.svg";
import UserIcon from "@/assets/images/user.svg";

// Navigation items configuration
const homeNavItems = [
  {
    href: "/app/portfolio",
    label: "Portfolio",
    icon: DollarCaseIcon,
    width: 20,
    height: 16,
  },
  {
    href: "/app/trade",
    label: "Trade",
    icon: GraphIcon,
    width: 16,
    height: 18,
  },
  {
    href: "/app/borrow",
    label: "Borrow",
    icon: BorrowIcon,
    width: 20,
    height: 14,
  },
  {
    href: "/app/lend",
    label: "Lend",
    icon: LendIcon,
    width: 18,
    height: 16,
  },
  {
    href: "/app/kyc",
    label: "KYC",
    icon: KYCIcon,
    width: 22,
    height: 14,
  },
];

const accountNavItems = [
  {
    href: "/app/settings",
    label: "Settings",
    icon: SettingsIcon,
    width: 20,
    height: 20,
  },
];

function useAppHome() {
  const router = useRouter();
  return () => router.push(isAppSubdomain() ? "/" : "/app");
}

export function DashboardSidebarNavClient() {
  const goHome = useAppHome();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [balanceSol, setBalanceSol] = useState<string | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<"borrow" | "lend">("borrow");

  // Section visibility state
  const [isHomeExpanded, setIsHomeExpanded] = useState(true);
  const [isAccountExpanded, setIsAccountExpanded] = useState(true);

  const shortAddress = useMemo(() => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
  }, [address]);

  const { data: bal, isLoading: balLoading } = useBalance({
    address,
    query: { enabled: Boolean(address) },
  });
  useEffect(() => {
    setIsBalanceLoading(balLoading);
    if (!balLoading && bal) {
      const balance = Number(bal.value) / 10 ** bal.decimals;
      const formattedBalance = balance.toFixed(6).replace(/\.?0+$/, "");
      setBalanceSol(`${formattedBalance} ${bal.symbol}`);
    } else if (!address) {
      setBalanceSol(null);
    }
  }, [bal, balLoading, address]);

  const isActive = (path: string) => {
    const normalizedPathname = normalizePathname(pathname);
    if (path === "/app") {
      return normalizedPathname === "/app";
    }
    return normalizedPathname.startsWith(path);
  };

  return (
    <div className="font-figtree flex flex-col h-full">
      <SidebarHeader className="px-4 h-21.5">
        <div className="flex items-center justify-between h-full">
          <Image
            className="cursor-pointer"
            onClick={goHome}
            src="/spout-full-dark-logo.svg"
            alt="Spout Finance logo"
            width={124}
            height={48}
          />
          {/* Sidebar Toggle Icon - Disabled */}
          <div
            className="p-1.5 rounded opacity-30 cursor-not-allowed"
            aria-label="Toggle sidebar (disabled)"
          >
            <SvgIcon src={SideBarToggle} width={28} height={28} />
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      {/* Borrow/Lend Toggle */}
      <div className="px-4 py-7.5">
        <div className="flex items-center bg-white border border-dashboard-border rounded-md p-1">
          <button
            type="button"
            onClick={() => setActiveMode("borrow")}
            className={cn(
              "flex-1 py-2 px-4 text-xl font-medium rounded transition-colors font-figtree",
              activeMode === "borrow"
                ? "bg-dashboard-bg-light text-dashboard-teal"
                : "text-dashboard-text-primary hover:bg-gray-50",
            )}
          >
            Borrow
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("lend")}
            className={cn(
              "flex-1 py-2 px-4 text-xl font-medium rounded transition-colors font-figtree",
              activeMode === "lend"
                ? "bg-dashboard-bg-light text-dashboard-teal"
                : "text-dashboard-text-primary hover:bg-gray-50",
            )}
          >
            Lend
          </button>
        </div>
      </div>

      <SidebarSeparator className="mx-0" />

      <SidebarContent className="px-2 py-2">
        {/* HOME Section */}
        <SidebarGroup>
          <button
            type="button"
            onClick={() => setIsHomeExpanded(!isHomeExpanded)}
            className="flex items-center gap-2 text-dashboard-text-secondary text-base font-medium font-figtree px-2 py-1 hover:bg-dashboard-bg-hover rounded transition-colors w-full text-left"
          >
            HOME
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                !isHomeExpanded && "-rotate-90",
              )}
            />
          </button>
          {isHomeExpanded && (
            <SidebarMenu className="mt-1 gap-0.5">
              {homeNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className={cn(
                      "h-10 pl-3 pr-5 rounded-[6px] transition-colors",
                      isActive(item.href)
                        ? "bg-dashboard-bg-active text-dashboard-teal"
                        : "text-dashboard-text-secondary hover:bg-dashboard-bg-hover active:bg-dashboard-bg-active",
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <SvgIcon src={item.icon} width={item.width} height={item.height} />
                      <span className="font-medium font-figtree">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarGroup>

        <SidebarSeparator className="-mx-2 my-2 w-[calc(100%+1rem)]" />

        {/* ACCOUNT Section */}
        <SidebarGroup>
          <button
            type="button"
            onClick={() => setIsAccountExpanded(!isAccountExpanded)}
            className="flex items-center gap-2 text-dashboard-text-secondary text-base font-medium font-figtree px-2 py-1 hover:bg-dashboard-bg-hover rounded transition-colors w-full text-left"
          >
            ACCOUNT
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                !isAccountExpanded && "-rotate-90",
              )}
            />
          </button>
          {isAccountExpanded && (
            <SidebarMenu className="mt-1 gap-0.5">
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className={cn(
                      "h-10 pl-3 pr-5 rounded-[6px] transition-colors",
                      isActive(item.href)
                        ? "bg-dashboard-bg-active text-dashboard-teal"
                        : "text-dashboard-text-secondary hover:bg-dashboard-bg-hover active:bg-dashboard-bg-active",
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <SvgIcon src={item.icon} width={item.width} height={item.height} />
                      <span className="font-medium font-figtree">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarGroup>

        <SidebarSeparator className="-mx-2 my-2 w-[calc(100%+1rem)]" />
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        {/* Powered by Solana */}
        <div className="flex items-center justify-center gap-2.5 py-4">
          <span className="text-dashboard-text-secondary text-base font-medium tracking-[-0.48px] font-figtree">
            Powered by
          </span>
          <Image
            src="/partners/solana-logo.svg"
            alt="Solana"
            width={122}
            height={18}
          />
        </div>

        <SidebarSeparator className="-mx-2 w-[calc(100%+1rem)]" />

        {/* Connect Wallet Button */}
        <div className="p-4">
          {!isConnected ? (
            <Button
              onClick={() => {
                if (openConnectModal) {
                  openConnectModal();
                } else {
                  console.error(
                    "openConnectModal is not available. Check RainbowKit configuration.",
                  );
                  alert(
                    "Wallet connection is not available. Please check your browser console for details.",
                  );
                }
              }}
              className="w-full h-10 bg-dashboard-teal hover:bg-dashboard-teal-hover text-white text-xl font-semibold rounded-lg border border-dashboard-teal-dark font-figtree"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-gray-600 truncate font-figtree">
                    {shortAddress}
                  </span>
                  <span className="text-xs font-medium text-gray-900 font-figtree">
                    {isBalanceLoading ? "Loading…" : (balanceSol ?? "—")}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => disconnect()}
                className="shrink-0 text-xs rounded-md font-figtree"
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </div>
  );
}

export function DashboardNavbarHeaderClient() {
  return (
    <header className="font-figtree flex h-21.5 shrink-0 items-center justify-between bg-dashboard-bg border-b border-dashboard-border px-9">
      {/* Left: NYSE Status + Search Bar */}
      <div className="flex items-center gap-6">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-2 bg-white border border-dashboard-border-light rounded-lg px-2.5 py-2 h-9.5">
          <span className="text-lg">🇺🇸</span>
          <div className="flex items-center gap-1.5">
            <p className="text-dashboard-text-secondary text-base tracking-[-0.48px] font-figtree">
              <span className="font-semibold">NYSE</span>
              <span className="font-medium"> : Closed</span>
            </p>
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2.5 bg-white border border-dashboard-border-input rounded-lg px-4 h-9.5 w-87.5 text-dashboard-text-secondary">
          <SvgIcon src={SearchIcon} size="sm" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-base text-dashboard-text-secondary placeholder-dashboard-text-secondary outline-none font-figtree"
          />
        </div>
      </div>

      {/* Right: Live Status, Notifications, Profile */}
      <div className="flex items-center gap-5">
        {/* Live Badge */}
        <div className="flex items-center gap-1.5 bg-white border border-dashboard-border-light rounded-lg px-2.5 py-2 h-9.5 w-20 justify-center">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-dashboard-text-secondary text-base font-medium tracking-[-0.48px] font-figtree">
            Live
          </span>
        </div>

        {/* Notification Icon */}
        <NotificationsDropdown />

        {/* User Profile Icon */}
        <button
          type="button"
          aria-label="User profile"
          className="flex items-center justify-center w-10 h-10 bg-white border-2 border-dashboard-border rounded-lg hover:bg-gray-50 transition-colors text-dashboard-text-secondary"
        >
          <SvgIcon src={UserIcon} size="lg" />
        </button>
      </div>
    </header>
  );
}
