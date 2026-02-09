"use client";

/**
 * TradePosition Component
 *
 * Displays the user's position for a specific asset including:
 * - Holdings (token balance)
 * - Current value
 * - Average buy price
 * - P&L (profit/loss)
 * - Break-even price
 *
 * DATA FLOW:
 * - holdings: From useTokenBalance hook (real on-chain balance)
 * - currentPrice: From useAssetPrice hook (real price data)
 * - avgBuyPrice: MOCK DATA - Currently using mock data from getMockAssetData()
 *
 * TO USE REAL DATA FOR avgBuyPrice:
 * The avgBuyPrice should come from transaction history or a backend API
 * that tracks user's purchase history. This requires:
 * 1. Indexing user's buy transactions
 * 2. Calculating weighted average purchase price
 * 3. Creating an API endpoint or hook to fetch this data
 *
 * Example implementation:
 * const { avgBuyPrice } = useUserPositionData(ticker, userAddress);
 */
import { StatusBadge, StatusBadgeVariant } from "@/components/ui/status-badge";

interface PositionCardProps {
  label: string;
  value: string;
  badge?: {
    text: string;
    variant: "success" | "error";
  };
}

function PositionCard({ label, value, badge }: PositionCardProps) {
  return (
    <div className="bg-white border border-dashboard-border rounded-lg flex-1 h-[82px] p-2.5">
      <span className="block text-base font-medium text-dashboard-text-muted leading-6 tracking-tight">
        {label}
      </span>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-2xl font-semibold text-dashboard-text-heading leading-7 tracking-tight">
          {value}
        </span>
        {badge && (
          <StatusBadge
            value={badge.text}
            variant={badge.variant}
            className="text-[11px] px-2 py-1 rounded-md leading-tight"
          />
        )}
      </div>
    </div>
  );
}

interface TradePositionProps {
  ticker: string;
  holdings: number;
  currentPrice: number | null;
  avgBuyPrice: number | null;
}

export function TradePosition({
  ticker,
  holdings,
  currentPrice,
  avgBuyPrice,
}: TradePositionProps) {
  // Calculate position values
  const value = currentPrice ? holdings * currentPrice : 0;
  const pnl =
    avgBuyPrice && currentPrice
      ? (currentPrice - avgBuyPrice) * holdings
      : 0;
  const pnlPercent =
    avgBuyPrice && avgBuyPrice > 0
      ? ((currentPrice || 0) - avgBuyPrice) / avgBuyPrice * 100
      : 0;
  const breakEven = avgBuyPrice || 0;

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatHoldings = (val: number) =>
    `${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${ticker}`;

  // Create P&L badge if there's a percentage change
  const pnlBadge =
    pnlPercent !== 0
      ? {
          text: `${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(2)}%`,
          variant: pnlPercent >= 0 ? ("success" as const) : ("error" as const),
        }
      : undefined;

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-2xl font-medium text-dashboard-text-heading leading-9 tracking-tight">
        Your Position
      </h2>
      <div className="flex items-center gap-4 flex-wrap">
        <PositionCard label="Holdings" value={formatHoldings(holdings)} />
        <PositionCard label="Value" value={formatCurrency(value)} />
        <PositionCard
          label="Avg. Buy Price"
          value={avgBuyPrice ? formatCurrency(avgBuyPrice) : "--"}
        />
        <PositionCard label="P&L" value={formatCurrency(pnl)} badge={pnlBadge} />
        <PositionCard label="Break-even" value={formatCurrency(breakEven)} />
      </div>
    </div>
  );
}
