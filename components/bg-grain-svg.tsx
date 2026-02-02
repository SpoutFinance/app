import React, { memo } from "react";

interface BgGrainProps {
  width?: number | string;
  height?: number | string;
  opacity?: number;
  fillOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Performant CSS-based grain background.
 * Uses a static CSS gradient pattern instead of expensive SVG feTurbulence filters.
 * Memoized and GPU-accelerated for smooth scrolling with Lenis.
 */
const BgGrain: React.FC<BgGrainProps> = memo(
  ({ opacity = 0.15, className, style }) => {
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          opacity,
          // Multi-layer CSS gradient simulating grain - no SVG filter needed
          backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(167, 198, 237, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(0, 64, 64, 0.03) 0%, transparent 30%),
          linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)
        `,
          // Hardware acceleration hints
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          contain: "strict",
          contentVisibility: "auto",
          ...style,
        }}
        aria-hidden="true"
      />
    );
  },
);

BgGrain.displayName = "BgGrain";

export default BgGrain;
