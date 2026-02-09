import Link from "next/link";
import { PressRow, type MediaOutlet } from "../shared/press-card";

const newsItems: MediaOutlet[] = [
  {
    image: "/svg-assets/block.svg",
    name: "The Block",
    date: "JAN 20, 2026",
    imageType: "logo",
    url: "https://apnews.com/press-release/globenewswire-mobile/onepiece-labs-solana-accelerator-officially-launches-f2e8e0a2478df30533933fdfe8f07a5e",
  },
  {
    image: "/svg-assets/mexc-global-seeklogo.svg",
    name: "MEXC",
    date: "JAN 21, 2026",
    bgColor: "#000000",
    imageType: "logo",
    url: "https://markets.businessinsider.com/news/stocks/onepiece-labs-solana-accelerator-officially-launches-1035128439",
  },
  {
    image: "/svg-assets/logo_general_green.svg",
    name: "Kucoin",
    date: "JAN 21, 2026",
    imageType: "logo",
    url: "https://www.marketwatch.com/press-release/onepiece-labs-solana-accelerator-officially-launches-7b06ee13?mod=search_headline",
  },
];

const dividerColors = [
  { from: "#FEC8BB", to: "#FFE4C8" }, // peach
  { from: "#ADE1FF", to: "#E8FBF9" }, // light blue
  { from: "#ABFFE1", to: "#DCFFE2" }, // cyan
];

export function InTheNews() {
  return (
    <section className="w-full">
      {/* Section content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 pb-8">
        {/* Header */}
        <div className="text-center ">
          <h2 className="text-[#004040] text-center font-['PT_Serif'] text-[48px] not-italic font-normal leading-[56px] tracking-[0.192px]">
            In the <span className="">Press</span>
          </h2>
          <p className="text-[#757679] pt-3 text-center font-['DM_Sans'] text-[16smriunge@gmail.compx] not-italic font-normal leading-[28px] tracking-[-0.064px]">
            Financial media outlets are highlighting our approach to secure,
            regulated
            <br />
            investing with real returns
          </p>
        </div>

        <div className="w-screen bg-transparent border-t border-b mt-[70px] border-[#F3F4F6] "></div>

        {/* News Cards Grid */}
        <div className="mb-8 sm:mb-12 lg:mb-0 max-w-[1178px] mx-auto pr-[2px]">
          <PressRow outlets={newsItems} dividerColors={dividerColors} />
        </div>
        <div className="w-screen bg-transparent border-t border-b border-[#F3F4F6] "></div>
        <div className="mt-4 sm:mt-7 text-end max-w-[1178px] mx-auto pe-[22px]">
          <Link
            href="/press"
            scroll={true}
            className="h-[36px] w-[116px] items-center justify-center group border rounded-sm border-[#E8E8E8] bg-white p-[10px] inline-flex text-sm sm:text-base font-noto-sans font-medium text-[#000] transition-colors gap-2"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              <path
                d="M14.4301 5.93018L20.5001 12.0002L14.4301 18.0702"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 12H20.33"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="w-screen bg-transparent border-t border-b border-[#F3F4F6] "></div>
    </section>
  );
}
