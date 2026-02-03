import Image from "next/image";

const cards = [
  {
    icon: "/svg-assets/icon-shield-security.svg",
    iconAlt: "Shield",
    title: "DeFi Integration Benefits",
    description:
      "DeFi expands access to traditional assets by enabling security-backed lending and diversified exposure, unlocking opportunities while bridging traditional and decentralized markets.",
    bullets: [
      "Security-backed lending",
      "Multi-asset exposure",
      "Access to real yield",
    ],
    illustration: "/svg-assets/defi-integration-benefits.svg",
    illustrationAlt: "DeFi Integration",
  },
  {
    icon: "/svg-assets/defi-security-transparency.svg",
    iconAlt: "Check",
    title: "DeFi Security & Transparency",
    description:
      "DeFi combines strong safeguards with full transparency, ensuring all assets are protected and fully verifiable while building lasting trust and unlocking new opportunities in finance.",
    bullets: [
      "Institutional-grade asset protection",
      "Transparent on-chain verification",
      "Continuous independent audits",
    ],
    illustration: "/svg-assets/security-lock.svg",
    illustrationAlt: "Security Lock",
  },
];

export function UnlockingFinance() {
  return (
    <section className="w-full pt-8 sm:pt-12 lg:pt-16">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-4xl xl:text-5xl leading-tight capitalize font-lora font-normal text-[#004040] mb-4 sm:mb-6 tracking-[0.192px]">
          Unlocking Finance with DeFi
          <br />
          through our stablecoin
        </h2>
        <p className="text-sm sm:text-base font-noto-sans font-normal text-[#757679] leading-6 tracking-[0.064px]">
          Expand access to traditional assets with security, transparency, and
          real yield on-chain
        </p>
        <p className="text-sm sm:text-base font-noto-sans font-normal text-[#757679] leading-6 tracking-[0.064px]">
          Global access, real yield, full transparency, built for DeFi
        </p>
      </div>

      {/* Desktop: Two cards with gradient dividers */}
      <div className="hidden lg:flex relative">
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
        {/* Card 1 */}
        <div className="flex-1 bg-white p-9 min-h-[340px]">
          <div className="flex flex-col gap-5 max-w-[452px]">
            {/* Badge */}
            <div className="flex flex-col gap-[18px]">
              <div className="flex items-center gap-2.5 bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] px-2.5 h-[38px] w-fit">
                <Image
                  src={cards[0].icon}
                  alt={cards[0].iconAlt}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-noto-sans font-medium text-[#3d5678] text-lg tracking-[-0.072px] leading-7">
                  {cards[0].title}
                </span>
              </div>
              {/* Description */}
              <p className="font-noto-sans font-normal text-[#757679] text-base leading-6 tracking-[0.064px]">
                {cards[0].description}
              </p>
            </div>
            {/* Bullet points */}
            <ul className="flex flex-col gap-1.5">
              {cards[0].bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-4 font-noto-sans font-normal text-[#525252] text-base leading-7 tracking-[-0.064px]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a7c6ed] shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          {/* Illustration */}
          <div className="absolute bottom-4 right-4">
            <Image
              src={cards[0].illustration}
              alt={cards[0].illustrationAlt}
              width={180}
              height={180}
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>

        {/* Gradient dividers */}
        <div className="flex shrink-0">
          <div
            className="w-16 self-stretch"
            style={{
              background: "linear-gradient(to top, #fec8bb, #ffe4c8)",
            }}
          />
          <div
            className="w-16 self-stretch"
            style={{
              background: "linear-gradient(to bottom, #ade1ff, #e8fbf9)",
            }}
          />
        </div>

        {/* Card 2 */}
        <div className="flex-1 bg-white p-9 min-h-[340px]">
          <div className="flex flex-col gap-5 max-w-[452px]">
            {/* Badge */}
            <div className="flex flex-col gap-[18px]">
              <div className="flex items-center gap-2.5 bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] px-2.5 h-[38px] w-fit">
                <Image
                  src={cards[1].icon}
                  alt={cards[1].iconAlt}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-noto-sans font-medium text-[#3d5678] text-lg tracking-[-0.072px] leading-7">
                  {cards[1].title}
                </span>
              </div>
              {/* Description */}
              <p className="font-noto-sans font-normal text-[#757679] text-base leading-6 tracking-[0.064px]">
                {cards[1].description}
              </p>
            </div>
            {/* Bullet points */}
            <ul className="flex flex-col gap-1.5">
              {cards[1].bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-4 font-noto-sans font-normal text-[#525252] text-base leading-7 tracking-[-0.064px]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a7c6ed] shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          {/* Illustration */}
          <div className="absolute bottom-2 right-4">
            <Image
              src={cards[1].illustration}
              alt={cards[1].illustrationAlt}
              width={130}
              height={155}
              className="w-28 h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Tablet/Mobile: Stacked cards */}
      <div className="lg:hidden space-y-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-gray-200 p-5 sm:p-7 relative"
          >
            {/* Badge */}
            <div className="flex items-center gap-2.5 bg-[rgba(167,198,237,0.35)] border border-[#a7c6ed] rounded-[4px] px-2.5 h-[38px] w-fit mb-4">
              <Image
                src={card.icon}
                alt={card.iconAlt}
                width={24}
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="font-noto-sans font-medium text-[#3d5678] text-base sm:text-lg tracking-[-0.072px] leading-7">
                {card.title}
              </span>
            </div>
            {/* Description */}
            <p className="font-noto-sans font-normal text-[#757679] text-sm sm:text-base leading-6 tracking-[0.064px] mb-4">
              {card.description}
            </p>
            {/* Bullet points */}
            <ul className="flex flex-col gap-1.5 mb-4">
              {card.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-3 font-noto-sans font-normal text-[#525252] text-sm sm:text-base leading-7 tracking-[-0.064px]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a7c6ed] shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
            {/* Illustration */}
            <div className="flex justify-center mt-4">
              <Image
                src={card.illustration}
                alt={card.illustrationAlt}
                width={140}
                height={140}
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
