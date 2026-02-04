"use client";

import Link from "next/link";
import { JoinMailingList } from "./join-mailing-list";

import image1 from "@/assets/images/hero/1.png";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="w-full flex flex-col relative pl-5 mb-[-34px]">
      {/* Hero content wrapper */}
      <div className="relative w-full h-[702px]">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/svg-assets/landingpage/grid-bg.svg"
            className="object-cover w-full h-full optimized"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:ps-16 pt-6 sm:pt-12 lg:pt-0 pb-16 flex flex-col lg:flex-row gap-10 xl:gap-[80px] justify-center items-center">
          {/* Left column */}
          <div className="lg:max-w-[840px]">
            <div className="">
              <h1 className="  mb-[16px] text-[#004040] font-pt-serif text-[52px] font-normal leading-[72px] tracking-[0.208px]">
                The Go-To Platform for Margin Trading at{" "}
                <span className="text-spout-blue">0%</span> Rates
              </h1>

              <p className="mb-[36px] text-[#757679] font-dm-sans text-[18px] font-normal leading-[24px] tracking-[0.072px]">
                Spout enables you to borrow against your equities at 0% APR or
                lend your stablecoins for <br /> 10%+ APY
              </p>

              <div className="mb-[44px] sm:pt-0 flex flex-col lg:flex-row  items-center gap-4 sm:gap-6 ">
                <Link
                  href="/app"
                  className="flex h-9 px-4 py-3 justify-center items-center gap-3 bg-spout-primary hover:bg-spout-primary/90 text-white font-dm-sans text-[16px] font-medium leading-normal rounded-[4.766px] transition-all"
                >
                  Launch Platform
                </Link>

                <button className="flex h-9 px-4 py-3 justify-center items-center gap-[11.916px] border-[1px]  rounded-[4.766px] not-italic font-medium leading-normal border-spout-light-gray text-primary font-dm-sans !text-black  text-[16px] transition-all group">
                  Try Demo
                </button>
              </div>

              <p className="text-[#004040] font-dm-sans text-base not-italic font-medium leading-normal uppercase">
                [ Join our mailing list for early access and updates ]
              </p>

              <div className="max-w-lg pt-4">
                <JoinMailingList />
              </div>
            </div>
          </div>

          {/* Right column - image */}
          <div className="w-[365px] h-[640px] relative">
            <Image
              src={image1}
              alt="Spout Water Tokens"
              fill
              quality={100}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
