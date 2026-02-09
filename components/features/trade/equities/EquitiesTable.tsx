"use client";

import { Loader2, ArrowDownWideNarrow } from "lucide-react";
import { EquityRow } from "./types";
import { AssetIcon } from "./AssetIcon";

interface EquitiesTableProps {
  equities: EquityRow[];
  loading7d: Set<string>;
  loadingYTD: Set<string>;
  onSelectEquity: (ticker: string) => void;
}

// Formatting utilities
const formatPercent = (value: number | null): string => {
  if (value === null) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const getPercentColor = (value: number | null): string => {
  if (value === null) return "text-dashboard-text-secondary";
  return value >= 0
    ? "text-dashboard-accent-success"
    : "text-dashboard-accent-error";
};

const formatPrice = (value: number | null): string => {
  if (value === null) return "—";
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatMarketCap = (value: number | null): string => {
  if (value === null) return "—";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

interface TableHeaderProps {
  label: string;
  showSort?: boolean;
}

function TableHeader({ label, showSort = false }: TableHeaderProps) {
  return (
    <th className="text-left py-4 px-6">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-dashboard-text-heading whitespace-nowrap">
          {label}
        </span>
        {showSort && (
          <ArrowDownWideNarrow className="h-3 w-3 text-dashboard-text-heading" />
        )}
      </div>
    </th>
  );
}

export function EquitiesTable({
  equities,
  loading7d,
  loadingYTD,
  onSelectEquity,
}: EquitiesTableProps) {
  return (
    <div className="bg-white border-2 border-dashboard-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dashboard-border">
            <TableHeader label="Ticker" />
            <TableHeader label="Name" />
            <TableHeader label="Price" showSort />
            <TableHeader label="Market Cap" showSort />
            <TableHeader label="24h Change" showSort />
            <TableHeader label="7d Change" showSort />
            <TableHeader label="YTD Change" showSort />
            <th className="text-left py-4 px-6">
              <span className="text-sm font-medium text-dashboard-text-heading">
                Action
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {equities.map((equity) => (
            <tr
              key={equity.ticker}
              className="border-b border-dashboard-border hover:bg-dashboard-bg-row-hover transition-colors"
            >
              {/* Ticker */}
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <AssetIcon symbol={equity.ticker} />
                  <span className="text-sm font-semibold text-dashboard-text-heading">
                    {equity.ticker}
                  </span>
                </div>
              </td>

              {/* Name */}
              <td className="py-4 px-6">
                <span className="text-sm text-dashboard-text-secondary">
                  {equity.name}
                </span>
              </td>

              {/* Price */}
              <td className="py-4 px-6">
                <span className="text-sm font-medium text-dashboard-text-heading">
                  {formatPrice(equity.price)}
                </span>
              </td>

              {/* Market Cap */}
              <td className="py-4 px-6">
                <span className="text-sm text-dashboard-text-secondary">
                  {formatMarketCap(equity.marketCap)}
                </span>
              </td>

              {/* 24h Change */}
              <td className="py-4 px-6">
                <span
                  className={`text-sm font-medium ${getPercentColor(equity.change24h)}`}
                >
                  {formatPercent(equity.change24h)}
                </span>
              </td>

              {/* 7d Change */}
              <td className="py-4 px-6">
                {loading7d.has(equity.ticker) ? (
                  <Loader2 className="h-4 w-4 animate-spin text-dashboard-text-muted" />
                ) : (
                  <span
                    className={`text-sm font-medium ${getPercentColor(equity.change7d)}`}
                  >
                    {formatPercent(equity.change7d)}
                  </span>
                )}
              </td>

              {/* YTD Change */}
              <td className="py-4 px-6">
                {loadingYTD.has(equity.ticker) ? (
                  <Loader2 className="h-4 w-4 animate-spin text-dashboard-text-muted" />
                ) : (
                  <span
                    className={`text-sm font-medium ${getPercentColor(equity.changeYTD)}`}
                  >
                    {formatPercent(equity.changeYTD)}
                  </span>
                )}
              </td>

              {/* Action */}
              <td className="py-4 px-6">
                <button
                  type="button"
                  onClick={() => onSelectEquity(equity.ticker)}
                  className="px-4 py-2 bg-dashboard-teal text-white text-sm font-medium rounded-md hover:bg-dashboard-teal-hover transition-colors cursor-pointer"
                >
                  Trade
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
