"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ComponentType, SVGProps } from "react";

type SvgIconSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

// Type for SVGR components (SVG imports transformed by @svgr/webpack)
type SvgrComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface SvgIconProps {
  /** The SVG source - can be an SVGR component, imported SVG, or a string path */
  src: SvgrComponent | string;
  /** Alt text for accessibility */
  alt?: string;
  /** Predefined size or custom number (in pixels) */
  size?: SvgIconSize;
  /** Custom width (overrides size) */
  width?: number;
  /** Custom height (overrides size) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether the icon should inherit text color (uses CSS filter) */
  inheritColor?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

const SIZE_MAP: Record<Exclude<SvgIconSize, number>, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/**
 * SvgIcon - A component for rendering SVG icons consistently
 *
 * Supports both:
 * 1. SVGR components (when @svgr/webpack transforms SVG imports into React components)
 * 2. URL strings (for use with next/image)
 *
 * @example
 * // Basic usage with imported SVG (SVGR component)
 * import FilterIcon from "@/assets/images/filters.svg";
 * <SvgIcon src={FilterIcon} alt="Filter" size="md" />
 *
 * @example
 * // With custom size
 * <SvgIcon src={FilterIcon} width={20} height={20} />
 *
 * @example
 * // With color inheritance (for monochrome icons)
 * <SvgIcon src={FilterIcon} size="lg" inheritColor className="text-primary" />
 */
export function SvgIcon({
  src,
  alt = "",
  size = "md",
  width,
  height,
  className,
  inheritColor = false,
  onClick,
  ariaLabel,
}: SvgIconProps) {
  // Calculate dimensions
  const resolvedSize = typeof size === "number" ? size : SIZE_MAP[size];
  const finalWidth = width ?? resolvedSize;
  const finalHeight = height ?? resolvedSize;

  // Check if src is an SVGR component (function/object with $$typeof)
  // @svgr/webpack transforms SVG imports into React components
  const isSvgrComponent =
    typeof src === "function" ||
    (typeof src === "object" && src !== null && "$$typeof" in src);

  if (isSvgrComponent) {
    // Render as SVGR React component
    const SvgComponent = src as SvgrComponent;
    return (
      <SvgComponent
        width={finalWidth}
        height={finalHeight}
        className={cn(
          "flex-shrink-0",
          inheritColor && "text-current",
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-hidden={!alt && !ariaLabel}
        role={alt || ariaLabel ? "img" : undefined}
      />
    );
  }

  // Render as next/image for URL strings
  return (
    <Image
      src={src as string}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      className={cn(
        "flex-shrink-0",
        inheritColor && "dark:invert",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-hidden={!alt && !ariaLabel}
      draggable={false}
    />
  );
}

/**
 * Inline SVG component for when you need full control over the SVG
 * Use this when you need to change colors dynamically with CSS
 */
interface InlineSvgProps extends React.SVGProps<SVGSVGElement> {
  size?: SvgIconSize;
}

export function InlineSvg({
  size = "md",
  width,
  height,
  className,
  children,
  ...props
}: InlineSvgProps) {
  const resolvedSize = typeof size === "number" ? size : SIZE_MAP[size];
  const finalWidth = width ?? resolvedSize;
  const finalHeight = height ?? resolvedSize;

  return (
    <svg
      width={finalWidth}
      height={finalHeight}
      className={cn("flex-shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}
