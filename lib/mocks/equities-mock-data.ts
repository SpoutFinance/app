/**
 * Mock data for EquitiesTable
 *
 * This file contains temporary mock data for development/testing purposes.
 * The data format matches the Figma design at:
 * https://www.figma.com/design/mDRMkM1kM0uUmOUAqDqREQ/SF-Internal-Dashboard?node-id=186-2639
 *
 * TO REVERT TO REAL DATA:
 * 1. Open hooks/useEquitiesData.ts
 * 2. Find the comment "// MOCK DATA START" and "// MOCK DATA END"
 * 3. Remove or comment out the mock data block
 * 4. Uncomment the real data fetching logic (marked with "// REAL DATA START" and "// REAL DATA END")
 * 5. Delete this file if no longer needed
 */

import { EquityRow } from "@/components/features/trade/equities/types";

export const MOCK_EQUITIES: EquityRow[] = [
  {
    ticker: "COIN",
    name: "Coinbase Global",
    price: 245.78,
    marketCap: 56.89e9,
    change24h: 6.78,
    change7d: 7.44,
    changeYTD: -2.34,
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 189.84,
    marketCap: 2.95e12,
    change24h: 0.52,
    change7d: 2.18,
    changeYTD: 12.45,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 248.42,
    marketCap: 789.5e9,
    change24h: -1.24,
    change7d: -3.67,
    changeYTD: -8.92,
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.28,
    marketCap: 2.16e12,
    change24h: 3.45,
    change7d: 8.92,
    changeYTD: 85.34,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: 415.56,
    marketCap: 3.09e12,
    change24h: 0.89,
    change7d: 1.45,
    changeYTD: 10.78,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 156.37,
    marketCap: 1.94e12,
    change24h: -0.34,
    change7d: 2.89,
    changeYTD: 15.23,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.92,
    marketCap: 1.87e12,
    change24h: 1.56,
    change7d: 4.23,
    changeYTD: 18.67,
  },
  {
    ticker: "META",
    name: "Meta Platforms Inc.",
    price: 505.95,
    marketCap: 1.29e12,
    change24h: 2.34,
    change7d: 5.67,
    changeYTD: 45.89,
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 198.45,
    marketCap: 571.2e9,
    change24h: -0.78,
    change7d: 1.23,
    changeYTD: 8.45,
  },
  {
    ticker: "V",
    name: "Visa Inc.",
    price: 279.83,
    marketCap: 574.8e9,
    change24h: 0.45,
    change7d: 2.34,
    changeYTD: 6.78,
  },
  {
    ticker: "LQD",
    name: "iShares iBoxx $ Investment Grade Corporate Bond ETF",
    price: 108.92,
    marketCap: 32.5e9,
    change24h: 0.12,
    change7d: 0.45,
    changeYTD: 1.23,
  },
  {
    ticker: "UNH",
    name: "UnitedHealth Group Inc.",
    price: 527.34,
    marketCap: 486.7e9,
    change24h: -1.12,
    change7d: -2.34,
    changeYTD: -5.67,
  },
  {
    ticker: "HD",
    name: "The Home Depot Inc.",
    price: 378.56,
    marketCap: 375.2e9,
    change24h: 0.67,
    change7d: 3.45,
    changeYTD: 9.12,
  },
  {
    ticker: "PG",
    name: "Procter & Gamble Co.",
    price: 162.78,
    marketCap: 383.5e9,
    change24h: 0.23,
    change7d: 0.89,
    changeYTD: 3.45,
  },
  {
    ticker: "MA",
    name: "Mastercard Inc.",
    price: 458.92,
    marketCap: 428.6e9,
    change24h: 0.56,
    change7d: 2.78,
    changeYTD: 7.89,
  },
  {
    ticker: "DIS",
    name: "The Walt Disney Company",
    price: 112.45,
    marketCap: 205.3e9,
    change24h: -0.89,
    change7d: -1.56,
    changeYTD: 4.23,
  },
  {
    ticker: "NFLX",
    name: "Netflix Inc.",
    price: 628.34,
    marketCap: 272.8e9,
    change24h: 1.89,
    change7d: 6.45,
    changeYTD: 32.56,
  },
  {
    ticker: "ADBE",
    name: "Adobe Inc.",
    price: 578.92,
    marketCap: 258.4e9,
    change24h: -0.45,
    change7d: 1.89,
    changeYTD: 5.67,
  },
  {
    ticker: "CRM",
    name: "Salesforce Inc.",
    price: 289.56,
    marketCap: 280.1e9,
    change24h: 0.78,
    change7d: 3.12,
    changeYTD: 11.34,
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices Inc.",
    price: 178.45,
    marketCap: 288.2e9,
    change24h: 2.56,
    change7d: 7.89,
    changeYTD: 28.45,
  },
];

/**
 * Use this flag to easily toggle between mock and real data
 * Set to false to use real API data
 */
export const USE_MOCK_DATA = true;

// ============================================================
// SINGLE TRADE PAGE MOCK DATA
// Used by /app/trade?ticker=<TICKER> page
// ============================================================

export interface MockAssetData {
  ticker: string;
  name: string;
  price: number;
  priceChangePercent: number;
  marketCap: number;
  volume24h: number;
  high52w: number;
  low52w: number;
  // Mock balances
  usdcBalance: number;
  tokenBalance: number;
  // Position data
  avgBuyPrice: number | null;
  // Chart data (simplified - array of {time, close} objects)
  chartData: Array<{ time: string; close: number }>;
}

/**
 * Generate mock chart data for the past 30 days
 */
function generateMockChartData(basePrice: number, volatility: number = 0.02): Array<{ time: string; close: number }> {
  const data: Array<{ time: string; close: number }> = [];
  const now = new Date();
  let price = basePrice * 0.95; // Start 5% lower

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.8);

    data.push({
      time: date.toISOString().split('T')[0],
      close: parseFloat(price.toFixed(2)),
    });
  }

  // Ensure last price matches the mock price
  if (data.length > 0) {
    data[data.length - 1].close = basePrice;
  }

  return data;
}

/**
 * Mock data for individual assets on the trade page
 * Keys are ticker symbols
 */
export const MOCK_ASSET_DATA: Record<string, MockAssetData> = {
  COIN: {
    ticker: "COIN",
    name: "Coinbase Global",
    price: 245.78,
    priceChangePercent: 2.64,
    marketCap: 56.89e9,
    volume24h: 34.6e9,
    high52w: 283.48,
    low52w: 114.51,
    usdcBalance: 125000.0,
    tokenBalance: 19.849657,
    avgBuyPrice: 228.45,
    chartData: generateMockChartData(245.78, 0.03),
  },
  NFLX: {
    ticker: "NFLX",
    name: "Netflix Inc.",
    price: 678.45,
    priceChangePercent: 2.64,
    marketCap: 850.2e9,
    volume24h: 34.6e9,
    high52w: 845.52,
    low52w: 508.06,
    usdcBalance: 125000.0,
    tokenBalance: 0,
    avgBuyPrice: null,
    chartData: generateMockChartData(678.45, 0.025),
  },
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 189.84,
    priceChangePercent: 0.52,
    marketCap: 2.95e12,
    volume24h: 52.3e9,
    high52w: 199.62,
    low52w: 164.08,
    usdcBalance: 125000.0,
    tokenBalance: 45.5,
    avgBuyPrice: 178.25,
    chartData: generateMockChartData(189.84, 0.015),
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 248.42,
    priceChangePercent: -1.24,
    marketCap: 789.5e9,
    volume24h: 28.7e9,
    high52w: 299.29,
    low52w: 138.80,
    usdcBalance: 125000.0,
    tokenBalance: 12.75,
    avgBuyPrice: 265.80,
    chartData: generateMockChartData(248.42, 0.035),
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.28,
    priceChangePercent: 3.45,
    marketCap: 2.16e12,
    volume24h: 45.2e9,
    high52w: 974.00,
    low52w: 473.20,
    usdcBalance: 125000.0,
    tokenBalance: 8.25,
    avgBuyPrice: 520.75,
    chartData: generateMockChartData(875.28, 0.04),
  },
  LQD: {
    ticker: "LQD",
    name: "iShares iBoxx $ Investment Grade Corporate Bond ETF",
    price: 108.92,
    priceChangePercent: 0.12,
    marketCap: 32.5e9,
    volume24h: 1.2e9,
    high52w: 112.45,
    low52w: 104.78,
    usdcBalance: 125000.0,
    tokenBalance: 250.0,
    avgBuyPrice: 106.50,
    chartData: generateMockChartData(108.92, 0.005),
  },
};

/**
 * Get mock data for a specific ticker
 * Returns default mock data if ticker not found
 */
export function getMockAssetData(ticker: string): MockAssetData {
  // Check if we have specific mock data for this ticker
  if (MOCK_ASSET_DATA[ticker]) {
    return MOCK_ASSET_DATA[ticker];
  }

  // Check if we have data in the equities list
  const equityData = MOCK_EQUITIES.find((e) => e.ticker === ticker);
  if (equityData) {
    return {
      ticker: equityData.ticker,
      name: equityData.name,
      price: equityData.price || 100,
      priceChangePercent: equityData.change24h || 0,
      marketCap: equityData.marketCap || 10e9,
      volume24h: (equityData.marketCap || 10e9) * 0.05,
      high52w: (equityData.price || 100) * 1.25,
      low52w: (equityData.price || 100) * 0.75,
      usdcBalance: 125000.0,
      tokenBalance: 0,
      avgBuyPrice: null,
      chartData: generateMockChartData(equityData.price || 100),
    };
  }

  // Return default mock data for unknown tickers
  return {
    ticker,
    name: `${ticker} Token`,
    price: 100.0,
    priceChangePercent: 1.5,
    marketCap: 10e9,
    volume24h: 500e6,
    high52w: 125.0,
    low52w: 75.0,
    usdcBalance: 125000.0,
    tokenBalance: 0,
    avgBuyPrice: null,
    chartData: generateMockChartData(100),
  };
}
