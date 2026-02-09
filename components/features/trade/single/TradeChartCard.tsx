"use client";

import { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { AssetIcon } from "../equities/AssetIcon";

type TimePeriod = "24H" | "1W" | "1M" | "2M" | "3M" | "6M" | "All time";

interface ChartDataPoint {
  time: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface TradeChartCardProps {
  ticker: string;
  name: string;
  loading: boolean;
  chartData: ChartDataPoint[];
  onPeriodChange?: (period: TimePeriod) => void;
}

const TIME_PERIODS: TimePeriod[] = [
  "24H",
  "1W",
  "1M",
  "2M",
  "3M",
  "6M",
  "All time",
];

// Format currency for Y axis
function formatCurrency(num: number): string {
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}k`;
  }
  return `$${num.toFixed(0)}`;
}

// Format full currency for tooltip
function formatFullCurrency(num: number): string {
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-md shadow-lg px-2.5 py-1.5 border border-dashboard-border">
        <p className="text-[10px] text-dashboard-text-muted font-figtree leading-3">
          {label}
        </p>
        <p className="text-[10px] font-semibold text-dashboard-text-heading font-figtree leading-3">
          {formatFullCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

// Custom cursor - vertical line with circle indicator
function CustomCursor({ points, height }: any) {
  if (!points || points.length === 0) return null;

  const { x, y } = points[0];
  const circleRadius = 5;
  const lineStartY = y + circleRadius;
  const lineEndY = height - 30;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={circleRadius}
        fill="white"
        stroke="#004a4a"
        strokeWidth={2}
      />
      <line
        x1={x}
        y1={lineStartY}
        x2={x}
        y2={lineEndY}
        stroke="#004a4a"
        strokeWidth={2}
        strokeOpacity={0.6}
      />
    </g>
  );
}

// Time period button component
function TimePeriodButton({
  period,
  isActive,
  onClick,
}: {
  period: TimePeriod;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-6.5 px-2.5 rounded-full text-sm font-medium font-figtree tracking-tight transition-colors ${
        isActive
          ? "bg-dashboard-accent-blue-bg border border-dashboard-accent-blue-light text-dashboard-accent-blue"
          : "bg-white border border-dashboard-border text-dashboard-accent-blue hover:bg-dashboard-bg-hover"
      }`}
    >
      {period}
    </button>
  );
}

export function TradeChartCard({
  ticker,
  name,
  loading,
  chartData,
  onPeriodChange,
}: TradeChartCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M");

  const handlePeriodClick = (period: TimePeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  // Transform chart data for Recharts
  const transformedData = useMemo(() => {
    if (!chartData?.length) return [];
    return chartData.map((d) => {
      const date = new Date(d.time);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return {
        date: dateStr,
        value: d.close,
      };
    });
  }, [chartData]);

  // Calculate Y axis domain
  const yDomain = useMemo(() => {
    if (transformedData.length === 0) return [0, 1000];
    const values = transformedData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [
      Math.floor((min - padding) / 50) * 50,
      Math.ceil((max + padding) / 50) * 50,
    ];
  }, [transformedData]);

  // Generate Y axis ticks
  const yTicks = useMemo(() => {
    const [min, max] = yDomain;
    const step = (max - min) / 5;
    const ticks = [];
    for (let i = 0; i <= 5; i++) {
      ticks.push(Math.round(min + step * i));
    }
    return ticks;
  }, [yDomain]);

  return (
    <div className="bg-white border border-dashboard-border rounded-xl overflow-hidden flex flex-col flex-1 h-94.75">
      {/* Header */}
      <div className="flex items-end gap-2 px-6 pt-6 pb-4">
        <AssetIcon symbol={ticker} size="md" />
        <span className="text-2xl font-semibold text-dashboard-text-heading tracking-tight font-figtree">
          {ticker}
        </span>
        <span className="text-base text-dashboard-text-muted pb-0.5 font-figtree">
          {name}
        </span>
      </div>

      {/* Chart Area */}
      <div className="flex-1 px-6">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-dashboard-bg-subtle rounded-lg">
            <LoadingSpinner size="lg" text="Loading chart data..." />
          </div>
        ) : !chartData?.length ? (
          <div className="h-full flex items-center justify-center text-dashboard-text-muted font-figtree">
            No chart data available
          </div>
        ) : (
          <div className="h-54.25 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transformedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="tradeChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004a4a" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#004a4a" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={true}
                  horizontal={true}
                  stroke="#e6e6e6"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#7d7d7d" }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  domain={yDomain}
                  ticks={yTicks}
                  tick={{ fontSize: 10, fill: "#7d7d7d" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrency}
                  width={45}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={<CustomCursor height={217} />}
                  offset={-45}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#004a4a"
                  strokeWidth={2}
                  fill="url(#tradeChartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Time Period Selector */}
      <div className="flex items-center justify-evenly gap-3 px-6 pb-6 pt-4">
        {TIME_PERIODS.map((period) => (
          <TimePeriodButton
            key={period}
            period={period}
            isActive={selectedPeriod === period}
            onClick={() => handlePeriodClick(period)}
          />
        ))}
      </div>
    </div>
  );
}
