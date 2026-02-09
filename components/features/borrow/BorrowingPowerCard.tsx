"use client";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import Wallet from "@/assets/images/safe.svg";
import ArrowDownLeft from "@/assets/images/dollar_incoming.svg";
import Clock from "@/assets/images/exposed.svg";
import { SvgIcon } from "@/components/ui/svg-icon";

interface BorrowingPowerCardProps {
  safeLimit: number;
  used: number;
  overexposedBy: number;
}

export function BorrowingPowerCard({
  safeLimit,
  used,
  overexposedBy,
}: BorrowingPowerCardProps) {
  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const usagePercent = Math.min((used / safeLimit) * 100, 100);
  const isOverexposed = overexposedBy > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xl font-semibold text-dashboard-text-primary tracking-[-0.6px]">
          Borrowing Power
        </h3>
        <InfoTooltip
          info="Your maximum borrowing capacity based on collateral value and LTV ratios"
          size={18}
        />
      </div>

      <div className="bg-white border border-dashboard-border rounded-lg p-5">
        <div className="flex flex-col gap-5">
          {/* Stats */}
          <div className="flex flex-col gap-5">
            {/* Safe limit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <SvgIcon src={Wallet} className="w-4 h-4" />
                <span className="text-base font-normal text-dashboard-text-label tracking-[-0.48px]">
                  Safe limit
                </span>
              </div>
              <span className="text-base font-medium text-dashboard-text-secondary tracking-[-0.48px]">
                {formatCurrency(safeLimit)}
              </span>
            </div>

            {/* Used */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <SvgIcon src={ArrowDownLeft} className="w-4 h-4" />
                <span className="text-base font-normal text-dashboard-text-label tracking-[-0.48px]">
                  Used
                </span>
              </div>
              <span className="text-base font-medium text-dashboard-text-secondary tracking-[-0.48px]">
                {formatCurrency(used)}
              </span>
            </div>

            {/* Overexposed by */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <SvgIcon src={Clock} className="w-4 h-4" />
                <span className="text-base font-normal text-dashboard-text-label tracking-[-0.48px]">
                  Overexposed by
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-dashboard-text-secondary tracking-[-0.48px]">
                  {formatCurrency(overexposedBy)}
                </span>
                {isOverexposed && (
                  <span className="text-xs font-semibold text-dashboard-accent-error-dark bg-dashboard-accent-error-bg px-2 py-0.5 rounded">
                    High risk
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[9px] bg-dashboard-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isOverexposed
                  ? "bg-dashboard-accent-error"
                  : "bg-dashboard-teal"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
