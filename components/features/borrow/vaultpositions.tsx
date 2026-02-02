"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  useAccount,
  useReadContract,
  usePublicClient,
  useConfig,
  useChainId,
} from "wagmi";
import { useContractAddress } from "@/lib/addresses";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Plus,
  Info,
  ArrowDownCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { useLQDPrice } from "@/hooks/api/useLQDPrice";
import { clientCacheHelpers } from "@/lib/cache/client-cache";
import { useVault } from "@/hooks/writes/onChain/useVault";
import { useCollateralTokenBalance } from "@/hooks/view/onChain/useCollateralTokenBalance";
import { useTokenBalance } from "@/hooks/view/onChain/useTokenBalance";
import { waitForTransactionReceipt } from "wagmi/actions";
import { toast } from "sonner";
import Link from "next/link";
import { getTokenAddress } from "@/lib/types/assets";
import vatABI from "@/abi/vat.json";
import erc20ABI from "@/abi/erc20.json";

interface VaultData {
  vaultId: bigint;
  owner: string;
  ilk: string;
  ink: bigint;
  art: bigint;
  collRatio: bigint;
  liqRatio: bigint;
}

// Component to check token balance for a vault
function VaultTokenBalanceCheck({
  ilk,
  chainId,
  address,
  hasCollateral,
}: {
  ilk: string;
  chainId: number;
  address: `0x${string}` | undefined;
  hasCollateral: boolean;
}) {
  const tokenAddress = getTokenAddress(ilk, chainId);
  const { amountUi: tokenBalance } = useTokenBalance(
    tokenAddress || null,
    address || null,
  );
  const hasTokenBalance = tokenBalance && Number(tokenBalance) > 0;
  const showNoBalanceMessage = !hasCollateral && !hasTokenBalance;

  if (!showNoBalanceMessage) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-amber-900">
            Oops, I see you don&apos;t have a balance of the{" "}
            <span className="font-semibold">{ilk}</span> product.{" "}
            <Link
              href={`/app/trade?ticker=${ilk}`}
              className="text-[#004040] hover:text-[#004040]/80 underline font-medium"
            >
              Commence here
            </Link>{" "}
            to buy the asset.
          </p>
        </div>
      </div>
    </div>
  );
}

export function VaultPositions() {
  const { address } = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const publicClient = usePublicClient();
  const vatAddress = useContractAddress("vat") as `0x${string}` | undefined;
  const lqdTokenAddress = useContractAddress("SpoutLQDtoken") as
    | `0x${string}`
    | undefined;
  const { latestPrice: lqdPrice } = useLQDPrice();
  const [ilkParamsMap, setIlkParamsMap] = React.useState<Map<string, any>>(
    new Map(),
  );
  const [assetPrices, setAssetPrices] = React.useState<Map<string, number>>(
    new Map(),
  );
  const [depositingVaultId, setDepositingVaultId] = useState<bigint | null>(
    null,
  );
  const [depositAmounts, setDepositAmounts] = useState<Map<string, string>>(
    new Map(),
  );
  const [showDepositInput, setShowDepositInput] = useState<
    Map<string, boolean>
  >(new Map());
  const [borrowingVaultId, setBorrowingVaultId] = useState<bigint | null>(null);
  const [borrowAmounts, setBorrowAmounts] = useState<Map<string, string>>(
    new Map(),
  );
  const [showBorrowInput, setShowBorrowInput] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [expandedVaults, setExpandedVaults] = useState<Set<string>>(new Set());
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Vault hooks for depositing collateral and borrowing
  const {
    depositCollateral,
    borrow,
    isGemJoinPending,
    isApprovePending,
    isFrobPending,
  } = useVault();
  const { amountUi: collateralBalance, refetch: refetchCollateralBalance } =
    useCollateralTokenBalance();

  // Get stablecoin decimals
  const stablecoinAddress = useContractAddress("stablecoin") as
    | `0x${string}`
    | undefined;
  const { data: stablecoinDecimals } = useReadContract({
    address: stablecoinAddress,
    abi: erc20ABI as any,
    functionName: "decimals",
    query: { enabled: Boolean(stablecoinAddress) },
  });
  const STABLECOIN_DECIMALS = stablecoinDecimals
    ? Number(stablecoinDecimals)
    : 18; // Default to 18 for stablecoin (SPUS)

  // Check if vatAddress is valid (not zero address)
  const isValidVatAddress =
    vatAddress && vatAddress !== "0x0000000000000000000000000000000000000000";

  // Fetch all vaults for the user in one call using getUserVaultsFull
  const {
    data: vaultsFullData,
    isLoading: isVaultsLoading,
    refetch: refetchVaults,
  } = useReadContract({
    address: vatAddress,
    abi: vatABI.abi as any,
    functionName: "getUserVaultsFull",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(isValidVatAddress && address),
      refetchInterval: 5000, // Refetch every 5 seconds to catch new vaults
    },
  });

  // Parse vaults to get unique ILKs first
  const uniqueIlks = React.useMemo(() => {
    if (!vaultsFullData) return [];
    const [, , ilks] = vaultsFullData as [bigint[], string[], `0x${string}`[]];
    return Array.from(new Set(ilks.map((ilk) => ilk as `0x${string}`)));
  }, [vaultsFullData]);

  // Parse ILK bytes32 to string (e.g., "LQD") - moved before useEffect
  const parseIlk = React.useCallback(
    (ilkBytes: `0x${string}` | string): string => {
      try {
        if (typeof ilkBytes !== "string") return "UNKNOWN";
        const hex = ilkBytes.slice(2);
        let result = "";
        for (let i = 0; i < hex.length; i += 2) {
          const byte = parseInt(hex.substr(i, 2), 16);
          if (byte === 0) break;
          result += String.fromCharCode(byte);
        }
        return result || "UNKNOWN";
      } catch {
        return "UNKNOWN";
      }
    },
    [],
  );

  // Helper function to convert ticker string to ILK bytes32
  const tickerToIlk = React.useCallback((ticker: string): `0x${string}` => {
    // Convert ticker to bytes32 hex string
    // Example: "LQD" -> "0x4c51440000000000000000000000000000000000000000000000000000000000"
    let hex = "0x";
    for (let i = 0; i < ticker.length && i < 32; i++) {
      hex += ticker.charCodeAt(i).toString(16).padStart(2, "0");
    }
    // Pad with zeros to 64 hex characters (32 bytes)
    hex = hex.padEnd(66, "0");
    return hex as `0x${string}`;
  }, []);

  // Fetch ILK parameters for each unique ILK using public client (on-chain)
  React.useEffect(() => {
    if (
      !uniqueIlks.length ||
      !vatAddress ||
      !isValidVatAddress ||
      !publicClient
    ) {
      console.log("⏸️ Skipping ILK fetch:", {
        uniqueIlks: uniqueIlks.length,
        vatAddress: !!vatAddress,
        isValidVatAddress,
        publicClient: !!publicClient,
      });
      return;
    }

    const fetchIlkData = async () => {
      console.log(
        `📡 Fetching ILK parameters from on-chain for ${uniqueIlks.length} unique ILK(s)...`,
      );
      const newMap = new Map<string, any>();

      for (const ilk of uniqueIlks) {
        try {
          const ilkString = parseIlk(ilk);
          console.log(
            `📡 Fetching ILK data for ${ilkString} (${ilk}) from Vat contract...`,
          );

          const ilkData = (await publicClient.readContract({
            address: vatAddress,
            abi: vatABI.abi as any,
            functionName: "getIlk",
            args: [ilk],
          })) as any;

          // Log the raw data structure to verify format
          console.log(`📦 Raw ILK data structure for ${ilkString}:`, {
            isArray: Array.isArray(ilkData),
            type: typeof ilkData,
            length: Array.isArray(ilkData) ? ilkData.length : "N/A",
            raw: ilkData,
          });

          // Handle both array and object formats (viem may return either)
          let liqRatio,
            defaultCollRatio,
            defaultRate,
            Art,
            rate,
            spot,
            line,
            dust;

          if (Array.isArray(ilkData)) {
            // Array format: [liqRatio, defaultCollRatio, defaultRate, Art, rate, spot, line, dust]
            liqRatio = ilkData[0];
            defaultCollRatio = ilkData[1];
            defaultRate = ilkData[2];
            Art = ilkData[3];
            rate = ilkData[4];
            spot = ilkData[5];
            line = ilkData[6];
            dust = ilkData[7];
          } else if (ilkData && typeof ilkData === "object") {
            // Object format with named properties
            liqRatio = ilkData.liqRatio || ilkData[0];
            defaultCollRatio = ilkData.defaultCollRatio || ilkData[1];
            defaultRate = ilkData.defaultRate || ilkData[2];
            Art = ilkData.Art || ilkData[3];
            rate = ilkData.rate || ilkData[4];
            spot = ilkData.spot || ilkData[5];
            line = ilkData.line || ilkData[6];
            dust = ilkData.dust || ilkData[7];
          } else {
            throw new Error(`Unexpected ILK data format: ${typeof ilkData}`);
          }

          console.log(`✅ Parsed ILK data for ${ilkString}:`, {
            liqRatio: liqRatio?.toString(),
            defaultCollRatio: defaultCollRatio?.toString(),
            defaultRate: defaultRate?.toString(),
            Art: Art?.toString(),
            rate: rate?.toString(),
            spot: spot?.toString(),
            line: line?.toString(),
            dust: dust?.toString(),
          });

          // Store parsed ILK data
          newMap.set(ilkString, {
            liqRatio,
            defaultCollRatio,
            defaultRate,
            Art,
            rate,
            spot,
            line,
            dust,
          });
        } catch (error: any) {
          console.error(
            `❌ Error fetching ILK data for ${parseIlk(ilk)} (${ilk}):`,
            error,
          );
          console.error("Error details:", {
            message: error?.message,
            cause: error?.cause,
            vatAddress,
            ilk,
          });
        }
      }

      console.log(`✅ ILK parameters map updated with ${newMap.size} ILK(s)`);
      setIlkParamsMap(newMap);
    };

    fetchIlkData();
  }, [uniqueIlks, vatAddress, isValidVatAddress, publicClient, parseIlk]);

  // Fetch market prices for each ILK (equity) to value collateral in USD
  useEffect(() => {
    if (!uniqueIlks.length) {
      return;
    }

    let cancelled = false;

    const fetchAssetPrices = async () => {
      const newMap = new Map<string, number>();

      await Promise.all(
        uniqueIlks.map(async (ilk) => {
          const ticker = parseIlk(ilk);
          try {
            const data = await clientCacheHelpers.fetchStockData(ticker);
            const price =
              typeof data?.price === "number" &&
              isFinite(data.price) &&
              data.price > 0
                ? data.price
                : typeof data?.currentPrice === "number" &&
                    isFinite(data.currentPrice) &&
                    data.currentPrice > 0
                  ? data.currentPrice
                  : null;
            if (price !== null) {
              newMap.set(ticker, price);
            }
          } catch (error) {
            console.error(`❌ Error fetching price for ${ticker}:`, error);
          }
        }),
      );

      // Always ensure LQD price is populated if available
      if (lqdPrice !== null) {
        newMap.set("LQD", lqdPrice);
      }

      if (!cancelled) {
        setAssetPrices(newMap);
      }
    };

    fetchAssetPrices();

    return () => {
      cancelled = true;
    };
  }, [uniqueIlks, lqdPrice, parseIlk]);

  // Parse vaults data from getUserVaultsFull response
  const vaults: VaultData[] = React.useMemo(() => {
    if (!vaultsFullData) {
      console.log("📊 No vault data received yet");
      return [];
    }

    const [vaultIds, owners, ilks, inks, arts, collRatios, liqRatios] =
      vaultsFullData as [
        bigint[],
        string[],
        `0x${string}`[],
        bigint[],
        bigint[],
        bigint[],
        bigint[],
      ];

    console.log(`📊 Fetched ${vaultIds.length} vault(s) for user:`, {
      vaultIds: vaultIds.map((id) => id.toString()),
      ilks: ilks.map((ilk) => parseIlk(ilk)),
    });

    return vaultIds.map((vaultId, index) => ({
      vaultId,
      owner: owners[index],
      ilk: parseIlk(ilks[index]),
      ink: inks[index],
      art: arts[index],
      collRatio: collRatios[index],
      liqRatio: liqRatios[index],
    }));
  }, [vaultsFullData, parseIlk]);

  // Handle borrow stablecoin
  const handleBorrow = async (vaultId: bigint, vaultIlk: string) => {
    const vaultKey = vaultId.toString();
    const borrowAmount = borrowAmounts.get(vaultKey) || "";

    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setBorrowingVaultId(vaultId);
    try {
      // Send amount in stablecoin native decimals (6 decimals)
      const amountInTokenUnits = BigInt(
        Math.floor(parseFloat(borrowAmount) * 10 ** STABLECOIN_DECIMALS),
      );

      toast.loading(`Borrowing ${borrowAmount} stablecoin...`, {
        id: `borrow-${vaultKey}`,
      });
      const txHash = await borrow(vaultId, amountInTokenUnits);

      if (!txHash) {
        throw new Error(
          "Transaction hash not returned. Transaction may have failed.",
        );
      }

      console.log(`📤 Borrow transaction sent: ${txHash}`);
      toast.loading(`Borrowing ${borrowAmount} stablecoin...`, {
        id: `borrow-${vaultKey}`,
      });

      // Wait for transaction receipt with timeout and retry logic
      try {
        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
          timeout: 120_000, // 2 minute timeout
          confirmations: 1,
        });

        // Check if transaction actually succeeded
        if (receipt.status === "reverted") {
          throw new Error("Transaction reverted. The borrow failed on-chain.");
        }

        console.log(
          `✅ Borrow transaction confirmed in block: ${receipt.blockNumber}`,
        );
        toast.success(`Successfully borrowed ${borrowAmount} stablecoin!`, {
          id: `borrow-${vaultKey}`,
        });

        // Clear borrow amount and hide input
        const newAmounts = new Map(borrowAmounts);
        newAmounts.delete(vaultKey);
        setBorrowAmounts(newAmounts);

        const newShowInput = new Map(showBorrowInput);
        newShowInput.set(vaultKey, false);
        setShowBorrowInput(newShowInput);

        // Refetch vaults only on successful transaction
        setTimeout(() => {
          refetchVaults();
        }, 2000);
      } catch (receiptError: any) {
        // If we have a txHash, the transaction was sent successfully
        if (
          receiptError?.message?.includes("block not found") ||
          receiptError?.message?.includes("Requested resource not found")
        ) {
          console.log(
            `⚠️ Transaction sent but receipt not yet available: ${txHash}`,
          );
          toast.success(
            `Transaction sent! Borrowing ${borrowAmount} stablecoin. Please wait for confirmation.`,
            {
              id: `borrow-${vaultKey}`,
              duration: 5000,
            },
          );

          // Clear borrow amount and hide input
          const newAmounts = new Map(borrowAmounts);
          newAmounts.delete(vaultKey);
          setBorrowAmounts(newAmounts);

          const newShowInput = new Map(showBorrowInput);
          newShowInput.set(vaultKey, false);
          setShowBorrowInput(newShowInput);

          // Refetch vaults after a delay
          setTimeout(() => {
            refetchVaults();
          }, 5000);
        } else {
          // Re-throw other errors
          throw receiptError;
        }
      }
    } catch (error: any) {
      console.error("Borrow error:", error);

      // Provide more helpful error messages
      let errorMessage = "Failed to borrow stablecoin";
      if (error?.message?.includes("block not found")) {
        errorMessage =
          "Transaction is still pending. Please check your wallet or try again in a moment.";
      } else if (
        error?.message?.includes("user rejected") ||
        error?.message?.includes("User rejected")
      ) {
        errorMessage = "Transaction was rejected. Please try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: `borrow-${vaultKey}` });
    } finally {
      setBorrowingVaultId(null);
    }
  };

  // Handle deposit collateral
  const handleDepositCollateral = async (vaultId: bigint, vaultIlk: string) => {
    const vaultKey = vaultId.toString();
    const depositAmount = depositAmounts.get(vaultKey) || "";

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const collBal = collateralBalance ? Number(collateralBalance) : 0;
    if (collBal < parseFloat(depositAmount)) {
      toast.error("Insufficient collateral balance");
      return;
    }

    setDepositingVaultId(vaultId);
    try {
      // SLQD has 6 decimals - send amount in token native decimals (6)
      // The depositCollateral function will convert to WAD (18 decimals) internally
      const amountInTokenUnits = BigInt(
        Math.floor(parseFloat(depositAmount) * 1e6),
      );

      // The depositCollateral function handles approval and deposit internally
      // depositCollateral expects amount in token units (6 decimals)
      toast.loading(`Approving collateral...`, { id: `deposit-${vaultKey}` });
      const txHash = await depositCollateral(vaultId, amountInTokenUnits);

      if (!txHash) {
        throw new Error(
          "Transaction hash not returned. Transaction may have failed.",
        );
      }

      console.log(`📤 Deposit transaction sent: ${txHash}`);
      toast.loading(`Depositing ${depositAmount} ${vaultIlk} to vault...`, {
        id: `deposit-${vaultKey}`,
      });

      // Wait for transaction receipt with timeout and retry logic
      try {
        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
          timeout: 120_000, // 2 minute timeout
          confirmations: 1,
        });

        // Check if transaction actually succeeded
        if (receipt.status === "reverted") {
          throw new Error("Transaction reverted. The deposit failed on-chain.");
        }

        console.log(
          `✅ Deposit transaction confirmed in block: ${receipt.blockNumber}`,
        );
        toast.success(
          `Successfully deposited ${depositAmount} ${vaultIlk} to vault!`,
          { id: `deposit-${vaultKey}` },
        );

        // Clear deposit amount and hide input
        const newAmounts = new Map(depositAmounts);
        newAmounts.delete(vaultKey);
        setDepositAmounts(newAmounts);

        const newShowInput = new Map(showDepositInput);
        newShowInput.set(vaultKey, false);
        setShowDepositInput(newShowInput);

        // Refetch balances only on successful transaction
        refetchCollateralBalance();
        setTimeout(() => {
          refetchVaults();
        }, 2000);
      } catch (receiptError: any) {
        // If we have a txHash, the transaction was sent successfully
        // The "block not found" error just means the receipt isn't available yet
        if (
          receiptError?.message?.includes("block not found") ||
          receiptError?.message?.includes("Requested resource not found")
        ) {
          console.log(
            `⚠️ Transaction sent but receipt not yet available: ${txHash}`,
          );
          toast.success(
            `Transaction sent! Depositing ${depositAmount} ${vaultIlk} to vault. Please wait for confirmation.`,
            {
              id: `deposit-${vaultKey}`,
              duration: 5000,
            },
          );

          // Clear deposit amount and hide input
          const newAmounts = new Map(depositAmounts);
          newAmounts.delete(vaultKey);
          setDepositAmounts(newAmounts);

          const newShowInput = new Map(showDepositInput);
          newShowInput.set(vaultKey, false);
          setShowDepositInput(newShowInput);

          // Refetch balances after a delay (transaction might be confirmed by then)
          setTimeout(() => {
            refetchCollateralBalance();
            refetchVaults();
          }, 5000);
        } else {
          // Re-throw other errors
          throw receiptError;
        }
      }
    } catch (error: any) {
      console.error("Deposit error:", error);

      // Provide more helpful error messages
      let errorMessage = "Failed to deposit collateral";
      if (error?.message?.includes("block not found")) {
        errorMessage =
          "Transaction is still pending. Please check your wallet or try again in a moment.";
      } else if (
        error?.message?.includes("user rejected") ||
        error?.message?.includes("User rejected")
      ) {
        errorMessage = "Transaction was rejected. Please try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: `deposit-${vaultKey}` });
    } finally {
      setDepositingVaultId(null);
    }
  };

  // Helper function to calculate health rate, collateralization ratio for a vault
  const calculateVaultMetrics = (vault: VaultData) => {
    // SLQD has 6 decimals, Vat stores in WAD (18 decimals) internally
    // So we need to convert from WAD (1e18) to token units (1e6)
    const ink = Number(vault.ink) / 1e18; // Vat stores in WAD
    const art = Number(vault.art) / 1e18; // Vat stores in WAD
    const hasDebt = art > 0;

    // Get ILK parameters for this vault's ILK (fetched from on-chain)
    const ilkParams = ilkParamsMap.get(vault.ilk);

    if (!ilkParams) {
      console.warn(
        `⚠️ ILK parameters not yet loaded for ${vault.ilk} (Vault #${vault.vaultId})`,
      );
    }

    // Liquidation ratio from ILK params (on-chain) - must be fetched from on-chain, no fallback
    // liqRatio is stored in RAY format (27 decimals), so divide by 1e27 to get the ratio
    const liqRatio = ilkParams?.liqRatio
      ? Number(ilkParams.liqRatio) / 1e27
      : null;

    // Default collateral ratio from ILK params (on-chain)
    const defaultCollRatio = ilkParams?.defaultCollRatio
      ? Number(ilkParams.defaultCollRatio) / 1e27
      : null;

    // Vault-specific collateral ratio (already in RAY format)
    const collRatio = Number(vault.collRatio) / 1e27;

    let healthRate: number | null = null;
    let collateralizationRatio: number | null = null;

    if (hasDebt && ilkParams && liqRatio !== null) {
      const spot = ilkParams.spot ? Number(ilkParams.spot) / 1e27 : null;
      const rate = ilkParams.rate ? Number(ilkParams.rate) / 1e27 : null;
      const effectiveSpot = spot || lqdPrice;

      if (effectiveSpot && rate && rate > 0 && art > 0 && liqRatio > 0) {
        // Collateralization ratio = (collateral * price) / (debt * rate)
        collateralizationRatio = (ink * effectiveSpot) / (art * rate);
        // Health Ratio = Collateralization Ratio / Liquidation Ratio
        healthRate = collateralizationRatio / liqRatio;
      }
    } else if (!hasDebt && ink > 0) {
      // No debt means infinite health (can't be liquidated)
      healthRate = Infinity;
      collateralizationRatio = Infinity;
    }

    return {
      healthRate,
      collateralizationRatio,
      liqRatio,
      defaultCollRatio,
      collRatio,
      ilkParamsLoaded: !!ilkParams, // Flag to indicate if ILK params are available
    };
  };

  if (!address) {
    return (
      <Card className="border border-[#004040]/15 bg-white rounded-none shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-slate-600">
            Please connect your wallet to view your vault positions
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isValidVatAddress) {
    return (
      <Card className="border border-[#004040]/15 bg-white rounded-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#004040]">
            Your Vault Positions
          </CardTitle>
          <CardDescription>
            View your current vault deposits and positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-yellow-800 font-semibold">
              Vault System Not Available
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              The vault system is only available on Pharos Testnet (Chain ID:
              688688). Please switch your network to view and create vaults.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isVaultsLoading) {
    return (
      <Card className="border border-[#004040]/15 bg-white rounded-none shadow-sm">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#004040] mx-auto" />
          <p className="text-slate-600 mt-4">Loading vault positions...</p>
        </CardContent>
      </Card>
    );
  }

  if (!vaults || vaults.length === 0) {
    return (
      <Card className="border border-[#004040]/15 bg-white rounded-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#004040]">
            Your Vault Positions
          </CardTitle>
          <CardDescription>
            View your current vault deposits and positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center border border-slate-200 rounded-lg bg-slate-50">
            <p className="text-slate-600">No active vaults</p>
            <p className="text-sm text-slate-500 mt-2">
              Create a vault and deposit collateral to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[#004040]/15 bg-white rounded-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#004040]">
          Your Vault Positions
        </CardTitle>
        <CardDescription>
          View your current vault deposits and positions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Vaults Table */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-left py-4 px-4 text-base font-semibold text-slate-700">
                Token
              </TableHead>
              <TableHead className="text-right py-4 px-6 text-base font-semibold text-slate-700">
                Collateral
              </TableHead>
              <TableHead className="text-center py-4 px-6 text-base font-semibold text-slate-700">
                Health Ratio
              </TableHead>
              <TableHead className="text-center py-4 px-6 text-base font-semibold text-slate-700">
                Debt
              </TableHead>
              <TableHead className="text-center py-4 px-6 text-base font-semibold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaults.map((vault) => {
              const vaultKey = vault.vaultId.toString();
              const vaultCollateralTokens = Number(vault.ink) / 1e18;
              const isWholeCollateral =
                Math.abs(
                  vaultCollateralTokens - Math.round(vaultCollateralTokens),
                ) < 1e-6;
              const vaultCollateralFormatted = vaultCollateralTokens.toFixed(6);
              const vaultCollateralDisplay = isWholeCollateral
                ? Math.round(vaultCollateralTokens).toString()
                : vaultCollateralTokens.toFixed(2);
              const vaultDebtFormatted = (Number(vault.art) / 1e18).toFixed(6);
              const hasDebt = Number(vault.art) > 0;
              const metrics = calculateVaultMetrics(vault);
              const isDepositing = depositingVaultId === vault.vaultId;
              const isBorrowing = borrowingVaultId === vault.vaultId;
              const showInput = showDepositInput.get(vaultKey) || false;
              const showBorrow = showBorrowInput.get(vaultKey) || false;
              const depositAmount = depositAmounts.get(vaultKey) || "";
              const borrowAmount = borrowAmounts.get(vaultKey) || "";
              const isProcessing =
                isDepositing ||
                isBorrowing ||
                isGemJoinPending ||
                isApprovePending ||
                isFrobPending;
              const assetPrice =
                assetPrices.get(vault.ilk) ??
                (vault.ilk === "LQD" && lqdPrice !== null ? lqdPrice : null);
              const collateralValue =
                assetPrice !== null ? vaultCollateralTokens * assetPrice : null;
              const defaultCollRatio =
                metrics.defaultCollRatio && metrics.defaultCollRatio > 0
                  ? metrics.defaultCollRatio
                  : metrics.liqRatio && metrics.liqRatio > 0
                    ? metrics.liqRatio
                    : null;
              // Calculate max borrowable: (collateral value / ratio) - existing debt
              const existingDebtValue = hasDebt ? Number(vault.art) / 1e18 : 0;
              const maxBorrowableValue =
                collateralValue !== null && defaultCollRatio
                  ? Math.max(
                      0,
                      collateralValue / defaultCollRatio - existingDebtValue,
                    )
                  : null;
              const hasCollateral = vaultCollateralTokens > 0;
              const isExpanded = expandedVaults.has(vaultKey);

              return (
                <React.Fragment key={vaultKey}>
                  <TableRow className="hover:bg-slate-50/50">
                    {/* Token Name (Leftmost) */}
                    <TableCell className="font-medium py-6 px-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedVaults);
                            if (isExpanded) {
                              newExpanded.delete(vaultKey);
                            } else {
                              newExpanded.add(vaultKey);
                            }
                            setExpandedVaults(newExpanded);
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-slate-500" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg text-slate-900">
                              {vault.ilk}
                            </span>
                            {vault.ilk === "LQD" && lqdTokenAddress && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={async () => {
                                        try {
                                          await navigator.clipboard.writeText(
                                            lqdTokenAddress,
                                          );
                                          setCopiedAddress(lqdTokenAddress);
                                          toast.success(
                                            "Token address copied to clipboard!",
                                          );
                                          setTimeout(
                                            () => setCopiedAddress(null),
                                            2000,
                                          );
                                        } catch (error) {
                                          toast.error("Failed to copy address");
                                        }
                                      }}
                                      className="p-1.5 hover:bg-slate-100 rounded transition-colors group"
                                    >
                                      {copiedAddress === lqdTokenAddress ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Copy className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                      )}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy stablecoin address</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 mt-0.5">
                            Collateral Token
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Collateral */}
                    <TableCell className="text-right py-6 px-6">
                      <div className="flex flex-col items-end">
                        <div className="font-semibold text-lg text-slate-900">
                          {collateralValue !== null
                            ? `$${collateralValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : vaultCollateralDisplay}
                        </div>
                        <div className="text-sm text-slate-500 mt-0.5">
                          {vaultCollateralDisplay} {vault.ilk}
                          {assetPrice !== null &&
                            ` @ $${assetPrice.toFixed(2)}`}
                        </div>
                      </div>
                    </TableCell>

                    {/* Health Ratio */}
                    <TableCell className="text-center py-6 px-6">
                      {metrics.healthRate !== null ? (
                        <div className="flex flex-col items-center">
                          <div
                            className={`font-semibold text-lg ${
                              metrics.healthRate === Infinity ||
                              metrics.healthRate >= 1.5
                                ? "text-green-600"
                                : metrics.healthRate >= 1.1
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {metrics.healthRate === Infinity
                              ? "∞"
                              : metrics.healthRate >= 1000
                                ? "Very High"
                                : metrics.healthRate.toFixed(2)}
                          </div>
                          <div className="text-sm text-slate-500 mt-0.5">
                            Health Ratio
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>

                    {/* Debt */}
                    <TableCell className="text-center py-6 px-6">
                      {hasDebt ? (
                        <div className="flex flex-col items-center">
                          <div className="font-semibold text-lg text-red-600">
                            {vaultDebtFormatted}
                          </div>
                          <div className="text-sm text-slate-500 mt-0.5">
                            SPUS
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center py-6 px-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <Button
                          onClick={() => {
                            const newShowInput = new Map(showDepositInput);
                            newShowInput.set(vaultKey, !showInput);
                            setShowDepositInput(newShowInput);
                            // Also expand the vault row if not already expanded
                            if (!isExpanded) {
                              const newExpanded = new Set(expandedVaults);
                              newExpanded.add(vaultKey);
                              setExpandedVaults(newExpanded);
                            }
                          }}
                          className="bg-[#004040] hover:bg-[#004040]/90 text-white text-xs py-1 px-2 h-7 w-auto min-w-[70px]"
                          variant="default"
                          size="sm"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Deposit
                        </Button>
                        {hasCollateral && (
                          <Button
                            onClick={() => {
                              const newShowBorrow = new Map(showBorrowInput);
                              newShowBorrow.set(vaultKey, !showBorrow);
                              setShowBorrowInput(newShowBorrow);
                              // Also expand the vault row if not already expanded
                              if (!isExpanded) {
                                const newExpanded = new Set(expandedVaults);
                                newExpanded.add(vaultKey);
                                setExpandedVaults(newExpanded);
                              }
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1 px-2 h-7 w-auto min-w-[70px]"
                            variant="outline"
                            size="sm"
                          >
                            <ArrowDownCircle className="mr-1 h-3 w-3" />
                            Borrow
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-slate-50/50 p-6">
                        <div className="space-y-4">
                          {/* Vault Parameters */}
                          <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="h-4 w-4 text-slate-500" />
                              <span className="text-sm font-semibold text-slate-700">
                                Vault Parameters
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {metrics.liqRatio !== null && (
                                <div>
                                  <span className="text-xs text-slate-600">
                                    Liquidation Ratio
                                  </span>
                                  <div className="text-sm font-semibold text-slate-900">
                                    {(metrics.liqRatio * 100).toFixed(2)}%
                                  </div>
                                </div>
                              )}
                              {metrics.defaultCollRatio !== null && (
                                <div>
                                  <span className="text-xs text-slate-600">
                                    Current Collateralization Ratio
                                  </span>
                                  <div className="text-sm font-semibold text-slate-900">
                                    {(metrics.defaultCollRatio * 100).toFixed(
                                      2,
                                    )}
                                    %
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* No Balance Message */}
                          <VaultTokenBalanceCheck
                            ilk={vault.ilk}
                            chainId={chainId}
                            address={address}
                            hasCollateral={hasCollateral}
                          />

                          {/* Actions Section */}
                          <div className="space-y-3">
                            {/* Add Collateral Section */}
                            <div>
                              {!showInput ? (
                                <Button
                                  onClick={() => {
                                    const newShowInput = new Map(
                                      showDepositInput,
                                    );
                                    newShowInput.set(vaultKey, true);
                                    setShowDepositInput(newShowInput);
                                  }}
                                  className="bg-[#004040] hover:bg-[#004040]/90 text-white text-xs py-1 px-3"
                                  variant="default"
                                  size="sm"
                                >
                                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                                  Add Collateral
                                </Button>
                              ) : (
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                      Amount to Deposit ({vault.ilk})
                                    </label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={depositAmount}
                                        onChange={(e) => {
                                          const newAmounts = new Map(
                                            depositAmounts,
                                          );
                                          newAmounts.set(
                                            vaultKey,
                                            e.target.value,
                                          );
                                          setDepositAmounts(newAmounts);
                                        }}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        className="flex-1 h-9 text-sm appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        disabled={isProcessing}
                                      />
                                      <Button
                                        onClick={() => {
                                          const newShowInput = new Map(
                                            showDepositInput,
                                          );
                                          newShowInput.set(vaultKey, false);
                                          setShowDepositInput(newShowInput);
                                          const newAmounts = new Map(
                                            depositAmounts,
                                          );
                                          newAmounts.delete(vaultKey);
                                          setDepositAmounts(newAmounts);
                                        }}
                                        variant="outline"
                                        isDisabled={isProcessing}
                                        size="sm"
                                        className="text-xs py-1.5 px-3"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                    {collateralBalance && (
                                      <p className="text-xs text-slate-500 mt-1">
                                        Available:{" "}
                                        {Number(collateralBalance).toFixed(6)}{" "}
                                        {vault.ilk}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    onClick={() =>
                                      handleDepositCollateral(
                                        vault.vaultId,
                                        vault.ilk,
                                      )
                                    }
                                    isDisabled={
                                      isProcessing ||
                                      !depositAmount ||
                                      parseFloat(depositAmount) <= 0
                                    }
                                    className="bg-[#004040] hover:bg-[#004040]/90 text-white text-xs py-1.5 px-3 w-full"
                                    size="sm"
                                  >
                                    {isDepositing ? (
                                      <>
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                        Deposit Collateral
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Borrow Section - Only show when collateral is deposited */}
                            {hasCollateral && (
                              <div className="space-y-2">
                                {!showBorrow ? (
                                  <Button
                                    onClick={() => {
                                      const newShowBorrow = new Map(
                                        showBorrowInput,
                                      );
                                      newShowBorrow.set(vaultKey, true);
                                      setShowBorrowInput(newShowBorrow);
                                    }}
                                    className="bg-[#004040] hover:bg-[#004040]/90 text-white text-xs py-1 px-3"
                                    variant="default"
                                    size="sm"
                                  >
                                    <ArrowDownCircle className="mr-1.5 h-3.5 w-3.5" />
                                    Borrow
                                  </Button>
                                ) : (
                                  <div className="space-y-2">
                                    <div>
                                      <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                        Amount to Borrow (SPUS)
                                      </label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          placeholder="0.00"
                                          value={borrowAmount}
                                          onChange={(e) => {
                                            const newAmounts = new Map(
                                              borrowAmounts,
                                            );
                                            newAmounts.set(
                                              vaultKey,
                                              e.target.value,
                                            );
                                            setBorrowAmounts(newAmounts);
                                          }}
                                          onWheel={(e) =>
                                            e.currentTarget.blur()
                                          }
                                          className="flex-1 h-9 text-sm appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          disabled={isProcessing}
                                        />
                                        <Button
                                          onClick={() => {
                                            const newShowBorrow = new Map(
                                              showBorrowInput,
                                            );
                                            newShowBorrow.set(vaultKey, false);
                                            setShowBorrowInput(newShowBorrow);
                                            const newAmounts = new Map(
                                              borrowAmounts,
                                            );
                                            newAmounts.delete(vaultKey);
                                            setBorrowAmounts(newAmounts);
                                          }}
                                          variant="outline"
                                          isDisabled={isProcessing}
                                          size="sm"
                                          className="text-xs py-1.5 px-3"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                      <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-slate-500">
                                          {maxBorrowableValue !== null
                                            ? `Max Borrowable: $${maxBorrowableValue.toLocaleString(
                                                undefined,
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                },
                                              )}`
                                            : "Max Borrowable: —"}
                                        </p>
                                        {maxBorrowableValue !== null &&
                                          borrowAmount &&
                                          parseFloat(borrowAmount) > 0 &&
                                          (() => {
                                            const remaining =
                                              maxBorrowableValue -
                                              parseFloat(borrowAmount);
                                            const isNegative = remaining < 0;
                                            return (
                                              <p
                                                className={`text-xs font-medium ${isNegative ? "text-red-600" : "text-slate-600"}`}
                                              >
                                                Remaining:{" "}
                                                {isNegative ? "-" : ""}$
                                                {Math.abs(
                                                  remaining,
                                                ).toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                })}
                                              </p>
                                            );
                                          })()}
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() =>
                                        handleBorrow(vault.vaultId, vault.ilk)
                                      }
                                      isDisabled={
                                        isProcessing ||
                                        !borrowAmount ||
                                        parseFloat(borrowAmount) <= 0
                                      }
                                      className="bg-[#004040] hover:bg-[#004040]/90 text-white text-xs py-1.5 px-3 w-full"
                                      size="sm"
                                    >
                                      {isBorrowing ? (
                                        <>
                                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        <>
                                          <ArrowDownCircle className="mr-1.5 h-3.5 w-3.5" />
                                          Borrow SPUS
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
