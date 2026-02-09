// Types for equities page

export interface EquityRow {
  ticker: string;
  name: string;
  price: number | null;
  marketCap: number | null;
  change24h: number | null;
  change7d: number | null;
  changeYTD: number | null;
}

export type Category = "all" | "equities" | "etfs";

export interface FilterState {
  marketCapMin: string;
  marketCapMax: string;
  change24hMin: string;
  change24hMax: string;
  change7dMin: string;
  change7dMax: string;
  change1mMin: string;
  change1mMax: string;
  change3mMin: string;
  change3mMax: string;
}

export const initialFilterState: FilterState = {
  marketCapMin: "",
  marketCapMax: "",
  change24hMin: "",
  change24hMax: "",
  change7dMin: "",
  change7dMax: "",
  change1mMin: "",
  change1mMax: "",
  change3mMin: "",
  change3mMax: "",
};

export interface ActiveFilter {
  key: string;
  label: string;
}

// Asset icon colors - brand colors for each ticker
export const ASSET_COLORS: Record<string, string> = {
  TSLA: "#cc0000",
  AAPL: "#555555",
  NVDA: "#76b900",
  NFLX: "#e50914",
  ORCL: "#f80000",
  MSFT: "#00a4ef",
  LQD: "#004a4a",
  USDC: "#2775ca",
  GOLD: "#ffd700",
  COIN: "#0052ff",
  GOOGL: "#4285f4",
  AMZN: "#ff9900",
  META: "#0668e1",
  AMD: "#ed1c24",
  JPM: "#117aca",
  V: "#1a1f71",
  UNH: "#002677",
  HD: "#f96302",
  PG: "#003cae",
  MA: "#eb001b",
  DIS: "#113ccf",
  ADBE: "#ff0000",
  CRM: "#00a1e0",
};

// Pagination options
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];
