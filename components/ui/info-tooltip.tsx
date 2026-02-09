"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfoTooltipProps {
  /** The info text to display in the tooltip */
  info?: string;
  /** Size of the icon in pixels */
  size?: number;
  /** Optional additional className for the button */
  className?: string;
  /** Position of the tooltip */
  side?: "top" | "bottom" | "left" | "right";
}

/**
 * InfoTooltip - A reusable info icon with tooltip
 * Uses Radix UI tooltip with Portal to work inside modals
 */
export function InfoTooltip({
  info,
  size = 18,
  className,
  side = "top",
}: InfoTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button
            type="button"
            className={cn(
              "text-dashboard-text-secondary hover:text-dashboard-text-primary transition-colors",
              className
            )}
            aria-label="More info"
          >
            <Info style={{ width: size, height: size }} />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={4}
            className="z-[100] max-w-xs overflow-hidden rounded-md bg-[#333] px-3 py-2 text-xs text-white shadow-lg animate-in fade-in-0 zoom-in-95"
          >
            {info || "Add info"}
            <TooltipPrimitive.Arrow className="fill-[#333]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export default InfoTooltip;
