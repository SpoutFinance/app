/**
 * Asset Registry Configuration
 * Maps ticker symbols to their contract addresses and metadata
 */

export interface AssetConfig {
  ticker: string; // Display ticker (e.g., "LQD", "TSLA", "AAPL")
  name: string; // Full name (e.g., "iShares iBoxx $ Investment Grade Corporate Bond ETF", "Tesla Inc.", "Apple Inc.")
  tokenAddress: {
    [chainId: number]: string; // Token contract address per chain
  };
  decimals: number; // Token decimals (default 18 for most ERC3643 tokens)
  chainlinkSubscriptionId?: number; // Chainlink subscription ID for price feeds (defaults to env var)
  enabled: boolean; // Whether this asset is enabled for trading
}

export const ASSET_REGISTRY: Record<string, AssetConfig> = {
  LQD: {
    ticker: "LQD",
    name: "iShares iBoxx $ Investment Grade Corporate Bond ETF",
    tokenAddress: {
      84532: "0xA3b7e2B478286955716B660f536F0DC89995ef07", // Base Sepolia - SpoutTokenProxy
      688688: "0x54b753555853ce22f66Ac8CB8e324EB607C4e4eE", // Pharos Testnet
    },
    decimals: 18,
    enabled: true,
  },
  AMZN: {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  AMBR: {
    // Amber – underlying market ticker AMBR
    ticker: "AMBR",
    name: "Amber Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  BTBT: {
    // Bit Digital Inc. – underlying NASDAQ ticker is BTBT
    ticker: "BTBT",
    name: "Bit Digital Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  CRCL: {
    // Circle – underlying market ticker CRCL
    ticker: "CRCL",
    name: "Circle Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  COIN: {
    ticker: "COIN",
    name: "Coinbase Global Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  GOOGL: {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  JPM: {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  META: {
    ticker: "META",
    name: "Meta Platforms Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  HOOD: {
    ticker: "HOOD",
    name: "Robinhood Markets Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  MSTR: {
    // MicroStrategy – ticker MSTR (replaces generic Strategy B)
    ticker: "MSTR",
    name: "MicroStrategy Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla Inc.",
    tokenAddress: {
      84532: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
      688688: "0x0000000000000000000000000000000000000000", // TODO: Update with actual contract address
    },
    decimals: 18,
    enabled: true,
  },
};

/**
 * Get asset config for a given ticker
 */
export function getAssetConfig(ticker: string): AssetConfig | undefined {
  return ASSET_REGISTRY[ticker.toUpperCase()];
}

/**
 * Get token address for a given ticker and chain ID
 */
export function getTokenAddress(
  ticker: string,
  chainId: number,
): `0x${string}` | undefined {
  const config = getAssetConfig(ticker);
  if (!config) return undefined;
  const address = config.tokenAddress[chainId];
  return address && address !== "0x0000000000000000000000000000000000000000"
    ? (address as `0x${string}`)
    : undefined;
}

/**
 * Get all enabled assets as an array
 */
export function getEnabledAssets(): AssetConfig[] {
  return Object.values(ASSET_REGISTRY).filter((asset) => asset.enabled);
}

/**
 * Get all enabled asset tickers
 */
export function getEnabledAssetTickers(): string[] {
  return getEnabledAssets().map((asset) => asset.ticker);
}
