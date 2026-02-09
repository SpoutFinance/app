"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  TrendingUp,
  ChevronDown,
  BarChart3,
  Check,
  Layers,
  Wallet,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SvgIcon } from "@/components/ui/svg-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import RecycleDollar from "@/assets/images/recycle_dollar.svg";
import DollarBars from "@/assets/images/dollar_bars.svg";

// Dropdown types and component
type DropdownOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
};

function CompareDropdown({
  options,
  selectedValues,
  onChange,
  trigger,
}: {
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 z-50 w-55 bg-white border border-dashboard-border rounded-[8px] shadow-lg py-2 animate-in fade-in-0 zoom-in-95">
          <div className="px-3 py-2 border-b border-dashboard-border">
            <span className="text-xs font-semibold text-dashboard-text-muted font-figtree uppercase tracking-wider">
              Select assets to compare
            </span>
          </div>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleValue(option.value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-figtree hover:bg-dashboard-bg-hover transition-colors ${
                selectedValues.includes(option.value)
                  ? "bg-dashboard-bg-light"
                  : ""
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center text-dashboard-text-secondary">
                {option.icon}
              </span>
              <div className="flex-1 text-left">
                <span className="text-dashboard-text-primary font-medium">
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-xs text-dashboard-text-muted">
                    {option.description}
                  </p>
                )}
              </div>
              <div
                className={`w-4 h-4 rounded border ${
                  selectedValues.includes(option.value)
                    ? "bg-dashboard-teal border-dashboard-teal"
                    : "border-dashboard-border"
                } flex items-center justify-center`}
              >
                {selectedValues.includes(option.value) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
            </button>
          ))}
          <div className="px-3 pt-2 mt-1 border-t border-dashboard-border">
            <span className="text-xs text-dashboard-text-muted font-figtree">
              {selectedValues.length} asset
              {selectedValues.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compare options
const compareOptions: DropdownOption[] = [
  {
    value: "portfolio",
    label: "Total Portfolio",
    icon: <Wallet className="h-4 w-4" />,
    description: "Your combined holdings",
  },
  {
    value: "stocks",
    label: "Stocks",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Equity positions",
  },
  {
    value: "etfs",
    label: "ETFs",
    icon: <Layers className="h-4 w-4" />,
    description: "Exchange traded funds",
  },
  {
    value: "crypto",
    label: "Crypto",
    icon: <DollarSign className="h-4 w-4" />,
    description: "Digital assets",
  },
  {
    value: "sp500",
    label: "S&P 500",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Market benchmark",
  },
  {
    value: "btc",
    label: "Bitcoin",
    icon: <TrendingDown className="h-4 w-4" />,
    description: "BTC performance",
  },
];

type TimePeriod = "24H" | "1W" | "1M" | "2M" | "3M" | "6M" | "All time";

type PNLDataPoint = {
  date: string;
  value: number;
  label?: string;
};

type TotalPNLChartProps = {
  totalPNL?: number;
  totalPNLPercent?: number;
  chartData?: PNLDataPoint[];
};

// Generate mock chart data for demo
const generateMockData = (period: TimePeriod): PNLDataPoint[] => {
  const now = new Date();
  const data: PNLDataPoint[] = [];
  let points = 15;
  let dayOffset = 1;

  switch (period) {
    case "24H":
      points = 24;
      break;
    case "1W":
      points = 7;
      dayOffset = 1;
      break;
    case "1M":
      points = 15;
      dayOffset = 2;
      break;
    case "2M":
      points = 15;
      dayOffset = 4;
      break;
    case "3M":
      points = 15;
      dayOffset = 6;
      break;
    case "6M":
      points = 15;
      dayOffset = 12;
      break;
    case "All time":
      points = 15;
      dayOffset = 24;
      break;
  }

  // Base value that trends upward with some variation
  let baseValue = 420000;

  for (let i = 0; i < points; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (points - i - 1) * dayOffset);

    // Add some randomness but trend upward
    const randomVariation = (Math.random() - 0.4) * 30000;
    const trendValue = (i / points) * 70000;
    const value = baseValue + trendValue + randomVariation;

    const dateStr =
      period === "24H"
        ? `${date.getHours()}:00`
        : `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

    data.push({
      date: dateStr,
      value: Math.round(value),
      label: dateStr,
    });
  }

  return data;
};

// Format currency for display
const formatCurrency = (num: number) => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}k`;
  }
  return `$${num.toFixed(0)}`;
};

const formatFullCurrency = (num: number) => {
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


// Time period button component
function TimePeriodButton({
  period,
  isActive,
  onClick,
}: {
  period: TimePeriod;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
       h-6.5 px-2.5 rounded-[20px] text-sm font-medium font-figtree tracking-[-0.42px] transition-colors
        ${
          isActive
            ? "bg-dashboard-accent-blue-bg border border-dashboard-accent-blue-light text-dashboard-accent-blue"
            : "bg-white border border-dashboard-border-subtle text-dashboard-accent-blue hover:bg-dashboard-bg-hover"
        }
      `}
    >
      {period}
    </button>
  );
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-[6px] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] px-2.5 py-1.5 border border-[#e6e6e6]">
        <p className="text-[10px] text-[#7d7d7d] font-figtree leading-3">
          {label}
        </p>
        <p className="text-[10px] font-semibold text-[#171717] font-figtree leading-3">
          {formatFullCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

// Custom cursor - vertical line from data point down to x-axis with circle indicator
function CustomCursor({ points, height }: any) {
  if (!points || points.length === 0) return null;

  const { x, y } = points[0];
  const circleRadius = 5;
  // Line starts just below the circle and goes down to x-axis area
  const lineStartY = y + circleRadius;
  const lineEndY = height - 30; // Just above x-axis labels

  return (
    <g>
      {/* Circle at data point (rendered first so line appears behind) */}
      <circle
        cx={x}
        cy={y}
        r={circleRadius}
        fill="white"
        stroke="#004a4a"
        strokeWidth={2}
      />
      {/* Vertical line from below circle DOWN to x-axis */}
      <line
        x1={x}
        y1={lineStartY}
        x2={x}
        y2={lineEndY}
        stroke="#004a4a"
        strokeWidth={2}
        strokeOpacity={0.6}
      />
    </g>
  );
}

export default function TotalPNLChart({
  totalPNL = 12543.23,
  totalPNLPercent = 2.64,
  chartData: initialChartData,
}: TotalPNLChartProps) {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("1M");
  const [compareAssets, setCompareAssets] = useState<string[]>(["portfolio"]);
  const timePeriods: TimePeriod[] = [
    "24H",
    "1W",
    "1M",
    "2M",
    "3M",
    "6M",
    "All time",
  ];

  // Generate chart data based on period
  const chartData = useMemo(() => {
    if (initialChartData) return initialChartData;
    return generateMockData(activePeriod);
  }, [activePeriod, initialChartData]);

  // Calculate Y axis domain
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100000];
    const values = chartData.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [
      Math.floor((min - padding) / 50000) * 50000,
      Math.ceil((max + padding) / 50000) * 50000,
    ];
  }, [chartData]);

  // Generate Y axis ticks
  const yTicks = useMemo(() => {
    const [min, max] = yDomain;
    const step = (max - min) / 6;
    const ticks = [];
    for (let i = 0; i <= 6; i++) {
      ticks.push(Math.round(min + step * i));
    }
    return ticks;
  }, [yDomain]);

  // Get label for compare button
  const getCompareLabel = () => {
    if (compareAssets.length === 0) return "Compare Assets";
    if (compareAssets.length === 1) {
      const asset = compareOptions.find((o) => o.value === compareAssets[0]);
      return asset?.label || "Compare Assets";
    }
    return `${compareAssets.length} Assets`;
  };

  return (
    <div className="bg-white border border-dashboard-border rounded-xl p-6.25 overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between pb-4.25">
        <div className="flex items-center! gap-2">
          <SvgIcon src={RecycleDollar} className="" />
          <span className="text-[21px] font-medium text-dashboard-teal font-figtree tracking-[-0.21px]">
            Total PNL:{" "}
            <span className="font-semibold">
              {totalPNL >= 0 ? "+" : "-"}$
              {formatFullCurrency(Math.abs(totalPNL)).replace("$", "")}
            </span>
          </span>
          <StatusBadge value={`${totalPNLPercent.toFixed(2)}%`} showPlus />
        </div>

        {/* Compare Assets dropdown */}
        <CompareDropdown
          options={compareOptions}
          selectedValues={compareAssets}
          onChange={setCompareAssets}
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 px-2 py-1.25 border-[1.5px] border-dashboard-border rounded-[4px] hover:bg-dashboard-bg-hover transition-colors"
            >
              <DollarBars className="h-[14.5px] w-[14.5px] text-dashboard-text-primary" />
              <span className="text-xs font-medium text-dashboard-text-primary font-figtree tracking-[-0.36px]">
                {getCompareLabel()}
              </span>
              <ChevronDown className="h-3 w-3 text-dashboard-text-secondary" />
            </button>
          }
        />
      </div>

      {/* Chart */}
      <div className="h-54.25 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
          >
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#004a4a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#004a4a" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
              stroke="#e6e6e6"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#7d7d7d" }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              domain={yDomain}
              ticks={yTicks}
              tick={{ fontSize: 10, fill: "#7d7d7d" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              width={45}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={<CustomCursor height={217} />}
              offset={-45}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#004a4a"
              strokeWidth={2}
              fill="url(#pnlGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time period selectors */}
      <div className="flex items-center gap-3 justify-end mt-8">
        {timePeriods.map((period) => (
          <TimePeriodButton
            key={period}
            period={period}
            isActive={activePeriod === period}
            onClick={() => setActivePeriod(period)}
          />
        ))}
      </div>
    </div>
  );
}
