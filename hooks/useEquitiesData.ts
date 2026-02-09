"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchAllStocks } from "@/lib/services/marketData";
import { getEnabledAssets } from "@/lib/types/assets";
import { clientCacheHelpers } from "@/lib/cache/client-cache";
import { useLQDPrice } from "@/hooks/api/useLQDPrice";
import {
  EquityRow,
  Category,
  FilterState,
  initialFilterState,
  ActiveFilter,
} from "@/components/features/trade/equities/types";

/**
 * MOCK DATA IMPORT
 * To revert to real data:
 * 1. Set USE_MOCK_DATA to false in lib/mocks/equities-mock-data.ts, OR
 * 2. Delete the import below and the mock data block in loadEquities()
 */
import { MOCK_EQUITIES, USE_MOCK_DATA } from "@/lib/mocks/equities-mock-data";

interface UseEquitiesDataReturn {
  // Data
  equities: EquityRow[];
  filteredEquities: EquityRow[];
  paginatedEquities: EquityRow[];

  // Loading states
  loading: boolean;
  refreshing: boolean;
  loading7d: Set<string>;
  loadingYTD: Set<string>;

  // Search and filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  appliedFilters: FilterState;
  hasAppliedFilters: boolean;
  activeFilterLabels: ActiveFilter[];
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  removeFilter: (key: string) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
  totalPages: number;
  startItem: number;
  endItem: number;

  // Actions
  handleRefresh: () => Promise<void>;
}

export function useEquitiesData(): UseEquitiesDataReturn {
  // Core data state
  const [equities, setEquities] = useState<EquityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading7d, setLoading7d] = useState<Set<string>>(new Set());
  const [loadingYTD, setLoadingYTD] = useState<Set<string>>(new Set());

  // Search and category
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  // Filters
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(initialFilterState);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // LQD price hook
  const { latestPrice: lqdPrice, dailyChangePercent: lqdDailyChange } =
    useLQDPrice();

  // Fetch 7-day change for a ticker
  const fetch7dChange = useCallback(async (ticker: string) => {
    setLoading7d((prev) => {
      if (prev.has(ticker)) return prev;
      return new Set(prev).add(ticker);
    });

    try {
      const response = await fetch(`/api/stocks/${ticker}?range=7d`);
      if (!response.ok) throw new Error(`Failed to fetch 7d data for ${ticker}`);

      const stockData = await response.json();

      if (stockData?.data?.length >= 2) {
        const currentPrice =
          stockData.currentPrice ||
          stockData.data[stockData.data.length - 1]?.close ||
          stockData.data[stockData.data.length - 1]?.c;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoTime = sevenDaysAgo.getTime();

        const sortedBars = [...stockData.data].sort((a, b) => {
          const timeA = new Date(a.time || a.t).getTime();
          const timeB = new Date(b.time || b.t).getTime();
          return timeA - timeB;
        });

        let sevenDaysAgoBar = sortedBars[0];
        for (const bar of sortedBars) {
          const barTime = new Date(bar.time || bar.t).getTime();
          if (barTime <= sevenDaysAgoTime) {
            sevenDaysAgoBar = bar;
          }
        }

        if (sevenDaysAgoBar && currentPrice) {
          const sevenDaysAgoPrice = sevenDaysAgoBar.close || sevenDaysAgoBar.c;
          const change7d =
            sevenDaysAgoPrice > 0
              ? ((currentPrice - sevenDaysAgoPrice) / sevenDaysAgoPrice) * 100
              : null;

          setEquities((prev) =>
            prev.map((eq) =>
              eq.ticker === ticker ? { ...eq, change7d } : eq
            )
          );
        }
      }
    } catch (error) {
      console.error(`Error fetching 7d data for ${ticker}:`, error);
    } finally {
      setLoading7d((prev) => {
        const next = new Set(prev);
        next.delete(ticker);
        return next;
      });
    }
  }, []);

  // Fetch YTD change for a ticker
  const fetchYTDChange = useCallback(async (ticker: string) => {
    setLoadingYTD((prev) => {
      if (prev.has(ticker)) return prev;
      return new Set(prev).add(ticker);
    });

    try {
      const stockData = await clientCacheHelpers.fetchStockData(ticker);

      if (stockData?.data?.length > 0) {
        const startOfYear = new Date();
        startOfYear.setMonth(0);
        startOfYear.setDate(1);
        startOfYear.setHours(0, 0, 0, 0);

        const currentPrice =
          stockData.currentPrice ||
          stockData.data[stockData.data.length - 1]?.close;
        const yearStartData = stockData.data.find((bar: Record<string, unknown>) => {
          const barDate = new Date((bar.time || bar.t) as string);
          return barDate >= startOfYear;
        });

        if (yearStartData && currentPrice) {
          const yearStartPrice = (yearStartData.close || yearStartData.c) as number;
          const ytdChange =
            yearStartPrice > 0
              ? ((currentPrice - yearStartPrice) / yearStartPrice) * 100
              : null;

          setEquities((prev) =>
            prev.map((eq) =>
              eq.ticker === ticker ? { ...eq, changeYTD: ytdChange } : eq
            )
          );
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

  // Load equities
  const loadEquities = useCallback(async () => {
    try {
      // ============================================================
      // MOCK DATA START
      // To revert to real data: Set USE_MOCK_DATA to false in
      // lib/mocks/equities-mock-data.ts or delete this block and
      // uncomment the "REAL DATA" block below
      // ============================================================
      if (USE_MOCK_DATA) {
        setEquities(MOCK_EQUITIES);
        return;
      }
      // ============================================================
      // MOCK DATA END
      // ============================================================

      // ============================================================
      // REAL DATA START
      // This is the original implementation that fetches live data
      // ============================================================
      const results = await fetchAllStocks();
      const registryAssets = getEnabledAssets();
      const mergedEquities = new Map<string, EquityRow>();

      results.forEach((stock) => {
        mergedEquities.set(stock.ticker, {
          ticker: stock.ticker,
          name: stock.name,
          price: stock.price,
          marketCap: null,
          change24h: stock.changePercent,
          change7d: null,
          changeYTD: null,
        });
      });

      registryAssets.forEach((asset) => {
        const existing = mergedEquities.get(asset.ticker);
        if (existing) {
          mergedEquities.set(asset.ticker, { ...existing, name: asset.name });
        } else {
          mergedEquities.set(asset.ticker, {
            ticker: asset.ticker,
            name: asset.name,
            price: null,
            marketCap: null,
            change24h: null,
            change7d: null,
            changeYTD: null,
          });
        }
      });

      const equitiesList = Array.from(mergedEquities.values());
      setEquities(equitiesList);

      // Fetch additional data
      setTimeout(() => {
        equitiesList.forEach((equity) => {
          if (equity.ticker) {
            fetch7dChange(equity.ticker);
            fetchYTDChange(equity.ticker);
          }
        });
      }, 100);
      // ============================================================
      // REAL DATA END
      // ============================================================
    } catch (error) {
      console.error("Error fetching equities:", error);
    }
  }, [fetch7dChange, fetchYTDChange]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadEquities();
      setLoading(false);
    };
    init();
  }, [loadEquities]);

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEquities();
    setRefreshing(false);
  };

  // Update LQD with accurate price
  useEffect(() => {
    if (lqdPrice !== null && equities.length > 0) {
      setEquities((prev) =>
        prev.map((equity) =>
          equity.ticker === "LQD"
            ? { ...equity, price: lqdPrice, change24h: lqdDailyChange ?? null }
            : equity
        )
      );
    }
  }, [lqdPrice, lqdDailyChange, equities.length]);

  // Filter equities
  const filteredEquities = useMemo(() => {
    let filtered = equities;

    // Category filter
    if (activeCategory === "etfs") {
      filtered = filtered.filter((eq) => eq.ticker === "LQD");
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (eq) =>
          eq.ticker.toLowerCase().includes(searchLower) ||
          eq.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [equities, searchTerm, activeCategory]);

  // Pagination calculations
  const totalItems = filteredEquities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedEquities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEquities.slice(start, start + itemsPerPage);
  }, [filteredEquities, currentPage, itemsPerPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  // Filter handlers
  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, [filters]);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
  }, []);

  // Check if any filters are applied
  const hasAppliedFilters = useMemo(
    () => Object.values(appliedFilters).some((v) => v !== ""),
    [appliedFilters]
  );

  // Get active filter labels
  const activeFilterLabels = useMemo(() => {
    const labels: ActiveFilter[] = [];

    if (appliedFilters.marketCapMin || appliedFilters.marketCapMax) {
      const min = appliedFilters.marketCapMin || "0";
      const max = appliedFilters.marketCapMax || "∞";
      labels.push({ key: "marketCap", label: `Market Cap: $${min}B – $${max}B` });
    }
    if (appliedFilters.change24hMin || appliedFilters.change24hMax) {
      const min = appliedFilters.change24hMin || "-∞";
      const max = appliedFilters.change24hMax || "+∞";
      labels.push({ key: "change24h", label: `24h Change: ${min}% – ${max}%` });
    }
    if (appliedFilters.change7dMin || appliedFilters.change7dMax) {
      const min = appliedFilters.change7dMin || "-∞";
      const max = appliedFilters.change7dMax || "+∞";
      labels.push({ key: "change7d", label: `7d Change: ${min}% – ${max}%` });
    }
    if (appliedFilters.change1mMin || appliedFilters.change1mMax) {
      const min = appliedFilters.change1mMin || "-∞";
      const max = appliedFilters.change1mMax || "+∞";
      labels.push({ key: "change1m", label: `1M Change: ${min}% – ${max}%` });
    }
    if (appliedFilters.change3mMin || appliedFilters.change3mMax) {
      const min = appliedFilters.change3mMin || "-∞";
      const max = appliedFilters.change3mMax || "+∞";
      labels.push({ key: "change3m", label: `3M Change: ${min}% – ${max}%` });
    }

    return labels;
  }, [appliedFilters]);

  // Remove specific filter
  const removeFilter = useCallback(
    (key: string) => {
      const newFilters = { ...appliedFilters };
      switch (key) {
        case "marketCap":
          newFilters.marketCapMin = "";
          newFilters.marketCapMax = "";
          break;
        case "change24h":
          newFilters.change24hMin = "";
          newFilters.change24hMax = "";
          break;
        case "change7d":
          newFilters.change7dMin = "";
          newFilters.change7dMax = "";
          break;
        case "change1m":
          newFilters.change1mMin = "";
          newFilters.change1mMax = "";
          break;
        case "change3m":
          newFilters.change3mMin = "";
          newFilters.change3mMax = "";
          break;
      }
      setAppliedFilters(newFilters);
      setFilters(newFilters);
    },
    [appliedFilters]
  );

  return {
    equities,
    filteredEquities,
    paginatedEquities,
    loading,
    refreshing,
    loading7d,
    loadingYTD,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    filters,
    setFilters,
    appliedFilters,
    hasAppliedFilters,
    activeFilterLabels,
    handleApplyFilters,
    handleClearFilters,
    removeFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    startItem,
    endItem,
    handleRefresh,
  };
}
