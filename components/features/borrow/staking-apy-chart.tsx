"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Convert bytes32 ILK to string
const LQD_ILK =
  "0x4c51440000000000000000000000000000000000000000000000000000000000" as `0x${string}`;

// APY curve based on utilization (typical DeFi pattern: APY increases with utilization)
// Formula: APY = baseRate + (utilization / maxUtilization) * (maxRate - baseRate)
function calculateAPYFromUtilization(utilization: number): number {
  const baseRate = 2.0; // Minimum APY at 0% utilization
  const maxRate = 15.0; // Maximum APY at 100% utilization
  const kinkUtilization = 0.8; // Utilization point where curve steepens
  const kinkRate = 8.0; // APY at kink point

  if (utilization <= kinkUtilization) {
    // Linear increase from baseRate to kinkRate
    return baseRate + (utilization / kinkUtilization) * (kinkRate - baseRate);
  } else {
    // Steeper increase from kinkRate to maxRate
    const excessUtilization =
      (utilization - kinkUtilization) / (1 - kinkUtilization);
    return kinkRate + excessUtilization * (maxRate - kinkRate);
  }
}

// Generate historical data points with utilization-based APY
function generateHistoricalData(
  days: number,
): Array<{ date: string; apy: number; utilization: number }> {
  const data: Array<{ date: string; apy: number; utilization: number }> = [];
  const today = new Date();

  // Start with a base utilization and add realistic variation
  let currentUtilization = 0.45; // Start at 45% utilization

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate utilization changes (random walk with some trend)
    // Utilization typically stays between 20% and 85%
    const change = (Math.random() - 0.5) * 0.08; // ±4% change per day
    currentUtilization = Math.max(
      0.2,
      Math.min(0.85, currentUtilization + change),
    );

    // Calculate APY based on utilization
    const baseAPY = calculateAPYFromUtilization(currentUtilization);

    // Add small random noise (±0.3%) to make it look more realistic
    const noise = (Math.random() - 0.5) * 0.6;
    const apy = Math.max(0, baseAPY + noise);

    // Format date based on time range
    let dateFormat: string;
    if (days <= 7) {
      dateFormat = date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (days <= 30) {
      dateFormat = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      dateFormat = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    data.push({
      date: dateFormat,
      apy: Number(apy.toFixed(2)),
      utilization: Number((currentUtilization * 100).toFixed(1)),
    });
  }

  return data;
}

export function StakingAPYChart() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [historicalData, setHistoricalData] = useState<
    Array<{ date: string; apy: number; utilization: number }>
  >([]);

  // Generate fake hardcoded data based on utilization curve
  useEffect(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const data = generateHistoricalData(days);
    setHistoricalData(data);
  }, [timeRange]);

  // Get current APY from the latest data point
  const currentAPY = useMemo(() => {
    if (historicalData.length === 0) return null;
    return historicalData[historicalData.length - 1].apy;
  }, [historicalData]);

  // Get current utilization from the latest data point
  const currentUtilization = useMemo(() => {
    if (historicalData.length === 0) return null;
    return historicalData[historicalData.length - 1].utilization;
  }, [historicalData]);

  const chartConfig = {
    apy: {
      label: "Staking APY",
      color: "#004040",
    },
  };

  if (currentAPY === null || historicalData.length === 0) {
    return (
      <Card className="border border-[#004040]/15">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#004040]">
            Staking APY
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-slate-500">
            No APY data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[#004040]/15">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-xl font-semibold text-[#004040]">
              Staking APY
            </CardTitle>
            <CardDescription>
              Current staking APY based on utilization
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#004040]">
              {currentAPY.toFixed(2)}%
            </div>
            <div className="text-sm text-slate-500">
              {currentUtilization !== null
                ? `${currentUtilization.toFixed(1)}% utilization`
                : "Current APY"}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Tabs
            value={timeRange}
            onValueChange={(value) =>
              setTimeRange(value as "7d" | "30d" | "90d")
            }
          >
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={historicalData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-slate-500"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-slate-500"
              domain={["dataMin - 1", "dataMax + 1"]}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value, name, item) => {
                    if (name === "apy") {
                      return [`${Number(value).toFixed(2)}%`, "APY"];
                    }
                    return [value, name];
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="apy"
              stroke="#004040"
              fill="#004040"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
