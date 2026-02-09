"use client";

import { Check } from "lucide-react";
import Filter from "@/assets/images/filters.svg";
import { SvgIcon } from "@/components/ui/svg-icon";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface Collateral {
  id: string;
  symbol: string;
  name: string;
  logoUrl?: string;
  ltvPercent: number;
  shares: number;
  value: number;
  maxBorrow: number;
}

interface CollateralSelectorProps {
  collaterals: Collateral[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onFilterClick?: () => void;
}

export function CollateralSelector({
  collaterals,
  selectedIds,
  onSelectionChange,
  onFilterClick,
}: CollateralSelectorProps) {
  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const selectedCollaterals = collaterals.filter((c) =>
    selectedIds.includes(c.id),
  );
  const totalCollateralValue = selectedCollaterals.reduce(
    (sum, c) => sum + c.value,
    0,
  );
  const totalBorrowingPower = selectedCollaterals.reduce(
    (sum, c) => sum + c.maxBorrow,
    0,
  );

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold text-dashboard-text-primary tracking-[-0.6px]">
            Select Collateral
          </h3>
          <p className="text-base text-dashboard-text-secondary">
            Choose which equities to use as collateral
          </p>
        </div>
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-dashboard-border rounded-lg hover:bg-dashboard-bg-hover transition-colors"
        >
          <SvgIcon src={Filter} className="w-5 h-5" />
          <span className="text-sm font-medium text-dashboard-text-primary">Filters</span>
        </button>
      </div>

      {/* Collateral Box */}
      <div className="flex flex-col gap-5 bg-white py-5 px-7 border border-dashboard-border rounded-lg overflow-hidden">
        {/* Summary */}
        <div className="p-4 bg-neutral-50 border-dashboard-border rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dashboard-text-label">
                Selected Collateral Value
              </span>
              <span className="text-sm font-medium text-dashboard-text-primary">
                {formatCurrency(totalCollateralValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dashboard-text-label">
                Total Borrowing Power
              </span>
              <span className="text-sm font-medium text-dashboard-text-primary">
                {formatCurrency(totalBorrowingPower)}
              </span>
            </div>
          </div>
        </div>

        {/* Collateral List */}
        <div className="max-h-125 overflow-y-auto flex flex-col gap-5"
        
        >
          {collaterals.map((collateral) => {
            const isSelected = selectedIds.includes(collateral.id);
            return (
              <div
                key={collateral.id}
                className={`p-4 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-dashboard-bg-selected border-[1.5px] border-dashboard-accent-blue-light"
                    : "border border-dashboard-border hover:bg-dashboard-bg-hover"
                }`}
                onClick={() => toggleSelection(collateral.id)}
                onKeyDown={(e) =>
                  e.key === "Enter" && toggleSelection(collateral.id)
                }
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-5">
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-sm flex items-center justify-center ${
                      isSelected
                        ? "bg-dashboard-teal"
                        : "border-2 border-dashboard-border-checkbox bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-5">
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {/* Logo placeholder */}
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                            {collateral.symbol[0]}
                          </div>
                          <span className="text-2xl font-semibold text-dashboard-text-secondary leading-5">
                            {collateral.symbol}
                          </span>
                        </div>
                        {/* Company name */}
                        <p className="text-sm font-normal text-dashboard-text-muted tracking-[-0.24px] text-right">
                          {collateral.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-dashboard-text-secondary bg-dashboard-border-modal px-2.5 py-1 rounded-md">
                          LTV {collateral.ltvPercent}%
                        </span>
                        <InfoTooltip
                          info="Loan-to-Value ratio determines the maximum you can borrow against this collateral"
                          size={16}
                        />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-7 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-dashboard-text-secondary">Shares</span>
                        <span className="w-1 h-1 rounded-full bg-dashboard-text-secondary" />
                        <span className="font-semibold text-dashboard-text-secondary">
                          {collateral.shares}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-dashboard-text-secondary">Value</span>
                        <span className="w-1 h-1 rounded-full bg-dashboard-text-secondary" />
                        <span className="font-semibold text-dashboard-text-secondary">
                          {formatCurrency(collateral.value)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-dashboard-text-secondary">
                          Max Borrow
                        </span>
                        <span className="w-1 h-1 rounded-full bg-dashboard-text-secondary" />
                        <span className="font-semibold text-dashboard-accent-success">
                          {formatCurrency(collateral.maxBorrow)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
