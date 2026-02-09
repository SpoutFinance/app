"use client";

/**
 * TradeStats Component
 *
 * Displays key statistics for an asset:
 * - Market Cap
 * - 24h Volume
 * - 52-Week High
 * - 52-Week Low
 *
 * DATA FLOW (CURRENTLY USING MOCK DATA):
 * All stats (marketCap, volume24h, high52w, low52w) are passed from the parent
 * trade page, which currently uses mock data from getMockAssetData().
 *
 * TO REVERT TO REAL DATA:
 * 1. Set USE_MOCK_DATA = false in lib/mocks/equities-mock-data.ts
 * 2. Implement real data fetching in the trade page using:
 *    - useAssetPrice hook for price data
 *    - clientCacheHelpers.fetchStockData() for fundamental data
 *    - Or create a dedicated useAssetStats hook
 *
 * The stats API should return: { marketCap, volume24h, high52w, low52w }
 */
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: "up" | "down";
}

function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="w-60 flex flex-col gap-2 px-6 py-4 bg-white border border-dashboard-border rounded-lg">
      <span className="text-sm text-dashboard-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-dashboard-text-heading">
          {value}
        </span>
        {trend && (
          <span
            className={
              trend === "up"
                ? "text-dashboard-accent-success"
                : "text-dashboard-accent-error"
            }
          >
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}

interface TradeStatsProps {
  marketCap: number | null;
  volume24h: number | null;
  high52w: number | null;
  low52w: number | null;
  currentPrice: number | null;
}

const formatLargeNumber = (value: number | null): string => {
  if (value === null) return "—";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};

const formatPrice = (value: number | null): string => {
  if (value === null) return "—";
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export function TradeStats({
  marketCap,
  volume24h,
  high52w,
  low52w,
  currentPrice,
}: TradeStatsProps) {
  // Determine trends based on current price vs 52w high/low
  const highTrend =
    currentPrice && high52w
      ? currentPrice >= high52w * 0.95
        ? "up"
        : "down"
      : undefined;

  const lowTrend =
    currentPrice && low52w
      ? currentPrice <= low52w * 1.05
        ? "down"
        : "up"
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-dashboard-text-heading">
        Stats
      </h2>
      <div className="w-full flex justify-left align-center gap-6">
        <StatCard
          label="Market Cap"
          value={formatLargeNumber(marketCap)}
          trend="up"
        />
        <StatCard
          label="24h Volume"
          value={formatLargeNumber(volume24h)}
          trend="up"
        />
        <StatCard
          label="52W High"
          value={formatPrice(high52w)}
          trend={highTrend}
        />
        <StatCard
          label="52W Low"
          value={formatPrice(low52w)}
          trend={lowTrend}
        />
      </div>
    </div>
  );
}
