"use client";

import { Eye, EyeOff, Calendar, ChevronDown, TrendingUp, Percent, Check } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useState, useRef, useEffect } from "react";

// Reusable Dropdown Component
type DropdownOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

function Dropdown({
  options,
  value,
  onChange,
  trigger,
  align = "right",
}: {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  trigger: React.ReactNode;
  align?: "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute top-full mt-1 ${align === "right" ? "right-0" : "left-0"} z-50 min-w-[140px] bg-white border border-dashboard-border rounded-[6px] shadow-lg py-1 animate-in fade-in-0 zoom-in-95`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-figtree hover:bg-dashboard-bg-hover transition-colors ${
                value === option.value
                  ? "text-dashboard-teal bg-dashboard-bg-light"
                  : "text-dashboard-text-primary"
              }`}
            >
              {option.icon && <span className="w-4 h-4">{option.icon}</span>}
              <span className="flex-1 text-left">{option.label}</span>
              {value === option.value && (
                <Check className="h-4 w-4 text-dashboard-teal" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type PortfolioSummaryCardsProps = {
  portfolioValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  holdings: any[];
  // Additional props for the new design
  yieldDeposits?: number;
  yieldAPY?: number;
  lockedDays?: number;
  activePNL?: number;
  activePNLPercent?: number;
  passiveYield?: number;
  passiveYieldPercent?: number;
};

// Format helpers
const formatCurrency = (num: number) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatPercent = (num: number) => {
  return num.toFixed(2);
};


// Total Net Worth Card
function TotalNetWorthCard({
  portfolioValue,
  dayChangePercent,
  previousMonthChange,
}: {
  portfolioValue: number;
  dayChangePercent: number;
  previousMonthChange: number;
}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-[10px]">
        <h3 className="text-2xl font-medium text-dashboard-text-primary font-figtree tracking-[-0.72px] leading-[35px]">
          Total Net Worth
        </h3>
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-dashboard-text-secondary hover:text-dashboard-text-primary transition-colors"
          aria-label="Toggle visibility"
        >
          {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </div>

      <div className="bg-white border border-dashboard-border rounded-[6px] p-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-[6px]">
            <span className="text-[22px] font-semibold text-dashboard-text-primary font-figtree tracking-[-0.17px] leading-[23.3px]">
              {isVisible ? `$${formatCurrency(portfolioValue)}` : "••••••••"}
            </span>
            <StatusBadge value={`${formatPercent(dayChangePercent)}%`} showPlus />
          </div>
          <p className="text-sm text-dashboard-text-secondary font-figtree tracking-[-0.2px]">
            Yay!! Your net worth have surged by{" "}
            <span className="font-medium">${formatCurrency(previousMonthChange)}</span> from{" "}
            <span className="font-medium">last month!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Year options for yield deposits
const getYearOptions = (): DropdownOption[] => {
  const currentYear = new Date().getFullYear();
  return [
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear - 1), label: String(currentYear - 1) },
    { value: String(currentYear - 2), label: String(currentYear - 2) },
    { value: String(currentYear - 3), label: String(currentYear - 3) },
    { value: "all", label: "All Time" },
  ];
};

// Total Yield Deposits Card
function TotalYieldDepositsCard({
  yieldDeposits,
  yieldAPY,
  lockedDays,
}: {
  yieldDeposits: number;
  yieldAPY: number;
  lockedDays: number;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const yearOptions = getYearOptions();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <h3 className="text-2xl font-medium text-dashboard-text-primary font-figtree tracking-[-0.72px] leading-8.75">
          Total Yield Deposits
        </h3>
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-dashboard-text-secondary hover:text-dashboard-text-primary transition-colors"
          aria-label="Toggle visibility"
        >
          {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </div>

      <div className="bg-white border border-dashboard-border rounded-[6px] p-5 relative">
        <div className="flex flex-col gap-3.25">
          <div className="flex items-center gap-1.5">
            <span className="text-[22px] font-semibold text-dashboard-text-primary font-figtree tracking-[-0.17px] leading-[23.3px]">
              {isVisible ? `$${formatCurrency(yieldDeposits)}` : "••••••••"}
            </span>
            <StatusBadge value={`${formatPercent(yieldAPY)}% APY`} showPlus />
            <InfoTooltip info="Annual Percentage Yield earned on your deposits" />
          </div>
          <div className="flex items-center gap-[4px]">
            <span className="text-xs font-semibold text-dashboard-text-secondary font-figtree">
              LOCKED
            </span>
            <span className="w-1 h-1 rounded-full bg-dashboard-text-secondary" />
            <span className="text-xs font-medium text-dashboard-text-secondary font-figtree">
              {lockedDays} days remaining
            </span>
          </div>
        </div>

        {/* Year selector dropdown */}
        <div className="absolute right-5 top-5">
          <Dropdown
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 px-2 py-1.5 border-[1.5px] border-dashboard-border rounded-[4px] hover:bg-dashboard-bg-hover transition-colors"
              >
                <Calendar className="h-[14px] w-[14px] text-dashboard-text-primary" />
                <span className="text-xs font-medium text-dashboard-text-primary font-figtree tracking-[-0.36px]">
                  {selectedYear === "all" ? "All Time" : selectedYear}
                </span>
                <ChevronDown className="h-3 w-3 text-dashboard-text-secondary" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}

// Performance Breakdown Section
function PerformanceBreakdown({
  activePNL,
  activePNLPercent,
  passiveYield,
  passiveYieldPercent,
}: {
  activePNL: number;
  activePNLPercent: number;
  passiveYield: number;
  passiveYieldPercent: number;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <h3 className="text-2xl font-medium text-dashboard-text-primary font-figtree tracking-[-0.72px] leading-[35px]">
        Performance breakdown
      </h3>

      <div className="flex gap-[28px]">
        {/* Active PNL Card */}
        <div className="flex-1 bg-white border border-dashboard-border rounded-[8px] relative overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-dashboard-teal" />
                  <span className="text-base font-medium text-dashboard-text-primary font-figtree tracking-[-0.17px]">
                    Active PNL
                  </span>
                </div>
                <span className="text-[22px] font-semibold text-dashboard-text-primary font-figtree tracking-[-0.17px] leading-[23.3px]">
                  + ${formatCurrency(activePNL)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <StatusBadge value={`${formatPercent(activePNLPercent)}%`} showPlus />
                <span className="w-1 h-1 rounded-full bg-dashboard-text-secondary" />
                <span className="text-xs font-semibold text-dashboard-text-secondary font-figtree">
                  Monthly
                </span>
              </div>
            </div>
          </div>
          <div className="px-4 py-[7px] bg-[rgba(167,198,237,0.1)] border-t border-dashboard-border">
            <span className="text-sm font-medium text-dashboard-text-secondary font-figtree tracking-[-0.2px]">
              From Trading
            </span>
          </div>
        </div>

        {/* Passive Yield Card */}
        <div className="flex-1 bg-white border border-dashboard-border rounded-[8px] relative overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-dashboard-teal" />
                  <span className="text-base font-medium text-dashboard-text-primary font-figtree tracking-[-0.17px]">
                    Passive Yield
                  </span>
                </div>
                <span className="text-[22px] font-semibold text-dashboard-text-primary font-figtree tracking-[-0.17px] leading-[23.3px]">
                  + ${formatCurrency(passiveYield)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <StatusBadge value={`${formatPercent(passiveYieldPercent)}%`} showPlus />
                <span className="w-1 h-1 rounded-full bg-dashboard-text-secondary" />
                <span className="text-xs font-semibold text-dashboard-text-secondary font-figtree">
                  Monthly
                </span>
              </div>
            </div>
          </div>
          <div className="px-4 py-[7px] bg-[rgba(167,198,237,0.1)] border-t border-dashboard-border">
            <span className="text-sm font-medium text-dashboard-text-secondary font-figtree tracking-[-0.2px]">
              From Interest
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function PortfolioSummaryCards({
  portfolioValue,
  dayChange,
  dayChangePercent,
  totalReturn,
  totalReturnPercent,
  holdings,
  yieldDeposits = 86420.44,
  yieldAPY = 5.66,
  lockedDays = 12,
  activePNL = 8234.12,
  activePNLPercent = 1.67,
  passiveYield = 4309.11,
  passiveYieldPercent = 0.91,
}: PortfolioSummaryCardsProps) {
  // Calculate previous month change (for demo, use totalReturn)
  const previousMonthChange = Math.abs(totalReturn) || 35435;

  return (
    <div className="flex flex-col gap-[32px]">
      <TotalNetWorthCard
        portfolioValue={portfolioValue}
        dayChangePercent={dayChangePercent}
        previousMonthChange={previousMonthChange}
      />
      <TotalYieldDepositsCard
        yieldDeposits={yieldDeposits}
        yieldAPY={yieldAPY}
        lockedDays={lockedDays}
      />
      <PerformanceBreakdown
        activePNL={activePNL}
        activePNLPercent={activePNLPercent}
        passiveYield={passiveYield}
        passiveYieldPercent={passiveYieldPercent}
      />
    </div>
  );
}

// Export individual components for flexible usage
export { TotalNetWorthCard, TotalYieldDepositsCard, PerformanceBreakdown };
