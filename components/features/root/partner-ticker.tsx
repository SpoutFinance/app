"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

const partners = [
  {
    src: "/partners/solana-logo.svg",
    alt: "Solana",
    link: "https://solana.org/",
  },
  {
    src: "/partners/Solayer.svg",
    alt: "Solayer",
    link: "https://solayer.org/",
  },
  {
    src: "/partners/circle-logo.svg",
    alt: "Circle",
    link: "https://circle.com/",
  },
  {
    src: "/partners/Raydium.svg",
    alt: "Raydium",
    link: "https://raydium.io/",
  },
  {
    src: "/partners/Jupiter.svg",
    alt: "Jupiter",
    link: "https://jup.ag/",
  },
  {
    src: "/partners/chainlink-logo.svg",
    alt: "Chainlink",
    link: "https://chain.link/",
  },
  {
    src: "/partners/Tether.svg",
    alt: "Tether",
    link: "https://tether.to/",
  },
  {
    src: "/partners/Agora.svg",
    alt: "Agora",
    link: "https://agora.finance/",
  },
  {
    src: "/partners/Pyth.svg",
    alt: "Pyth",
    link: "https://pyth.network/",
  },
  {
    src: "/partners/inco-logo.svg",
    alt: "Inco",
    link: "https://www.inco.org/",
  },
];

export function PartnerTicker() {
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (firstSetRef.current) {
        setScrollWidth(firstSetRef.current.scrollWidth);
      }
    };

    // Wait for images to load
    const timeout = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="w-full rounded-lg border border-gray-300 relative">
      {/* Horizontal lines extending from center to screen edges */}
      {/* Left side line */}
      <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[50vw] w-[50vw] h-[1.5px] bg-[#A7C6ED] z-10"></div>
      {/* Right side line */}
      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50vw] w-[50vw] h-[1.5px] bg-[#A7C6ED] z-10"></div>

      {/* Diamonds at intersection points with vertical page lines */}
      {/* Left intersection diamond - positioned at left vertical page line */}
      <div className="hidden md:block absolute -left-[120px] top-1/2 -translate-y-1/2 z-20">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-blue-300"
        >
          <path
            d="M12 2L22 12L12 22L2 12L12 2Z"
            stroke="currentColor"
            strokeWidth="3"
            fill="white"
          />
        </svg>
      </div>

      {/* Right intersection diamond - positioned at right vertical page line */}
      <div className="hidden md:block absolute -right-[120px] top-1/2 -translate-y-1/2 z-20">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-blue-300"
        >
          <path
            d="M12 2L22 12L12 22L2 12L12 2Z"
            stroke="currentColor"
            strokeWidth="3"
            fill="white"
          />
        </svg>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Fixed "Who We're Working With" box */}
        <div className="bg-white rounded-t-lg sm:rounded-t-none sm:rounded-l-lg px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b sm:border-b-0 sm:border-r border-gray-300 shrink-0 w-full sm:w-auto flex items-center justify-center">
          <h3 className="text-base sm:text-lg font-noto-sans text-[#334155] font-semibold text-center leading-tight">
            Who We&apos;re
            <br />
            Working With
          </h3>
        </div>

        {/* Animated partner logos */}
        <div className="flex-1 overflow-hidden bg-white rounded-b-lg sm:rounded-bl-none sm:rounded-r-lg">
          <style>
            {scrollWidth > 0
              ? `
              @keyframes ticker-scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${scrollWidth}px); }
              }
            `
              : ""}
          </style>
          <div
            className="flex hover:paused motion-reduce:animate-none"
            style={{
              animation:
                scrollWidth > 0 ? `ticker-scroll 20s linear infinite` : "none",
            }}
          >
            {/* First set - measure this */}
            <div ref={firstSetRef} className="flex shrink-0">
              {partners.map((partner, idx) => (
                <div
                  key={`first-${idx}`}
                  className="bg-white px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 border-r border-gray-200 flex items-center justify-center min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] relative shrink-0"
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={80}
                    height={80}
                    className="h-10 sm:h-12 lg:h-14 w-auto max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex shrink-0">
              {partners.map((partner, idx) => (
                <div
                  key={`second-${idx}`}
                  className="bg-white px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 border-r border-gray-200 flex items-center justify-center min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] relative shrink-0"
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={80}
                    height={80}
                    className="h-10 sm:h-12 lg:h-14 w-auto max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
