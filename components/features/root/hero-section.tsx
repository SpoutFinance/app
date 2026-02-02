"use client";

import BgGrain from "@/components/bg-grain-svg";
import { DiagonalPattern } from "@/components/slant-dashes-svg";
import { Button } from "@/components/ui/button";
import { useScreenSize } from "@/hooks/use-screen-size";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JoinMailingList } from "./join-mailing-list";
import { PartnerTicker } from "./partner-ticker";

export function HeroSection() {
  const screenSize = useScreenSize();

  return (
    <section className="w-full flex flex-col relative overflow-hidden">
      {/* Background grain */}
      <BgGrain className="absolute inset-0 w-full h-full z-0 optimized" />

      {/* Hero content wrapper */}
      <div className="relative w-full">
        {/* Grid background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[35px_35px] optimized"></div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-16 pt-6 sm:pt-12 lg:pt-20 pb-0 flex flex-col lg:flex-row items-start justify-between gap-0">
          {/* Left column */}
          <div className="w-full lg:w-[55%] mb-6 sm:mb-12 lg:mb-0">
            <div className="max-w-5xl space-y-4 sm:space-y-6">
              <h1 className="text-2xl capitalize sm:text-3xl lg:text-5xl font-lora font-medium text-[#004040] leading-tight!">
                The Go-To Platform for Margin Trading at 0% Rates
              </h1>

              <p className="text-sm sm:text-base lg:text-lg tracking-[-0.072px] font-noto-sans text-[#525252] ">
                Spout enables you to borrow against your equities at 0% APR or
                lend your stablecoins for 10%+ APY
              </p>

              <div className="pt-2 sm:pt-0 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="https://demo.spout.finance ">
                  <Button
                    size="lg"
                    className="bg-[#004040] hover:bg-[#003030] data-hovered:bg-[#003030] text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl font-semibold rounded-none shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    Launch Platform
                    <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </Button>
                </Link>
                <Link href="https://app.spout.finance">
                  <Button
                    size="lg"
                    className="border-2 border-[#004040] bg-white hover:bg-gray-50 data-hovered:bg-gray-50 text-[#004040] px-6 sm:px-7 lg:px-8 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl font-semibold rounded-none shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    Try Demo
                    <ArrowUpRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </Button>
                </Link>
              </div>

              <p className="text-xs sm:text-sm lg:text-base font-noto-sans text-[#004040] uppercase tracking-wide">
                [JOIN THE PLATFORM THAT&apos;S MAKING TRADITIONAL CAPITAL MORE
                EFFICIENT]
              </p>

              <div className="max-w-md pt-2 sm:pt-0">
                <JoinMailingList />
              </div>
            </div>
          </div>

          {/* Right column - image */}
          <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end -mt-2 sm:-mt-6 lg:-mt-8">
            <div className="w-full max-w-[280px] sm:max-w-sm lg:max-w-xl optimized">
              <Image
                src="/svg-assets/landingpage/spout-water-tokens.svg"
                alt="Spout Water Tokens"
                width={452}
                height={496}
                priority
              />
            </div>
          </div>
        </div>

        {/* Partner Ticker */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-16 mb-3 sm:mb-6">
          <div className="px-16 hidden md:block optimized">
            <PartnerTicker />
          </div>
          <div className="block md:hidden optimized">
            <PartnerTicker />
          </div>
        </div>
      </div>

      {/* Slant Dashes */}
      <div className="relative z-10 w-full mt-10 px-4 py-2 optimized">
        <DiagonalPattern
          width="100%"
          height={34}
          color="#A7C6ED"
          strokeWidth={1.5}
          spacing={14}
        />
      </div>
    </section>
  );
}
