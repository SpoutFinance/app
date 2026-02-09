"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getAppRoute } from "@/lib/utils";
import { AssetIcon } from "../equities/AssetIcon";
import { SvgIcon } from "@/components/ui/svg-icon";
import CoinGraphicsIcon from "@/assets/images/coin-graphics.svg";

interface TradePageHeaderProps {
  ticker: string;
  name: string;
  price: number | null;
  priceChangePercent: number;
  refreshing: boolean;
  onRefresh: () => void;
}

export function TradePageHeader({
  ticker,
  name,
  price,
  priceChangePercent,
  refreshing,
  onRefresh,
}: TradePageHeaderProps) {
  const isPositive = priceChangePercent >= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Row: Back link and Refresh */}
      <div className="flex items-center justify-between">
        <Link
          href={getAppRoute("/app/trade/equities")}
          className="flex items-center gap-2 text-dashboard-text-secondary hover:text-dashboard-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to markets</span>
        </Link>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-dashboard-border rounded-lg bg-white hover:bg-dashboard-bg-hover transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 text-dashboard-text-secondary ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          <span className="text-sm font-medium text-dashboard-text-heading">
            Refresh
          </span>
        </button>
      </div>

      {/* Asset Info Card */}
      <div className="relative bg-white border border-dashboard-border rounded-lg px-6 py-5 overflow-hidden">
        {/* Decorative graphics on the right */}
        <div className="absolute right-0 top-0 -bottom-6 flex items-center">
          <SvgIcon src={CoinGraphicsIcon} width={144} height={87} alt="" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-2">
          {/* Ticker and Name Row */}
          <div className="flex items-center gap-3">
            <AssetIcon symbol={ticker} size="md" />
            <span className="text-lg font-semibold text-dashboard-text-heading">
              {ticker}
            </span>
            <span className="text-sm text-dashboard-text-secondary">
              {name}
            </span>
          </div>

          {/* Price and Change Row */}
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-semibold text-dashboard-teal leading-tight">
              {price !== null
                ? `$${price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "—"}
            </span>
            <span
              className={`text-sm font-medium px-2.5 py-1 rounded-md ${
                isPositive
                  ? "text-dashboard-accent-success bg-dashboard-accent-success/10"
                  : "text-dashboard-accent-error bg-dashboard-accent-error/10"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
