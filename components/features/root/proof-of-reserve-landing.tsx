"use client";

import amazonSvg from "@/assets/images/amazon.svg";
import circleSvg from "@/assets/images/circle.svg";
import coinbaseSvg from "@/assets/images/coinbase.svg";
import frame1Svg from "@/assets/images/frame 1.svg";
import frame2Svg from "@/assets/images/frame 2.svg";
import frame3Svg from "@/assets/images/frame 3.svg";
import lockImage from "@/assets/images/lock.png";
import metaSvg from "@/assets/images/meta.svg";
import microsoftSvg from "@/assets/images/microsoft.svg";
import teslaSvg from "@/assets/images/tesla.svg";
import Image from "next/image";

export function ProofOfReserveLanding() {
  const logos = [
    {
      id: "tesla",
      src: teslaSvg,
      alt: "Tesla",
      width: 145.275,
      height: 18.943,
    },
    { id: "meta", src: metaSvg, alt: "Meta" },
    {
      id: "coinbase",
      src: coinbaseSvg,
      alt: "Coinbase",
      width: 142.048,
      height: 26.006,
    },
    { id: "amazon", src: amazonSvg, alt: "Amazon", width: 100, height: 34 },
    {
      id: "circle",
      src: circleSvg,
      alt: "Circle",
      width: 118.534,
      height: 30.654,
    },
    {
      id: "microsoft",
      src: microsoftSvg,
      alt: "Microsoft",
      width: 125.62,
      height: 26.586,
    },
  ];

  return (
    <section className="w-full h-fit py-4 sm:py-6 lg:py-6 relative">
      {/* Section content */}
      <div className="w-full  px-4 sm:px-6 md:px-8 lg:px-0 p-12">
        {/* Header */}
        <div className="flex flex-col justify-center align-center mb-8 sm:mb-12 lg:mb-16 text-center">
          <h2 className="section-heading">
            <span className="">Proof</span> of Reserve
          </h2>
          <p className="text-[#757679] text-center font-['DM_Sans'] text-[16px] not-italic font-normal leading-[24px] tracking-[0.064px]">
            Every token is fully backed 1:1 by investment-grade bond ETFs, held
            by qualified U.S. custodians <br /> for maximum security.
          </p>
        </div>

        <div className="h-[1px] w-screen bg-transparent border-t-2 border-[#F3F4F6]"></div>

        {/* Vault Image with Company Logos */}
        <div className="flex justify-center items-center mb-8 sm:mb-12 lg:mb-0 max-w-[1178px] mx-auto">
          <div
            className=" w-full max-w-[1183.345px] h-[333px] flex flex-col md:flex-row items-center mr-[2px] ml-[2px]"
            style={{
              background: `
      radial-gradient(100% 100% at left 60%, rgba(61, 199, 132, 0.38), transparent 70%),
      radial-gradient(150% 160% at right 80%, rgba(88, 162, 255, 0.38), transparent 60%)
    `,
            }}
          >
            {/* Left: lock image */}
            <div className="">
              <Image
                src={lockImage}
                alt="Proof of Reserve Lock"
                className="object-contain"
              />
            </div>

            {/* Right: company logos grid */}
            <div className="pt-[38px] pb-[35px] inline-grid gap-y-[41px] gap-x-[108px] grid-rows-[repeat(3,fit-content(100%))] grid-cols-[repeat(2,fit-content(100%))]">
              {logos.map((logo) => (
                <div
                  className="relative overflow-hidden rounded-[4px] flex justify-center items-center bg-white h-[59.819px] w-[208.511px] border-[2.5px] border-[#DEE9F8] drop-shadow-[filter: drop-shadow(0 4px 13.9px rgba(0, 0, 0, 0.05))]"
                  key={logo.id}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    className="object-contain"
                    {...(logo.width && {
                      width: logo.width,
                      height: logo.height,
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[100px] w-screen bg-transparent border-t-2 border-b-2 border-[#F3F4F6]"></div>

        {/* Statistics Section */}

        <div className="rounded-none max-w-[1180px] mx-auto">
          <div className="flex flex-col items-center sm:flex-row justify-between gap-3 sm:gap-4 pr-[8px]">
            {/* Assets On-Chain */}
            <div className="flex-1 flex justify-between h-[156px]">
              <div className="flex flex-col items-start gap-[24px]  w-[360px] h-[156px] pt-[24px] pl-[32.91px]">
                <Image
                  src={frame3Svg}
                  alt="Bank"
                  className="w-[35.843px] h-[38.893px]"
                />

                <div>
                  <div className="text-black font-dm-sans text-[20px] font-semibold leading-normal">
                    $200k
                  </div>
                  <div className="text-[#7D8690] font-dm-sans text-[16px] font-medium leading-normal">
                    Assets On-Chain
                  </div>
                </div>
              </div>
              <div className="bg-linear-gradient-1 w-[21.985px] h-[156px]"></div>
            </div>

            {/* Investments Tokenized */}

            <div className="flex-1 flex justify-between">
              <div className="flex flex-col items-start gap-[24px] w-[360px] h-[156px] pt-[24px] pl-[25.91px]">
                <Image
                  src={frame1Svg}
                  alt="Category"
                  className="w-[35.843px] h-[38.893px]"
                />

                <div>
                  <div className="text-black font-dm-sans text-[20px] font-semibold leading-normal">
                    1,124
                  </div>
                  <div className="text-[#7D8690] font-dm-sans text-[16px] font-medium leading-normal">
                    Investments Tokenized
                  </div>
                </div>
              </div>
              <div className="bg-linear-gradient-2 w-[21.985px] h-[156px]"></div>
            </div>

            {/* Proof-of-Reserve Verified */}

            <div className="flex-1 flex justify-between">
              <div className="flex flex-col items-start gap-[24px] w-[360px] h-[156px] pt-[24px] pl-[25.91px]">
                <Image
                  src={frame2Svg}
                  alt="Shield"
                  className="w-[35.843px] h-[38.893px]"
                />

                <div>
                  <div className="text-black font-dm-sans text-[20px] font-semibold leading-normal">
                    100%
                  </div>
                  <div className="text-[#7D8690] font-dm-sans text-[16px] font-medium leading-normal">
                    Proof-of-Reserve Verified
                  </div>
                </div>
              </div>
              <div className="bg-linear-gradient-3 w-[21.985px] h-[156px]"></div>
            </div>
          </div>
        </div>
        <div className="h-[100px] w-screen bg-transparent border-t-2 border-b-2 border-[#F3F4F6]"></div>
      </div>
    </section>
  );
}
