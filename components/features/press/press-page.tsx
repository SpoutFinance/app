"use client";

import NewsletterCta from "@/components/features/newsletter-cta";
import {
  PressRow,
  type MediaOutlet,
} from "@/components/features/shared/press-card";

const mediaOutlets: MediaOutlet[] = [
  {
    name: "The Block",
    date: "JAN 20, 2026",
    image: "/svg-assets/landingpage/theblock.png",
    imageType: "logo",
    url: "#",
  },
  {
    name: "MEXC",
    date: "JAN 21, 2026",
    image: "/svg-assets/landingpage/mexc.png",
    bgColor: "#000000",
    imageType: "logo",
    url: "#",
  },
  {
    name: "Kucoin",
    date: "JAN 21, 2026",
    image: "/svg-assets/landingpage/kucoin.png",
    imageType: "logo",
    url: "#",
  },
  {
    name: "Morningstar",
    date: "JAN 4, 2026",
    image: "/svg-assets/landingpage/morningstar.png",
    imageType: "cover",
    url: "#",
  },
  {
    name: "Business Insider",
    date: "JAN 16, 2026",
    image: "/svg-assets/landingpage/businessinsider.png",
    imageType: "logo",
    url: "#",
  },
  {
    name: "Bezinga",
    date: "JAN 24, 2026",
    image: "/svg-assets/landingpage/bz.png",
    imageType: "cover",
    url: "#",
  },
];

const rowDividerColors = [
  // Row 1
  [
    { from: "#fec8bb", to: "#ffe4c8" }, // peach
    { from: "#ade1ff", to: "#e8fbf9" }, // light blue
    { from: "#abffe1", to: "#dcffe2" }, // mint
  ],
  // Row 2
  [
    { from: "#abffe1", to: "#dcffe2" }, // mint
    { from: "#ade1ff", to: "#e8fbf9" }, // light blue
    { from: "#fec8bb", to: "#ffe4c8" }, // peach
  ],
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-x-clip">
      <div className="relative z-50">
        <main className="relative flex flex-col gap-12 sm:gap-16 lg:gap-[100px]">
          {/* ── Hero Section ── */}
          <section className="relative flex justify-center items-center w-full px-4 sm:px-6 lg:px-0 overflow-hidden bg-white">
            {/* Full-width horizontal lines at top and bottom */}
            <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
            <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />

            {/* Left gradient chevrons — blue — hidden below lg */}
            <div className="z-10 hidden lg:block">
              <div className="w-96 h-5 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-88 h-10 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-80 h-10 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-72 h-10 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-60 h-10 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-72 h-10 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-80 h-10 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-88 h-10 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-96 h-5 relative bg-gradient-to-r from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
            </div>

            {/* Mobile gradient accents */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgba(0,87,216,0.68)] via-[rgba(39,148,236,0.68)] to-[rgba(78,210,255,0.68)] lg:hidden" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgba(0,87,216,0.68)] via-[rgba(39,148,236,0.68)] to-[rgba(78,210,255,0.68)] lg:hidden" />

            {/* Center content */}
            <div className="mx-auto text-center relative z-10 flex flex-col justify-center items-center py-16 sm:py-20 lg:py-0">
              <div className="w-fit px-2.5 py-1 rounded-[3px] bg-spout-accent/35 mb-4">
                <span className="text-sm sm:text-base font-medium text-spout-text-secondary">
                  Press &amp; Media
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal text-spout-primary font-lora leading-tight mb-3">
                In the Press
              </h1>

              <p className="text-base sm:text-lg text-spout-text-muted max-w-[646px] mx-auto leading-7 px-2 sm:px-0">
                Financial media outlets are highlighting our approach to secure,
                regulated investing with real returns
              </p>
            </div>

            {/* Right gradient chevrons — blue — hidden below lg */}
            <div className="z-10 hidden lg:flex flex-col items-end">
              <div className="w-96 h-5 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-88 h-10 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-80 h-10 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-72 h-10 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-60 h-10 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-72 h-10 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-80 h-10 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-88 h-10 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
              <div className="w-96 h-5 relative bg-gradient-to-l from-[rgba(78,210,255,0.68)] to-[rgba(0,87,216,0.68)]" />
            </div>
          </section>

          {/* ── Content wrapper ── */}
          <div>
            {/* Upper bordered container: Media Outlets */}
            <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 lg:border-x-2 lg:border-gray-100">
              {/* Row 1 — top + bottom full-width lines */}
              <div className="relative mb-6 sm:mb-8 lg:mb-[60px]">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <PressRow
                  outlets={mediaOutlets.slice(0, 3)}
                  dividerColors={rowDividerColors[0]}
                />
              </div>

              {/* Row 2 — top + bottom full-width lines */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <PressRow
                  outlets={mediaOutlets.slice(3, 6)}
                  dividerColors={rowDividerColors[1]}
                />
              </div>

              {/* Gap + bottom line before gradient bar */}
              <div className="h-8 sm:h-12 lg:h-[60px]" />
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              </div>
            </div>

            {/* ── Gradient bar separator ── */}
            <div className="flex w-full overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[44px] flex-1 bg-gradient-to-r from-blue-600 to-lime-200"
                />
              ))}
            </div>

            {/* Lower bordered container: Newsletter */}
            <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 lg:border-x-2 lg:border-gray-100">
              {/* Gap after gradient bar */}
              <div className="h-12 sm:h-16 lg:h-[100px]" />

              {/* ── Newsletter CTA — top + bottom full-width lines ── */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
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
