import { Sidebar, SidebarInset } from "@/components/ui/sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";
import OnchainIDChecker from "@/components/contract/OnchainIDChecker";
import {
  DashboardSidebarNavClient,
  DashboardNavbarHeaderClient,
} from "@/components/dashboardNavClient";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" />
      <SidebarProvider defaultOpen={true}>
        <Sidebar className="border-r-2 border-[#e6e6e6] bg-[#fafafa]">
          <DashboardSidebarNavClient />
        </Sidebar>

        <SidebarInset className="flex flex-col min-h-screen bg-[#f7f9f9]">
          <DashboardNavbarHeaderClient />
          <Suspense fallback={<div>Loading...</div>}>
            <OnchainIDChecker />
          </Suspense>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
