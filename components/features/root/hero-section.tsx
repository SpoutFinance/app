"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { JoinMailingList } from "./join-mailing-list";
import { PartnerTicker } from "./partner-ticker";

export function HeroSection() {
  return (
    <section className="w-full flex flex-col relative overflow-hidden bg-white">
      {/* Top horizontal line — edge to edge */}
      <div className="w-full border-t-2 border-gray-100" />

      {/* Hero content wrapper */}
      <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[670px]">
        {/* Grid background SVG — fades from transparent top-left to visible bottom-right */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/svg-assets/landingpage/hero-grid-bg.svg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 pt-8 sm:pt-14 lg:pt-20 pb-0 flex flex-col lg:flex-row items-start justify-between">
          {/* Left column */}
          <div className="w-full lg:w-[60%] mb-8 sm:mb-12 lg:mb-0">
            <div className="max-w-[833px] flex flex-col gap-9 sm:gap-11">
              {/* Title + subtitle */}
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-lora font-normal text-[#004040] leading-tight lg:leading-[72px] tracking-[0.208px] whitespace-nowrap">
                  The Go-To Platform for Margin
                  <br className="hidden sm:block" /> Trading at{" "}
                  <span className="text-[#84b0ff]">0%</span> Rates
                </h1>

                <p className="text-sm sm:text-base lg:text-lg font-noto-sans font-normal text-[#757679] tracking-[0.072px] leading-6 max-w-[755px]">
                  Spout enables you to borrow against your equities at 0% APR or
                  lend your stablecoins for 10%+ APY
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="https://demo.spout.finance">
                  <Button
                    size="lg"
                    className="bg-[#004040] hover:bg-[#003030] data-hovered:bg-[#003030] text-white px-4 h-9 text-base font-medium rounded-[4px] transition-all duration-300 w-full sm:w-auto"
                  >
                    Launch Platform
                  </Button>
                </Link>
                <Link href="https://app.spout.finance">
                  <Button
                    size="lg"
                    className="border border-[#d4d4d4] bg-white hover:bg-gray-50 data-hovered:bg-gray-50 text-black px-4 h-9 text-base font-medium rounded-[4px] transition-all duration-300 w-full sm:w-auto"
                  >
                    Try Demo
                  </Button>
                </Link>
              </div>

              {/* Mailing list section */}
              <div className="flex flex-col gap-5 max-w-[596px]">
                <p className="text-sm sm:text-base font-noto-sans font-medium text-[#004040] uppercase">
                  [ Join our mailing list for early access and updates ]
                </p>
                <JoinMailingList />
              </div>
            </div>
          </div>

          {/* Right column - coins image */}
          <div className="w-full lg:w-[40%] flex items-start justify-center lg:justify-end">
            <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[369px]">
              <Image
                src="/svg-assets/landingpage/hero-coins.png"
                alt="Company token coins"
                width={369}
                height={670}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Partner Ticker — edge to edge */}
        <div className="relative z-10 w-full">
          <PartnerTicker />
        </div>
      </div>
    </section>
  );
}
