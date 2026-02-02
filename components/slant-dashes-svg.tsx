import { memo, useMemo } from "react";

interface DiagonalPatternProps {
  width?: string | number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  spacing?: number;
}

// Memoized Diamond component to avoid recreating SVG elements
const Diamond = memo(({ className }: { className: string }) => (
  <div className={className}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-blue-300"
    >
      <path
        d="M12 2L22 12L12 22L2 12L12 2Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="white"
      />
    </svg>
  </div>
));
Diamond.displayName = "Diamond";

export const DiagonalPattern = memo(
  ({
    width = "100%",
    height = 34,
    color = "#A7C6ED",
    strokeWidth = 1.5,
    spacing = 14,
  }: DiagonalPatternProps) => {
    // Convert width to number if it's a string with px
    const numericWidth = useMemo(() => {
      if (typeof width === "string" && width.endsWith("px")) {
        return parseInt(width);
      }
      return typeof width === "number" ? width : 1406;
    }, [width]);

    // Memoize mobile line calculations
    const mobileLines = useMemo(() => {
      const mobileSpacing = spacing * 1.5;
      const mobileLineCount =
        Math.ceil(numericWidth / mobileSpacing) +
        Math.ceil(height / mobileSpacing);

      const mobilePathData: string[] = [];
      const extraLines = 3;
      const extendedHeight = height * 1.5;
      for (let i = -extraLines; i < mobileLineCount + extraLines; i++) {
        const x = i * mobileSpacing;
        mobilePathData.push(`M${x} ${height}L${x + extendedHeight} 0`);
      }

      return mobilePathData.join(" ");
    }, [numericWidth, height, spacing]);

    return (
      <div
        className="relative"
        style={{ contain: "layout style", transform: "translateZ(0)" }}
      >
        {/* Horizontal border extensions to connect with vertical page lines - hidden on mobile */}
        <div className="hidden md:block absolute -left-16 top-0 w-16 h-[1.5px] bg-[#A7C6ED]"></div>
        <div className="hidden md:block absolute -right-16 top-0 w-16 h-[1.5px] bg-[#A7C6ED]"></div>
        <div className="hidden md:block absolute -left-16 bottom-0 w-16 h-[1.5px] bg-[#A7C6ED]"></div>
        <div className="hidden md:block absolute -right-16 bottom-0 w-16 h-[1.5px] bg-[#A7C6ED]"></div>

        {/* Corner diamonds */}
        <Diamond className="hidden lg:block absolute -left-2 -top-2 z-20" />
        <Diamond className="hidden lg:block absolute -right-2 -top-2 z-20" />
        <Diamond className="hidden lg:block absolute -left-2 -bottom-2 z-20" />
        <Diamond className="hidden lg:block absolute -right-2 -bottom-2 z-20" />

        {/* Intersection diamonds where extended borders meet vertical page lines */}
        <Diamond className="hidden lg:block absolute -left-16 -top-2 z-20" />
        <Diamond className="hidden lg:block absolute -right-16 -top-2 z-20" />
        <Diamond className="hidden lg:block absolute -left-16 -bottom-2 z-20" />
        <Diamond className="hidden lg:block absolute -right-16 -bottom-2 z-20" />

        {/* Main content container with border and overflow hidden */}
        <div className="relative md:border md:border-[#A7C6ED] md:rounded-none md:shadow-sm overflow-hidden">
          {/* Mobile SVG */}
          <svg
            className="block md:hidden"
            width="100%"
            height={height}
            viewBox={`-100 0 ${numericWidth + 200} ${height * 1.5}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{
              overflow: "visible",
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
            }}
          >
            <path
              d={mobileLines}
              stroke={color}
              strokeWidth={strokeWidth * 1.2}
            />
          </svg>

          {/* Desktop - CSS repeating gradient for seamless diagonal lines */}
          <div
            className="hidden md:block"
            style={{
              width,
              height,
              background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent ${spacing - strokeWidth}px,
              ${color} ${spacing - strokeWidth}px,
              ${color} ${spacing}px
            )`,
            }}
          />
        </div>
      </div>
    );
  },
);

DiagonalPattern.displayName = "DiagonalPattern";
