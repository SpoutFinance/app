"use client";

import BgGrain from "@/components/bg-grain-svg";
import { DiagonalPattern } from "@/components/slant-dashes-svg";
import Image from "next/image";

const steps = [
  {
    number: "STEP 1",
    title: "Complete KYC",
    description:
      "Connect your wallet and complete KYC verification to access investment-grade equities. KYC ensures that we are completely compliant with every jurisdiction",
    image: "/svg-assets/kyc-tokens.svg",
    imageAlt: "KYC Verification",
  },
  {
    number: "STEP 2",
    title: "Access Public Equities",
    description:
      "Access over 1,000 U.S. public equities, including Tesla, Microsoft, Coinbase, and more",
    image: "/svg-assets/public-equity.svg",
    imageAlt: "Public Equities",
  },
  {
    number: "STEP 3",
    title: "Lever Up",
    description:
      "Trade like the top 1% of equities traders, and borrow against your equities at 0% APR",
    image: "/svg-assets/stable-yields.svg",
    imageAlt: "Stable Yields",
  },
  {
    number: "STEP 4",
    title: "Lend to Our Pool for a Stable Return",
    description:
      "If you are looking for a safer and steadier return, lend to our liquidity pool, which enables margin trading for our borrowers, and earn 10%+ APY",
    image: "/svg-assets/defi-with-tokens.svg",
    imageAlt: "DeFi Integration",
  },
  {
    number: "STEP 5",
    title: "Track Performance",
    description:
      "Monitor your portfolio with real-time analytics and transparent reporting. Trade assets with a UI similar to your traditional brokerage",
    image: "/svg-assets/track-performance.svg",
    imageAlt: "Performance Tracking",
  },
];

export function HowSpoutWorks() {
  return (
    <section
      className="w-full py-8 sm:py-12 lg:py-20 relative"
      style={{ contain: "layout style paint" }}
    >
      {/* Background grain for this section */}
      <BgGrain className="absolute inset-0 w-full h-full z-0 optimized" />
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl capitalize sm:text-4xl lg:text-5xl font-lora font-medium text-[#004040] mb-4 sm:mb-6">
            How Spout Works
          </h2>
          <p className="text-base sm:text-base lg:text-lg tracking-[-0.072px] font-noto-sans text-[#525252] max-w-4xl mx-auto">
            Spout bridges the gap between traditional finance and DeFi by
            tokenizing investment-grade securities, providing stable yields
            while maintaining the benefits of blockchain technology
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative space-y-0" style={{ contain: "layout style" }}>
          {/* Decorative diamonds at corners of entire section */}
          {/* Top-left diamond */}
          <div className="hidden sm:block absolute -left-2 sm:-left-3 -top-2 sm:-top-3 z-20 optimized">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-blue-300 sm:w-6 sm:h-6"
            >
              <path
                d="M12 2L22 12L12 22L2 12L12 2Z"
                stroke="currentColor"
                strokeWidth="3"
                fill="white"
              />
            </svg>
          </div>
          {/* Top-right diamond */}
          <div className="hidden sm:block absolute -right-2 sm:-right-3 -top-2 sm:-top-3 z-20 optimized">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-blue-300 sm:w-6 sm:h-6"
            >
              <path
                d="M12 2L22 12L12 22L2 12L12 2Z"
                stroke="currentColor"
                strokeWidth="3"
                fill="white"
              />
            </svg>
          </div>
          {/* Bottom-left diamond */}
          <div className="hidden sm:block absolute -left-2 sm:-left-3 -bottom-2 sm:-bottom-3 z-20 optimized">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-blue-300 sm:w-6 sm:h-6"
            >
              <path
                d="M12 2L22 12L12 22L2 12L12 2Z"
                stroke="currentColor"
                strokeWidth="3"
                fill="white"
              />
            </svg>
          </div>
          {/* Bottom-right diamond */}
          <div className="hidden sm:block absolute -right-2 sm:-right-3 -bottom-2 sm:-bottom-3 z-20 optimized">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-blue-300 sm:w-6 sm:h-6"
            >
              <path
                d="M12 2L22 12L12 22L2 12L12 2Z"
                stroke="currentColor"
                strokeWidth="3"
                fill="white"
              />
            </svg>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch border-gray-300 rounded-none overflow-hidden relative ${
                index === 0
                  ? "border-t border-l border-r border-b"
                  : "border-l border-r border-b"
              }`}
            >
              {/* Vertical divider line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2 optimized"></div>
              {/* Content - alternates left/right */}
              <div
                className={`flex items-center bg-white py-4 sm:py-6 px-4 sm:px-6 min-h-[250px] sm:min-h-[300px] ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
              >
                <div>
                  <div className="inline-block bg-[#A7C6ED]/35 border border-[#A7C6ED] text-[#3D5678] px-2 sm:px-3 py-1 sm:py-1.5 rounded-none text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-[28px] leading-7! tracking-[-0.072px] font-noto-sans font-semibold text-[#004040] mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg tracking-[-0.072px] font-noto-sans font-normal text-[#525252] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Image - alternates right/left */}
              <div
                className={`flex justify-center bg-white items-center relative px-4 sm:px-6 py-4 sm:py-6 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
                  backgroundSize: "35px 35px",
                  contain: "content",
                  transform: "translateZ(0)",
                }}
              >
                {/* Gradient fade overlay - fades from bottom (visible) to top (hidden) */}
                <div
                  className="absolute inset-0 bg-linear-to-t from-transparent from-0% via-transparent via-50% to-gray-50 to-100% pointer-events-none"
                  style={{ contain: "strict" }}
                ></div>
                <div className="w-full max-w-[180px] sm:max-w-[220px] lg:max-w-[250px] h-[180px] sm:h-[220px] lg:h-[250px] relative z-10 flex items-center justify-center">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    width={250}
                    height={250}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagonal blue lines at bottom */}
      <div className="relative z-10 w-full mt-40 px-4 py-2">
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
