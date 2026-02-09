"use client";

import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

export default function WelcomeBanner() {
  return (
    <div className="relative w-full">
      {/* Gradient header bar */}
      <div className="h-[22px] w-full bg-gradient-to-r from-dashboard-teal to-dashboard-accent-blue-light rounded-t-[6px]" />

      {/* Content area */}
      <div className="bg-white border-l-2 border-r-2 border-b-2 border-dashboard-border rounded-b-[6px] px-5 py-5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[22px] font-medium text-dashboard-text-primary font-figtree tracking-[-0.17px] leading-[23.3px]">
            Welcome to Spout Finance
          </h2>
          <p className="text-sm text-dashboard-text-secondary font-figtree tracking-[-0.2px]">
            Now it's easier than ever to get started with Spout
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/app/trade"
            className="flex items-center gap-1.5 px-[13px] py-[11.5px] bg-dashboard-teal border border-dashboard-teal-dark text-white rounded-[12px] hover:bg-dashboard-teal-hover transition-colors"
          >
            <span className="text-base font-semibold font-figtree">
              Watch Demo
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            className="flex items-center justify-center size-[45px] text-dashboard-teal hover:text-dashboard-teal-hover transition-colors"
            aria-label="Add new"
          >
            <Plus className="h-8 w-8 rotate-45" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
