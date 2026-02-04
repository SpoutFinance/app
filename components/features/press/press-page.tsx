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
          <section className="relative w-full overflow-hidden bg-white px-4 sm:px-6 lg:px-0">
            {/* Full-width horizontal lines at top and bottom */}
            <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
            <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />

            {/* Left gradient chevrons — absolutely positioned, vw-based widths */}
            <div className="hidden lg:flex flex-col absolute left-0 top-0 bottom-0 pointer-events-none">
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '22vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '20vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '18vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '16vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '14vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '16vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '18vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '20vw' }} />
              <div className="flex-1 bg-gradient-to-r from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '22vw' }} />
            </div>

            {/* Right gradient chevrons — absolutely positioned, vw-based widths */}
            <div className="hidden lg:flex flex-col items-end absolute right-0 top-0 bottom-0 pointer-events-none">
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '22vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '20vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '18vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '16vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '14vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '16vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '18vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '20vw' }} />
              <div className="flex-1 bg-gradient-to-l from-spout-gradient-cyan to-spout-gradient-blue" style={{ width: '22vw' }} />
            </div>

            {/* Mobile gradient accents */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-spout-gradient-blue via-spout-gradient-blue-mid to-spout-gradient-cyan lg:hidden" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-spout-gradient-blue via-spout-gradient-blue-mid to-spout-gradient-cyan lg:hidden" />

            {/* Center content */}
            <div className="relative z-10 mx-auto text-center flex flex-col justify-center items-center py-16 sm:py-20 lg:py-24">
              <div className="w-fit px-2.5 py-1 rounded-[3px] bg-spout-accent/35 mb-4">
                <span className="text-sm sm:text-base font-medium text-spout-text-secondary">
                  Press &amp; Media
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal text-spout-primary font-pt-serif leading-tight mb-3">
                In the Press
              </h1>

              <p className="text-base sm:text-lg text-spout-text-muted max-w-[646px] font-dm-sans mx-auto leading-7 px-2 sm:px-0">
                Financial media outlets are highlighting our approach to secure,
                regulated investing with real returns
              </p>
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
