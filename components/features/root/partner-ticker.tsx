"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const partners = [
  {
    src: "/partners/chainlink-logo.png",
    alt: "Chainlink",
    link: "https://chain.link/",
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
  {
    src: "/partners/Raydium.svg",
    alt: "Raydium",
    link: "https://raydium.io/",
  },
  {
    src: "/partners/solana-logo.png",
    alt: "Solana",
    link: "https://solana.org/",
  },
  {
    src: "/partners/Solayer.svg",
    alt: "Solayer",
    link: "https://solayer.org/",
  },
  {
    src: "/partners/circle-logo.png",
    alt: "Circle",
    link: "https://circle.com/",
  },
  {
    src: "/partners/blocksense-logo.png",
    alt: "Blocksense",
    link: "https://blocksense.network/",
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

    const timeout = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="w-full bg-white border-t-2 border-b-2 border-[#f3f4f6] py-4 sm:py-5 lg:py-6">
      <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 flex items-center gap-4 sm:gap-6 lg:gap-8">
        {/* Label */}
        <p className="text-sm sm:text-base lg:text-lg font-noto-sans font-medium text-[#004040] tracking-[0.072px] leading-6 whitespace-nowrap shrink-0">
          WORKING WITH
        </p>

        {/* Scrolling partner logos */}
        <div className="flex-1 overflow-hidden">
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
                scrollWidth > 0
                  ? "ticker-scroll 20s linear infinite"
                  : "none",
            }}
          >
            {/* First set */}
            <div ref={firstSetRef} className="flex shrink-0">
              {partners.map((partner) => (
                <a
                  key={`first-${partner.alt}`}
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.alt}
                  className="shrink-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={120}
                    height={32}
                    className="h-6 sm:h-7 lg:h-8 w-auto object-contain"
                    draggable={false}
                  />
                </a>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex shrink-0">
              {partners.map((partner) => (
                <a
                  key={`second-${partner.alt}`}
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.alt}
                  className="shrink-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={120}
                    height={32}
                    className="h-6 sm:h-7 lg:h-8 w-auto object-contain"
                    draggable={false}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
