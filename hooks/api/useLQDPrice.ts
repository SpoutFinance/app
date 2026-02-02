"use client";

/**
 * Legacy hook for backward compatibility
 * Wraps useAssetPrice("LQD") to maintain existing API
 *
 * @deprecated Use useAssetPrice("LQD") directly for better clarity
 * @returns Object containing LQD price data, loading states, and price change calculations
 */
import { useAssetPrice } from "./useAssetPrice";

export function useLQDPrice() {
  return useAssetPrice("LQD");
}
