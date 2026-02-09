"use client";

import { cn } from "@/lib/utils";

export type StatusBadgeVariant = "success" | "error";

export interface StatusBadgeProps {
  /** The text to display in the badge */
  value: string;
  /** Whether to show a plus sign prefix (default: false) */
  showPlus?: boolean;
  /** The visual variant of the badge */
  variant?: StatusBadgeVariant;
  /** Optional additional className */
  className?: string;
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  success: "bg-[#deffee] text-[#078842]",
  error: "bg-[#ffeeee] text-[#d32f2f]",
};

/**
 * StatusBadge - A reusable badge component for displaying status indicators
 * Used for showing percentage changes, APY rates, and other status values
 */
export function StatusBadge({
  value,
  showPlus = false,
  variant = "success",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-[9px] py-[4.6px] rounded-[6px] text-[11.5px] font-semibold font-figtree leading-[13.9px]",
        variantStyles[variant],
        className
      )}
    >
      {showPlus && "+"}
      {value}
    </span>
  );
}

export default StatusBadge;
