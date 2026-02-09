"use client";

import dynamic from "next/dynamic";
import PortfolioHeader from "@/components/features/portfolio/portfolioheader";
import WelcomeBanner from "@/components/features/portfolio/welcomebanner";
import PortfolioSummaryCards from "@/components/features/portfolio/portfoliosummarycards";
import PortfolioHoldings from "@/components/features/portfolio/portfolioholdings";
import AssetAllocation from "@/components/features/portfolio/assetallocation";

// Lazy load heavy chart components
const TotalPNLChart = dynamic(
  () => import("@/components/features/portfolio/totalpnlchart"),
  {
    loading: () => (
      <div className="h-[379px] bg-white border border-dashboard-border rounded-[12px] animate-pulse flex items-center justify-center">
        <span className="text-dashboard-text-muted font-figtree">Loading chart...</span>
      </div>
    ),
    ssr: false,
  },
);

import { useMarketData } from "@/hooks/api/useMarketData";
import { useLQDPrice } from "@/hooks/api/useLQDPrice";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useReturns } from "@/hooks/api/useReturns";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useUSDCTokenBalance } from "@/hooks/view/onChain/useUSDCTokenBalance";
import { useTokenBalance } from "@/hooks/view/onChain/useTokenBalance";
import { useContractAddress } from "@/lib/addresses";

function PortfolioPage() {
  const { address } = useAccount();
  const userAddress = address ?? null;

  // EVM token addresses
  const lqdToken = useContractAddress("SpoutLQDtoken") as `0x${string}`;

  // Balances (EVM)
  const usdcBalHook = useUSDCTokenBalance();
  const slqdBalHook = useTokenBalance(lqdToken, (address ?? null) as any);
  const lqdBal = useMemo(
    () => Number(slqdBalHook.amountUi ?? 0) || 0,
    [slqdBalHook.amountUi],
  );
  const usdcBal = useMemo(
    () => Number(usdcBalHook.amountUi ?? 0) || 0,
    [usdcBalHook.amountUi],
  );
  const balanceLoading = Boolean(
    slqdBalHook.isLoading || usdcBalHook.isLoading,
  );

  // Use reusable hook for LQD price data
  const {
    latestPrice: lqdLatestPrice,
    previousPrice: lqdPrevPrice,
    previousClose: lqdPrevClose,
    dailyChangePercent: lqdDailyChangePercent,
    isLoading: lqdPriceLoading,
  } = useLQDPrice();
  const {
    price: tslaPrice,
    previousClose: tslaPrevClose,
    isLoading: tslaLoading,
  } = useMarketData("TSLA");
  const {
    price: aaplPrice,
    previousClose: aaplPrevClose,
    isLoading: aaplLoading,
  } = useMarketData("AAPL");
  const {
    price: goldPrice,
    previousClose: goldPrevClose,
    isLoading: goldLoading,
  } = useMarketData("GOLD");

  // GOLD price fallback via Metalprice API
  const [goldUsd, setGoldUsd] = useState<number | null>(null);
  const [goldUsdLoading, setGoldUsdLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function fetchGold() {
      setGoldUsdLoading(true);
      try {
        const url =
          "https://api.metalpriceapi.com/v1/latest?api_key=54ee16f25dba8e9c04459a5da94d415e&base=USD&currencies=EUR,XAU,XAG";
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`gold api ${res.status}`);
        const data = await res.json();
        const xauPerUsd = Number(data?.rates?.XAU || 0);
        const usdPerXau = xauPerUsd > 0 ? 1 / xauPerUsd : null;
        if (!cancelled) setGoldUsd(usdPerXau);
      } catch (e) {
        if (!cancelled) setGoldUsd(null);
      } finally {
        if (!cancelled) setGoldUsdLoading(false);
      }
    }
    fetchGold();
    return () => {
      cancelled = true;
    };
  }, []);

  const { returns, isLoading: returnsLoading } = useReturns("LQD");
  const { username } = useCurrentUser();

  // Format number to 3 decimals
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  };

  // Other demo balances remain zero
  const tslaBal = 0;
  const aaplBal = 0;
  const goldBal = 0;

  // Mock data for testing UI/UX with 50 positions
  const mockHoldings: Holding[] = [
    { symbol: "TSLA", name: "Tesla Inc.", shares: 45.5, avgPrice: 248.50, currentPrice: 265.80, value: 12094.90, dayChange: 6.96, totalReturn: 6.96, allocation: 8 },
    { symbol: "AAPL", name: "Apple Inc.", shares: 120.0, avgPrice: 178.25, currentPrice: 185.40, value: 22248.00, dayChange: 4.01, totalReturn: 4.01, allocation: 15 },
    { symbol: "NVDA", name: "NVIDIA Corporation", shares: 30.0, avgPrice: 485.20, currentPrice: 520.75, value: 15622.50, dayChange: 7.33, totalReturn: 7.33, allocation: 10 },
    { symbol: "NFLX", name: "Netflix Inc.", shares: 25.0, avgPrice: 445.80, currentPrice: 468.25, value: 11706.25, dayChange: 5.03, totalReturn: 5.03, allocation: 8 },
    { symbol: "ORCL", name: "Oracle Corporation", shares: 85.0, avgPrice: 112.40, currentPrice: 118.65, value: 10085.25, dayChange: 5.56, totalReturn: 5.56, allocation: 7 },
    { symbol: "MSFT", name: "Microsoft Corporation", shares: 50.0, avgPrice: 378.90, currentPrice: 395.20, value: 19760.00, dayChange: 4.30, totalReturn: 4.30, allocation: 13 },
    { symbol: "GOOGL", name: "Alphabet Inc.", shares: 75.0, avgPrice: 142.30, currentPrice: 148.75, value: 11156.25, dayChange: 4.53, totalReturn: 4.53, allocation: 7 },
    { symbol: "AMZN", name: "Amazon.com Inc.", shares: 65.0, avgPrice: 175.40, currentPrice: 182.90, value: 11888.50, dayChange: 4.28, totalReturn: 4.28, allocation: 8 },
    { symbol: "META", name: "Meta Platforms Inc.", shares: 40.0, avgPrice: 485.60, currentPrice: 512.35, value: 20494.00, dayChange: 5.51, totalReturn: 5.51, allocation: 14 },
    { symbol: "AMD", name: "Advanced Micro Devices", shares: 100.0, avgPrice: 145.20, currentPrice: 158.45, value: 15845.00, dayChange: 9.12, totalReturn: 9.12, allocation: 11 },
    { symbol: "INTC", name: "Intel Corporation", shares: 200.0, avgPrice: 32.80, currentPrice: 30.25, value: 6050.00, dayChange: -7.77, totalReturn: -7.77, allocation: 4 },
    { symbol: "CRM", name: "Salesforce Inc.", shares: 35.0, avgPrice: 265.40, currentPrice: 278.90, value: 9761.50, dayChange: 5.09, totalReturn: 5.09, allocation: 6 },
    { symbol: "ADBE", name: "Adobe Inc.", shares: 20.0, avgPrice: 545.80, currentPrice: 568.25, value: 11365.00, dayChange: 4.11, totalReturn: 4.11, allocation: 8 },
    { symbol: "PYPL", name: "PayPal Holdings Inc.", shares: 90.0, avgPrice: 62.40, currentPrice: 58.75, value: 5287.50, dayChange: -5.85, totalReturn: -5.85, allocation: 4 },
    { symbol: "SHOP", name: "Shopify Inc.", shares: 55.0, avgPrice: 68.90, currentPrice: 75.40, value: 4147.00, dayChange: 9.43, totalReturn: 9.43, allocation: 3 },
    { symbol: "SQ", name: "Block Inc.", shares: 70.0, avgPrice: 72.30, currentPrice: 78.65, value: 5505.50, dayChange: 8.78, totalReturn: 8.78, allocation: 4 },
    { symbol: "UBER", name: "Uber Technologies", shares: 150.0, avgPrice: 58.20, currentPrice: 62.45, value: 9367.50, dayChange: 7.30, totalReturn: 7.30, allocation: 6 },
    { symbol: "LYFT", name: "Lyft Inc.", shares: 300.0, avgPrice: 12.80, currentPrice: 11.25, value: 3375.00, dayChange: -12.11, totalReturn: -12.11, allocation: 2 },
    { symbol: "SNAP", name: "Snap Inc.", shares: 400.0, avgPrice: 11.40, currentPrice: 12.85, value: 5140.00, dayChange: 12.72, totalReturn: 12.72, allocation: 3 },
    { symbol: "PINS", name: "Pinterest Inc.", shares: 180.0, avgPrice: 32.50, currentPrice: 35.20, value: 6336.00, dayChange: 8.31, totalReturn: 8.31, allocation: 4 },
    { symbol: "ROKU", name: "Roku Inc.", shares: 45.0, avgPrice: 68.90, currentPrice: 72.35, value: 3255.75, dayChange: 5.01, totalReturn: 5.01, allocation: 2 },
    { symbol: "SPOT", name: "Spotify Technology", shares: 25.0, avgPrice: 285.40, currentPrice: 298.75, value: 7468.75, dayChange: 4.68, totalReturn: 4.68, allocation: 5 },
    { symbol: "DKNG", name: "DraftKings Inc.", shares: 120.0, avgPrice: 35.60, currentPrice: 38.90, value: 4668.00, dayChange: 9.27, totalReturn: 9.27, allocation: 3 },
    { symbol: "COIN", name: "Coinbase Global", shares: 30.0, avgPrice: 185.40, currentPrice: 205.75, value: 6172.50, dayChange: 10.97, totalReturn: 10.97, allocation: 4 },
    { symbol: "HOOD", name: "Robinhood Markets", shares: 250.0, avgPrice: 12.80, currentPrice: 14.25, value: 3562.50, dayChange: 11.33, totalReturn: 11.33, allocation: 2 },
    { symbol: "PLTR", name: "Palantir Technologies", shares: 200.0, avgPrice: 22.40, currentPrice: 24.85, value: 4970.00, dayChange: 10.94, totalReturn: 10.94, allocation: 3 },
    { symbol: "SNOW", name: "Snowflake Inc.", shares: 35.0, avgPrice: 165.80, currentPrice: 172.45, value: 6035.75, dayChange: 4.01, totalReturn: 4.01, allocation: 4 },
    { symbol: "CRWD", name: "CrowdStrike Holdings", shares: 25.0, avgPrice: 285.60, currentPrice: 298.40, value: 7460.00, dayChange: 4.48, totalReturn: 4.48, allocation: 5 },
    { symbol: "ZS", name: "Zscaler Inc.", shares: 30.0, avgPrice: 195.40, currentPrice: 188.25, value: 5647.50, dayChange: -3.66, totalReturn: -3.66, allocation: 4 },
    { symbol: "NET", name: "Cloudflare Inc.", shares: 80.0, avgPrice: 85.20, currentPrice: 92.45, value: 7396.00, dayChange: 8.51, totalReturn: 8.51, allocation: 5 },
    { symbol: "MDB", name: "MongoDB Inc.", shares: 20.0, avgPrice: 285.60, currentPrice: 295.80, value: 5916.00, dayChange: 3.57, totalReturn: 3.57, allocation: 4 },
    { symbol: "DDOG", name: "Datadog Inc.", shares: 50.0, avgPrice: 118.40, currentPrice: 125.75, value: 6287.50, dayChange: 6.21, totalReturn: 6.21, allocation: 4 },
    { symbol: "PANW", name: "Palo Alto Networks", shares: 20.0, avgPrice: 325.80, currentPrice: 345.25, value: 6905.00, dayChange: 5.97, totalReturn: 5.97, allocation: 5 },
    { symbol: "OKTA", name: "Okta Inc.", shares: 45.0, avgPrice: 92.40, currentPrice: 88.75, value: 3993.75, dayChange: -3.95, totalReturn: -3.95, allocation: 3 },
    { symbol: "TWLO", name: "Twilio Inc.", shares: 55.0, avgPrice: 68.90, currentPrice: 72.45, value: 3984.75, dayChange: 5.15, totalReturn: 5.15, allocation: 3 },
    { symbol: "DOCU", name: "DocuSign Inc.", shares: 65.0, avgPrice: 58.40, currentPrice: 62.85, value: 4085.25, dayChange: 7.62, totalReturn: 7.62, allocation: 3 },
    { symbol: "ZM", name: "Zoom Video Communications", shares: 75.0, avgPrice: 72.30, currentPrice: 68.45, value: 5133.75, dayChange: -5.33, totalReturn: -5.33, allocation: 3 },
    { symbol: "TTD", name: "The Trade Desk", shares: 40.0, avgPrice: 92.80, currentPrice: 98.65, value: 3946.00, dayChange: 6.30, totalReturn: 6.30, allocation: 3 },
    { symbol: "RBLX", name: "Roblox Corporation", shares: 100.0, avgPrice: 42.60, currentPrice: 45.85, value: 4585.00, dayChange: 7.63, totalReturn: 7.63, allocation: 3 },
    { symbol: "U", name: "Unity Software", shares: 120.0, avgPrice: 28.40, currentPrice: 25.75, value: 3090.00, dayChange: -9.33, totalReturn: -9.33, allocation: 2 },
    { symbol: "PATH", name: "UiPath Inc.", shares: 200.0, avgPrice: 15.80, currentPrice: 17.25, value: 3450.00, dayChange: 9.18, totalReturn: 9.18, allocation: 2 },
    { symbol: "BILL", name: "Bill Holdings Inc.", shares: 45.0, avgPrice: 72.40, currentPrice: 78.65, value: 3539.25, dayChange: 8.63, totalReturn: 8.63, allocation: 2 },
    { symbol: "HUBS", name: "HubSpot Inc.", shares: 10.0, avgPrice: 585.40, currentPrice: 612.75, value: 6127.50, dayChange: 4.67, totalReturn: 4.67, allocation: 4 },
    { symbol: "NOW", name: "ServiceNow Inc.", shares: 12.0, avgPrice: 785.60, currentPrice: 825.40, value: 9904.80, dayChange: 5.07, totalReturn: 5.07, allocation: 7 },
    { symbol: "WDAY", name: "Workday Inc.", shares: 25.0, avgPrice: 248.90, currentPrice: 258.45, value: 6461.25, dayChange: 3.84, totalReturn: 3.84, allocation: 4 },
    { symbol: "TEAM", name: "Atlassian Corporation", shares: 30.0, avgPrice: 225.40, currentPrice: 238.75, value: 7162.50, dayChange: 5.92, totalReturn: 5.92, allocation: 5 },
    { symbol: "SPLK", name: "Splunk Inc.", shares: 40.0, avgPrice: 148.60, currentPrice: 155.85, value: 6234.00, dayChange: 4.88, totalReturn: 4.88, allocation: 4 },
    { symbol: "ESTC", name: "Elastic N.V.", shares: 55.0, avgPrice: 98.40, currentPrice: 105.25, value: 5788.75, dayChange: 6.96, totalReturn: 6.96, allocation: 4 },
    { symbol: "GTLB", name: "GitLab Inc.", shares: 80.0, avgPrice: 58.90, currentPrice: 62.45, value: 4996.00, dayChange: 6.03, totalReturn: 6.03, allocation: 3 },
    { symbol: "CFLT", name: "Confluent Inc.", shares: 150.0, avgPrice: 28.60, currentPrice: 31.25, value: 4687.50, dayChange: 9.27, totalReturn: 9.27, allocation: 3 },
  ];

  // Build holdings
  type Holding = {
    symbol: string;
    name: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
    value: number;
    dayChange: number;
    totalReturn: number;
    allocation: number;
  };

  const baseHoldings: Omit<
    Holding,
    "dayChange" | "totalReturn" | "allocation"
  >[] = [
    {
      symbol: "LQD",
      name: "Spout US Corporate Bond Token",
      shares: lqdBal,
      avgPrice: lqdPrevPrice || lqdPrevClose || 0,
      currentPrice: lqdLatestPrice ?? 0,
      value: lqdBal * (lqdLatestPrice ?? 0),
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      shares: usdcBal,
      avgPrice: 1,
      currentPrice: 1,
      value: usdcBal * 1,
    },
    {
      symbol: "TSLA",
      name: "Tesla Token",
      shares: Number(tslaBal || 0),
      avgPrice: tslaPrevClose || 0,
      currentPrice: tslaPrice ?? 0,
      value: Number(tslaBal || 0) * (tslaPrice ?? 0),
    },
    {
      symbol: "AAPL",
      name: "Apple Token",
      shares: Number(aaplBal || 0),
      avgPrice: aaplPrevClose || 0,
      currentPrice: aaplPrice ?? 0,
      value: Number(aaplBal || 0) * (aaplPrice ?? 0),
    },
    {
      symbol: "GOLD",
      name: "Gold Token",
      shares: Number(goldBal || 0),
      avgPrice: goldPrevClose || 0,
      currentPrice: goldUsd ?? goldPrice ?? 0,
      value: Number(goldBal || 0) * (goldUsd ?? goldPrice ?? 0),
    },
  ];

  const realHoldings: Holding[] = baseHoldings
    .map((h) => {
      let individualDayChange = 0;
      if (h.symbol === "LQD") {
        individualDayChange = lqdDailyChangePercent ?? 0;
      }

      return {
        ...h,
        dayChange: individualDayChange,
        totalReturn: individualDayChange,
        allocation: 0,
      };
    })
    .filter((h) => h.shares > 0);

  // Combine real holdings with mock data for testing (mock data appended)
  const holdings: Holding[] = [...realHoldings, ...mockHoldings];

  // Calculate portfolio metrics
  const portfolioValue = holdings.reduce((sum, h) => sum + (h.value || 0), 0);
  const previousDayValue = holdings.reduce(
    (sum, h) => sum + (h.shares || 0) * (h.avgPrice || 0),
    0,
  );
  const dayChange = portfolioValue - previousDayValue;
  const dayChangePercent =
    previousDayValue > 0
      ? ((portfolioValue - previousDayValue) / previousDayValue) * 100
      : 0;
  const totalReturn = dayChange;
  const totalReturnPercent = dayChangePercent;

  // Update allocations
  const holdingsWithAllocations = holdings.map((h) => ({
    ...h,
    allocation:
      portfolioValue > 0 ? Math.round((h.value / portfolioValue) * 100) : 0,
  }));

  const isLoading =
    balanceLoading ||
    returnsLoading ||
    lqdPriceLoading ||
    tslaLoading ||
    aaplLoading ||
    goldLoading ||
    goldUsdLoading;

  // Refresh handler
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-8 font-figtree">
      {/* Header */}
      <PortfolioHeader
        username={username || ""}
        onRefresh={handleRefresh}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-dashboard-text-secondary mt-4 font-figtree">
              Loading your portfolio...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_508px] gap-8">
            {/* Left column - Value cards + PNL Chart */}
            <div className="flex flex-col gap-8">
              <PortfolioSummaryCards
                portfolioValue={portfolioValue}
                dayChange={dayChange}
                dayChangePercent={dayChangePercent}
                totalReturn={totalReturn}
                totalReturnPercent={totalReturnPercent}
                holdings={holdingsWithAllocations}
              />
              <TotalPNLChart
                totalPNL={totalReturn}
                totalPNLPercent={totalReturnPercent}
              />
            </div>

            {/* Right column - Asset Allocation */}
            <div>
              <AssetAllocation holdings={holdingsWithAllocations} />
            </div>
          </div>

          {/* Your Positions table - full width */}
          <PortfolioHoldings
            holdings={holdingsWithAllocations}
            formatNumber={formatNumber}
          />
        </>
      )}
    </div>
  );
}

export default PortfolioPage;
