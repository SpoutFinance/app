"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import SlippageIcon from "@/assets/images/up_down.svg";
import PriorityFeeIcon from "@/assets/images/electric_bars.svg";
import { SvgIcon } from "@/components/ui/svg-icon";

const SLIPPAGE_OPTIONS = ["0.1", "0.5", "1", "2"] as const;

type PriorityFee = "fast" | "turbo" | "ultra";

interface PriorityFeeOption {
  id: PriorityFee;
  label: string;
  value: string;
  disabled?: boolean;
}

const PRIORITY_FEE_OPTIONS: PriorityFeeOption[] = [
  { id: "fast", label: "Fast", value: "0.0001 SOL" },
  { id: "turbo", label: "Turbo", value: "0.001 SOL" },
  { id: "ultra", label: "Ultra", value: "0.005 SOL", disabled: true },
];

interface TransactionalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxSlippage: number;
  onMaxSlippageChange: (value: number) => void;
  priorityFee: PriorityFee;
  onPriorityFeeChange: (value: PriorityFee) => void;
}

export function TransactionalSettingsModal({
  isOpen,
  onClose,
  maxSlippage,
  onMaxSlippageChange,
  priorityFee,
  onPriorityFeeChange,
}: TransactionalSettingsModalProps) {
  const [localSlippage, setLocalSlippage] = useState<string>(
    maxSlippage.toString(),
  );
  const [localPriorityFee, setLocalPriorityFee] =
    useState<PriorityFee>(priorityFee);
  const [isCustomSlippage, setIsCustomSlippage] = useState(false);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      const slippageStr = maxSlippage.toString();
      setLocalSlippage(slippageStr);
      setLocalPriorityFee(priorityFee);
      setIsCustomSlippage(
        !SLIPPAGE_OPTIONS.includes(
          slippageStr as (typeof SLIPPAGE_OPTIONS)[number],
        ),
      );
    }
  }, [isOpen, maxSlippage, priorityFee]);

  if (!isOpen) return null;

  const handleSlippageSelect = (value: string) => {
    setLocalSlippage(value);
    setIsCustomSlippage(false);
  };

  const handleCustomSlippage = () => {
    setIsCustomSlippage(true);
  };

  const handleCustomSlippageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setLocalSlippage(value);
    }
  };

  const handleApply = () => {
    const slippageValue = parseFloat(localSlippage) || 0.1;
    onMaxSlippageChange(slippageValue);
    onPriorityFeeChange(localPriorityFee);
    onClose();
  };

  const handleClear = () => {
    setLocalSlippage("0.1");
    setLocalPriorityFee("fast");
    setIsCustomSlippage(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-119.75 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dashboard-border">
          <h2 className="text-xl font-semibold text-dashboard-text-heading">
            Transactional Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded bg-dashboard-bg-subtle hover:bg-dashboard-bg-hover transition-colors"
            aria-label="Close settings"
          >
            <X className="h-4 w-4 text-dashboard-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Max Slippage Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SvgIcon src={SlippageIcon} size={12} alt="Slippage" />
              <span className="text-xl font-medium text-dashboard-text-heading tracking-tight">
                Max Slippage
              </span>
              <InfoTooltip
                info="Your transaction will revert if price changes unfavorably by more than this percentage"
                size={18}
              />
            </div>

            <div className="flex items-center gap-3">
              {SLIPPAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSlippageSelect(option)}
                  className={`h-9 w-17 rounded-md text-lg font-medium transition-colors ${
                    localSlippage === option && !isCustomSlippage
                      ? "bg-dashboard-accent-blue-bg border border-dashboard-accent-blue-light text-dashboard-accent-blue"
                      : "bg-white border border-dashboard-border text-dashboard-accent-blue hover:bg-dashboard-bg-hover"
                  }`}
                >
                  {option}%
                </button>
              ))}
              {isCustomSlippage ? (
                <div className="relative">
                  <input
                    type="text"
                    value={localSlippage}
                    onChange={handleCustomSlippageChange}
                    className="h-9 w-20 px-3 rounded-md text-lg font-medium bg-dashboard-accent-blue-bg border border-dashboard-accent-blue-light text-dashboard-accent-blue focus:outline-none"
                    autoFocus
                    aria-label="Custom slippage percentage"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dashboard-accent-blue">
                    %
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCustomSlippage}
                  className="h-9 px-5 rounded-md text-lg font-medium bg-white border border-dashboard-border text-dashboard-accent-blue hover:bg-dashboard-bg-hover transition-colors"
                >
                  Custom
                </button>
              )}
            </div>

            <p className="text-sm text-dashboard-text-muted leading-5">
              Your transaction will revert if price changes unfavorably by more
              than this percentage
            </p>
          </div>

          {/* Priority Fee Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <SvgIcon src={PriorityFeeIcon} size={28} alt="Priority Fee" />
              <span className="text-xl font-medium text-dashboard-text-heading tracking-tight">
                Priority Fee
              </span>
            </div>

            <div className="space-y-3">
              {PRIORITY_FEE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    !option.disabled && setLocalPriorityFee(option.id)
                  }
                  disabled={option.disabled}
                  className={`w-full h-11 px-3 rounded-md flex items-center justify-between transition-colors ${
                    option.disabled
                      ? "bg-dashboard-bg-disabled border-[1.4px] border-dashboard-border cursor-not-allowed"
                      : localPriorityFee === option.id
                        ? "bg-dashboard-accent-blue-highlight border-[1.4px] border-dashboard-accent-blue-light"
                        : "bg-white border-[1.4px] border-dashboard-border hover:bg-dashboard-bg-hover"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <RadioIndicator
                      selected={localPriorityFee === option.id}
                      disabled={option.disabled}
                    />
                    <span className="text-lg font-medium text-dashboard-text-heading tracking-tight">
                      {option.label}
                    </span>
                    {option.disabled && (
                      <span className="px-2 py-1 text-[10px] font-semibold text-dashboard-text-muted bg-dashboard-bg-light-subtle rounded-md">
                        Not Available
                      </span>
                    )}
                  </div>
                  <span className="text-base text-dashboard-text-muted">
                    {option.value}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-sm text-dashboard-text-muted leading-5">
              Higher priority fees help your transaction land faster during
              network congestion
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-dashboard-border">
          <button
            type="button"
            onClick={handleClear}
            className="h-9 px-4 rounded-xl text-sm font-semibold bg-white border border-dashboard-accent-blue-light text-dashboard-accent-blue hover:bg-dashboard-bg-hover transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-9 px-4 rounded-xl text-sm font-semibold bg-dashboard-teal border border-dashboard-teal-dark text-white hover:bg-dashboard-teal-hover transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function RadioIndicator({
  selected,
  disabled,
}: {
  selected: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        disabled
          ? "bg-dashboard-bg-subtle border-dashboard-border"
          : selected
            ? "border-dashboard-teal"
            : "border-dashboard-border"
      }`}
    >
      {selected && !disabled && (
        <div className="w-2.5 h-2.5 rounded-full bg-dashboard-teal" />
      )}
    </div>
  );
}

export type { PriorityFee };
