"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export interface MediaOutlet {
  name: string;
  date: string;
  image: string | StaticImageData;
  bgColor?: string;
  imageType: "logo" | "cover";
  url: string;
}

/* ─── Press Row ─── */
export function PressRow({
  outlets,
  dividerColors,
}: {
  outlets: MediaOutlet[];
  dividerColors: { from: string; to: string }[];
}) {
  return (
    <>
      {/* Desktop: cards with gradient dividers */}
      <div className="hidden lg:flex">
        {outlets.map((outlet, i) => (
          <div key={outlet.name} className="flex">
            <PressCard {...outlet} />
            <div
              className="w-[22px] self-stretch flex-shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${dividerColors[i].from}, ${dividerColors[i].to})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Tablet: 2-column grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 sm:gap-6">
        {outlets.map((outlet) => (
          <PressCard key={outlet.name} {...outlet} />
        ))}
      </div>

      {/* Mobile: single column */}
      <div className="grid sm:hidden grid-cols-1 gap-6">
        {outlets.map((outlet) => (
          <PressCard key={outlet.name} {...outlet} />
        ))}
      </div>
    </>
  );
}

/* ─── Press Card ─── */
export function PressCard({
  name,
  date,
  image,
  bgColor = "#ffffff",
  imageType,
  url,
}: MediaOutlet) {
  return (
    <div className="w-full lg:w-[370px] bg-white flex flex-col">
      {/* Image Section */}
      <div
        className="h-32 sm:h-40 lg:h-[225px] flex items-center justify-center px-8 relative overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <Image
          src={image}
          alt={name}
          width={370}
          height={224}
          className={
            imageType === "cover"
              ? "w-full h-full object-cover"
              : "max-h-[60%] max-w-[80%] object-contain"
          }
          loading="lazy"
          unoptimized
        />
      </div>

      {/* Info Section */}
      <div className="px-[16px] py-[22px] border-t border-[#F3F4F6] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 md:gap-4">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="border-[1px] border-solid h-[32px] border-[#A7C6ED] bg-[rgba(167,198,237,0.35)] flex items-center gap-1 sm:gap-2 p-[10px] tracking-[-0.064px] leading-[28px] text-[#004040] font-dm-sans text-[16px] font-[500] flex-shrink-0"
        >
          <Image
            src="/svg-assets/landingpage/spout-book.svg"
            alt="Article"
            width={20}
            height={20}
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          {name}
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
          {date}
        </span>
      </div>
    </div>
  );
}
