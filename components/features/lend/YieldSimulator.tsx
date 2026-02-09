"use client";

import { useState, useMemo } from "react";
import { Info, ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type LockupPeriod = "no-lockup" | "30-day" | "90-day" | "180-day";

interface PeriodConfig {
  id: LockupPeriod;
  label: string;
  apyPercent: number;
}

/**
 * TODO: Replace with live data from your lending protocol/API
 * Example integration:
 *   const { data: periods } = useLendingRates(); // Custom hook to fetch APY rates
 *   Or fetch from smart contract: const apyRates = await lendingContract.getAPYRates();
 */
const PERIODS: PeriodConfig[] = [
  { id: "no-lockup", label: "No Lockup", apyPercent: 5.66 },
  { id: "30-day", label: "30-Day Lock", apyPercent: 8.5 },
  { id: "90-day", label: "90-Day Lock", apyPercent: 11.2 },
  { id: "180-day", label: "180-Day Lock", apyPercent: 14.8 },
];

const COLORS = {
  principal: "#004a4a",
  returns: "#A7C6ED",
};

export function YieldSimulator() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<LockupPeriod>("no-lockup");
  /**
   * TODO: Replace default value with user's wallet balance or existing position
   * Example: const { balance } = useWalletBalance(); setPrincipal(balance);
   * Or from props: interface Props { initialPrincipal?: number }
   */
  const [principal, setPrincipal] = useState(25800);
  const [timeframe, setTimeframe] = useState<"yearly" | "monthly">("yearly");

  const currentPeriod =
    PERIODS.find((p) => p.id === selectedPeriod) || PERIODS[0];

  const estimatedEarnings = useMemo(() => {
    const yearlyEarnings = principal * (currentPeriod.apyPercent / 100);
    return timeframe === "yearly" ? yearlyEarnings : yearlyEarnings / 12;
  }, [principal, currentPeriod.apyPercent, timeframe]);

  /**
   * Chart data for the donut chart visualization
   * - Principal: User's input amount (see TODO above for live wallet balance)
   * - Returns: Calculated from principal × APY rate (see PERIODS TODO for live rates)
   *
   * TODO: For live portfolio data, replace with actual position values:
   *   const { depositedAmount, accruedInterest } = useUserPosition(selectedPeriod);
   *   Or from smart contract: const position = await lendingContract.getUserPosition(address);
   */
  const chartData = useMemo(() => {
    return [
      { name: "Principal", value: principal, color: COLORS.principal },
      { name: "Returns", value: estimatedEarnings, color: COLORS.returns },
    ];
  }, [principal, estimatedEarnings]);

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatNumber = (val: number) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <div className="flex flex-col gap-5 w-[80%]">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-medium leading-8.75 text-[#171717] tracking-[-0.72px]">
          Yield Simulator
        </h2>
        <p className="text-base font-normal leading-5 text-[#666] tracking-[-0.2px]">
          See your potential earnings
        </p>
      </div>

      <div className="bg-white border-[1.5px] border-[#e6e6e6] rounded-[10px] p-8">
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Left Side - Controls */}
          <div className="flex flex-col gap-8 flex-1 w-full max-w-131">
            {/* Period Tabs */}
            <div className="flex items-center gap-2.5">
              {PERIODS.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`h-9 px-4 py-2 text-base font-medium leading-6 whitespace-nowrap rounded-md transition-colors text-center ${
                    selectedPeriod === period.id
                      ? "bg-[#d5e2f1] border border-[#a7c6ed] text-[#3d5678]"
                      : "bg-white border border-[#e1e1e1] text-[#3d5678] hover:bg-gray-50"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Principal Amount */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-medium leading-6 text-[#171717] tracking-[-0.72px]">
                  Principal Amount*
                </span>
                <div className="flex items-center gap-1 h-11 w-full max-w-32.5 bg-white border border-[#e6e6e6] rounded-lg px-2 overflow-hidden">
                  <svg
                    width="11"
                    height="18"
                    viewBox="0 0 11 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M0.973633 11.7887C0.973633 13.4635 2.25898 14.8138 3.85592 14.8138H7.11473C8.50394 14.8138 9.63349 13.6323 9.63349 12.1782C9.63349 10.5942 8.94537 10.036 7.91969 9.67242L2.68743 7.85476C1.66175 7.49123 0.973633 6.93295 0.973633 5.34899C0.973633 3.89486 2.10318 2.71338 3.49239 2.71338H6.7512C8.34814 2.71338 9.63349 4.06364 9.63349 5.73849"
                      stroke="#292D32"
                      strokeWidth="1.94749"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.29492 0.973633V16.5536"
                      stroke="#292D32"
                      strokeWidth="1.94749"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    aria-label="Principal amount"
                    value={formatNumber(principal)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, "");
                      setPrincipal(Number(value) || 0);
                    }}
                    className="w-full min-w-0 text-2xl font-medium text-[#171717] tracking-[-0.72px] bg-transparent border-none focus:outline-none text-right"
                  />
                </div>
              </div>
              {/* Slider */}
              <div className="relative h-11 flex items-center">
                <div className="absolute inset-x-0 h-1 bg-[rgba(60,60,67,0.18)] rounded-sm" />
                <div
                  className="absolute left-0 h-1 bg-[#004a4a] rounded-sm"
                  style={{ width: `${(principal / 100000) * 100}%` }}
                />
                <input
                  type="range"
                  aria-label="Principal amount slider"
                  min="0"
                  max="100000"
                  step="100"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="absolute inset-x-0 w-full h-7 opacity-0 cursor-pointer"
                />
                <div
                  className="absolute w-7 h-7 bg-white rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16),0_3px_1px_rgba(0,0,0,0.1)] pointer-events-none"
                  style={{
                    left: `calc(${(principal / 100000) * 100}% - 14px)`,
                  }}
                />
              </div>
            </div>

            {/* Est. Earnings */}
            <div className="flex flex-col gap-3">
              <span className="text-2xl font-medium leading-6 text-[#171717] tracking-[-0.72px]">
                Est. Earnings
              </span>
              <div className="relative bg-[#fafafa] border border-[#e6e6e6] rounded-md h-[76px] px-6 flex items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold leading-7 text-[#171717] tracking-[-0.18px]">
                    {formatCurrency(estimatedEarnings)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge
                      value={`${currentPeriod.apyPercent}% APY`}
                      className="text-sm px-[11px] py-[5.6px] rounded-md"
                    />
                    <Info className="w-[19px] h-[19px] text-[#666]" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTimeframe(timeframe === "yearly" ? "monthly" : "yearly")
                  }
                  className="absolute right-6 flex items-center gap-[7px] h-[34px] px-2.5 bg-white border-[1.5px] border-[#e6e6e6] rounded text-sm font-medium text-[#171717] tracking-[-0.43px] hover:bg-gray-50"
                >
                  {timeframe === "yearly" ? "Yearly" : "Monthly"}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Donut Chart */}
          <div className="flex flex-col gap-[35px] w-[299px]">
            {/* Legend */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-[18px] h-[17px] rounded-full bg-[#004a4a]" />
                <span className="text-lg font-medium leading-6 text-[#171717] tracking-[-0.54px]">
                  Principal Amount
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[18px] h-[17px] rounded-full bg-[#A7C6ED]" />
                <span className="text-lg font-medium leading-6 text-[#171717] tracking-[-0.54px]">
                  Est. Returns
                </span>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="w-[245px] h-[245px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
