import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const maxDuration = 10;
import { fetchWithTimeout } from "@/lib/utils/fetchWithTimeout";

// Check for required environment variables
if (!process.env.APCA_API_KEY_ID || !process.env.APCA_API_SECRET_KEY) {
  console.error("Missing required Alpaca API environment variables");
}

const ALPACA_API_KEY = process.env.APCA_API_KEY_ID ?? "";
const ALPACA_API_SECRET = process.env.APCA_API_SECRET_KEY ?? "";
const DATA_URL = "https://data.alpaca.markets";

interface StockResponse {
  symbol: string;
  currentPrice: number | null;
  priceChange: number | null;
  priceChangePercent: number | null;
  data: any[];
  dataSource: string;
}

interface BatchResponse {
  [ticker: string]: StockResponse;
}

async function fetchBatchStockData(tickers: string[]): Promise<BatchResponse> {
  const results: BatchResponse = {};

  // Process each ticker to get accurate pricing with change data
  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        // Skip LQD as it's handled separately
        if (ticker === "LQD") {
          results[ticker] = {
            symbol: ticker,
            currentPrice: null,
            priceChange: null,
            priceChangePercent: null,
            data: [],
            dataSource: "mock",
          };
          return;
        }

        // Use the exact same logic as /api/marketdata endpoint
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "APCA-API-KEY-ID": ALPACA_API_KEY,
            "APCA-API-SECRET-KEY": ALPACA_API_SECRET,
          },
        };

        let askPrice: number | null = null;
        let bidPrice: number | null = null;

        // Step 1: Get latest quote for fallback price (optional, same as marketdata route)
        try {
          const latestUrl = `${DATA_URL}/v2/stocks/quotes/latest?symbols=${ticker}`;
          const latestRes = await fetchWithTimeout(latestUrl, {
            ...options,
            timeoutMs: 7000,
          });

          if (latestRes.ok) {
            const latestData = (await latestRes.json()) as {
              quotes: {
                [symbol: string]: { ap: number; bp: number; t: string };
              };
            };
            const latestQuote = latestData.quotes?.[ticker];
            askPrice = latestQuote?.ap ?? null;
            bidPrice = latestQuote?.bp ?? null;
          }
        } catch (quoteError) {
          // Quote fetch is optional, continue with bar data
          console.log(
            `Quote fetch failed for ${ticker}, will use bar data only`,
          );
        }

        // Step 2: Get the most recent 10 bars (same as marketdata route)
        const barsUrl = `${DATA_URL}/v2/stocks/bars?symbols=${ticker}&timeframe=1Day&limit=10`;
        const barsRes = await fetchWithTimeout(barsUrl, {
          ...options,
          timeoutMs: 7000,
        });

        if (!barsRes.ok) {
          throw new Error(
            `Failed to fetch bars for ${ticker}: ${barsRes.status}`,
          );
        }

        const barsData = (await barsRes.json()) as {
          bars: { [symbol: string]: Array<{ c: number; t: string }> };
        };

        const bars = barsData.bars?.[ticker] ?? [];
        const sortedBars = bars
          .filter((b) => typeof b?.c === "number")
          .sort((a, b) => new Date(b.t).getTime() - new Date(a.t).getTime());

        const currentBar = sortedBars[0] ?? null;
        const previousBar = sortedBars[1] ?? null;

        // Helper to choose first valid positive number (same as marketdata route)
        const firstValid = (...vals: Array<number | null | undefined>) =>
          vals.find((v) => typeof v === "number" && isFinite(v) && v > 0) ??
          null;

        // Robust fallbacks (same as marketdata route)
        // Priority: currentBar close > askPrice > bidPrice > previousBar close
        const resolvedPrice = firstValid(
          currentBar?.c,
          askPrice,
          bidPrice,
          previousBar?.c,
        );
        // Priority: previousBar close > currentBar close > bidPrice > askPrice
        const resolvedPreviousClose = firstValid(
          previousBar?.c,
          currentBar?.c,
          bidPrice,
          askPrice,
        );

        const currentPrice = resolvedPrice;
        const previousClose = resolvedPreviousClose;

        // Calculate price change
        let priceChange: number | null = null;
        let priceChangePercent: number | null = null;
        if (
          currentPrice !== null &&
          previousClose !== null &&
          previousClose > 0
        ) {
          priceChange = currentPrice - previousClose;
          priceChangePercent = (priceChange / previousClose) * 100;
        }

        if (currentPrice === null) {
          throw new Error(`No valid price data for ${ticker}`);
        }

        results[ticker] = {
          symbol: ticker,
          currentPrice,
          priceChange,
          priceChangePercent,
          data: [],
          dataSource: "real",
        };
        console.log(
          `✅ Successfully fetched ${ticker}: $${currentPrice} (${priceChangePercent !== null ? (priceChangePercent >= 0 ? "+" : "") + priceChangePercent.toFixed(2) + "%" : "N/A"})`,
        );
      } catch (error) {
        console.error(`❌ Error fetching data for ${ticker}:`, error);

        // Return error entry for this ticker
        results[ticker] = {
          symbol: ticker,
          currentPrice: null,
          priceChange: null,
          priceChangePercent: null,
          data: [],
          dataSource: "error",
        };
      }
    }),
  );

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tickers } = body;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: "Invalid tickers array" },
        { status: 400 },
      );
    }

    // Limit batch size to prevent excessive API calls
    if (tickers.length > 20) {
      return NextResponse.json(
        { error: "Too many tickers requested (max 20)" },
        { status: 400 },
      );
    }

    console.log("🔍 Batch stock data request for:", tickers);

    const batchData = await fetchBatchStockData(tickers);

    // Log summary of results
    const successCount = Object.values(batchData).filter(
      (d: any) => d.dataSource === "real",
    ).length;
    const errorCount = Object.values(batchData).filter(
      (d: any) => d.dataSource === "error",
    ).length;
    const mockCount = Object.values(batchData).filter(
      (d: any) => d.dataSource === "mock",
    ).length;

    console.log(
      `🎯 Batch response completed: ${successCount} successful, ${errorCount} errors, ${mockCount} mock (LQD)`,
    );
    return NextResponse.json(batchData);
  } catch (error) {
    console.error("❌ Error in batch stock fetch:", error);
    return NextResponse.json(
      { error: "Failed to fetch batch stock data" },
      { status: 500 },
    );
  }
}
