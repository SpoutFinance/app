"use client";

import Image from "next/image";

const stats = [
  {
    icon: "/svg-assets/landingpage/spout-bank.svg",
    iconAlt: "Bank",
    value: "$200k",
    label: "Assets On-Chain",
  },
  {
    icon: "/svg-assets/landingpage/spout-category.svg",
    iconAlt: "Category",
    value: "1,124",
    label: "Investment Tokenized",
  },
  {
    icon: "/svg-assets/landingpage/spout-shield-tick.svg",
    iconAlt: "Shield",
    value: "100%",
    label: "Proof-of-Reserve Verified",
  },
];

const dividerColors = [
  { from: "#abffe1", to: "#dcffe2" }, // mint
  { from: "#fec8bb", to: "#ffe4c8" }, // peach
  { from: "#ade1ff", to: "#e8fbf9" }, // light blue
];

export function ProofOfReserveLanding() {
  return (
    <section className="w-full pt-8 sm:pt-12 lg:pt-16">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-lora font-normal text-[#004040] mb-4 sm:mb-6 tracking-[0.192px]">
          Proof of Reserve
        </h2>
        <p className="text-sm sm:text-base lg:text-base font-noto-sans font-normal text-[#757679] max-w-3xl mx-auto leading-6 tracking-[0.064px]">
          Every token is fully backed 1:1 by U.S. public equities, held by
          qualified U.S. custodians for maximum security
        </p>
      </div>

      {/* Vault Image with Company Logos */}
      <div className="flex justify-center items-center">
        <Image
          src="/svg-assets/landingpage/spout-reserve.svg"
          alt="Proof of Reserve Vault"
          width={1183}
          height={333}
          className="w-full h-auto"
        />
      </div>

      {/* Frame-line spacer between image and stats */}
      <div className="relative h-12 sm:h-16 lg:h-[100px]">
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
        <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
      </div>

      {/* Statistics Section — Desktop with gradient dividers */}
      <div className="hidden lg:flex">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex">
            <div className="w-[370px] bg-white py-5 px-8 flex flex-col gap-6">
              {/* Icon */}
              <div className="w-9 h-10 bg-[#004040] rounded-[5px] flex items-center justify-center">
                <Image
                  src={stat.icon}
                  alt={stat.iconAlt}
                  width={20}
                  height={20}
                  className="w-5 h-5 brightness-0 invert"
                />
              </div>
              {/* Value + Label */}
              <div className="flex flex-col gap-1.5">
                <p className="text-xl font-noto-sans font-semibold text-black">
                  {stat.value}
                </p>
                <p className="text-base font-noto-sans font-medium text-[#7d8690]">
                  {stat.label}
                </p>
              </div>
            </div>
            <div
              className="w-[22px] self-stretch shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${dividerColors[i].from}, ${dividerColors[i].to})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Statistics Section — Tablet/Mobile */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 mt-6 sm:mt-0">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex">
            <div className="flex-1 bg-white py-5 px-6 flex flex-col gap-5">
              {/* Icon */}
              <div className="w-9 h-10 bg-[#004040] rounded-[5px] flex items-center justify-center">
                <Image
                  src={stat.icon}
                  alt={stat.iconAlt}
                  width={20}
                  height={20}
                  className="w-5 h-5 brightness-0 invert"
                />
              </div>
              {/* Value + Label */}
              <div className="flex flex-col gap-1.5">
                <p className="text-lg font-noto-sans font-semibold text-black">
                  {stat.value}
                </p>
                <p className="text-sm font-noto-sans font-medium text-[#7d8690]">
                  {stat.label}
                </p>
              </div>
            </div>
            {i < stats.length - 1 && (
              <div
                className="hidden sm:block w-[22px] self-stretch shrink-0"
                style={{
                  background: `linear-gradient(to bottom, ${dividerColors[i].from}, ${dividerColors[i].to})`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
