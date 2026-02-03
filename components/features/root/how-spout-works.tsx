"use client";

import Image from "next/image";

const steps = [
  {
    number: "Step 01",
    title: "Complete KYC",
    description:
      "Connect your wallet and complete KYC verification to access investment-grade equities. KYC ensures that we are completely compliant with every jurisdiction",
    image: "/svg-assets/kyc-tokens.svg",
    imageAlt: "KYC Verification",
    stripeColors: {
      from: "rgba(61,199,132,0.58)",
      to: "rgba(186,244,116,0.58)",
    },
  },
  {
    number: "Step 02",
    title: "Access Public Equities",
    description:
      "Access over 1,000 U.S. public equities, including Tesla, Microsoft, Coinbase, and more",
    image: "/svg-assets/public-equity.svg",
    imageAlt: "Public Equities",
    stripeColors: {
      from: "rgba(253,183,62,0.58)",
      to: "rgba(255,217,139,0.58)",
    },
  },
  {
    number: "Step 03",
    title: "Lever Up",
    description:
      "Trade like the top 1% of equities traders, and borrow against your equities at 0% APR",
    image: "/svg-assets/stable-yields.svg",
    imageAlt: "Stable Yields",
    stripeColors: {
      from: "rgba(4,112,255,0.58)",
      to: "rgba(3,155,255,0.58)",
    },
  },
];

function VerticalStripes({ from, to }: { from: string; to: string }) {
  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="w-[60px] h-full shrink-0"
          style={{
            background:
              i % 2 === 0
                ? `linear-gradient(to bottom, ${from}, ${to})`
                : `linear-gradient(to top, ${from}, ${to})`,
          }}
        />
      ))}
    </div>
  );
}

export function HowSpoutWorks() {
  return (
    <section className="w-full pt-8 sm:pt-12 lg:pt-16">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-3xl capitalize sm:text-4xl lg:text-5xl font-lora font-medium text-[#004040] mb-4 sm:mb-6">
          How Spout Works
        </h2>
        <p className="text-base sm:text-base lg:text-lg tracking-[-0.072px] font-noto-sans text-[#525252] max-w-4xl mx-auto">
          Spout bridges the gap between traditional finance and DeFi by
          tokenizing investment-grade securities, providing stable yields while
          maintaining the benefits of blockchain technology
        </p>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block">
        {/* Gradient progress bar */}
        <div className="w-full h-[10px] rounded-full bg-gradient-to-r from-[#ddff87] to-[#0057ff]" />

        {/* 3 cards side by side */}
        <div className="flex border-t border-[#f3f4f6]">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex-1 bg-white flex flex-col${
                i < steps.length - 1 ? " border-r border-[#f3f4f6]" : ""
              }`}
            >
              {/* Step label */}
              <div className="bg-[#fafafa] border-b border-[#f3f4f6] px-5 py-2.5">
                <span className="font-mono text-sm text-[#191b20]">
                  {step.number}
                </span>
              </div>

              {/* Image area with vertical gradient stripes */}
              <div className="relative w-full h-[274px] overflow-hidden bg-white">
                <VerticalStripes
                  from={step.stripeColors.from}
                  to={step.stripeColors.to}
                />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    width={180}
                    height={180}
                    className="w-[170px] h-[170px] object-contain"
                  />
                </div>
              </div>

              {/* Horizontal divider between image and text */}
              <div className="border-t border-[#f3f4f6]" />

              {/* Content */}
              <div className="px-5 py-6">
                <h3 className="text-xl font-noto-sans font-semibold text-[#004040] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm font-noto-sans text-[#525252] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom border */}
        <div className="border-t border-[#f3f4f6]" />
      </div>

      {/* Tablet/Mobile layout */}
      <div className="lg:hidden space-y-4">
        {/* Gradient progress bar */}
        <div className="w-full h-[6px] sm:h-[8px] rounded-full bg-gradient-to-r from-[#ddff87] to-[#0057ff]" />

        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-[#f3f4f6]"
          >
            {/* Step label */}
            <div className="bg-[#fafafa] border-b border-[#f3f4f6] px-5 py-2.5">
              <span className="font-mono text-sm text-[#191b20]">
                {step.number}
              </span>
            </div>

            {/* Image area with vertical gradient stripes */}
            <div className="relative w-full h-[200px] sm:h-[240px] overflow-hidden bg-white">
              <VerticalStripes
                from={step.stripeColors.from}
                to={step.stripeColors.to}
              />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  width={160}
                  height={160}
                  className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] object-contain"
                />
              </div>
            </div>

            {/* Horizontal divider */}
            <div className="border-t border-[#f3f4f6]" />

            {/* Content */}
            <div className="px-5 py-5">
              <h3 className="text-lg font-noto-sans font-semibold text-[#004040] mb-2">
                {step.title}
              </h3>
              <p className="text-sm font-noto-sans text-[#525252] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
