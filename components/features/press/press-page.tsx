"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import NewsletterCta from "@/components/features/newsletter-cta";

interface MediaOutlet {
  name: string;
  date: string;
  image: string;
  bgColor?: string;
  imageType: "logo" | "cover";
  url: string;
}

// Replace Figma CDN URLs with local image paths once assets are downloaded
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

/* ─── Press Row ─── */
function PressRow({
  outlets,
  dividerColors,
}: {
  outlets: MediaOutlet[];
  dividerColors: { from: string; to: string }[];
}) {
  return (
    <>
      {/* Desktop: cards with gradient dividers */}
      <div className="hidden lg:flex">
        {outlets.map((outlet, i) => (
          <div key={outlet.name} className="flex">
            <PressCard {...outlet} />
            <div
              className="w-[22px] self-stretch flex-shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${dividerColors[i].from}, ${dividerColors[i].to})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Tablet: 2-column grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 sm:gap-6">
        {outlets.map((outlet) => (
          <PressCard key={outlet.name} {...outlet} />
        ))}
      </div>

      {/* Mobile: single column */}
      <div className="grid sm:hidden grid-cols-1 gap-6">
        {outlets.map((outlet) => (
          <PressCard key={outlet.name} {...outlet} />
        ))}
      </div>
    </>
  );
}

/* ─── Press Card ─── */
function PressCard({
  name,
  date,
  image,
  bgColor = "#ffffff",
  imageType,
  url,
}: MediaOutlet) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full lg:w-[370px] bg-white flex flex-col"
    >
      {/* Image Section */}
      <div
        className="relative w-full h-48 sm:h-56 overflow-hidden border-b border-spout-border flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <Image
          src={image}
          alt={name}
          width={370}
          height={224}
          className={
            imageType === "cover"
              ? "w-full h-full object-cover"
              : "max-h-[60%] max-w-[80%] object-contain"
          }
          loading="lazy"
          unoptimized
        />
      </div>

      {/* Info Section */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Name Badge */}
        <div className="inline-flex items-center gap-2.5 px-2.5 py-1 border border-spout-accent bg-spout-accent/35">
          <Image
            src="/svg-assets/landingpage/spout-book.svg"
            alt=""
            width={18}
            height={18}
            className="w-[18px] h-[18px]"
          />
          <span className="text-sm sm:text-base font-medium text-spout-text-secondary tracking-[-0.064px] leading-7">
            {name}
          </span>
          <ChevronRight className="w-3 h-3 text-spout-text-secondary flex-shrink-0" />
        </div>

        {/* Date */}
        <span className="text-sm sm:text-base font-medium text-spout-text-muted tracking-[-0.064px] leading-7">
          {date}
        </span>
      </div>
    </a>
  );
}
