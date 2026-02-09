"use client";

import { X, Unlock } from "lucide-react";

interface ConfirmDepositDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /**
   * TODO: Replace with live data from your lending protocol
   * These values should come from the selected lockup period and user input
   */
  amount: number;
  stablecoin?: string;
  apyPercent: number;
  lockupTitle: string;
  lockupSubtitle: string;
  isLoading?: boolean;
}

export function ConfirmDepositDrawer({
  isOpen,
  onClose,
  onConfirm,
  amount,
  stablecoin = "USDC",
  apyPercent,
  lockupTitle,
  lockupSubtitle,
  isLoading = false,
}: ConfirmDepositDrawerProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close drawer"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[420px] bg-dashboard-bg border-l-2 border-dashboard-border z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-[18px] py-3">
          <h2 className="text-[22px] font-medium leading-6 text-dashboard-text-primary tracking-[-0.65px] font-figtree">
            Confirm Deposit
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-[42px] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-[30px] text-dashboard-text-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-[18px] overflow-y-auto">
          {/* Selected Lockup Period */}
          <div className="bg-dashboard-bg-selected border-[1.5px] border-dashboard-accent-blue-light rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="bg-dashboard-accent-blue-bg rounded-[4.8px] size-6 flex items-center justify-center">
                <Unlock className="size-[17px] text-dashboard-accent-blue" />
              </div>
              <span className="text-[22px] font-semibold leading-[23px] text-dashboard-text-primary tracking-[-0.17px] font-figtree">
                {lockupTitle}
              </span>
            </div>
            <p className="text-sm font-medium leading-[14px] text-dashboard-text-secondary font-figtree">
              {lockupSubtitle}
            </p>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xl font-medium leading-6 text-dashboard-text-primary tracking-[-0.19px]">
              Summary
            </h3>
            <div className="bg-dashboard-bg-summary border border-dashboard-border rounded-lg p-3">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between py-2.5 px-2.5">
                  <span className="text-base font-normal leading-5 text-dashboard-text-label tracking-[-0.48px]">
                    Amount
                  </span>
                  <span className="text-base font-medium leading-5 text-dashboard-text-subtle tracking-[-0.48px]">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-normal leading-5 text-dashboard-text-label tracking-[-0.48px]">
                    Stablecoin
                  </span>
                  <span className="text-base font-medium leading-5 text-dashboard-text-subtle tracking-[-0.48px]">
                    {stablecoin}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-normal leading-5 text-dashboard-text-label tracking-[-0.48px]">
                    APY
                  </span>
                  <span className="text-base font-medium leading-5 text-dashboard-text-subtle tracking-[-0.48px]">
                    {apyPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-[18px] pb-6 pt-4">
          {/* Warning Note */}
          <div className="bg-dashboard-accent-warning-bg border border-dashboard-accent-warning-border rounded-md px-3 py-3 mb-4">
            <p className="text-xs font-medium leading-4 text-dashboard-text-dark">
              Deposits are irreversible once confirmed on-chain.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-[49px] bg-white border border-dashboard-accent-blue-light rounded-xl text-[17.5px] font-semibold text-dashboard-accent-blue hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-[49px] bg-dashboard-teal border border-dashboard-teal-dark rounded-xl text-[17.5px] font-semibold text-white hover:bg-dashboard-teal-hover transition-colors disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Deposit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
