"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { StockData } from "@/lib/types/markets";
import { fetchAllStocks } from "@/lib/services/marketData";
import { getEnabledAssets } from "@/lib/types/assets";
import { useRouter } from "next/navigation";
import { getAppRoute } from "@/lib/utils";
import { clientCacheHelpers } from "@/lib/cache/client-cache";
import { useLQDPrice } from "@/hooks/api/useLQDPrice";

interface EquityRow {
  ticker: string;
  name: string;
  price: number | null;
  change1h: number | null;
  change24h: number | null;
  changeYTD: number | null;
}

export default function EquitiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [equities, setEquities] = useState<EquityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingYTD, setLoadingYTD] = useState<Set<string>>(new Set());
  const [loading1h, setLoading1h] = useState<Set<string>>(new Set());

  // Use the same LQD price source as other pages
  const {
    latestPrice: lqdPrice,
    previousClose: lqdPrevClose,
    dailyChangePercent: lqdDailyChange,
  } = useLQDPrice();

  // Fetch 1-hour change for a ticker
  const fetch1hChange = useCallback(async (ticker: string) => {
    setLoading1h((prev) => {
      if (prev.has(ticker)) return prev;
      return new Set(prev).add(ticker);
    });

    try {
      // Fetch 1-hour bars from Alpaca API
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const response = await fetch(
        `/api/stocks/${ticker}?range=7d`, // Use 7d range which fetches 1Hour bars
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch 1h data for ${ticker}`);
      }

      const stockData = await response.json();

      if (
        stockData?.data &&
        Array.isArray(stockData.data) &&
        stockData.data.length >= 2
      ) {
        // Get current price - prefer API's currentPrice, otherwise use latest bar
        const currentPrice =
          stockData.currentPrice ||
          stockData.data[stockData.data.length - 1]?.close ||
          stockData.data[stockData.data.length - 1]?.c;

        // Find the bar closest to 1 hour ago
        const oneHourAgoTime = oneHourAgo.getTime();
        let oneHourAgoBar = null;
        let minTimeDiff = Infinity;

        // Sort bars by time to ensure we're working with chronological data
        const sortedBars = [...stockData.data].sort((a, b) => {
          const timeA = new Date(a.time || a.t).getTime();
          const timeB = new Date(b.time || b.t).getTime();
          return timeA - timeB;
        });

        for (const bar of sortedBars) {
          const barTime = new Date(bar.time || bar.t).getTime();
          const timeDiff = Math.abs(barTime - oneHourAgoTime);

          // Only consider bars that are before or at the 1-hour mark
          if (barTime <= oneHourAgoTime && timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            oneHourAgoBar = bar;
          }
        }

        // If no bar found before 1 hour ago, use the second-to-last bar as fallback
        if (!oneHourAgoBar && sortedBars.length >= 2) {
          oneHourAgoBar = sortedBars[sortedBars.length - 2];
        }

        if (oneHourAgoBar && currentPrice) {
          const oneHourAgoPrice = oneHourAgoBar.close || oneHourAgoBar.c;
          const change1h =
            oneHourAgoPrice > 0
              ? ((currentPrice - oneHourAgoPrice) / oneHourAgoPrice) * 100
              : null;

          setEquities((prev) => {
            return prev.map((eq) => {
              if (eq.ticker === ticker) {
                return { ...eq, change1h: change1h };
              }
              return eq;
            });
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching 1h data for ${ticker}:`, error);
    } finally {
      setLoading1h((prev) => {
        const next = new Set(prev);
        next.delete(ticker);
        return next;
      });
    }
  }, []); // Empty deps - function is stable

  // Fetch YTD change for a ticker
  const fetchYTDChange = useCallback(async (ticker: string) => {
    setLoadingYTD((prev) => {
      if (prev.has(ticker)) return prev;
      return new Set(prev).add(ticker);
    });

    try {
      // Fetch historical data to calculate YTD
      const stockData = await clientCacheHelpers.fetchStockData(ticker);

      if (
        stockData?.data &&
        Array.isArray(stockData.data) &&
        stockData.data.length > 0
      ) {
        // Get start of year date
        const startOfYear = new Date();
        startOfYear.setMonth(0);
        startOfYear.setDate(1);
        startOfYear.setHours(0, 0, 0, 0);

        // Find the first data point from this year
        const currentPrice =
          stockData.currentPrice ||
          stockData.data[stockData.data.length - 1]?.close;
        const yearStartData = stockData.data.find((bar: any) => {
          const barDate = new Date(bar.time || bar.t);
          return barDate >= startOfYear;
        });

        if (yearStartData && currentPrice) {
          const yearStartPrice = yearStartData.close || yearStartData.c;
          const ytdChange =
            yearStartPrice > 0
              ? ((currentPrice - yearStartPrice) / yearStartPrice) * 100
              : null;

          setEquities((prev) => {
            return prev.map((eq) => {
              if (eq.ticker === ticker) {
                return { ...eq, changeYTD: ytdChange };
              }
              return eq;
            });
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching YTD data for ${ticker}:`, error);
    } finally {
      setLoadingYTD((prev) => {
        const next = new Set(prev);
        next.delete(ticker);
        return next;
      });
    }
  }, []);

  // Fetch all equities on mount
  useEffect(() => {
    const loadEquities = async () => {
      try {
        setLoading(true);
        const results = await fetchAllStocks();

        // Get assets from registry and convert to EquityRow format
        const registryAssets = getEnabledAssets();

        // Merge API results with registry assets
        const mergedEquities = new Map<string, EquityRow>();

        // First, add all API results
        results.forEach((stock) => {
          mergedEquities.set(stock.ticker, {
            ticker: stock.ticker,
            name: stock.name,
            price: stock.price,
            change1h: stock.changePercent, // Use daily change as approximation for 1h
            change24h: stock.changePercent, // 24h change from API
            changeYTD: null, // Will be calculated separately
          });
        });

        // Then, add/update with registry assets
        registryAssets.forEach((asset) => {
          const existing = mergedEquities.get(asset.ticker);
          if (existing) {
            // Update name from registry but keep API price data
            mergedEquities.set(asset.ticker, {
              ...existing,
              name: asset.name,
            });
          } else {
            // Add new asset from registry
            mergedEquities.set(asset.ticker, {
              ticker: asset.ticker,
              name: asset.name,
              price: null,
              change1h: null,
              change24h: null,
              changeYTD: null,
            });
          }
        });

        const equitiesList = Array.from(mergedEquities.values());
        setEquities(equitiesList);

        // Fetch 1h and YTD data for all equities after state is set
        // Only fetch once per ticker to avoid infinite loops
        setTimeout(() => {
          equitiesList.forEach((equity) => {
            if (equity.ticker) {
              fetch1hChange(equity.ticker);
              fetchYTDChange(equity.ticker);
            }
          });
        }, 100);
      } catch (error) {
        console.error("Error fetching equities:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEquities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - fetch functions are stable

  // Update LQD equity with accurate price
  useEffect(() => {
    if (lqdPrice !== null && equities.length > 0) {
      setEquities((prevEquities) => {
        return prevEquities.map((equity) => {
          if (equity.ticker === "LQD") {
            const change24h = lqdDailyChange ?? null;
            return {
              ...equity,
              price: lqdPrice,
              // Keep existing change1h if already calculated, otherwise use daily change as fallback
              change1h: equity.change1h ?? change24h,
              change24h: change24h,
            };
          }
          return equity;
        });
      });
    }
  }, [lqdPrice, lqdDailyChange, equities.length]);

  // Fetch 1h change for LQD as well (only once)
  useEffect(() => {
    if (equities.length > 0) {
      const lqdEquity = equities.find((eq) => eq.ticker === "LQD");
      if (lqdEquity && !loading1h.has("LQD")) {
        fetch1hChange("LQD");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equities.length]); // Only depend on equities.length, fetch1hChange is stable

  // Filter equities based on search term
  const filteredEquities = useMemo(() => {
    if (!searchTerm.trim()) {
      return equities;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return equities.filter((equity) => {
      const tickerLower = equity.ticker.toLowerCase();
      const nameLower = equity.name.toLowerCase();

      return (
        tickerLower.includes(searchLower) || nameLower.includes(searchLower)
      );
    });
  }, [equities, searchTerm]);

  const handleSelectEquity = (ticker: string) => {
    router.push(getAppRoute(`/app/trade?ticker=${ticker}`));
  };

  const formatPercent = (value: number | null): string => {
    if (value === null) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getPercentColor = (value: number | null): string => {
    if (value === null) return "text-slate-400";
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getBarColor = (value: number | null): string => {
    if (value === null) return "bg-slate-200";
    return value >= 0 ? "bg-green-500" : "bg-red-500";
  };

  const getBarWidth = (value: number | null): string => {
    if (value === null) return "0%";
    // Normalize to 0-100% for display (cap at 100%)
    const absValue = Math.min(Math.abs(value), 100);
    return `${absValue}%`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 md:px-0">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">
          Available Equities
        </h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search equities (e.g., AAPL, TSLA, MSFT, LQD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-[#004040]/20"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Equities List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-500">Loading equities...</span>
        </div>
      ) : filteredEquities.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {searchTerm ? (
            <>No equities found matching &quot;{searchTerm}&quot;</>
          ) : (
            <>No equities available</>
          )}
        </div>
      ) : (
        <div className="border border-slate-200 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    Ticker
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    1h %
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    24h %
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    YTD %
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEquities.map((equity) => (
                  <tr
                    key={equity.ticker}
                    onClick={() => handleSelectEquity(equity.ticker)}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {equity.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-700">
                        {equity.ticker}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">
                        {equity.price !== null
                          ? `$${equity.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : "—"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div
                          className={`text-sm font-medium ${getPercentColor(equity.change1h)}`}
                        >
                          {loading1h.has(equity.ticker) ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          ) : (
                            formatPercent(equity.change1h)
                          )}
                        </div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          {!loading1h.has(equity.ticker) && (
                            <div
                              className={`h-full ${getBarColor(equity.change1h)} transition-all`}
                              style={{ width: getBarWidth(equity.change1h) }}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div
                          className={`text-sm font-medium ${getPercentColor(equity.change24h)}`}
                        >
                          {formatPercent(equity.change24h)}
                        </div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getBarColor(equity.change24h)} transition-all`}
                            style={{ width: getBarWidth(equity.change24h) }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div
                          className={`text-sm font-medium ${getPercentColor(equity.changeYTD)}`}
                        >
                          {loadingYTD.has(equity.ticker) ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          ) : (
                            formatPercent(equity.changeYTD)
                          )}
                        </div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          {!loadingYTD.has(equity.ticker) && (
                            <div
                              className={`h-full ${getBarColor(equity.changeYTD)} transition-all`}
                              style={{ width: getBarWidth(equity.changeYTD) }}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
