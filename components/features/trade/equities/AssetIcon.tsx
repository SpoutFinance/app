"use client";

import { ASSET_COLORS } from "./types";

interface AssetIconProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-5 h-5 text-[8px]",
  md: "w-6 h-6 text-[10px]",
  lg: "w-8 h-8 text-xs",
};

export function AssetIcon({ symbol, size = "md" }: AssetIconProps) {
  const color = ASSET_COLORS[symbol] || "#004a4a";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold`}
      style={{ backgroundColor: color }}
    >
      {symbol[0]}
    </div>
  );
}
