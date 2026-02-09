"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Check, Calendar, Clock, TrendingUp, History } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

type AssetCategory = {
  name: string;
  value: number;
  changePercent: number;
  allocation: number;
  color: string;
};

type AssetAllocationProps = {
  categories?: AssetCategory[];
  holdings?: any[];
};

// Dropdown option type
type DropdownOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
};

// Comparison period options
const comparisonPeriodOptions: DropdownOption[] = [
  { value: "vs last week", label: "vs last week", icon: <Clock className="h-4 w-4" />, description: "7 day change" },
  { value: "vs last month", label: "vs last month", icon: <Calendar className="h-4 w-4" />, description: "30 day change" },
  { value: "vs last quarter", label: "vs last quarter", icon: <TrendingUp className="h-4 w-4" />, description: "90 day change" },
  { value: "vs last year", label: "vs last year", icon: <History className="h-4 w-4" />, description: "365 day change" },
  { value: "vs all time", label: "vs all time", icon: <TrendingUp className="h-4 w-4" />, description: "Since inception" },
];

// Reusable Dropdown Component
function PeriodDropdown({
  options,
  value,
  onChange,
  trigger,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        <div className="absolute top-full mt-1 right-0 z-50 w-[180px] bg-white border border-dashboard-border rounded-[8px] shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-figtree hover:bg-dashboard-bg-hover transition-colors ${
                value === option.value
                  ? "text-dashboard-teal bg-dashboard-bg-light"
                  : "text-dashboard-text-primary"
              }`}
            >
              <span className="w-4 h-4 text-dashboard-text-secondary">{option.icon}</span>
              <div className="flex-1 text-left">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <p className="text-[10px] text-dashboard-text-muted">{option.description}</p>
                )}
              </div>
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

// Default categories based on Figma design
const defaultCategories: AssetCategory[] = [
  { name: "Stocks", value: 45898, changePercent: 10.26, allocation: 35, color: "#004a4a" },
  { name: "ETFs", value: 34556, changePercent: 5.78, allocation: 30, color: "#3d5678" },
  { name: "Crypto", value: 12123, changePercent: 14.56, allocation: 20, color: "#a7c6ed" },
  { name: "Stablecoins", value: 45898, changePercent: 10.26, allocation: 15, color: "#078842" },
  { name: "Locked Yield", value: 45898, changePercent: 10.26, allocation: 5, color: "#e6e6e6" },
];

// Format currency for display
const formatCurrency = (num: number) => {
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

// Category card component
function CategoryCard({ category }: { category: AssetCategory }) {
  return (
    <div className="bg-[rgba(245,245,245,0.12)] border-[1.5px] border-dashboard-border rounded-[8px] p-3 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[8px]">
          {/* Label with color indicator */}
          <div className="flex items-center gap-2">
            <div
              className="w-[18px] h-[3px] rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-base font-medium text-dashboard-text-primary font-figtree">
              {category.name}
            </span>
          </div>

          {/* Value and change */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-dashboard-text-primary font-figtree">
              {formatCurrency(category.value)}
            </span>
            <StatusBadge
              value={`${category.changePercent.toFixed(2)}%`}
              showPlus
              className="px-2 py-[5px] rounded-[3.6px] text-[11px]"
            />
          </div>
        </div>

        {/* Allocation percentage */}
        <span className="text-2xl font-semibold text-dashboard-teal font-figtree">
          {category.allocation}%
        </span>
      </div>
    </div>
  );
}

export default function AssetAllocation({
  categories = defaultCategories,
  holdings,
}: AssetAllocationProps) {
  const [comparisonPeriod, setComparisonPeriod] = useState("vs last month");

  // Prepare pie chart data
  const chartData = useMemo(() => {
    return categories.map((cat) => ({
      name: cat.name,
      value: cat.allocation,
      fill: cat.color,
    }));
  }, [categories]);

  // Calculate total value
  const totalValue = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.value, 0);
  }, [categories]);

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-dashboard-text-primary font-figtree tracking-[-0.72px] leading-[35px]">
          Asset Allocation
        </h3>
      </div>

      {/* Content card */}
      <div className="bg-white border border-dashboard-border rounded-[6px] relative">
        {/* Period selector dropdown */}
        <div className="absolute right-4 top-4 z-10">
          <PeriodDropdown
            options={comparisonPeriodOptions}
            value={comparisonPeriod}
            onChange={setComparisonPeriod}
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 px-2 py-[7px] border-[1.5px] border-dashboard-border rounded-[4px] hover:bg-dashboard-bg-hover transition-colors"
              >
                <span className="text-xs font-medium text-dashboard-text-primary font-figtree tracking-[-0.36px]">
                  {comparisonPeriod}
                </span>
                <ChevronDown className="h-[8.5px] w-[8.5px] text-dashboard-text-secondary" />
              </button>
            }
          />
        </div>

        {/* Pie chart */}
        <div className="h-[261px] flex items-center justify-center px-5 pt-[36px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category cards */}
        <div className="flex flex-col gap-6 px-5 pb-5 pt-[40px]">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>

        {/* Bottom shadow bar */}
        <div
          className="h-4 w-full rounded-b-[6px]"
          style={{
            background:
              "linear-gradient(270deg, rgba(106, 106, 106, 0.04) 3%, rgba(0, 0, 0, 0) 87%)",
          }}
        />
      </div>
    </div>
  );
}
