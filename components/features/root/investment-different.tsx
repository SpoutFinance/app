import Image from "next/image";

const cards = [
  {
    icon: "/svg-assets/icon-lock-privacy.svg",
    iconAlt: "Lock",
    title: "Privacy Protection",
    description: "Confidential transactions with encrypted data",
    badges: ["Encrypted data", "Private transfers"],
    gradientFrom: "#48ca83",
    gradientTo: "#c1f672",
  },
  {
    icon: "/svg-assets/icon-security-safe.svg",
    iconAlt: "Shield",
    title: "Regulated Assets",
    description: "Backed by real U.S. public equities",
    badges: ["SEC Compliant", "FDIC Protected"],
    gradientFrom: "#0168ff",
    gradientTo: "#02bfff",
  },
  {
    icon: "/svg-assets/icon-flash-liquidity.svg",
    iconAlt: "Flash",
    title: "Instant Liquidity",
    description: "Trade tokens 24/7 on decentralized exchanges",
    badges: ["No Lock-up Period", "24/7 Trading"],
    gradientFrom: "#febb46",
    gradientTo: "#fee6a9",
  },
  {
    icon: "/svg-assets/icon-key-confidential.svg",
    iconAlt: "Key",
    title: "Confidential Assets",
    description: "Protected identity and private records",
    badges: ["Secure Handling", "Private Layers"],
    gradientFrom: "#fab6e4",
    gradientTo: "#f8cce9",
  },
];

export function InvestmentDifferent() {
  return (
    <section className="w-full pt-8 sm:pt-12 lg:pt-16">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-4xl xl:text-5xl leading-tight capitalize font-lora font-normal text-[#004040] mb-4 sm:mb-6 tracking-[0.192px]">
          Smarter On-chain Investing
        </h2>
        <p className="text-sm sm:text-base font-noto-sans font-normal text-[#757679] leading-7 tracking-[-0.064px]">
          Consistent returns from regulated investment-grade securities, with
          instant trading
          <br />
          and full transparency
        </p>
      </div>

      {/* Desktop: 2x2 grid */}
      <div className="hidden lg:block relative">
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
        {/* Row 1 */}
        <div className="flex">
          {/* Card 1: Privacy Protection */}
          <div className="flex">
            <div
              className="w-[18px] self-stretch shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${cards[0].gradientFrom}, ${cards[0].gradientTo})`,
              }}
            />
            <div className="w-[570px] bg-white border-b-2 border-[#f3f4f6] overflow-clip py-8 px-9">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={cards[0].icon}
                      alt={cards[0].iconAlt}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-noto-sans font-medium text-black text-xl tracking-[-0.08px] leading-7">
                      {cards[0].title}
                    </span>
                  </div>
                  <p className="font-noto-sans font-normal text-[#7d8690] text-base leading-7 tracking-[-0.064px]">
                    {cards[0].description}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  {cards[0].badges.map((badge) => (
                    <div
                      key={badge}
                      className="bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] h-[33px] flex items-center justify-center px-2.5"
                    >
                      <span className="font-noto-sans font-medium text-[#3d5678] text-base text-center tracking-[-0.064px] leading-7">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Regulated Assets */}
          <div className="flex">
            <div
              className="w-[18px] self-stretch shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${cards[1].gradientFrom}, ${cards[1].gradientTo})`,
              }}
            />
            <div className="w-[570px] bg-white border-b-2 border-[#f3f4f6] overflow-clip py-8 px-9">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={cards[1].icon}
                      alt={cards[1].iconAlt}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-noto-sans font-medium text-black text-xl tracking-[-0.08px] leading-7">
                      {cards[1].title}
                    </span>
                  </div>
                  <p className="font-noto-sans font-normal text-[#7d8690] text-base leading-7 tracking-[-0.064px]">
                    {cards[1].description}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  {cards[1].badges.map((badge) => (
                    <div
                      key={badge}
                      className="bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] h-[33px] flex items-center justify-center px-2.5"
                    >
                      <span className="font-noto-sans font-medium text-[#3d5678] text-base text-center tracking-[-0.064px] leading-7">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex">
          {/* Card 3: Instant Liquidity */}
          <div className="flex">
            <div
              className="w-[18px] self-stretch shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${cards[2].gradientFrom}, ${cards[2].gradientTo})`,
              }}
            />
            <div className="w-[570px] bg-white overflow-clip py-8 px-9">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={cards[2].icon}
                      alt={cards[2].iconAlt}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-noto-sans font-medium text-black text-xl tracking-[-0.08px] leading-7">
                      {cards[2].title}
                    </span>
                  </div>
                  <p className="font-noto-sans font-normal text-[#7d8690] text-base leading-7 tracking-[-0.064px]">
                    {cards[2].description}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  {cards[2].badges.map((badge) => (
                    <div
                      key={badge}
                      className="bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] h-[33px] flex items-center justify-center px-2.5"
                    >
                      <span className="font-noto-sans font-medium text-[#3d5678] text-base text-center tracking-[-0.064px] leading-7">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Confidential Assets */}
          <div className="flex">
            <div
              className="w-[18px] self-stretch shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${cards[3].gradientFrom}, ${cards[3].gradientTo})`,
              }}
            />
            <div className="w-[570px] bg-white overflow-clip py-8 px-9">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={cards[3].icon}
                      alt={cards[3].iconAlt}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="font-noto-sans font-medium text-black text-xl tracking-[-0.08px] leading-7">
                      {cards[3].title}
                    </span>
                  </div>
                  <p className="font-noto-sans font-normal text-[#7d8690] text-base leading-7 tracking-[-0.064px]">
                    {cards[3].description}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  {cards[3].badges.map((badge) => (
                    <div
                      key={badge}
                      className="bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] h-[33px] flex items-center justify-center px-2.5"
                    >
                      <span className="font-noto-sans font-medium text-[#3d5678] text-base text-center tracking-[-0.064px] leading-7">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet/Mobile: Stacked cards */}
      <div className="lg:hidden space-y-4">
        {cards.map((card) => (
          <div key={card.title} className="flex">
            <div
              className="w-3 sm:w-[18px] self-stretch shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${card.gradientFrom}, ${card.gradientTo})`,
              }}
            />
            <div className="flex-1 bg-white border border-gray-200 border-l-0 p-5 sm:p-7">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={card.icon}
                      alt={card.iconAlt}
                      width={24}
                      height={24}
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    <span className="font-noto-sans font-medium text-black text-lg sm:text-xl tracking-[-0.08px] leading-7">
                      {card.title}
                    </span>
                  </div>
                  <p className="font-noto-sans font-normal text-[#7d8690] text-sm sm:text-base leading-7 tracking-[-0.064px]">
                    {card.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {card.badges.map((badge) => (
                    <div
                      key={badge}
                      className="bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] h-[33px] flex items-center justify-center px-2.5"
                    >
                      <span className="font-noto-sans font-medium text-[#3d5678] text-sm sm:text-base text-center tracking-[-0.064px] leading-7">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
