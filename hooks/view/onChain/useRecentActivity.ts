"use client";

import { useState, useEffect } from "react";
import {
  useWatchContractEvent,
  usePublicClient,
  useReadContract,
  useAccount,
} from "wagmi";
import { useMarketData } from "@/hooks/api/useMarketData";
import erc3643ABI from "@/abi/erc3643.json";
import ordersAbiFile from "@/abi/ordersChainlink.json";
import { useContractAddress } from "@/lib/addresses";
import { formatUnits, keccak256, toHex, stringToHex } from "viem";

export interface ActivityEvent {
  id: string;
  action: string;
  symbol: string;
  amount: string;
  time: string;
  value: string;
  blockNumber?: number;
  transactionType: "BUY" | "SELL";
}

const ordersABI = Array.isArray(ordersAbiFile)
  ? ordersAbiFile
  : ordersAbiFile.abi;
const USDC_DECIMALS = 6;
const DEFAULT_TOKEN_DECIMALS = 18;

export function useRecentActivity(explicitUserAddress?: string) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [showCount, setShowCount] = useState(5);
  const publicClient = usePublicClient();
  const { price: currentPrice } = useMarketData("LQD");
  const { address: connectedAddress } = useAccount();
  const userAddress = (explicitUserAddress ?? connectedAddress)?.toLowerCase();

  // Get the correct contract address for the current network
  const rwaTokenAddress = useContractAddress("rwatoken") as `0x${string}`;
  const ordersAddress = useContractAddress("orders") as `0x${string}`;

  // Add a constant for fallback price
  const FALLBACK_PRICE = 108.725;

  // Helper functions - we'll get decimals dynamically
  const formatAmount = (amount: bigint, decimals: number = 6) => {
    try {
      // Convert to string and handle decimals
      const value = Number(amount) / Math.pow(10, decimals);
      if (isNaN(value)) {
        console.error("Invalid amount value:", amount.toString());
        return "0";
      }
      return value.toLocaleString();
    } catch (error) {
      console.error("Error formatting amount:", error);
      return "0";
    }
  };

  // Add a function to calculate value for large numbers
  const calculateValue = (amount: bigint, price: number, decimals: number) => {
    try {
      // Convert to number with decimals
      const valueStr = amount.toString();
      const decimalPoint = valueStr.length - decimals;
      const wholePartStr = valueStr.slice(0, decimalPoint) || "0";
      const fractionalPartStr = valueStr.slice(decimalPoint);

      // Calculate the whole number part
      const wholePart = BigInt(wholePartStr);
      // Calculate the fractional part if it exists
      const fractionalPart = fractionalPartStr
        ? Number(`0.${fractionalPartStr}`)
        : 0;

      // Convert whole part to number safely
      const wholeValue = Number(wholePart);

      // Calculate final value
      return (wholeValue + fractionalPart) * price;
    } catch (error) {
      console.error("Error calculating value:", error);
      return 0;
    }
  };

  // Add a function to get a valid price
  const getValidPrice = (price: number | null) => {
    if (typeof price === "number" && !isNaN(price) && price > 0) {
      return price;
    }
    return FALLBACK_PRICE;
  };

  // Add a function to format currency values
  const formatCurrencyValue = (value: number) => {
    try {
      if (isNaN(value) || !isFinite(value)) {
        console.error("Invalid currency value:", value);
        return "$0";
      }
      return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } catch (error) {
      console.error("Error formatting currency:", error);
      return "$0";
    }
  };

  // Get the actual decimals from the contract
  const { data: contractDecimals } = useReadContract({
    address: rwaTokenAddress,
    abi: erc3643ABI.abi,
    functionName: "decimals",
    query: {
      enabled: Boolean(rwaTokenAddress),
    },
  });

  const tokenDecimals = contractDecimals
    ? Number(contractDecimals)
    : DEFAULT_TOKEN_DECIMALS;

  const formatTokenAmount = (
    amount?: bigint,
    decimals: number = DEFAULT_TOKEN_DECIMALS,
    fractionDigits = 3,
  ) => {
    if (!amount) return "0";
    try {
      const formatted = Number(formatUnits(amount, decimals));
      return formatted.toLocaleString(undefined, {
        maximumFractionDigits: fractionDigits,
      });
    } catch (error) {
      console.error("Error formatting token amount:", error);
      return "0";
    }
  };

  const formatUsdcAmount = (amount?: bigint) => {
    if (!amount) return "$0";
    try {
      const formatted = Number(formatUnits(amount, USDC_DECIMALS));
      return `$${formatted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } catch (error) {
      console.error("Error formatting USDC amount:", error);
      return "$0";
    }
  };

  // Helper functions - we'll get decimals dynamically
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const formatTimestampToRelative = (timestampMs: number) => {
    const diffMs = Date.now() - timestampMs;
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const mapLogToActivity = (
    log: any,
    type: "BUY" | "SELL",
    timestampMs: number,
  ): ActivityEvent => {
    console.log("📝 mapLogToActivity called:", {
      txHash: log.transactionHash,
      type,
      typeIsBUY: type === "BUY",
      typeIsSELL: type === "SELL",
    });

    // Normalize symbol to always show SLQD format (not LQD)
    const rawSymbol = log.args.ticker || "LQD";
    const symbol =
      rawSymbol === "LQD"
        ? "SLQD"
        : rawSymbol.startsWith("S")
          ? rawSymbol
          : `S${rawSymbol}`;

    // Always use 18 decimals for token amounts (LQD token uses 18 decimals)
    const assetAmount = formatTokenAmount(
      log.args.assetAmount,
      DEFAULT_TOKEN_DECIMALS,
    );

    const action = type === "BUY" ? "Purchased" : "Sold";

    console.log("📝 mapLogToActivity result:", {
      txHash: log.transactionHash,
      type,
      action,
      transactionType: type,
      actionIsSold: action === "Sold",
      actionIsPurchased: action === "Purchased",
    });

    return {
      id: `${log.transactionHash}-${log.logIndex}`,
      action,
      symbol,
      amount: `${assetAmount} ${symbol}`,
      time: formatTimestampToRelative(timestampMs),
      value: formatUsdcAmount(log.args.usdcAmount),
      blockNumber: Number(log.blockNumber ?? BigInt(0)),
      transactionType: type,
    };
  };

  const buildBlockTimestampMap = async (logs: any[]) => {
    if (!publicClient) return {};
    const uniqueBlocks = Array.from(
      new Set(
        logs
          .map((log) => log.blockNumber)
          .filter((blockNumber): blockNumber is bigint => Boolean(blockNumber)),
      ),
    );

    const entries = await Promise.all(
      uniqueBlocks.map(async (blockNumber) => {
        try {
          const block = await publicClient.getBlock({ blockNumber });
          return [blockNumber.toString(), Number(block.timestamp) * 1000];
        } catch (error) {
          console.error("Error fetching block timestamp:", error);
          return [blockNumber.toString(), Date.now()];
        }
      }),
    );

    return Object.fromEntries(entries);
  };

  const dedupeActivities = (items: ActivityEvent[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const handleRealtimeLogs = async (logs: any[], type: "BUY" | "SELL") => {
    if (!userAddress || !publicClient) return;
    const filtered = logs.filter(
      (log) => log.args.user?.toLowerCase() === userAddress,
    );
    if (filtered.length === 0) return;

    console.log(`Processing ${type} order logs:`, filtered.length);
    const timestampMap = await buildBlockTimestampMap(filtered);
    const newActivities = filtered.map((log) => {
      console.log(`Real-time ${type} order:`, {
        txHash: log.transactionHash,
        assetAmount: log.args.assetAmount?.toString(),
        usdcAmount: log.args.usdcAmount?.toString(),
      });
      return mapLogToActivity(
        log,
        type,
        timestampMap[log.blockNumber?.toString()] ?? Date.now(),
      );
    });

    setAllTransactions((prev) => {
      const updated = dedupeActivities([...newActivities, ...prev]);
      return updated;
    });
  };

  useWatchContractEvent({
    address: ordersAddress,
    abi: ordersABI as any,
    eventName: "BuyOrderCreated",
    onLogs(logs) {
      handleRealtimeLogs(logs, "BUY");
    },
  });

  useWatchContractEvent({
    address: ordersAddress,
    abi: ordersABI as any,
    eventName: "SellOrderCreated",
    onLogs(logs) {
      handleRealtimeLogs(logs, "SELL");
    },
  });

  // Fetch recent order events on mount
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!publicClient || !userAddress || !ordersAddress) {
        setActivities([]);
        setAllTransactions([]);
        setIsLoading(false);
        return;
      }

      try {
        const currentBlock = await publicClient.getBlockNumber();
        const lookbackBlocks = BigInt(3000);
        const fromBlock =
          currentBlock > lookbackBlocks
            ? currentBlock - lookbackBlocks
            : BigInt(0);

        const buyEvent = ordersABI.find(
          (item: any) =>
            item.type === "event" && item.name === "BuyOrderCreated",
        );
        const sellEvent = ordersABI.find(
          (item: any) =>
            item.type === "event" && item.name === "SellOrderCreated",
        );

        console.log("🔍 Event definitions:", {
          buyEventFound: !!buyEvent,
          sellEventFound: !!sellEvent,
          buyEventName: buyEvent?.name,
          sellEventName: sellEvent?.name,
        });

        if (!buyEvent || !sellEvent) {
          console.error("❌ Order events not found in ABI", {
            buyEventFound: !!buyEvent,
            sellEventFound: !!sellEvent,
            availableEvents: ordersABI
              .filter((item: any) => item.type === "event")
              .map((item: any) => item.name),
          });
          setActivities([]);
          setAllTransactions([]);
          return;
        }

        // Fetch logs for both events
        const [buyLogsRaw, sellLogsRaw] = await Promise.all([
          publicClient.getLogs({
            address: ordersAddress,
            event: buyEvent as any,
            fromBlock,
            toBlock: currentBlock,
          }),
          publicClient.getLogs({
            address: ordersAddress,
            event: sellEvent as any,
            fromBlock,
            toBlock: currentBlock,
          }),
        ]);

        console.log("📊 Fetched logs:", {
          buyLogsCount: buyLogsRaw.length,
          sellLogsCount: sellLogsRaw.length,
          userAddress,
        });

        // Debug: Log actual sell logs structure
        if (sellLogsRaw.length > 0) {
          const firstSellLog = sellLogsRaw[0] as any;
          console.log("🔍 DEBUG: First sell log structure:", {
            log: firstSellLog,
            topics: firstSellLog?.topics,
            topics0: firstSellLog?.topics?.[0],
            eventName: firstSellLog?.eventName,
            args: firstSellLog?.args,
            user: firstSellLog?.args?.user,
          });
        }

        // Debug: Log actual buy logs structure
        if (buyLogsRaw.length > 0) {
          const firstBuyLog = buyLogsRaw[0] as any;
          console.log("🔍 DEBUG: First buy log structure:", {
            log: firstBuyLog,
            topics: firstBuyLog?.topics,
            topics0: firstBuyLog?.topics?.[0],
            eventName: firstBuyLog?.eventName,
            args: firstBuyLog?.args,
            user: firstBuyLog?.args?.user,
          });
        }

        type OrderLog = any & { orderType: "BUY" | "SELL" };

        // Compute event signature hashes to verify event types
        // Event signature: "SellOrderCreated(address,string,address,uint256,uint256,uint256)"
        const sellEventSignature = keccak256(
          stringToHex(
            "SellOrderCreated(address,string,address,uint256,uint256,uint256)",
          ),
        );
        // Event signature: "BuyOrderCreated(address,string,address,uint256,uint256,uint256)"
        const buyEventSignature = keccak256(
          stringToHex(
            "BuyOrderCreated(address,string,address,uint256,uint256,uint256)",
          ),
        );

        console.log("🔍 Event signature hashes:", {
          sellEventSignature,
          buyEventSignature,
        });

        // Helper function to determine event type from log topics
        const getEventTypeFromLog = (log: any): "BUY" | "SELL" | null => {
          if (!log.topics || log.topics.length === 0) {
            console.warn("⚠️ Log has no topics:", log);
            return null;
          }
          const eventSignature = log.topics[0];

          console.log("🔍 Checking event signature:", {
            topics0: eventSignature,
            sellSig: sellEventSignature,
            buySig: buyEventSignature,
            matchesSell:
              eventSignature.toLowerCase() === sellEventSignature.toLowerCase(),
            matchesBuy:
              eventSignature.toLowerCase() === buyEventSignature.toLowerCase(),
          });

          if (
            eventSignature.toLowerCase() === sellEventSignature.toLowerCase()
          ) {
            return "SELL";
          }
          if (
            eventSignature.toLowerCase() === buyEventSignature.toLowerCase()
          ) {
            return "BUY";
          }
          return null;
        };

        // Tag logs immediately when fetched - this ensures orderType is always correct
        const buyLogs = (buyLogsRaw as any[]).map((log) => {
          // Verify this is actually a BuyOrderCreated event by checking topics
          const verifiedType = getEventTypeFromLog(log);
          if (verifiedType && verifiedType !== "BUY") {
            console.warn("⚠️ Buy log has SELL event signature!", {
              txHash: log.transactionHash,
              expected: "BUY",
              actual: verifiedType,
            });
          }
          const taggedLog = { ...log, orderType: "BUY" as const };
          console.log("🔵 BUY log tagged:", {
            txHash: log.transactionHash,
            logIndex: log.logIndex,
            user: log.args?.user,
            orderType: taggedLog.orderType,
            verifiedType,
            topics0: log.topics?.[0],
          });
          return taggedLog;
        });

        const sellLogs = (sellLogsRaw as any[]).map((log: any) => {
          // CRITICAL: Tag as SELL immediately - this log came from sellLogsRaw query
          const taggedLog = { ...log, orderType: "SELL" as const };

          // Verify this is actually a SellOrderCreated event by checking topics
          const verifiedType = getEventTypeFromLog(log);
          if (verifiedType && verifiedType !== "SELL") {
            console.error(
              "❌ CRITICAL ERROR: Sell log has wrong event signature!",
              {
                txHash: log.transactionHash,
                expected: "SELL",
                actual: verifiedType,
                topics0: log.topics?.[0],
              },
            );
          }

          console.log("🔴 SELL log tagged (from sellLogsRaw):", {
            txHash: log.transactionHash,
            logIndex: log.logIndex,
            user: log.args?.user,
            orderType: taggedLog.orderType,
            verifiedType,
            topics0: log.topics?.[0],
            hasOrderType: "orderType" in taggedLog,
          });

          // Double-check: ensure orderType is SELL
          if (taggedLog.orderType !== "SELL") {
            console.error("❌ CRITICAL: orderType was not set to SELL!", {
              txHash: log.transactionHash,
              orderType: taggedLog.orderType,
            });
            taggedLog.orderType = "SELL";
          }

          return taggedLog;
        });

        // Combine all logs - they're already tagged with correct orderType
        const combinedLogs: OrderLog[] = [...buyLogs, ...sellLogs];

        console.log("📋 Combined logs:", {
          total: combinedLogs.length,
          buyCount: combinedLogs.filter((log: any) => log.orderType === "BUY")
            .length,
          sellCount: combinedLogs.filter((log: any) => log.orderType === "SELL")
            .length,
        });

        const filteredLogs = combinedLogs.filter((log: any) => {
          const logUser = log.args?.user?.toLowerCase();
          const matches = logUser === userAddress;

          // Debug ALL logs, not just matching ones
          if (log.orderType === "SELL") {
            console.log("🔍 Checking SELL log:", {
              txHash: log.transactionHash,
              orderType: log.orderType,
              logUser,
              userAddress,
              matches,
              userMatches: logUser === userAddress,
            });
          }

          if (matches) {
            console.log("✅ Matching log:", {
              txHash: log.transactionHash,
              orderType: log.orderType,
              hasOrderType: "orderType" in log,
              user: log.args?.user,
              isSell: log.orderType === "SELL",
              isBuy: log.orderType === "BUY",
            });

            // CRITICAL: Verify orderType is still present after filtering
            if (
              !log.orderType ||
              (log.orderType !== "BUY" && log.orderType !== "SELL")
            ) {
              console.error("❌ CRITICAL: orderType lost during filtering!", {
                txHash: log.transactionHash,
                orderType: log.orderType,
                logKeys: Object.keys(log),
              });
            }
          } else if (log.orderType === "SELL") {
            console.warn("⚠️ SELL log did NOT match user filter:", {
              txHash: log.transactionHash,
              logUser,
              userAddress,
              orderType: log.orderType,
            });
          }
          return matches;
        });

        console.log("🎯 Filtered logs for user:", {
          count: filteredLogs.length,
          orderTypes: filteredLogs.map((log: any) => log.orderType),
          sellCount: filteredLogs.filter((log: any) => log.orderType === "SELL")
            .length,
          buyCount: filteredLogs.filter((log: any) => log.orderType === "BUY")
            .length,
        });

        const timestampMap = await buildBlockTimestampMap(filteredLogs);

        const parsedActivities = filteredLogs
          .map((log: any) => {
            // CRITICAL: Get orderType directly from log - it should already be set when we tagged the logs
            // This is the source of truth since we tagged them when fetched
            let orderType: "BUY" | "SELL" = log.orderType;

            console.log("🔍 Processing filtered log:", {
              txHash: log.transactionHash,
              logOrderType: log.orderType,
              hasOrderType: "orderType" in log,
              orderTypeValue: orderType,
              isSELL: log.orderType === "SELL",
              isBUY: log.orderType === "BUY",
            });

            // Verify event signature as a double-check, but TRUST the log.orderType first
            const verifiedType = getEventTypeFromLog(log);

            // Only override if orderType is missing or invalid, OR if there's a clear mismatch
            if (!orderType || (orderType !== "BUY" && orderType !== "SELL")) {
              // If orderType is missing, use verified type or fallback
              if (verifiedType) {
                orderType = verifiedType;
                console.log(
                  "🔧 Using verified type (orderType was missing):",
                  orderType,
                );
              } else {
                // Last resort: check if this log is in the sellLogs array
                const isInSellLogs = sellLogs.some(
                  (sellLog: any) =>
                    sellLog.transactionHash === log.transactionHash &&
                    sellLog.logIndex === log.logIndex,
                );
                orderType = isInSellLogs ? "SELL" : "BUY";
                console.log(
                  "🔧 Determined orderType from array check:",
                  orderType,
                );
              }
            } else if (verifiedType && orderType !== verifiedType) {
              // If there's a mismatch, log it but TRUST the log.orderType (it was set when fetched)
              console.warn(
                "⚠️ Mismatch between log.orderType and verified type:",
                {
                  txHash: log.transactionHash,
                  logOrderType: orderType,
                  verifiedType,
                  topics0: log.topics?.[0],
                  decision: "Using log.orderType (source of truth)",
                },
              );
              // Keep the log.orderType - it's more reliable since we set it when fetching
            } else if (verifiedType) {
              console.log("✅ OrderType matches verified type:", orderType);
            }

            // FINAL CHECK: Ensure orderType is definitely SELL or BUY
            if (orderType !== "BUY" && orderType !== "SELL") {
              console.error(
                "❌ CRITICAL: Invalid orderType after all checks:",
                orderType,
              );
              // Last resort fallback
              const isInSellLogs = sellLogs.some(
                (sellLog: any) =>
                  sellLog.transactionHash === log.transactionHash &&
                  sellLog.logIndex === log.logIndex,
              );
              orderType = isInSellLogs ? "SELL" : "BUY";
              console.log("🔧 Final fallback - set orderType to:", orderType);
            }

            // Verify orderType is set correctly
            if (!orderType || (orderType !== "BUY" && orderType !== "SELL")) {
              console.error("❌ CRITICAL: Missing or invalid orderType!", {
                txHash: log.transactionHash,
                orderType: log.orderType,
                verifiedType,
                logKeys: Object.keys(log),
                hasOrderType: "orderType" in log,
              });
              // This should never happen if logs are tagged correctly
              // But if it does, we'll log an error and skip this log
              return null;
            }

            // Explicit logging for SELL orders
            if (orderType === "SELL") {
              console.log("🔴🔴🔴 PROCESSING SELL ORDER:", {
                txHash: log.transactionHash,
                orderType,
                logOrderType: log.orderType,
                verifiedType,
                user: log.args?.user,
              });
            }

            console.log("🔄 Processing order:", {
              txHash: log.transactionHash,
              orderType,
              logOrderType: log.orderType,
              verifiedType,
              user: log.args?.user,
              assetAmount: log.args?.assetAmount?.toString(),
              usdcAmount: log.args?.usdcAmount?.toString(),
            });

            const activity = mapLogToActivity(
              log,
              orderType,
              timestampMap[log.blockNumber?.toString()] ?? Date.now(),
            );

            // Explicit logging for SELL activities
            if (orderType === "SELL") {
              console.log("🔴🔴🔴 CREATED SELL ACTIVITY:", {
                id: activity.id,
                action: activity.action,
                transactionType: activity.transactionType,
                expectedAction: "Sold",
                actualAction: activity.action,
                isCorrect: activity.action === "Sold",
              });
            }

            console.log("✅ Created activity:", {
              id: activity.id,
              action: activity.action,
              transactionType: activity.transactionType,
              expectedAction: orderType === "BUY" ? "Purchased" : "Sold",
              matches:
                activity.action ===
                (orderType === "BUY" ? "Purchased" : "Sold"),
            });

            return activity;
          })
          .filter((activity): activity is ActivityEvent => activity !== null);

        parsedActivities.sort(
          (a, b) => (b.blockNumber ?? 0) - (a.blockNumber ?? 0),
        );

        setAllTransactions(parsedActivities);
        setActivities(parsedActivities.slice(0, showCount));
        setHasMore(parsedActivities.length > showCount);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setActivities([]);
        setAllTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOrders();
  }, [publicClient, userAddress, ordersAddress, showCount, tokenDecimals]);

  // Update displayed activities when showCount changes
  useEffect(() => {
    if (allTransactions.length > 0) {
      setActivities(allTransactions.slice(0, showCount));
      setHasMore(allTransactions.length > showCount);
    }
  }, [showCount, allTransactions]);

  const loadMore = () => {
    setShowCount((prev) => prev + 5);
  };

  return { activities, isLoading, hasMore, loadMore };
}
