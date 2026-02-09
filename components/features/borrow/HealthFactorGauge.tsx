"use client";

import { InfoTooltip } from "@/components/ui/info-tooltip";

interface HealthFactorGaugeProps {
  healthFactor: number;
}

// Color constants using Tailwind values
const COLORS = {
  teal: "#004a4a",
  success: "#078842",
  successLight: "#22c55e",
  successBg: "#deffee",
  warning: "#f59e0b",
  warningBg: "#fef3c7",
  error: "#e23434",
  errorBg: "#fee2e2",
  border: "#e6e6e6",
};

export function HealthFactorGauge({ healthFactor }: HealthFactorGaugeProps) {
  // Determine status based on health factor
  const getStatus = () => {
    if (healthFactor >= 1.5)
      return { label: "Safe", color: COLORS.success, bgColor: COLORS.successBg };
    if (healthFactor >= 1.2)
      return { label: "Caution", color: COLORS.warning, bgColor: COLORS.warningBg };
    return { label: "At Risk", color: COLORS.error, bgColor: COLORS.errorBg };
  };

  const status = getStatus();

  // Total segments in the semicircle gauge
  const totalSegments = 22;

  // Calculate filled segments based on health factor
  // Health factor 1.0 = 0 segments, 2.0+ = all segments
  const normalizedValue = Math.min(Math.max((healthFactor - 1) / 1, 0), 1);
  const filledSegments = Math.round(normalizedValue * totalSegments);

  // Generate segment positions for a semicircle
  const generateSegments = () => {
    const segments = [];
    const centerX = 145;
    const centerY = 130;
    const radius = 110;
    const segmentWidth = 12;
    const segmentHeight = 32;
    const gapAngle = 3; // Gap between segments in degrees

    for (let i = 0; i < totalSegments; i++) {
      // Calculate angle for this segment (from left to right, 180 to 0 degrees)
      const angleRange = 180 - gapAngle * totalSegments;
      const segmentAngle = angleRange / totalSegments;
      const angle = 180 - i * (segmentAngle + gapAngle) - segmentAngle / 2;
      const angleRad = (angle * Math.PI) / 180;

      // Calculate position
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY - radius * Math.sin(angleRad);

      // Determine if this segment should be filled
      const isFilled = i < filledSegments;

      // Determine color based on position and fill state
      let fillColor = COLORS.border; // Default gray for unfilled
      if (isFilled) {
        // Gradient from dark green to light green based on position
        const greenIntensity = 1 - i / totalSegments;
        if (greenIntensity > 0.6) {
          fillColor = COLORS.teal; // Dark teal
        } else if (greenIntensity > 0.3) {
          fillColor = COLORS.success; // Green
        } else {
          fillColor = COLORS.successLight; // Light green
        }
      }

      segments.push(
        <rect
          key={i}
          x={x - segmentWidth / 2}
          y={y - segmentHeight / 2}
          width={segmentWidth}
          height={segmentHeight}
          rx={6}
          ry={6}
          fill={fillColor}
          transform={`rotate(${90 - angle}, ${x}, ${y})`}
          className="transition-all duration-300"
        />
      );
    }

    return segments;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-medium leading-[35px] text-dashboard-text-primary tracking-[-0.72px]">
          Health Factor
        </h3>
        <InfoTooltip info="Health Factor indicates the safety of your loan. Below 1.0 risks liquidation" size={18} />
      </div>

      <div className="bg-white border border-dashboard-border rounded-xl overflow-hidden min-h-[174px] flex items-center justify-center">
        <div className="relative w-[290px] h-[145px]">
          {/* SVG Gauge with segments */}
          <svg viewBox="0 0 290 145" className="w-full h-full">
            {generateSegments()}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            <span className="text-[26px] font-semibold text-black">
              {healthFactor.toFixed(2)}%
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-md mt-1"
              style={{ color: status.color, backgroundColor: status.bgColor }}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
