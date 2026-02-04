"use client";

import image1 from "@/assets/images/hero/1.png";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="w-full flex flex-col justify-center relative h-[702px] overflow-hidden ">
      {/* Hero content wrapper */}
      <div className="relative">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/svg-assets/landingpage/grid-bg.svg"
            className="bg-contain w-full h-full optimized"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4  flex flex-col lg:flex-row gap-[114px] pt-2 pb-5 ps-[80px] pe-[44px]">
          {/* Left column */}
          <div className="flex flex-col gap-14 max-w-[833px]">
            {/* Heading and Buttons */}
            <div className="flex flex-col gap-14">
              {/* Text Content */}
              <div className="flex flex-col gap-6">
                <h1 className="text-[#004040] font-pt-serif text-[52px] font-normal leading-[72px] tracking-[0.208px]">
                  The Go-To Platform for Margin Trading at{" "}
                  <span className="text-spout-blue">0%</span> Rates
                </h1>
                <p className="text-[#757679] font-dm-sans text-[18px] font-normal leading-[24px] tracking-[0.072px]">
                  Spout enables you to borrow against your equities at 0% APR or
                  lend your stablecoins for 10%+ APY
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-6">
                <button className="flex items-center justify-center w-[199px] h-[45.281px] bg-spout-primary hover:bg-spout-primary/90 text-white font-dm-sans text-[16px] font-medium leading-normal rounded-[4.766px] transition-all">
                  Launch Platform
                </button>
                <button className="flex items-center justify-center gap-3 min-w-[162px] h-[45.281px] border-[1px] rounded-[4.766px] border-spout-light-gray text-black font-dm-sans text-[16px] font-medium leading-normal transition-all group">
                  Try Demo
                  <div className="bg-spout-primary w-[35px] h-[32px] rounded-[3px] text-white flex items-center justify-center transition-transform group-hover:translate-x-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.43 5.92999L20.5 12L14.43 18.07"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.5 12H20.33"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Mailing List */}
            <div className="flex flex-col gap-5">
              <div className="font-dm-sans font-medium text-sm sm:text-base text-primary uppercase tracking-wide">
                [ Join our mailing list for early access and updates ]
              </div>
              <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="email"
                  placeholder="Enter your email to join our mailing list"
                  className=" px-5 py-3.5 border-[1px] w-[395px] border-[#E2E2E2] focus:border-spout-primary rounded-[6px] font-dm-sans text-sm text-gray-400 placeholder-gray-400 focus:outline-none focus:border-spout-border-blue transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-spout-light-blue border-[1px] border-spout-border-blue text-spout-button-blue font-dm-sans font-medium rounded-[4px] hover:bg-spout-border-blue hover:text-white transition-all"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Right column - image */}
          <div className="max-w-[368.592px]">
            <div className="w-full max-w-[280px] sm:max-w-sm lg:max-w-xl optimized">
              <Image src={image1} alt="Spout Water Tokens" priority />
            </div>
          </div>
        </div>

        {/* Partner Ticker */}
        {/* <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 mb-3 sm:mb-6">
          <div className="px-16 hidden md:block optimized">
            <PartnerTicker />
          </div>
          <div className="block md:hidden optimized">
            <PartnerTicker />
          </div>
        </div> */}
      </div>

      {/* Slant Dashes */}
      {/* <div className="relative z-10 w-full mt-10 px-4 py-2 optimized">
        <DiagonalPattern
          width="100%"
          height={34}
          color="#A7C6ED"
          strokeWidth={1.5}
          spacing={14}
        />
      </div> */}
    </section>
  );
}
