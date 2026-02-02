"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, X, Plus, Loader2, ChevronDown } from "lucide-react";
import { StockData } from "@/lib/types/markets";
import { fetchAllStocks } from "@/lib/services/marketData";
import { useLQDPrice } from "@/hooks/api/useLQDPrice";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useVault } from "@/hooks/writes/onChain/useVault";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useConfig } from "wagmi";
import { toast } from "sonner";
import { getEnabledAssets } from "@/lib/types/assets";

interface EquitySearchProps {
  onSelectEquity?: (equity: StockData) => void;
  selectedEquity?: StockData | null;
  onVaultCreated?: () => void;
}

export function EquitySearch({
  onSelectEquity,
  selectedEquity,
  onVaultCreated,
}: EquitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const { latestPrice: lqdPrice, previousClose: lqdPrevClose } = useLQDPrice();
  const [creatingVaultFor, setCreatingVaultFor] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { createVault, isCreateVaultPending, vatAddress } = useVault();
  const config = useConfig();

  // Check if vatAddress is valid (not zero address)
  const isValidVatAddress =
    vatAddress && vatAddress !== "0x0000000000000000000000000000000000000000";

  // Fetch chart data (same as trade page and vault deposit)

  // Fetch stocks on mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const results = await fetchAllStocks();

        // Assets configured in the on-chain registry (same as trade page)
        const registryAssets = getEnabledAssets();

        // Ensure LQD is always included even if API fails
        // LQD price will be updated from useMarketData hook
        const lqdStock: StockData = {
          ticker: "LQD",
          name: "iShares iBoxx $ Investment Grade Corporate Bond ETF",
          price: null, // Will be updated from useMarketData
          change: null,
          changePercent: null,
          volume: "0",
          marketCap: "$0",
          dataSource: "mock",
        };
        const hasLQD = results.some((s) => s.ticker === "LQD");
        const stocksWithLQD = hasLQD ? results : [...results, lqdStock];

        // Merge in all enabled assets from the registry so the borrow page
        // shows the same "available equities" as the trade page
        const mergedStocks: StockData[] = [...stocksWithLQD];

        for (const asset of registryAssets) {
          const exists = mergedStocks.some(
            (s) => s.ticker.toUpperCase() === asset.ticker.toUpperCase(),
          );
          if (exists) continue;

          mergedStocks.push({
            ticker: asset.ticker,
            name: asset.name,
            price: null,
            change: null,
            changePercent: null,
            volume: "0",
            marketCap: "$0",
            dataSource: "registry",
          });
        }

        setStocks(mergedStocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        // Fallback: include all enabled registry assets, and make sure LQD is present
        const registryAssets = getEnabledAssets();

        const baseStocks: StockData[] = registryAssets.map((asset) => ({
          ticker: asset.ticker,
          name: asset.name,
          price: null,
          change: null,
          changePercent: null,
          volume: "0",
          marketCap: "$0",
          dataSource: "registry",
        }));

        const hasLQD = baseStocks.some((s) => s.ticker === "LQD");
        const lqdStock: StockData = {
          ticker: "LQD",
          name: "iShares iBoxx $ Investment Grade Corporate Bond ETF",
          price: null,
          change: null,
          changePercent: null,
          volume: "0",
          marketCap: "$0",
          dataSource: "mock",
        };

        setStocks(hasLQD ? baseStocks : [lqdStock, ...baseStocks]);
      } finally {
        setLoading(false);
      }
    };
    loadStocks();
  }, []);

  // Update LQD stock with accurate price from useMarketData
  useEffect(() => {
    if (lqdPrice !== null && stocks.length > 0) {
      setStocks((prevStocks) => {
        const updatedStocks = prevStocks.map((stock) => {
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
        return updatedStocks;
      });

      // Also update selectedEquity if it's LQD and price is not already set
      if (
        selectedEquity?.ticker === "LQD" &&
        onSelectEquity &&
        selectedEquity.price !== lqdPrice
      ) {
        const change = lqdPrevClose ? lqdPrice - lqdPrevClose : null;
        const changePercent =
          lqdPrevClose && lqdPrevClose > 0
            ? ((lqdPrice - lqdPrevClose) / lqdPrevClose) * 100
            : null;
        onSelectEquity({
          ...selectedEquity,
          price: lqdPrice,
          change: change,
          changePercent: changePercent,
        });
      }
    }
  }, [lqdPrice, lqdPrevClose, stocks.length, selectedEquity, onSelectEquity]);

  // Filter stocks based on search term - searchable by ticker, name, or partial matches
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

      // Exact ticker match (highest priority)
      if (tickerLower === searchLower) return true;

      // Ticker starts with search term
      if (tickerLower.startsWith(searchLower)) return true;

      // Ticker contains search term
      if (tickerLower.includes(searchLower)) return true;

      // Name contains search term (word boundary aware)
      if (nameLower.includes(searchLower)) return true;

      // Check if any word in the name starts with the search term
      const nameWords = nameLower.split(/\s+/);
      if (nameWords.some((word) => word.startsWith(searchLower))) return true;

      return false;
    });
  }, [stocks, searchTerm]);

  // Helper function to convert ticker to ILK bytes32
  const tickerToIlk = (ticker: string): `0x${string}` => {
    // Convert ticker to bytes32 hex string
    // Example: "LQD" -> "0x4c51440000000000000000000000000000000000000000000000000000000000"
    let hex = "0x";
    for (let i = 0; i < ticker.length && i < 32; i++) {
      hex += ticker.charCodeAt(i).toString(16).padStart(2, "0");
    }
    // Pad with zeros to 64 hex characters (32 bytes)
    hex = hex.padEnd(66, "0");
    return hex as `0x${string}`;
  };

  const handleCreateVault = async (stock: StockData) => {
    setCreatingVaultFor(stock.ticker);
    try {
      toast.loading(`Creating vault for ${stock.ticker}...`, {
        id: `create-vault-${stock.ticker}`,
      });
      const ilk = tickerToIlk(stock.ticker);
      console.log(`🔨 Creating vault for ${stock.ticker} with ILK:`, ilk);
      const txHash = await createVault(ilk);
      console.log(`✅ Vault creation transaction sent:`, txHash);
      toast.loading("Waiting for confirmation...", {
        id: `create-vault-${stock.ticker}`,
      });
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });
      console.log(`✅ Vault creation confirmed in block:`, receipt.blockNumber);
      toast.success(`Vault created successfully for ${stock.ticker}!`, {
        id: `create-vault-${stock.ticker}`,
      });

      // Trigger refetch of vault positions after successful creation
      // Wait a bit for the blockchain state to update
      setTimeout(() => {
        console.log(`🔄 Triggering vault positions refresh...`);
        onVaultCreated?.();
      }, 2000);
    } catch (error: any) {
      console.error("❌ Create vault error:", error);
      toast.error(
        error?.message || `Failed to create vault for ${stock.ticker}`,
        { id: `create-vault-${stock.ticker}` },
      );
    } finally {
      setCreatingVaultFor(null);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onSelectEquity?.(null as any);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search equities (e.g., AAPL, TSLA, MSFT, LQD)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-[#004040]/20"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Investment Options Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">
            Loading investment options...
          </span>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No equities found matching &quot;{searchTerm}&quot;</p>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] py-4 text-base font-semibold">
                  Token
                </TableHead>
                <TableHead className="py-4 text-base font-semibold">
                  Name
                </TableHead>
                <TableHead className="text-right py-4 text-base font-semibold">
                  Price
                </TableHead>
                <TableHead className="text-right py-4 text-base font-semibold">
                  24h Change
                </TableHead>
                <TableHead className="text-right w-[200px] py-4 text-base font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Render first 5 stocks */}
              {filteredStocks.slice(0, 5).map((stock) => {
                const isCreating = creatingVaultFor === stock.ticker;
                const isPending = isCreateVaultPending && isCreating;

                return (
                  <TableRow key={stock.ticker} className="hover:bg-slate-50/50">
                    {/* Token/Ticker (Leftmost) */}
                    <TableCell className="font-medium py-6">
                      <div className="font-semibold text-lg text-slate-900">
                        {stock.ticker}
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell className="py-6">
                      <div className="text-base text-slate-700">
                        {stock.name}
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="text-right py-6">
                      {stock.price !== null ? (
                        <div className="font-semibold text-lg text-slate-900">
                          $
                          {stock.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>

                    {/* 24h Change */}
                    <TableCell className="text-right py-6">
                      {stock.changePercent !== null ? (
                        <div
                          className={`flex items-center justify-end gap-1 font-semibold text-lg ${
                            stock.changePercent >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <TrendingDown className="h-5 w-5" />
                          )}
                          <span>
                            {stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right py-6">
                      {stock.ticker !== "LQD" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Button
                                  onClick={() => handleCreateVault(stock)}
                                  isDisabled={true}
                                  className="bg-[#004040] hover:bg-[#004040]/90 text-white text-sm py-2 px-4 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                                  size="sm"
                                >
                                  <Plus className="mr-1.5 h-4 w-4" />
                                  Create Vault
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Coming soon</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Button
                          onClick={() => handleCreateVault(stock)}
                          isDisabled={isPending || !isValidVatAddress}
                          className="bg-[#004040] hover:bg-[#004040]/90 text-white text-sm py-2 px-4 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                          size="sm"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : !isValidVatAddress ? (
                            <>
                              <Plus className="mr-1.5 h-4 w-4" />
                              Switch Network
                            </>
                          ) : (
                            <>
                              <Plus className="mr-1.5 h-4 w-4" />
                              Create Vault
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Render remaining stocks when expanded */}
              {isExpanded &&
                filteredStocks.slice(5).map((stock) => {
                  const isCreating = creatingVaultFor === stock.ticker;
                  const isPending = isCreateVaultPending && isCreating;

                  return (
                    <TableRow
                      key={stock.ticker}
                      className="hover:bg-slate-50/50"
                    >
                      {/* Token/Ticker (Leftmost) */}
                      <TableCell className="font-medium py-6">
                        <div className="font-semibold text-lg text-slate-900">
                          {stock.ticker}
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell className="py-6">
                        <div className="text-base text-slate-700">
                          {stock.name}
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right py-6">
                        {stock.price !== null ? (
                          <div className="font-semibold text-lg text-slate-900">
                            $
                            {stock.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>

                      {/* 24h Change */}
                      <TableCell className="text-right py-6">
                        {stock.changePercent !== null ? (
                          <div
                            className={`flex items-center justify-end gap-1 font-semibold text-lg ${
                              stock.changePercent >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stock.changePercent >= 0 ? (
                              <TrendingUp className="h-5 w-5" />
                            ) : (
                              <TrendingDown className="h-5 w-5" />
                            )}
                            <span>
                              {stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right py-6">
                        {stock.ticker !== "LQD" ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Button
                                    onClick={() => handleCreateVault(stock)}
                                    isDisabled={true}
                                    className="bg-[#004040] hover:bg-[#004040]/90 text-white text-sm py-2 px-4 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="sm"
                                  >
                                    <Plus className="mr-1.5 h-4 w-4" />
                                    Create Vault
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Coming soon</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Button
                            onClick={() => handleCreateVault(stock)}
                            isDisabled={isPending || !isValidVatAddress}
                            className="bg-[#004040] hover:bg-[#004040]/90 text-white text-sm py-2 px-4 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                            size="sm"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : !isValidVatAddress ? (
                              <>
                                <Plus className="mr-1.5 h-4 w-4" />
                                Switch Network
                              </>
                            ) : (
                              <>
                                <Plus className="mr-1.5 h-4 w-4" />
                                Create Vault
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {/* Show More / Show Less button - Always at the bottom */}
          {filteredStocks.length > 5 && (
            <div className="flex items-center justify-center w-full border-t border-slate-200 pt-4 mt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center text-slate-600 font-medium hover:text-slate-900 transition-colors"
              >
                <span className="mr-2">
                  {isExpanded
                    ? "Show Less"
                    : `${filteredStocks.length - 5} more ${filteredStocks.length - 5 === 1 ? "option" : "options"}`}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
