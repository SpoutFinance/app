"use client";

import { useState, useRef, useEffect } from "react";
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
  position?: "top" | "bottom" | "left" | "right";
}

/**
 * InfoTooltip - A reusable info icon with tooltip
 * Shows tooltip on hover and click with customizable content
 */
export function InfoTooltip({
  info,
  size = 18,
  className,
  position = "top",
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const displayText = info || "Add info";

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[#333]",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[#333]",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[#333]",
    right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[#333]",
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={cn(
          "text-dashboard-text-secondary hover:text-dashboard-text-primary transition-colors cursor-pointer",
          className
        )}
        aria-label="More info"
      >
        <Info style={{ width: size, height: size }} />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-3 py-2 text-xs font-medium text-white bg-[#333] rounded-md shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95",
            positionClasses[position]
          )}
        >
          {displayText}
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0 border-[5px]",
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}

export default InfoTooltip;
