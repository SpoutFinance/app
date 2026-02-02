"use client";

import { useState, useEffect, useMemo } from "react";
import { clientCacheHelpers } from "@/lib/cache/client-cache";
import { useMarketData } from "./useMarketData";

/**
 * Generic hook to fetch asset price data with chart data and market data
 * Works for any ticker symbol (LQD, TSLA, AAPL, etc.)
 * Uses chart data as primary source, falls back to market data API, then useMarketData hook
 *
 * @param ticker - The ticker symbol (e.g., "LQD", "TSLA", "AAPL")
 * @returns Object containing price data, loading states, and price change calculations
 */
export function useAssetPrice(ticker: string) {
  // Hook fallback (refreshes every 10 minutes)
  const {
    price: marketPrice,
    previousClose: marketPrevClose,
    isLoading: marketLoading,
  } = useMarketData(ticker);

  // Chart data state
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Direct market data state (refreshes every 5 minutes)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  // Fetch chart data
  useEffect(() => {
    if (!ticker) {
      setChartData([]);
      setChartLoading(false);
      return;
    }

    async function fetchChartData() {
      try {
        setChartLoading(true);
        const json = await clientCacheHelpers.fetchStockData(ticker);
        if (json.data && Array.isArray(json.data)) {
          setChartData(json.data);
        } else {
          setChartData([]);
        }
      } catch (e) {
        console.error(`Error fetching ${ticker} chart data:`, e);
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    }
    fetchChartData();
  }, [ticker]);

  // Fetch market data directly from Alpaca (refreshes every 5 minutes)
  useEffect(() => {
    if (!ticker) {
      setCurrentPrice(null);
      setPriceLoading(false);
      return;
    }

    let isMounted = true;
    let lastKnownPrice: number | null = null;

    async function fetchPriceData() {
      try {
        setPriceLoading(true);
        const json = await clientCacheHelpers.fetchMarketData(ticker);
        if (!isMounted) return;

        if (json.price && json.price > 0) {
          // Only update if price has actually changed
          if (lastKnownPrice !== json.price) {
            setCurrentPrice(json.price);
            lastKnownPrice = json.price;
          }
        } else {
          setCurrentPrice(null);
        }
      } catch (e) {
        if (isMounted) {
          setCurrentPrice(null);
        }
      } finally {
        if (isMounted) {
          setPriceLoading(false);
        }
      }
    }

    // Initial fetch
    fetchPriceData();

    // Refetch every 5 minutes to reduce Vercel compute usage
    const interval = setInterval(fetchPriceData, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [ticker]);

  // Calculate prices from chart data
  const chartLatestPrice = useMemo(
    () => (chartData.length > 0 ? chartData[chartData.length - 1].close : null),
    [chartData],
  );

  const chartPrevPrice = useMemo(
    () => (chartData.length > 1 ? chartData[chartData.length - 2].close : null),
    [chartData],
  );

  // Priority: chart data → direct market data → hook fallback
  const latestPrice = useMemo(
    () => chartLatestPrice ?? currentPrice ?? marketPrice ?? null,
    [chartLatestPrice, currentPrice, marketPrice],
  );

  const prevPrice = useMemo(
    () =>
      chartPrevPrice ??
      (chartData.length > 0 ? chartData[chartData.length - 1].close : null) ??
      currentPrice ??
      marketPrice ??
      null,
    [chartPrevPrice, chartData, currentPrice, marketPrice],
  );

  // Calculate daily price change percentage
  const dailyChangePercent = useMemo(() => {
    if (prevPrice && prevPrice > 0 && latestPrice) {
      return ((latestPrice - prevPrice) / prevPrice) * 100;
    }
    return 0;
  }, [latestPrice, prevPrice]);

  const isLoading = chartLoading || priceLoading || marketLoading;

  return {
    // Prices
    latestPrice,
    previousPrice: prevPrice,
    previousClose: marketPrevClose,

    // Price change
    dailyChangePercent,

    // Chart data
    chartData,

    // Loading states
    isLoading,
    chartLoading,
    priceLoading,
    marketDataLoading: marketLoading,
  };
}

/**
 * Legacy hook for backward compatibility - wraps useAssetPrice("LQD")
 */
export function useLQDPrice() {
  return useAssetPrice("LQD");
}
