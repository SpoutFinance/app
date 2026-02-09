"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface BorrowUSDCFormProps {
  availableAmount: number;
  apr: number;
  currentHealthFactor: number;
  onBorrow: (amount: number) => void;
  isLoading?: boolean;
}

export function BorrowUSDCForm({
  availableAmount,
  apr,
  currentHealthFactor,
  onBorrow,
  isLoading = false,
}: BorrowUSDCFormProps) {
  const [amount, setAmount] = useState("");

  const parsedAmount = parseFloat(amount) || 0;
  const annualInterest = parsedAmount * (apr / 100);
  const isOverLimit = availableAmount < 0 || parsedAmount > availableAmount;

  // Estimate updated health factor (simplified calculation)
  const updatedHealthFactor =
    parsedAmount > 0 && availableAmount > 0
      ? Math.max(
          currentHealthFactor - (parsedAmount / availableAmount) * 0.5,
          0
        )
      : currentHealthFactor;

  const formatCurrency = (val: number) =>
    `$${Math.abs(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleMaxClick = () => {
    if (availableAmount > 0) {
      setAmount(availableAmount.toFixed(2));
    }
  };

  const handleBorrow = () => {
    if (parsedAmount > 0 && !isOverLimit) {
      onBorrow(parsedAmount);
    }
  };

  // Health factor color
  const getHealthFactorColor = (hf: number) => {
    if (hf >= 1.5) return "text-[#078842]";
    if (hf >= 1.2) return "text-[#baac4d]";
    return "text-[#e23434]";
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-medium leading-[35px] text-[#171717] tracking-[-0.72px]">
          Borrow USDC
        </h3>
        <p className="text-base font-normal text-[#666] tracking-[-0.2px]">
          Borrow against your selected collateral
        </p>
      </div>

      {/* Form Box */}
      <div className="bg-white h-full border border-[#e6e6e6] rounded-xl p-6 flex flex-col gap-6">
        {/* USDC Token Card */}
        <div className="bg-[#fdfdfd] border-[1.2px] border-[#e2e2e2] rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* USDC Logo */}
            <div className="w-6 h-6 rounded-full bg-[#2775ca] flex items-center justify-center">
              <span className="text-white text-xs font-bold">$</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-semibold text-[#666] leading-5">
                USDC
              </span>
              <span className="text-sm font-normal text-[#929292] tracking-[-0.24px]">
                USD Coin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              value={`${apr}% APR`}
              variant={isOverLimit ? "error" : "success"}
              className="text-base px-3 py-1.5 rounded-md"
            />
            <Info className="w-[18px] h-[18px] text-[#666]" />
          </div>
        </div>

        {/* Amount Input Section */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium text-[#898989] tracking-[-0.2px]">
            Enter amount to borrow
          </label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-14 px-3 pr-24 text-2xl font-medium text-[#666] bg-white border-[1.2px] border-[#e2e2e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#004a4a]/20 focus:border-[#004a4a] tracking-[-0.2px]"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="w-19.5 absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-md text-[#3d5678] bg-white border border-indigo-300 rounded-xl hover:bg-[#f0f7ff] transition-colors font-semibold"
            >
              Max
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-[#828282] tracking-[-0.48px]">
              Available:{" "}
              <span className={availableAmount < 0 ? "text-[#e23434]" : ""}>
                {availableAmount < 0 ? "-" : ""}
                {formatCurrency(availableAmount)}
              </span>
            </span>
            {isOverLimit && (
              <span className="text-base font-normal text-[#e23434] tracking-[-0.48px]">
                Over borrow limit
              </span>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-[#fbfbfb] rounded-lg px-5 py-4 flex flex-col gap-2.5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-normal text-[#666] tracking-[-0.42px]">
                Borrow amount
              </span>
              <span className="text-base font-medium text-[#666] tracking-[-0.48px]">
                {formatCurrency(parsedAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-normal text-[#666] tracking-[-0.42px]">
                APR
              </span>
              <span className="text-base font-medium text-[#666] tracking-[-0.48px]">
                {apr}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-normal text-[#666] tracking-[-0.42px]">
                Annual Interest
              </span>
              <span className="text-base font-medium text-[#666] tracking-[-0.48px]">
                {formatCurrency(annualInterest)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e6e6e6]" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-normal text-[#666] tracking-[-0.42px]">
              Updated Health Factor
            </span>
            <span
              className={`text-base font-semibold tracking-[-0.48px] ${getHealthFactorColor(
                updatedHealthFactor
              )}`}
            >
              {updatedHealthFactor.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Warning Note */}
        <div className="bg-[#fffaed] rounded-md px-3 py-3 flex items-center gap-1">
          <Info className="w-3 h-3 text-[#9F6B00] shrink-0" />
          <span className="text-xs font-medium text-[#444]">
            Maintain health factor above{" "}
            <span className="font-semibold">1.5</span> to avoid liquidation
          </span>
        </div>

        {/* Borrow Button */}
        <button
          type="button"
          onClick={handleBorrow}
          disabled={!parsedAmount || isOverLimit || isLoading}
          className="w-full h-14 bg-[#004a4a] border border-[#002828] text-white text-xl font-semibold rounded-xl hover:bg-[#003838] transition-colors disabled:bg-[#ccc] disabled:border-[#ccc] disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Borrow USDC"}
        </button>
      </div>
    </div>
  );
}
