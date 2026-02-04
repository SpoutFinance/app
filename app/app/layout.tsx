"use client";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";
// import OnchainIDChecker from "@/components/contract/OnchainIDChecker";
import { RumInit } from "@/aws/rum-init";
import {
  DashboardNavbarHeaderClient,
  DashboardSidebarNavClient,
} from "@/components/dashboardNavClient";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";

const Providers = dynamic(
  () => import("@/components/providers").then((mod) => mod.Providers),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RumInit />
      <Providers>
        <SidebarProvider defaultOpen={true}>
          <Toaster position="top-right" />
          <div className="flex h-screen w-full overflow-hidden bg-[#f7f9f9]">
            <Sidebar className="border-r bg-white border-[#004040]/20">
              <DashboardSidebarNavClient />
            </Sidebar>

            <SidebarInset className="flex-1 flex flex-col h-screen overflow-hidden">
              <DashboardNavbarHeaderClient />
              {/* <Suspense fallback={<div>Loading...</div>}>
            <OnchainIDChecker />
          </Suspense> */}
              <main className="flex-1 overflow-y-auto p-6 bg-[#f7f9f9]">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </Providers>
    </>
  );
}
