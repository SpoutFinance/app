import block from "@/assets/images/block.svg";
import kucoin from "@/assets/images/logo_general_green.svg";
import mexc from "@/assets/images/mexc-global-seeklogo.svg";
import Image from "next/image";
import Link from "next/link";

export function InTheNews() {
  const newsItems = [
    {
      logo: block,
      publication: "The Block",
      date: "JAN 20, 2026",
      url: "https://apnews.com/press-release/globenewswire-mobile/onepiece-labs-solana-accelerator-officially-launches-f2e8e0a2478df30533933fdfe8f07a5e",
      gradient: "linear-gradient-2",
    },
    {
      logo: mexc,
      publication: "MEXC",
      date: "JAN 21, 2026",
      url: "https://markets.businessinsider.com/news/stocks/onepiece-labs-solana-accelerator-officially-launches-1035128439",
      gradient: "linear-gradient-3",
    },
    {
      logo: kucoin,
      publication: "Kucoin",
      date: "JAN 21, 2026",
      url: "https://www.marketwatch.com/press-release/onepiece-labs-solana-accelerator-officially-launches-7b06ee13?mod=search_headline",
      gradient: "linear-gradient-blue-3",
    },
  ];

  // Map gradient identifiers to concrete Tailwind classes so they are discoverable by the
  // Tailwind compiler (avoid using dynamic `bg-${...}` strings)
  const gradientMap: Record<string, string> = {
    "linear-gradient-2": "bg-linear-gradient-2",
    "linear-gradient-3": "bg-linear-gradient-3",
    "linear-gradient-blue-3": "bg-linear-gradient-blue-3",
  };

  return (
    <section className="w-full">
      {/* Section content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 pb-8">
        {/* Header */}
        <div className="text-center ">
          <h2 className="text-[#004040] text-center font-['PT_Serif'] text-[48px] not-italic font-normal leading-[56px] tracking-[0.192px]">
            In the <span className="">Press</span>
          </h2>
          <p className="text-[#757679] pt-3 text-center font-['DM_Sans'] text-[16px] not-italic font-normal leading-[28px] tracking-[-0.064px]">
            Financial media outlets are highlighting our approach to secure,
            regulated
            <br />
            investing with real returns
          </p>
        </div>

        <div className="w-screen bg-transparent border-t border-b mt-[70px] border-[#F3F4F6] "></div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12 lg:mb-0 max-w-[1178px] mx-auto pr-[2px]">
          {newsItems.map((item, index) => (
            <div className="flex w-full" key={index}>
              <div className=" rounded-none w-full">
                {/* Card Content with rounded corners */}
                <div className="overflow-hidden rounded-none">
                  {/* Logo Area */}
                  <div
                    className={`h-32 sm:h-40 lg:h-[225px] flex ${index === 1 ? "bg-black" : ""} items-center justify-center px-8 relative`}
                  >
                    <Image src={item.logo} alt={item.publication} />
                  </div>

                  {/* Publication Info */}
                  <div className="px-[16px] py-[22px] border-t border-[#F3F4F6] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 md:gap-4">
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-[1px]  border-solid h-[32px] border-[#A7C6ED] bg-[rgba(167,198,237,0.35)] flex items-center  gap-1 sm:gap-2 p-[10px] tracking-[-0.064px] leading-[28px]  text-[#004040] font-dm-sans text-[16px] font-[500] flex-shrink-0 "
                    >
                      <Image
                        src="/svg-assets/landingpage/spout-book.svg"
                        alt="Article"
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      {item.publication}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="9"
                        viewBox="0 0 6 9"
                        fill="none"
                      >
                        <path
                          d="M0.75 7.81L4.27 4.28L0.75 0.75"
                          stroke="#3D5678"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <span className="text-[16px] font-[500] leading-[28px] tracking-[-0.064px] font-dm-sans text-[#525252] sm:ml-auto">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`${gradientMap[item.gradient] ?? ""} h-full w-[22px]`}
              ></div>
            </div>
          ))}
        </div>
        <div className="w-screen bg-transparent border-t border-b border-[#F3F4F6] "></div>
        <div className="mt-4 sm:mt-7 text-end max-w-[1178px] mx-auto pe-[22px]">
          <Link
            href="/faq"
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
