import { StockData } from "@/lib/types/markets";
import { formatMarketCap, formatVolume } from "@/lib/utils/formatters";
import { clientCacheHelpers } from "@/lib/cache/client-cache";
import { getEnabledAssetTickers } from "@/lib/types/assets";

// Popular stocks/ETFs with company names - prices will be fetched from API
const popularStocks = [
  // ETFs (from product offering slide)
  {
    ticker: "SGOV",
    name: "iShares 0-3 Month Treasury Bond ETF",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "IWM",
    name: "iShares Russell 2000 ETF",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "XLF",
    name: "Financial Select Sector SPDR Fund",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "XLK",
    name: "Technology Select Sector SPDR Fund",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "XLE",
    name: "Energy Select Sector SPDR Fund",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "USHY",
    name: "iShares Broad USD High Yield Corporate Bond ETF",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "LQD",
    name: "iShares iBoxx $ Investment Grade Corporate Bond ETF",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  // Large-cap stocks
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 0, // Will be updated from API
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "META",
    name: "Meta Platforms, Inc.",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
  {
    ticker: "IBM",
    name: "IBM Corporation",
    price: 0,
    change: 0,
    changePercent: 0,
    volume: "0",
    marketCap: "0",
  },
];

export const fetchStockData = async (ticker: string): Promise<StockData> => {
  try {
    const data = await clientCacheHelpers.fetchStockData(ticker);

    // Return a properly formatted StockData object with fallbacks
    return {
      ticker: data.ticker || ticker,
      name: popularStocks.find((s) => s.ticker === ticker)?.name || ticker,
      // Use the current price from API (Alpaca) for display
      price: data.currentPrice ?? null,
      change: data.priceChange ?? null,
      changePercent: data.priceChangePercent ?? null,
      volume: formatVolume(data.volume),
      marketCap: formatMarketCap(data.marketCap),
      dataSource: data.dataSource || "mock",
    };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    // Return a StockData object with null/empty values on error
    return {
      ticker,
      name: popularStocks.find((s) => s.ticker === ticker)?.name || ticker,
      price: null,
      change: null,
      changePercent: null,
      volume: "0",
      marketCap: "$0",
      dataSource: "mock",
    };
  }
};

export const fetchAllStocks = async (): Promise<StockData[]> => {
  try {
    // Use cached batch API to reduce API calls
    // Combine popular stocks with all enabled asset tickers (trade/borrow registry)
    const registryTickers = getEnabledAssetTickers();
    const tickers = Array.from(
      new Set([
        ...popularStocks.map((stock) => stock.ticker),
        ...registryTickers,
      ]),
    );
    const batchData = await clientCacheHelpers.fetchBatchStockData(tickers);

    // Transform batch response to StockData format.
    // Start from popularStocks so we keep nice names for common tickers,
    // then add any extra registry tickers that weren't in popularStocks.
    const resultsFromPopular = popularStocks.map((stock) => {
      const data = batchData[stock.ticker];
      if (!data) {
        return {
          ticker: stock.ticker,
          name: stock.name,
          price: null,
          change: null,
          changePercent: null,
          volume: "0",
          marketCap: "$0",
          dataSource: "error",
        };
      }

      return {
        ticker: data.symbol,
        name: stock.name,
        // Use the current price from batch API for display
        price: data.currentPrice,
        change: data.priceChange,
        changePercent: data.priceChangePercent,
        volume: formatVolume(0), // Batch API doesn't include volume yet
        marketCap: formatMarketCap(0), // Batch API doesn't include market cap yet
        dataSource: data.dataSource,
      };
    });

    // Add missing registry-only tickers
    const popularTickersSet = new Set(popularStocks.map((s) => s.ticker));
    const extraRegistryResults: StockData[] = registryTickers
      .filter((ticker) => !popularTickersSet.has(ticker))
      .map((ticker) => {
        const data = batchData[ticker];
        if (!data) {
          return {
            ticker,
            name: ticker, // Fallback name; UI can override with registry name if needed
            price: null,
            change: null,
            changePercent: null,
            volume: "0",
            marketCap: "$0",
            dataSource: "error",
          };
        }

        return {
          ticker: data.symbol,
          name: ticker,
          // Use the current price from batch API for display
          price: data.currentPrice,
          change: data.priceChange,
          changePercent: data.priceChangePercent,
          volume: formatVolume(0),
          marketCap: formatMarketCap(0),
          dataSource: data.dataSource,
        };
      });

    const allResults = [...resultsFromPopular, ...extraRegistryResults];

    return allResults.filter((stock) => stock !== null) as StockData[];
  } catch (error) {
    console.error("Error fetching stocks in batch:", error);

    // Fallback to individual requests if batch fails
    try {
      const promises = popularStocks.map((stock) =>
        fetchStockData(stock.ticker),
      );
      const results = await Promise.all(promises);
      return results.filter((stock) => stock !== null) as StockData[];
    } catch (fallbackError) {
      console.error("Fallback individual requests also failed:", fallbackError);
      return [];
    }
  }
};

export { popularStocks };
