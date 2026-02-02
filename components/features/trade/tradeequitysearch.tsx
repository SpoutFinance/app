"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, ChevronDown } from "lucide-react";
import { StockData } from "@/lib/types/markets";
import { fetchAllStocks } from "@/lib/services/marketData";
import { getEnabledAssets } from "@/lib/types/assets";
import { useLQDPrice } from "@/hooks/api/useLQDPrice";

interface TradeEquitySearchProps {
  selectedToken: string;
  onSelectToken: (ticker: string) => void;
}

export function TradeEquitySearch({
  selectedToken,
  onSelectToken,
}: TradeEquitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the same LQD price source as the borrow page (useLQDPrice → useAssetPrice("LQD"))
  const { latestPrice: lqdPrice, previousClose: lqdPrevClose } = useLQDPrice();

  // Fetch stocks on mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const results = await fetchAllStocks();

        // Get assets from registry and convert to StockData format
        const registryAssets = getEnabledAssets().map(
          (asset): StockData => ({
            ticker: asset.ticker,
            name: asset.name,
            price: null, // Will be fetched from API if available
            change: null,
            changePercent: null,
            volume: "0",
            marketCap: "$0",
            dataSource: "registry",
          }),
        );

        // Merge API results with registry assets
        // Registry assets take precedence for names, but API prices are preferred
        const mergedStocks = new Map<string, StockData>();

        // First, add all API results
        results.forEach((stock) => {
          mergedStocks.set(stock.ticker, stock);
        });

        // Then, add/update with registry assets (preserve API prices if available)
        registryAssets.forEach((registryStock) => {
          const existing = mergedStocks.get(registryStock.ticker);
          if (existing) {
            // Update name from registry but keep API price data
            mergedStocks.set(registryStock.ticker, {
              ...existing,
              name: registryStock.name, // Use registry name (more accurate)
            });
          } else {
            // Add new asset from registry
            mergedStocks.set(registryStock.ticker, registryStock);
          }
        });

        setStocks(Array.from(mergedStocks.values()));
      } catch (error) {
        console.error("Error fetching stocks:", error);
        // Fallback: use registry assets only
        const registryAssets = getEnabledAssets().map(
          (asset): StockData => ({
            ticker: asset.ticker,
            name: asset.name,
            price: null,
            change: null,
            changePercent: null,
            volume: "0",
            marketCap: "$0",
            dataSource: "registry",
          }),
        );
        setStocks(registryAssets);
      } finally {
        setLoading(false);
      }
    };
    loadStocks();
  }, []);

  // Update LQD stock with accurate price (same logic as borrow EquitySearch)
  useEffect(() => {
    if (lqdPrice !== null && stocks.length > 0) {
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          if (stock.ticker === "LQD") {
            const change = lqdPrevClose ? lqdPrice - lqdPrevClose : null;
            const changePercent =
              lqdPrevClose && lqdPrevClose > 0
                ? ((lqdPrice - lqdPrevClose) / lqdPrevClose) * 100
                : null;
            return {
              ...stock,
              price: lqdPrice,
              change: change,
              changePercent: changePercent,
            };
          }
          return stock;
        });
      });
    }
  }, [lqdPrice, lqdPrevClose, stocks.length]);

  // Filter stocks based on search term
  const filteredStocks = useMemo(() => {
    if (!searchTerm.trim()) {
      // Show all stocks, prioritize LQD first
      const lqdStock = stocks.find((s) => s.ticker === "LQD");
      const otherStocks = stocks.filter((s) => s.ticker !== "LQD");
      return lqdStock ? [lqdStock, ...otherStocks] : stocks;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return stocks.filter((stock) => {
      const tickerLower = stock.ticker.toLowerCase();
      const nameLower = stock.name.toLowerCase();

      if (tickerLower === searchLower) return true;
      if (tickerLower.startsWith(searchLower)) return true;
      if (tickerLower.includes(searchLower)) return true;
      if (nameLower.includes(searchLower)) return true;

      const nameWords = nameLower.split(/\s+/);
      if (nameWords.some((word) => word.startsWith(searchLower))) return true;

      return false;
    });
  }, [stocks, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const handleSelectStock = (ticker: string) => {
    onSelectToken(ticker);
    setSearchTerm(""); // Clear search after selection
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleClear = () => {
    setSearchTerm("");
    setIsDropdownOpen(true); // Keep dropdown open when clearing
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search equities (e.g., AAPL, TSLA, MSFT, LQD)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true); // Open dropdown when typing
          }}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          className="w-full pl-10 pr-10 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-[#004040]/20"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isDropdownOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown - Show when open and not empty */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto"
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                <span className="ml-2 text-sm text-slate-500">
                  Loading investment options...
                </span>
              </div>
            ) : filteredStocks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                {searchTerm ? (
                  <>No equities found matching &quot;{searchTerm}&quot;</>
                ) : (
                  <>No equities available</>
                )}
              </div>
            ) : (
              <div>
                {!searchTerm && (
                  <div className="px-4 py-2 border-b border-slate-200 bg-slate-50">
                    <div className="text-sm font-semibold text-slate-700">
                      Available Equities ({filteredStocks.length})
                    </div>
                  </div>
                )}
                <div className="py-2">
                  {filteredStocks
                    .slice(0, searchTerm ? 10 : filteredStocks.length)
                    .map((stock) => (
                      <button
                        key={stock.ticker}
                        onClick={() => handleSelectStock(stock.ticker)}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                          selectedToken === stock.ticker ? "bg-[#004040]/5" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">
                              {stock.ticker}
                            </div>
                            <div className="text-sm text-slate-500">
                              {stock.name}
                            </div>
                          </div>
                          {stock.price !== null && (
                            <div className="text-right">
                              <div className="font-semibold text-slate-900">
                                $
                                {stock.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                              {stock.changePercent !== null && (
                                <div
                                  className={`text-sm ${
                                    stock.changePercent >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {stock.changePercent >= 0 ? "+" : ""}
                                  {stock.changePercent.toFixed(2)}%
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
