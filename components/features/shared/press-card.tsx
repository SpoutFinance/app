"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

export interface MediaOutlet {
  name: string;
  date: string;
  image: string;
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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full lg:w-[370px] bg-white flex flex-col"
    >
      {/* Image Section */}
      <div
        className="relative w-full h-48 sm:h-56 overflow-hidden border-b border-spout-border flex items-center justify-center"
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
      <div className="flex items-center justify-between px-4 py-3">
        {/* Name Badge */}
        <div className="inline-flex items-center gap-2.5 px-2.5 py-1 border border-spout-accent bg-spout-accent/35">
          <Image
            src="/svg-assets/landingpage/spout-book.svg"
            alt=""
            width={18}
            height={18}
            className="w-[18px] h-[18px]"
          />
          <span className="text-sm sm:text-base font-medium text-spout-text-secondary tracking-[-0.064px] leading-7">
            {name}
          </span>
          <ChevronRight className="w-3 h-3 text-spout-text-secondary flex-shrink-0" />
        </div>

        {/* Date */}
        <span className="text-sm sm:text-base font-medium text-spout-text-muted tracking-[-0.064px] leading-7">
          {date}
        </span>
      </div>
    </a>
  );
}
