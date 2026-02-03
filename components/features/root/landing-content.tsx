"use client";

import {
  FAQSection,
  HeroSection,
  HowSpoutWorks,
  InTheNews,
  InvestmentDifferent,
  ProofOfReserveLanding,
  UnlockingFinance,
} from "@/components/features/root";
import NewsletterCta from "@/components/features/newsletter-cta";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingContent() {
  return (
    <div className="min-h-screen bg-white relative overflow-x-clip">
      <div className="relative z-50">
        <main className="relative flex flex-col">
          {/* ── Hero Section ── */}
          <HeroSection />

          {/* ── Content wrapper ── */}
          <div>
            {/* Bordered container: all sections */}
            <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 lg:border-x-2 lg:border-gray-100">
              {/* ── How Spout Works ── */}
              <div className="relative">
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <HowSpoutWorks />
              </div>

              <div className="h-12 sm:h-16 lg:h-[100px]" />

              {/* ── Proof of Reserve ── */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <ProofOfReserveLanding />
              </div>

              <div className="h-12 sm:h-16 lg:h-[100px]" />

              {/* ── Unlocking Finance ── */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none z-10" />
                <UnlockingFinance />
              </div>

              <div className="h-12 sm:h-16 lg:h-[100px]" />

              {/* ── Smarter On-chain Investing ── */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none z-10" />
                <InvestmentDifferent />
              </div>

              <div className="h-12 sm:h-16 lg:h-[100px]" />

              {/* ── In the Press ── */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none z-10" />
                <InTheNews />
              </div>

              {/* Spacer with View All button */}
              <div className="h-12 sm:h-16 lg:h-[100px] flex items-center justify-end pr-[22px]">
                <Link
                  href="/press"
                  className="inline-flex items-center gap-2.5 px-3 h-9 bg-white border-[1.5px] border-[#e8e8e8] rounded-[4px] font-noto-sans font-medium text-sm text-black hover:border-gray-400 transition-colors"
                >
                  View All
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* ── FAQ ── */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <FAQSection />
              </div>
            </div>

            {/* Lower bordered container: Newsletter */}
            <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 lg:border-x-2 lg:border-gray-100">
              {/* ── Newsletter CTA ── */}
              <div className="relative">
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <NewsletterCta />
              </div>

              {/* Gap before footer */}
              <div className="h-12 sm:h-16 lg:h-[100px]" />

              {/* Bottom horizontal line */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
