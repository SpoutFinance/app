"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Settings, Lock, Info } from "lucide-react";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { SvgIcon } from "@/components/ui/svg-icon";

const UsdcIcon = "/svg-assets/circle.svg";
import {
  TransactionalSettingsModal,
  type PriorityFee,
} from "./TransactionalSettingsModal";
import UpArrows from "@/assets/images/uparrows.svg";
import DownArrows from "@/assets/images/downarrows.svg";
import DownArrow from "@/assets/images/downarrow.svg";

interface TradeFormCardProps {
  tradeType: "buy" | "sell";
  setTradeType: (type: "buy" | "sell") => void;
  ticker: string;
  fromAmount: string;
  setFromAmount: (v: string) => void;
  toAmount: string;
  usdcBalance: number;
  tokenBalance: number;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
  conversionRate: string;
  initialMaxSlippage?: number;
}

export function TradeFormCard({
  tradeType,
  setTradeType,
  ticker,
  fromAmount,
  setFromAmount,
  toAmount,
  usdcBalance,
  tokenBalance,
  isLoading,
  isDisabled,
  onSubmit,
  conversionRate,
  initialMaxSlippage = 0.1,
}: TradeFormCardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [maxSlippage, setMaxSlippage] = useState(initialMaxSlippage);
  const [priorityFee, setPriorityFee] = useState<PriorityFee>("fast");

  const handleMaxClick = () => {
    if (tradeType === "buy") {
      setFromAmount(usdcBalance.toFixed(2));
    } else {
      setFromAmount(tokenBalance.toFixed(4));
    }
  };

  const fromLabel = tradeType === "buy" ? "USDC" : ticker;
  const toLabel = tradeType === "buy" ? ticker : "USDC";
  const balance = tradeType === "buy" ? usdcBalance : tokenBalance;

  // Format the button amount (4 decimal places for tokens)
  const buttonAmount = toAmount ? parseFloat(toAmount).toFixed(4) : "0";

  return (
    <div className="bg-white border border-dashboard-border rounded-xl p-5 flex-1">
      {/* Header: Buy/Sell Toggle + Settings */}
      <div className="flex items-center justify-between mb-6">
        {/* Buy/Sell Toggle */}
        <div className="flex items-center border border-dashboard-border rounded-lg overflow-hidden p-1.5">
          <button
            type="button"
            onClick={() => setTradeType("buy")}
            className={`rounded inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
              tradeType === "buy"
                ? "bg-white text-dashboard-text-heading"
                : "bg-dashboard-bg-subtle text-dashboard-text-secondary hover:bg-dashboard-bg-hover"
            }`}
          >
            <span className="inline-flex items-center justify-center">
              <SvgIcon src={UpArrows} size={14} />
            </span>
            <span>BUY</span>
          </button>
          <button
            type="button"
            onClick={() => setTradeType("sell")}
            className={`rounded inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
              tradeType === "sell"
                ? "bg-white text-dashboard-text-heading"
                : "bg-dashboard-bg-subtle text-dashboard-text-secondary hover:bg-dashboard-bg-hover"
            }`}
          >
            <span className="inline-flex items-center justify-center">
              <SvgIcon src={DownArrows} size={14} />
            </span>
            <span>SELL</span>
          </button>
        </div>

        {/* Settings Button */}
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashboard-border rounded-lg text-sm text-dashboard-text-secondary hover:bg-dashboard-bg-hover transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Transactional Settings Modal */}
      <TransactionalSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        maxSlippage={maxSlippage}
        onMaxSlippageChange={setMaxSlippage}
        priorityFee={priorityFee}
        onPriorityFeeChange={setPriorityFee}
      />

      {/* From Section */}
      <div className="mb-2 bg-neutral-50 px-5 py-4 rounded relative">
        <label className="block text-base font-medium text-dashboard-text-heading mb-3">
          From
        </label>
        <div className="flex items-center gap-3 relative">
          {/* Amount Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0"
              className="w-full h-12 px-4 pr-16 text-base font-medium bg-white border border-dashboard-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dashboard-teal/20 focus:border-dashboard-teal"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-dashboard-text-secondary bg-white border border-dashboard-border rounded hover:bg-dashboard-bg-hover transition-colors"
            >
              Max
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-2 h-12 px-4 bg-white border border-dashboard-border rounded-lg min-w-27.5">
            {fromLabel === "USDC" ? (
              <SvgIcon src={UsdcIcon} size={20} alt="USDC" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-dashboard-accent-error flex items-center justify-center text-white text-[10px] font-bold">
                {fromLabel.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-dashboard-text-heading">
              {fromLabel}
            </span>
            <ChevronDown className="h-4 w-4 text-dashboard-text-muted ml-auto" />
          </div>
        </div>

        {/* Balance */}
        <p className="mt-2 text-sm text-dashboard-text-secondary">
          Balance:{" "}
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        {/* Swap Arrow */}
        <div className="flex justify-center my-4 absolute left-[50%] -bottom-9.5">
          <div className="w-9 h-9 rounded-full bg-dashboard-teal flex items-center justify-center shadow-sm">
            {/* <ChevronDown className="h-5 w-5 text-white" strokeWidth={3} /> */}
            <SvgIcon src={DownArrow} className="" width={24} height={24} />
          </div>
        </div>
      </div>

      {/* To Section */}
      <div className="mb-6 bg-neutral-50 px-5 py-4 rounded">
        <label className="block text-base font-medium text-dashboard-text-heading mb-3">
          To
        </label>
        <div className="flex items-center gap-3">
          {/* Amount Input (Read Only) */}
          <div className="flex-1">
            <input
              type="text"
              value={toAmount}
              placeholder="0"
              readOnly
              className="w-full h-12 px-4 text-base font-medium bg-white border border-dashboard-border rounded-lg text-dashboard-text-heading"
            />
          </div>

          {/* Token Selector (Locked) */}
          <div className="flex items-center gap-2 h-12 px-4 bg-neutral-100 border border-dashboard-border rounded-lg min-w-27.5">
            {toLabel === "USDC" ? (
              <SvgIcon src={UsdcIcon} size={20} alt="USDC" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-dashboard-accent-error flex items-center justify-center text-white text-[10px] font-bold">
                {toLabel.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-dashboard-text-heading">
              {toLabel}
            </span>
            <Lock className="h-3.5 w-3.5 text-dashboard-text-muted ml-auto" />
          </div>
        </div>
      </div>

      {/* Conversion Info */}
      <div className="flex flex-col gap-2.5 mb-6 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-dashboard-text-secondary">Conversion Rate</span>
          <span className="text-dashboard-text-heading font-medium">
            {conversionRate}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-dashboard-text-secondary">Max Slippage</span>
            <Info className="h-3.5 w-3.5 text-dashboard-text-muted" />
          </div>
          <span className="text-dashboard-text-heading font-medium">
            {maxSlippage}%
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isDisabled || isLoading}
        className="w-full h-10 bg-dashboard-teal text-white text-base font-semibold rounded-lg hover:bg-dashboard-teal-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner />
            Processing...
          </span>
        ) : (
          `${tradeType === "buy" ? "Buy" : "Sell"} ${buttonAmount} ${toLabel}`
        )}
      </button>
    </div>
  );
}
