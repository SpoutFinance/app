"use client";
import Image from "next/image";

export function InvestmentDifferent() {
  const features = [
    {
      icon: "/svg-assets/landingpage/lock.svg",
      title: "Privacy Protection",
      description: "Confidential transactions with encrypted data",
      badges: ["Encrypted data", "Private transfers"],
      gradient: "linear-gradient-green-2",
    },
    {
      icon: "/svg-assets/landingpage/security-safe.svg",
      title: "Regulated Assets",
      description: "Backed by real corporate debt obligations",
      badges: ["SEC Compliant", "FDIC protected"],
      gradient: "linear-gradient-blue-2",
    },
    {
      icon: "/svg-assets/landingpage/flash.svg",
      title: "Instant Liquidity",
      description: "Trade tokens 24/7 on decentralized exchanges",
      badges: ["No Lock-up Period", "24/7 Trading"],
      gradient: "linear-gradient-4",
    },
    {
      icon: "/svg-assets/landingpage/key.svg",
      title: "Confidential Assets",
      description: "Protected identity and private records",
      badges: ["Secure handling", "Private layers"],
      gradient: "linear-gradient-5",
    },
  ];

  // Map gradient identifiers to concrete Tailwind classes so they are discoverable by the
  // Tailwind compiler (avoid using dynamic `bg-${...}` strings)
  const gradientMap: Record<string, string> = {
    "linear-gradient-green-2": "bg-linear-gradient-green-2",
    "linear-gradient-blue-2": "bg-linear-gradient-blue-2",
    "linear-gradient-4": "bg-linear-gradient-4",
    "linear-gradient-5": "bg-linear-gradient-5",
  };

  return (
    <section className="w-full py-20 relative">
      {/* Section content */}
      <div className="w-full  px-4 sm:px-8 lg:px-0 pb-8 lg:pb-0">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-[#004040] text-center font-['PT_Serif'] text-[48px] not-italic font-normal leading-[56px] tracking-[0.192px]">
            Smarter On-chain Investing
          </h2>
          <p className="pt-5 text-[#757679] text-center font-['DM_Sans'] text-[16px] not-italic font-normal leading-[28px] tracking-[-0.064px]">
            Consistent returns from regulated investment-grade securities, with
            instant trading
            <br />
            and full transparency
          </p>
        </div>

        <div className="w-screen bg-transparent border-t border-b border-[#F3F4F6] "></div>

        {/* Features Grid */}
        <div className="max-w-[1176px] mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-0 mb-8 sm:mb-12 lg:mb-0">
          {features.map((feature, index) => (
            <div key={index} className="flex ">
              <div
                className={`${gradientMap[feature.gradient] ?? "bg-linear-gradient-1"} w-[18px] h-[183px]`}
              />
              <div
                className={`flex-1 border border-[#F3F4F6] p-4 sm:p-6 rounded-none flex flex-col ${
                  index === 0
                    ? "sm:rounded-l-lg"
                    : index === features.length - 1
                      ? "sm:rounded-r-lg"
                      : ""
                } ${index !== features.length - 1 ? "sm:border-r-0" : ""}`}
              >
                {/* Icon and Title */}
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <h3 className="text-black font-[DM Sans] text-[20px] font-medium leading-[28px] tracking-[-0.08px]">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[#7D8690] font-[DM_Sans] text-[16px] leading-[28px] tracking-[-0.064px]">
                  {feature.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto font-dm-sans">
                  {feature.badges.map((badge, badgeIndex) => (
                    <span
                      key={badgeIndex}
                      className="px-2 sm:px-3 py-1 rounded-[4px] border border-solid border-[#A7C6ED] bg-[rgba(167,198,237,0.35)] text-[#3D5678] text-center font-[DM Sans] text-[16px] font-medium leading-[28px] tracking-[-0.064px]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-[100px] w-screen bg-transparent border-t-2 border-b-2 border-[#F3F4F6]"></div>
      </div>
    </section>
  );
}
