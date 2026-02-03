"use client";

import {
  PressRow,
  type MediaOutlet,
} from "@/components/features/shared/press-card";

const newsOutlets: MediaOutlet[] = [
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
];

const dividerColors = [
  { from: "#fec8bb", to: "#ffe4c8" }, // peach
  { from: "#ade1ff", to: "#e8fbf9" }, // light blue
  { from: "#abffe1", to: "#dcffe2" }, // mint
];

export function InTheNews() {
  return (
    <section className="w-full pt-8 sm:pt-12 lg:pt-16">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-4xl xl:text-5xl leading-tight font-lora font-normal text-[#004040] mb-4 sm:mb-6 tracking-[0.192px]">
          In the Press
        </h2>
        <p className="text-sm sm:text-base font-noto-sans font-normal text-[#757679] leading-7 tracking-[-0.064px]">
          Financial media outlets are highlighting our approach to secure,
          regulated
          <br />
          investing with real returns
        </p>
      </div>

      {/* Press Cards */}
      <div className="relative">
        <div className="hidden z-10 lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
        <PressRow outlets={newsOutlets} dividerColors={dividerColors} />
      </div>
    </section>
  );
}
