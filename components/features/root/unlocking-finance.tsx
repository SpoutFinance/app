"use client";

import Image from "next/image";

import lockImage from "@/assets/images/lock.svg";

export function UnlockingFinance() {
  return (
    <section className="w-full relative">
      {/* Section content */}
      <div className="w-full px-4 sm:px-6 lg:px-0 pb-8 lg:pb-0">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="section-heading text-3xl capitalize sm:text-4xl lg:text-5xl font-pt-serif !leading-[56px] tracking-[0.192px] text-spout-deep-teal font-normal mb-4 sm:mb-6">
            Unlocking <span className="font-normal">Finance</span> with DeFi
            <br />
            through our stablecoin
          </h2>
          <p className="section-description">
            Expand access to traditional assets with security, transparency, and
            real yield on-chain.
          </p>
          <p className="section-description">
            Global access, real yield, full transparency, built for DeFi.
          </p>
        </div>

        <div className="w-screen bg-transparent border-t border-b border-[#F3F4F6] "></div>

        {/* Cards Section */}
        <div className="relative max-w-[1178px] h-[340px] mx-auto flex">
          {/* DeFi Integration Benefits Card */}

          <div className="flex ">
            <div className="w-[524px] rounded-l-none sm:rounded-l-none rounded-r-none sm:rounded-r-none p-10 relative ">
              <div className="rounded-[4px] border-[1px] border-solid border-[#A7C6ED] flex bg-[#A7C6ED]/35  items-center gap-2 sm:gap-3 mb-3 sm:mb-4 w-fit px-2 py-1">
                <Image
                  src="/svg-assets/icon-shield-security.svg"
                  alt="Shield"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <h3 className="text-[#3D5678] text-center font-dm-sans font-[500] text-[18px] leading-[28px] tracking-[-0.072px]">
                  DeFi Integration Benefits
                </h3>
              </div>

              <p className="text-[#757679] font-dm-sans text-[16px] pb-5 font-normal leading-[24px] tracking-[0.064px]">
                DeFi expands access to traditional assets by enabling
                security-backed lending and diversified exposure, unlocking
                opportunities while bridging traditional and decentralized
                markets.
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 lg:mb-0">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-[#525252] font-dm-sans text-[16px] font-normal leading-[28px] tracking-[-0.064px]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></div>
                  Security-backed lending
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-[#525252] font-dm-sans text-[16px] font-normal leading-[28px] tracking-[-0.064px]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></div>
                  Multi-asset exposure
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-[#525252] font-dm-sans text-[16px] font-normal leading-[28px] tracking-[-0.064px]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></div>
                  Access to real yield
                </li>
              </ul>

              {/* Benefits icon */}
              <div className="flex justify-center lg:absolute lg:bottom-6 lg:right-6 optimized">
                <Image
                  src="/svg-assets/defi-integration-benefits.svg"
                  alt="Benefits"
                  width={180}
                  height={180}
                  className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40"
                />
              </div>
            </div>
            <div className="bg-linear-gradient-2 w-[64px] h-[340px]"></div>
          </div>

          {/* DeFi Security & Transparency Card */}
          <div className="flex ">
            <div className="bg-linear-gradient-3 w-[64px] h-[340px] sm:h-auto"></div>

            <div className="w-[524px] rounded-r-none sm:rounded-r-none rounded-l-none sm:rounded-l-none p-4 sm:p-6 lg:p-8 relative">
              <div className="flex bg-[#A7C6ED]/35 rounded-[4px] border-[1px] border-solid border-[#A7C6ED]  items-center gap-2 sm:gap-3 mb-3 sm:mb-4 w-fit px-2 py-1">
                <Image
                  src="/svg-assets/defi-security-transparency.svg"
                  alt="Lock"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <h3 className="text-[#3D5678] text-center font-dm-sans font-[500] text-[18px] leading-[28px] tracking-[-0.072px]">
                  DeFi Security & Transparency
                </h3>
              </div>

              <p className="text-[#757679] font-dm-sans text-[16px] pb-5 font-normal leading-[24px] tracking-[0.064px]">
                DeFi combines strong safeguards with full transparency, ensuring
                all assets are protected and fully verifiable while building
                lasting trust and unlocking new opportunities in finance.
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 lg:mb-0">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-[#525252] font-dm-sans text-[16px] font-normal leading-[28px] tracking-[-0.064px]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></div>
                  Institutional-grade asset protection
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-[#525252] font-dm-sans text-[16px] font-normal leading-[28px] tracking-[-0.064px]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></div>
                  Transparent on-chain verification
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-[#525252] font-dm-sans text-[16px] font-normal leading-[28px] tracking-[-0.064px]">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400"></div>
                  Continuous independent audits
                </li>
              </ul>

              {/* Lock icon */}
              <div className="flex justify-center lg:absolute lg:bottom-3 lg:right-6 optimized">
                <Image
                  src="/svg-assets/security-lock.svg"
                  alt="Lock"
                  width={160}
                  height={160}
                  className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 z-10"
                />
                <Image
                  src={lockImage}
                  alt="Lock"
                  width={160}
                  height={160}
                  className="w-20 h-20 sm:w-22 sm:h-22 lg:w-26 opacity-20 lg:h-26 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 ml-7 mt-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
