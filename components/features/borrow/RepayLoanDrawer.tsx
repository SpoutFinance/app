"use client";

import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { SvgIcon } from "@/components/ui/svg-icon";
import FullRepayIcon from "@/assets/images/full_repayment.svg";
import PartialRepayIcon from "@/assets/images/partial_repayment.svg";

interface ActiveLoan {
  id: string;
  assetSymbol: string;
  assetName: string;
  collateral: number;
  borrowed: number;
  apr: number;
  interestAccrued: number;
  healthFactor: number;
}

interface RepayLoanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loan: ActiveLoan | null;
  onRepay: (loanId: string, amount: number, isFullRepay: boolean) => void;
  isLoading?: boolean;
}

export function RepayLoanDrawer({
  isOpen,
  onClose,
  loan,
  onRepay,
  isLoading = false,
}: RepayLoanDrawerProps) {
  const [isFullRepay, setIsFullRepay] = useState(true);
  const [partialAmount, setPartialAmount] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Reset state and lock body scroll when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsFullRepay(true);
      setPartialAmount("");
      setIsClosing(false);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (!isOpen || !loan) return null;

  const parsedPartialAmount = parseFloat(partialAmount) || 0;
  const repayAmount = isFullRepay ? loan.borrowed : parsedPartialAmount;
  const remainingDebt = isFullRepay
    ? 0
    : Math.max(loan.borrowed - parsedPartialAmount, 0);
  const isOverDebt = !isFullRepay && parsedPartialAmount > loan.borrowed;
  const canRepay = isFullRepay || (parsedPartialAmount > 0 && !isOverDebt);

  /**
   * TODO: Replace with live network/fee data from your provider
   * Example: const { data: networkFee } = useNetworkFee();
   */
  const estimatedFee = 0.5; // Mock fee
  const network = "Ethereum"; // Mock network
  const executionType = "Instant"; // Mock execution type

  const handleRepay = () => {
    if (canRepay && loan) {
      onRepay(loan.id, repayAmount, isFullRepay);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-black/50 z-40 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
        onKeyDown={(e) => e.key === "Escape" && handleClose()}
        role="button"
        tabIndex={0}
        aria-label="Close drawer"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-xl z-50 flex flex-col ${
          isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-3 px-5">
          <h2 className="text-xl font-semibold text-dashboard-text-primary">
            Repay Loan
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-dashboard-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-6 bg">
            {/* Full/Partial Repay Toggle */}
            <div className="flex p-1 border rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setIsFullRepay(true)}
                className={`cursor-pointer w-32 h-9 flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${
                  isFullRepay
                    ? "bg-dashboard-bg-toggle text-dashboard-text-primary"
                    : "text-dashboard-text-secondary hover:text-dashboard-text-primary"
                }`}
              >
                <SvgIcon src={FullRepayIcon} className="w-4 h-4" />
                Full Repay
              </button>
              <button
                type="button"
                onClick={() => setIsFullRepay(false)}
                className={`cursor-pointer w-32 h-9 flex-1 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors ${
                  !isFullRepay
                    ? "bg-dashboard-bg-toggle text-dashboard-text-primary"
                    : "text-dashboard-text-secondary hover:text-dashboard-text-primary"
                }`}
              >
                <SvgIcon src={PartialRepayIcon} className="w-4 h-4" />
                Partial Repay
              </button>
            </div>

            {/* Partial Repay Amount Input */}
            {!isFullRepay && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-dashboard-text-placeholder">
                  Enter amount to repay
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-14 px-4 pr-20 text-xl font-medium text-dashboard-text-secondary bg-white border border-dashboard-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dashboard-teal/20 focus:border-dashboard-teal"
                  />
                  <button
                    type="button"
                    onClick={() => setPartialAmount(loan.borrowed.toFixed(2))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-dashboard-accent-blue bg-white border border-dashboard-accent-blue-light rounded-lg hover:bg-dashboard-accent-blue-hover transition-colors font-semibold"
                  >
                    Max
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dashboard-text-subtle">
                    Total debt: {formatCurrency(loan.borrowed)}
                  </span>
                  {isOverDebt && (
                    <span className="text-sm text-dashboard-accent-error">
                      Exceeds total debt
                    </span>
                  )}
                </div>
                <div className="text-sm text-dashboard-text-subtle">
                  Remaining debt: {formatCurrency(remainingDebt)}
                </div>
              </div>
            )}

            {/* Repayment Summary */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-medium text-dashboard-text-primary">
                Repayment Summary
              </h3>
              <div className="bg-dashboard-bg-summary border border-dashboard-border rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dashboard-text-secondary">
                    Amount
                  </span>
                  <span className="text-sm font-medium text-dashboard-text-primary">
                    {formatCurrency(repayAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dashboard-text-secondary">
                    Collateral
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {loan.assetSymbol[0]}
                    </div>
                    <span className="text-sm font-medium text-dashboard-text-primary">
                      {loan.assetSymbol}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dashboard-text-secondary">
                    Repayment Type
                  </span>
                  <span className="text-sm font-medium text-dashboard-text-primary">
                    {isFullRepay ? "Full Repayment" : "Partial Repayment"}
                  </span>
                </div>
              </div>
            </div>

            {/* Network & Execution */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-medium text-dashboard-text-primary">
                Network & Execution
              </h3>
              <div className="bg-dashboard-bg-summary border border-dashboard-border rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dashboard-text-secondary">
                    Network
                  </span>
                  <span className="text-sm font-medium text-dashboard-text-primary">
                    {network}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dashboard-text-secondary">
                    Est. Fee
                  </span>
                  <span className="text-sm font-medium text-dashboard-text-primary">
                    {formatCurrency(estimatedFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dashboard-text-secondary">
                    Execution
                  </span>
                  <span className="text-sm font-medium text-dashboard-text-primary">
                    {executionType}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning Note */}
          </div>
          <div className="bg-dashboard-accent-warning-bg border border-dashboard-accent-warning-border rounded-lg px-3 py-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-dashboard-accent-warning-dark shrink-0 mt-0.5" />
            <span className="text-xs text-dashboard-text-dark">
              Repayments are irreversible once confirmed on-chain.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dashboard-border flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 h-12 bg-white border border-dashboard-accent-blue-light text-dashboard-accent-blue text-base font-semibold rounded-xl hover:bg-dashboard-accent-blue-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRepay}
            disabled={!canRepay || isLoading}
            className="flex-1 h-12 bg-dashboard-teal border border-dashboard-teal-dark text-white text-base font-semibold rounded-xl hover:bg-dashboard-teal-hover transition-colors disabled:bg-dashboard-accent-disabled disabled:border-dashboard-accent-disabled disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : `Repay ${formatCurrency(repayAmount)}`}
          </button>
        </div>
      </div>
    </>
  );
}
