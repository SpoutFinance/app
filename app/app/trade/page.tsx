"use client";
import React, { useEffect, useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { getAppRoute } from "@/lib/utils";
import { clientCacheHelpers } from "@/lib/cache/client-cache";
import { TradeEquitySearch } from "@/components/features/trade/tradeequitysearch";
import TradeForm from "@/components/features/trade/tradeform";

// Lazy load heavy chart component to reduce initial bundle size
const TradeChart = dynamic(
  () => import("@/components/features/trade/tradechart"),
  {
    loading: () => (
      <div className="h-[400px] bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Loading chart...</span>
      </div>
    ),
    ssr: false,
  },
);
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
  const [etfData, setEtfData] = useState<any>(null);

  // Get asset config for selected token
  const assetConfig = useMemo(
    () => getAssetConfig(selectedToken),
    [selectedToken],
  );

  // Get token address dynamically from registry
  const tokenAddress = useMemo(() => {
    if (!assetConfig) return undefined;
    return getTokenAddress(selectedToken, chainId);
  }, [selectedToken, chainId, assetConfig]);

  // Use generic asset price hook for selected token
  const {
    latestPrice,
    previousPrice: prevPrice,
    dailyChangePercent,
    chartData,
    isLoading: priceLoading,
    chartLoading,
  } = useAssetPrice(selectedToken);

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
    amountUi: usdcBalance,
    isLoading: usdcLoading,
    error: usdcError,
    refetch: refetchUSDCBalance,
  } = useUSDCTokenBalance();

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
    return 18; // Default to 18 decimals
  }, [tokenDecimals, assetConfig]);

  // Get token balance for selected token
  const {
    amountUi: tokenBalance,
    isLoading: balanceLoading,
    refetch: refetchTokenBalance,
  } = useTokenBalance(
    tokenAddress || ("0x" as `0x${string}`),
    (userAddress ?? null) as any,
  );

  // Monitor order transaction state
  useEffect(() => {
    if (transactionModal.isOpen && transactionModal.status === "waiting") {
      if (isOrderSuccess) {
        // Transaction completed successfully
        setTransactionModal((prev) => ({
          ...prev,
          status: "completed",
        }));

        // Refetch balances to show updated amounts
        refetchTokenBalance();
        refetchUSDCBalance();

        // Auto-close modal after 3 seconds
        setTimeout(() => {
          setTransactionModal((prev) => ({ ...prev, isOpen: false }));
        }, 3000);
      } else if (orderError) {
        // Transaction failed - show simple error message
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

  useEffect(() => {
    async function fetchETFData() {
      try {
        const data = await clientCacheHelpers.fetchStockData(selectedToken);
        setEtfData(data);
      } catch (error) {}
    }
    fetchETFData();
  }, [selectedToken]);

  // Calculate price change from latest and previous prices
  const priceChange = useMemo(() => {
    if (latestPrice && prevPrice) {
      return latestPrice - prevPrice;
    }
    return 0;
  }, [latestPrice, prevPrice]);

  const priceChangePercent = dailyChangePercent || 0;

  const tradingFee = 0.0025;
  const estimatedTokens =
    buyUsdc && latestPrice
      ? (parseFloat(buyUsdc) / latestPrice).toFixed(4)
      : "";
  const estimatedUsdc =
    sellToken && latestPrice
      ? (parseFloat(sellToken) * latestPrice).toFixed(2)
      : "";
  const buyFeeUsdc = buyUsdc
    ? (parseFloat(buyUsdc) * tradingFee).toFixed(2)
    : "";
  const sellFeeUsdc = estimatedUsdc
    ? (parseFloat(estimatedUsdc) * tradingFee).toFixed(2)
    : "";
  const netReceiveTokens = estimatedTokens
    ? (parseFloat(estimatedTokens) * (1 - tradingFee)).toFixed(4)
    : "";
  const netReceiveUsdc = estimatedUsdc
    ? (parseFloat(estimatedUsdc) * (1 - tradingFee)).toFixed(2)
    : "";

  const handleBuy = async () => {
    if (!userAddress || !buyUsdc || !latestPrice) return;
    // Convert USDC amount to proper decimals using USDC_DECIMALS
    const usdcAmountNum = parseFloat(buyUsdc);
    const amount = BigInt(Math.floor(usdcAmountNum * 1e6));

    const estimatedTokenAmount =
      latestPrice > 0 ? usdcAmountNum / latestPrice : 0;

    // Show transaction modal
    setTransactionModal({
      isOpen: true,
      status: "waiting",
      transactionType: "buy",
      amount: `${buyUsdc} USDC`,
      receivedAmount: netReceiveTokens,
      error: "",
    });

    try {
      // Validate inputs before proceeding
      if (
        !tokenAddress ||
        tokenAddress === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error(
          `Token address not configured for ${selectedToken}. Please update the asset registry.`,
        );
      }
      if (!selectedToken || selectedToken.trim() === "") {
        throw new Error("Invalid token ticker");
      }
      if (amount <= BigInt(0)) {
        throw new Error("Invalid amount: must be greater than 0");
      }

      // Get subscription ID from asset config or use default
      const subscriptionId = assetConfig?.chainlinkSubscriptionId
        ? BigInt(assetConfig.chainlinkSubscriptionId)
        : BigInt(process.env.NEXT_PUBLIC_CHAINLINK_SUBSCRIPTION_ID || 522);

      console.log("🔍 Buy transaction inputs:", {
        asset: selectedToken,
        ticker: selectedToken,
        token: tokenAddress,
        usdcAmount: amount.toString(),
        subscriptionId: subscriptionId.toString(),
        ordersAddress,
      });

      // Step 1: Approve USDC
      console.log("📝 Step 1: Approving USDC...");
      const approveTx = await approve(ordersAddress, amount);
      if (!approveTx) {
        throw new Error("USDC approval failed - no transaction hash returned");
      }
      console.log("⏳ Waiting for USDC approval confirmation...");
      await waitForTransactionReceipt(config, { hash: approveTx });
      console.log("✅ USDC approval completed");

      // Step 2: Execute buy transaction
      console.log("📤 Step 2: Executing buy transaction...");
      console.log("📤 Sending USDC amount to contract:", amount.toString());

      // buyAsset returns void - it triggers the transaction and the hash will be available
      // through the hook's data property. Errors will be thrown if validation fails.
      // Parameters match documentation exactly:
      // 1. asset: ticker (asset symbol for Chainlink)
      // 2. ticker: ticker (display ticker)
      // 3. token: token contract address from registry
      // 4. usdcAmount: amount in 6 decimals (BigInt)
      // 5. subscriptionId: Chainlink subscription ID (from config or default)
      buyAsset(
        selectedToken, // asset: string
        selectedToken, // ticker: string
        tokenAddress, // token: address (from asset registry)
        amount, // usdcAmount: uint256 (6 decimals)
        subscriptionId, // subscriptionId: uint64 (from config or default)
      );

      console.log(
        "✅ Buy transaction submitted (hash will be available in hook data)",
      );
      setBuyUsdc("");

      // Keep modal open for buy transaction to complete
      // The modal will stay in "waiting" state until the buy transaction is processed
      console.log("⏳ Buy transaction submitted, keeping modal open...");
    } catch (error: any) {
      console.error("❌ Error in buy transaction:", error);
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

    // Validate balance before proceeding
    const sellTokenAmount = parseFloat(sellToken);
    const tokenBalanceNum = tokenBalance ? Number(tokenBalance) : 0;
    if (sellTokenAmount > tokenBalanceNum) {
      console.log("❌ Sell amount exceeds balance:", {
        sellAmount: sellTokenAmount,
        availableBalance: tokenBalanceNum,
      });

      // Show processing status first
      setTransactionModal({
        isOpen: true,
        status: "waiting",
        transactionType: "sell",
        amount: `${sellToken}`, // Just the number, modal will add SLQD
        receivedAmount: "",
        error: "",
      });

      // Wait 3 seconds then show the error
      setTimeout(() => {
        setTransactionModal((prev) => ({
          ...prev,
          status: "failed",
          error: `Transaction reverted: Order exceeds balance. You don't have enough ${selectedToken} tokens.`,
        }));
      }, 3000);

      return;
    }

    // Multiply by token decimals for token amount
    const tokenAmount = BigInt(
      Math.floor(sellTokenAmount * 10 ** actualTokenDecimals),
    );

    const estimatedUsdcAmount =
      latestPrice > 0 ? sellTokenAmount * latestPrice : 0;

    // Show transaction modal
    setTransactionModal({
      isOpen: true,
      status: "waiting",
      transactionType: "sell",
      amount: `${sellToken}`, // Just the number, modal will add SLQD
      receivedAmount: netReceiveUsdc,
      error: "",
    });

    try {
      // Validate token address
      if (
        !tokenAddress ||
        tokenAddress === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error(
          `Token address not configured for ${selectedToken}. Please update the asset registry.`,
        );
      }

      // Get subscription ID from asset config or use default
      const subscriptionId = assetConfig?.chainlinkSubscriptionId
        ? BigInt(assetConfig.chainlinkSubscriptionId)
        : BigInt(process.env.NEXT_PUBLIC_CHAINLINK_SUBSCRIPTION_ID || 522);

      // Execute sell transaction
      // Parameters match documentation exactly (same as buyAsset)
      sellAsset(
        selectedToken,
        selectedToken,
        tokenAddress,
        tokenAmount,
        subscriptionId,
      );
      setSellToken("");

      console.log("⏳ Sell transaction submitted, keeping modal open...");
    } catch (error) {
      console.error("❌ Error in sell transaction:", error);
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

  // Don't render trading interface if no ticker is selected (will redirect)
  if (!tickerParam) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-2 md:px-0">
      <TradeEquitySearch
        selectedToken={selectedToken}
        onSelectToken={setSelectedToken}
      />
      <TradeChart
        loading={chartLoading}
        tokenData={chartData}
        selectedToken={selectedToken}
      />
      <TradeForm
        tradeType={tradeType}
        setTradeType={setTradeType}
        selectedToken={selectedToken}
        buyUsdc={buyUsdc}
        setBuyUsdc={setBuyUsdc}
        sellToken={sellToken}
        setSellToken={setSellToken}
        latestPrice={latestPrice}
        priceLoading={priceLoading}
        usdcBalance={usdcBalance ? Number(usdcBalance) : 0}
        tokenBalance={tokenBalance ? Number(tokenBalance) : 0}
        usdcLoading={usdcLoading}
        usdcError={Boolean(usdcError)}
        balanceLoading={balanceLoading}
        isApprovePending={isApprovePending}
        isOrderPending={isOrderPending}
        handleBuy={handleBuy}
        handleSell={handleSell}
        buyFeeUsdc={buyFeeUsdc}
        netReceiveTokens={netReceiveTokens}
        sellFeeUsdc={sellFeeUsdc}
        netReceiveUsdc={netReceiveUsdc}
        priceChangePercent={priceChangePercent}
        priceChange={priceChange}
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
