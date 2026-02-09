"use client";

import { useState } from "react";
import { Lock, ChevronDown, Info } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { SvgIcon } from "@/components/ui/svg-icon";

const UsdcIcon = "/svg-assets/circle.svg";
import LockIcon from "@/assets/images/lock_2.svg";

interface LockupPeriodCardProps {
  title: string;
  subtitle: string;
  apyPercent: number;
  liquidityInPool: number;
  userBalance: number;
  onDeposit: (amount: number) => void;
  isLoading?: boolean;
}

export function LockupPeriodCard({
  title,
  subtitle,
  apyPercent,
  liquidityInPool,
  userBalance,
  onDeposit,
  isLoading = false,
}: LockupPeriodCardProps) {
  const [amount, setAmount] = useState("");

  const parsedAmount = parseFloat(amount) || 0;
  const estimatedEarnings =
    parsedAmount > 0 ? parsedAmount * (apyPercent / 100) : null;

  const handleMaxClick = () => {
    setAmount(userBalance.toFixed(2));
  };

  const handleDeposit = () => {
    if (parsedAmount > 0) {
      onDeposit(parsedAmount);
    }
  };

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const hasAmount = parsedAmount > 0;

  return (
    <div className="bg-white border border-dashboard-border rounded-xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md p-[3.6px] bg-indigo-50 ">
            <SvgIcon src={LockIcon} />
          </div>
          <span className="text-lg font-semibold text-dashboard-text-heading">
            {title}
          </span>
        </div>
        <StatusBadge
          value={`${apyPercent}% APY`}
          className="text-sm px-2.5 py-1 rounded-md"
        />
      </div>

      {/* Subtitle */}
      <p className="text-sm text-dashboard-text-muted mb-4">{subtitle}</p>

      {/* Enter Amount */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-dashboard-text-secondary mb-2">
          Enter Amount
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-11 px-4 pr-16 text-base font-medium bg-white border border-dashboard-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dashboard-teal/20 focus:border-dashboard-teal"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-3 text-slate-600 top-1/2 -translate-y-1/2 px-2.5 py-0.5 text-xs font-medium text-dashboard-text-secondary bg-dashboard-bg-subtle border border-indigo-300 rounded hover:bg-dashboard-bg-hover transition-colors"
            >
              Max
            </button>
          </div>
          <div className="flex items-center gap-1.5 h-11 px-3 bg-white border border-dashboard-border rounded-lg">
            <SvgIcon src={UsdcIcon} size={20} alt="USDC" />
            <span className="text-sm font-medium text-dashboard-text-heading">
              USDC
            </span>
            <ChevronDown className="w-4 h-4 text-dashboard-text-muted" />
          </div>
        </div>
      </div>

      {/* Balance */}
      <p className="text-sm text-dashboard-text-muted mb-4">
        Balance: {formatCurrency(userBalance)}
      </p>

      {/* Stats */}
      <div className="flex flex-col gap-2 mb-4 py-3 px-4 rounded-lg bg-neutral-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-dashboard-text-muted">
            Liquidity in Pool
          </span>
          <span className="text-sm font-medium text-dashboard-text-heading">
            {formatCurrency(liquidityInPool)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm text-dashboard-text-muted">
              Estimated Annual Earnings
            </span>
            <Info className="w-3.5 h-3.5 text-dashboard-text-muted" />
          </div>
          <span className="text-sm font-semibold text-dashboard-teal">
            {estimatedEarnings !== null
              ? formatCurrency(estimatedEarnings)
              : "--"}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleDeposit}
        disabled={!hasAmount || isLoading}
        className={`w-full h-10 text-base font-semibold rounded-lg transition-colors ${
          hasAmount
            ? "bg-dashboard-teal text-white hover:bg-dashboard-teal-hover"
            : "bg-stone-300 text-white/80 cursor-not-allowed"
        }`}
      >
        {isLoading
          ? "Processing..."
          : hasAmount
            ? `Deposit ${formatCurrency(parsedAmount)} USDC`
            : "Enter Amount"}
      </button>
    </div>
  );
}
