"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAppRoute } from "@/lib/utils";
import { clientCacheHelpers } from "@/lib/cache/client-cache";
import {
  TradePageHeader,
  TradeStats,
  TradeFormCard,
  TradeChartCard,
  TradePosition,
} from "@/components/features/trade/single";
import TransactionModal from "@/components/ui/transaction-modal";
import { useAccount, useConfig, useChainId } from "wagmi";
import { useERC20Approve } from "@/hooks/writes/onChain/useERC20Approve";
import { useOrdersContract } from "@/hooks/writes/onChain/useOrders";
import { useAssetPrice } from "@/hooks/api/useAssetPrice";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useTokenBalance } from "@/hooks/view/onChain/useTokenBalance";
import { useUSDCTokenBalance } from "@/hooks/view/onChain/useUSDCTokenBalance";
import { useContractAddress } from "@/lib/addresses";
import { useReadContract } from "wagmi";
import erc3643ABI from "@/abi/erc3643.json";
import { getAssetConfig, getTokenAddress } from "@/lib/types/assets";

/**
 * ============================================================
 * MOCK DATA CONFIGURATION
 * ============================================================
 *
 * This page uses mock data for UI development. The data flow remains
 * the same as the original implementation, with mock values substituted
 * when USE_MOCK_DATA is true.
 *
 * ORIGINAL DATA SOURCES (preserved when USE_MOCK_DATA = false):
 * - useAssetPrice(selectedToken) → latestPrice, previousPrice, dailyChangePercent, chartData
 * - useUSDCTokenBalance() → USDC balance
 * - useTokenBalance() → Token balance for selected asset
 * - clientCacheHelpers.fetchStockData() → Asset name and metadata
 *
 * MOCK DATA PROVIDES:
 * - price, priceChangePercent → Substitutes useAssetPrice data
 * - chartData → Substitutes chart data (generated 30-day random walk)
 * - usdcBalance, tokenBalance → Substitutes balance hooks
 * - marketCap, volume24h, high52w, low52w → Stats card data
 * - avgBuyPrice → Position card data (not available in original)
 *
 * TO REVERT TO REAL DATA:
 * Option 1: Set USE_MOCK_DATA = false in lib/mocks/equities-mock-data.ts
 * Option 2: Delete the mock data conditionals below (search for "MOCK DATA")
 *
 * COMPONENTS AFFECTED BY MOCK DATA:
 * - TradeStats: marketCap, volume24h, high52w, low52w
 * - TradePosition: avgBuyPrice (needs real implementation for production)
 * - TradeChartCard: chartData
 * - TradeFormCard: usdcBalance, tokenBalance
 * ============================================================
 */
import {
  USE_MOCK_DATA,
  getMockAssetData,
} from "@/lib/mocks/equities-mock-data";

const TradePageContent = () => {
  const chainId = useChainId();
  const searchParams = useSearchParams();
  const tickerParam = searchParams?.get("ticker");
  const router = useRouter();

  // Redirect to equities page if no ticker is selected
  useEffect(() => {
    if (!tickerParam) {
      router.replace(getAppRoute("/app/trade/equities"));
      return;
    }
  }, [tickerParam, router]);

  const [selectedToken, setSelectedToken] = useState(tickerParam || "LQD");
  const [buyUsdc, setBuyUsdc] = useState("");
  const [sellToken, setSellToken] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [refreshing, setRefreshing] = useState(false);
  const [assetName, setAssetName] = useState("");

  // ============================================================
  // MOCK DATA START
  // Get mock data for the selected token
  // To revert: Set USE_MOCK_DATA to false in lib/mocks/equities-mock-data.ts
  // ============================================================
  const mockData = useMemo(
    () => (USE_MOCK_DATA ? getMockAssetData(selectedToken) : null),
    [selectedToken]
  );
  // ============================================================
  // MOCK DATA END
  // ============================================================

  // Get asset config for selected token
  const assetConfig = useMemo(
    () => getAssetConfig(selectedToken),
    [selectedToken]
  );

  // Get token address dynamically from registry
  const tokenAddress = useMemo(() => {
    if (!assetConfig) return undefined;
    return getTokenAddress(selectedToken, chainId);
  }, [selectedToken, chainId, assetConfig]);

  // Use generic asset price hook for selected token (skipped when using mock data)
  const {
    latestPrice: realLatestPrice,
    previousPrice: realPrevPrice,
    dailyChangePercent: realDailyChangePercent,
    chartData: realChartData,
    isLoading: priceLoading,
    chartLoading: realChartLoading,
  } = useAssetPrice(selectedToken);

  // ============================================================
  // MOCK DATA: Use mock values when USE_MOCK_DATA is true
  // ============================================================
  const latestPrice = USE_MOCK_DATA && mockData ? mockData.price : realLatestPrice;
  const prevPrice = USE_MOCK_DATA && mockData ? mockData.price * (1 - mockData.priceChangePercent / 100) : realPrevPrice;
  const dailyChangePercent = USE_MOCK_DATA && mockData ? mockData.priceChangePercent : realDailyChangePercent;
  const chartData = USE_MOCK_DATA && mockData ? mockData.chartData : realChartData;
  const chartLoading = USE_MOCK_DATA ? false : realChartLoading;

  // Transaction modal state
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    status: "waiting" as "waiting" | "completed" | "failed",
    transactionType: "buy" as "buy" | "sell",
    amount: "",
    receivedAmount: "",
    error: "",
  });

  const { address: userAddress } = useAccount();
  const ordersAddress = useContractAddress("orders") as `0x${string}`;
  const usdcAddress = useContractAddress("usdc") as `0x${string}`;
  const { approve, isPending: isApprovePending } = useERC20Approve(usdcAddress);
  const {
    buyAsset,
    sellAsset,
    isPending: isOrderPending,
    isSuccess: isOrderSuccess,
    error: orderError,
  } = useOrdersContract();
  const config = useConfig();
  const {
    amountUi: realUsdcBalance,
    isLoading: usdcLoading,
    error: usdcError,
    refetch: refetchUSDCBalance,
  } = useUSDCTokenBalance();

  // MOCK DATA: Use mock USDC balance when enabled
  const usdcBalance = USE_MOCK_DATA && mockData ? mockData.usdcBalance : realUsdcBalance;

  // Get token decimals from asset config or contract
  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress,
    abi: erc3643ABI.abi,
    functionName: "decimals",
    query: { enabled: Boolean(tokenAddress) },
  });

  const actualTokenDecimals = useMemo(() => {
    if (tokenDecimals) return Number(tokenDecimals);
    if (assetConfig) return assetConfig.decimals;
    return 18;
  }, [tokenDecimals, assetConfig]);

  // Get token balance for selected token
  const {
    amountUi: realTokenBalance,
    isLoading: balanceLoading,
    refetch: refetchTokenBalance,
  } = useTokenBalance(
    tokenAddress || ("0x" as `0x${string}`),
    (userAddress ?? null) as any
  );

  // MOCK DATA: Use mock token balance when enabled
  const tokenBalance = USE_MOCK_DATA && mockData ? mockData.tokenBalance : realTokenBalance;

  // Monitor order transaction state
  useEffect(() => {
    if (transactionModal.isOpen && transactionModal.status === "waiting") {
      if (isOrderSuccess) {
        setTransactionModal((prev) => ({
          ...prev,
          status: "completed",
        }));
        refetchTokenBalance();
        refetchUSDCBalance();
        setTimeout(() => {
          setTransactionModal((prev) => ({ ...prev, isOpen: false }));
        }, 3000);
      } else if (orderError) {
        setTransactionModal((prev) => ({
          ...prev,
          status: "failed",
          error: "Transaction timed out. Please try again.",
        }));
      }
    }
  }, [
    isOrderSuccess,
    orderError,
    transactionModal.isOpen,
    transactionModal.status,
    refetchTokenBalance,
    refetchUSDCBalance,
  ]);

  // Update selected token when ticker param changes
  useEffect(() => {
    if (tickerParam) {
      setSelectedToken(tickerParam);
    }
  }, [tickerParam]);

  // Fetch asset name (skipped when using mock data)
  useEffect(() => {
    // MOCK DATA: Use mock name directly
    if (USE_MOCK_DATA && mockData) {
      setAssetName(mockData.name);
      return;
    }

    async function fetchAssetData() {
      try {
        const data = await clientCacheHelpers.fetchStockData(selectedToken);
        if (data?.name) {
          setAssetName(data.name);
        } else if (assetConfig?.name) {
          setAssetName(assetConfig.name);
        }
      } catch {
        if (assetConfig?.name) {
          setAssetName(assetConfig.name);
        }
      }
    }
    fetchAssetData();
  }, [selectedToken, assetConfig, mockData]);

  // Calculate price change
  const priceChange = useMemo(() => {
    if (latestPrice && prevPrice) {
      return latestPrice - prevPrice;
    }
    return 0;
  }, [latestPrice, prevPrice]);

  const priceChangePercent = dailyChangePercent || 0;

  // Trade calculations
  const tradingFee = 0.0025;
  const estimatedTokens =
    buyUsdc && latestPrice
      ? (parseFloat(buyUsdc) / latestPrice).toFixed(4)
      : "";
  const estimatedUsdc =
    sellToken && latestPrice
      ? (parseFloat(sellToken) * latestPrice).toFixed(2)
      : "";
  const netReceiveTokens = estimatedTokens
    ? (parseFloat(estimatedTokens) * (1 - tradingFee)).toFixed(4)
    : "";
  const netReceiveUsdc = estimatedUsdc
    ? (parseFloat(estimatedUsdc) * (1 - tradingFee)).toFixed(2)
    : "";

  // Conversion rate string
  const conversionRate = latestPrice
    ? `1 ${selectedToken} = $${latestPrice.toFixed(2)} USDC`
    : "—";

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchTokenBalance(), refetchUSDCBalance()]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBuy = async () => {
    if (!userAddress || !buyUsdc || !latestPrice) return;
    const usdcAmountNum = parseFloat(buyUsdc);
    const amount = BigInt(Math.floor(usdcAmountNum * 1e6));

    setTransactionModal({
      isOpen: true,
      status: "waiting",
      transactionType: "buy",
      amount: `${buyUsdc} USDC`,
      receivedAmount: netReceiveTokens,
      error: "",
    });

    try {
      if (
        !tokenAddress ||
        tokenAddress === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error(
          `Token address not configured for ${selectedToken}. Please update the asset registry.`
        );
      }
      if (!selectedToken || selectedToken.trim() === "") {
        throw new Error("Invalid token ticker");
      }
      if (amount <= BigInt(0)) {
        throw new Error("Invalid amount: must be greater than 0");
      }

      const subscriptionId = assetConfig?.chainlinkSubscriptionId
        ? BigInt(assetConfig.chainlinkSubscriptionId)
        : BigInt(process.env.NEXT_PUBLIC_CHAINLINK_SUBSCRIPTION_ID || 522);

      const approveTx = await approve(ordersAddress, amount);
      if (!approveTx) {
        throw new Error("USDC approval failed - no transaction hash returned");
      }
      await waitForTransactionReceipt(config, { hash: approveTx });

      buyAsset(
        selectedToken,
        selectedToken,
        tokenAddress,
        amount,
        subscriptionId
      );

      setBuyUsdc("");
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.reason ||
        "Transaction failed. Please try again.";
      setTransactionModal((prev) => ({
        ...prev,
        status: "failed",
        error: errorMessage,
      }));
    }
  };

  const handleSell = async () => {
    if (!userAddress || !sellToken || !latestPrice) return;

    const sellTokenAmount = parseFloat(sellToken);
    const tokenBalanceNum = tokenBalance ? Number(tokenBalance) : 0;
    if (sellTokenAmount > tokenBalanceNum) {
      setTransactionModal({
        isOpen: true,
        status: "waiting",
        transactionType: "sell",
        amount: `${sellToken}`,
        receivedAmount: "",
        error: "",
      });

      setTimeout(() => {
        setTransactionModal((prev) => ({
          ...prev,
          status: "failed",
          error: `Transaction reverted: Order exceeds balance. You don't have enough ${selectedToken} tokens.`,
        }));
      }, 3000);

      return;
    }

    const tokenAmount = BigInt(
      Math.floor(sellTokenAmount * 10 ** actualTokenDecimals)
    );

    setTransactionModal({
      isOpen: true,
      status: "waiting",
      transactionType: "sell",
      amount: `${sellToken}`,
      receivedAmount: netReceiveUsdc,
      error: "",
    });

    try {
      if (
        !tokenAddress ||
        tokenAddress === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error(
          `Token address not configured for ${selectedToken}. Please update the asset registry.`
        );
      }

      const subscriptionId = assetConfig?.chainlinkSubscriptionId
        ? BigInt(assetConfig.chainlinkSubscriptionId)
        : BigInt(process.env.NEXT_PUBLIC_CHAINLINK_SUBSCRIPTION_ID || 522);

      sellAsset(
        selectedToken,
        selectedToken,
        tokenAddress,
        tokenAmount,
        subscriptionId
      );
      setSellToken("");
    } catch {
      setTransactionModal((prev) => ({
        ...prev,
        status: "failed",
        error: "Transaction failed. Please try again.",
      }));
    }
  };

  const closeTransactionModal = () => {
    setTransactionModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Submit handler based on trade type
  const handleSubmit = () => {
    if (tradeType === "buy") {
      handleBuy();
    } else {
      handleSell();
    }
  };

  // Current form values based on trade type
  const fromAmount = tradeType === "buy" ? buyUsdc : sellToken;
  const setFromAmount = tradeType === "buy" ? setBuyUsdc : setSellToken;
  const toAmount = tradeType === "buy" ? netReceiveTokens : netReceiveUsdc;

  // Determine if submit should be disabled
  const isSubmitDisabled =
    !fromAmount ||
    parseFloat(fromAmount) <= 0 ||
    isApprovePending ||
    isOrderPending;

  // Don't render trading interface if no ticker is selected (will redirect)
  if (!tickerParam) {
    return null;
  }

  return (
    <div className="space-y-8 font-figtree">
      {/* Header */}
      <TradePageHeader
        ticker={selectedToken}
        name={assetName || assetConfig?.name || selectedToken}
        price={latestPrice}
        priceChangePercent={priceChangePercent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Stats
          MOCK DATA: marketCap, volume24h, high52w, low52w come from getMockAssetData()
          TO REVERT: Fetch real stats from API (e.g., clientCacheHelpers.fetchStockData)
          and pass them here instead of mockData values */}
      <TradeStats
        marketCap={mockData?.marketCap ?? null}
        volume24h={mockData?.volume24h ?? null}
        high52w={mockData?.high52w ?? null}
        low52w={mockData?.low52w ?? null}
        currentPrice={latestPrice}
      />

      {/* Trade Form + Chart (Two Column Layout) */}
      <div className="flex align-center justify-left gap-6">
        {/* Trade Form */}
        <TradeFormCard
          tradeType={tradeType}
          setTradeType={setTradeType}
          ticker={selectedToken}
          fromAmount={fromAmount}
          setFromAmount={setFromAmount}
          toAmount={toAmount}
          usdcBalance={usdcBalance ? Number(usdcBalance) : 0}
          tokenBalance={tokenBalance ? Number(tokenBalance) : 0}
          isLoading={isApprovePending || isOrderPending}
          isDisabled={isSubmitDisabled}
          onSubmit={handleSubmit}
          conversionRate={conversionRate}
        />

        {/* Chart */}
        <TradeChartCard
          ticker={selectedToken}
          name={assetName || assetConfig?.name || selectedToken}
          loading={chartLoading}
          chartData={chartData}
        />
      </div>

      {/* Your Position - MOCK DATA: Uses mock position data when enabled */}
      <TradePosition
        ticker={selectedToken}
        holdings={tokenBalance ? Number(tokenBalance) : 0}
        currentPrice={latestPrice}
        avgBuyPrice={mockData?.avgBuyPrice ?? null}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={transactionModal.isOpen}
        onClose={closeTransactionModal}
        status={transactionModal.status}
        transactionType={transactionModal.transactionType}
        tokenSymbol={selectedToken}
        amount={transactionModal.amount}
        receivedAmount={transactionModal.receivedAmount}
        error={transactionModal.error}
      />
    </div>
  );
};

const TradePage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <TradePageContent />
    </Suspense>
  );
};

export default TradePage;
