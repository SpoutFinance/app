"use client";

import {
  useWriteContract,
  useReadContract,
  useAccount,
  useConfig,
  usePublicClient,
} from "wagmi";
import { decodeEventLog, getContractError, decodeErrorResult } from "viem";
import vatABI from "@/abi/vat.json";
import gemJoinABI from "@/abi/gem.json";
import stablecoinJoinABI from "@/abi/stablecoinjoin.json";
import erc20ABI from "@/abi/erc20.json";
import spotterABI from "@/abi/spotter.json";
import { useContractAddress } from "@/lib/addresses";
import { useERC20Approve } from "./useERC20Approve";
import { useState, useEffect } from "react";

// Ilk for LQD - manually create bytes32 hex string
// "LQD" in ASCII: L=0x4c, Q=0x51, D=0x44, padded with zeros to 32 bytes
const LQD_ILK =
  "0x4c51440000000000000000000000000000000000000000000000000000000000" as `0x${string}`;

export function useVault() {
  const { address: userAddress } = useAccount();
  const config = useConfig();
  const publicClient = usePublicClient();
  const vatAddress = useContractAddress("vat") as `0x${string}` | undefined;
  const spotterAddress = useContractAddress("spotter") as
    | `0x${string}`
    | undefined;
  const gemJoinAddress = useContractAddress("gemJoin") as
    | `0x${string}`
    | undefined;
  const stablecoinJoinAddress = useContractAddress("stablecoinJoin") as
    | `0x${string}`
    | undefined;
  // Use SLQD token (SpoutLQDtoken) as collateral instead of TCOL
  const collateralAddress = useContractAddress("SpoutLQDtoken") as
    | `0x${string}`
    | undefined;
  const stablecoinAddress = useContractAddress("stablecoin") as
    | `0x${string}`
    | undefined;

  const {
    writeContractAsync: createVaultAsync,
    isPending: isCreateVaultPending,
    error: createVaultError,
  } = useWriteContract();
  const {
    writeContractAsync: frobAsync,
    isPending: isFrobPending,
    error: frobError,
  } = useWriteContract();
  const { writeContractAsync: hopeAsync, isPending: isHopePending } =
    useWriteContract();
  const {
    writeContractAsync: gemJoinAsync,
    isPending: isGemJoinPending,
    error: gemJoinError,
  } = useWriteContract();
  const {
    writeContractAsync: stablecoinJoinAsync,
    isPending: isStablecoinJoinPending,
    error: stablecoinJoinError,
  } = useWriteContract();

  // Get user's vault IDs
  const {
    data: userVaultIds,
    isLoading: isVaultIdsLoading,
    refetch: refetchVaultIds,
  } = useReadContract({
    address: vatAddress,
    abi: vatABI.abi as any,
    functionName: "getUserVaults",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: Boolean(vatAddress && userAddress) },
  });

  // Get vault details (for the first vault if exists)
  const [selectedVaultId, setSelectedVaultId] = useState<bigint | null>(null);
  const firstVaultId =
    userVaultIds && Array.isArray(userVaultIds) && userVaultIds.length > 0
      ? (userVaultIds[0] as bigint)
      : null;

  useEffect(() => {
    if (firstVaultId && !selectedVaultId) {
      setSelectedVaultId(firstVaultId);
    }
  }, [firstVaultId, selectedVaultId]);

  const {
    data: vaultData,
    isLoading: isVaultLoading,
    refetch: refetchVault,
  } = useReadContract({
    address: vatAddress,
    abi: vatABI.abi as any,
    functionName: "getVault",
    args: selectedVaultId !== null ? [selectedVaultId] : undefined,
    query: { enabled: Boolean(vatAddress && selectedVaultId !== null) },
  });

  // Approve hook for collateral token
  const { approve: approveCollateral, isPending: isApprovePending } =
    useERC20Approve(collateralAddress || ("0x" as `0x${string}`));

  // Get collateral balance
  const { data: collateralBalance, refetch: refetchCollateralBalance } =
    useReadContract({
      address: collateralAddress,
      abi: erc20ABI as any,
      functionName: "balanceOf",
      args: userAddress ? [userAddress] : undefined,
      query: { enabled: Boolean(collateralAddress && userAddress) },
    });

  // Get collateral token decimals
  const { data: collateralDecimals } = useReadContract({
    address: collateralAddress,
    abi: erc20ABI as any,
    functionName: "decimals",
    query: { enabled: Boolean(collateralAddress) },
  });

  const COLLATERAL_DECIMALS = collateralDecimals
    ? Number(collateralDecimals)
    : 6; // Default to 6 for SLQD

  // Get stablecoin token decimals
  const { data: stablecoinDecimals } = useReadContract({
    address: stablecoinAddress,
    abi: erc20ABI as any,
    functionName: "decimals",
    query: { enabled: Boolean(stablecoinAddress) },
  });

  const STABLECOIN_DECIMALS = stablecoinDecimals
    ? Number(stablecoinDecimals)
    : 18; // Default to 18 for stablecoin (SPUS)

  // Get ilk parameters for LQD - fetched on-chain from Vat contract
  const {
    data: ilkData,
    isLoading: isIlkLoading,
    error: ilkError,
    refetch: refetchIlk,
  } = useReadContract({
    address: vatAddress,
    abi: vatABI.abi as any,
    functionName: "getIlk",
    args: [LQD_ILK],
    query: { enabled: Boolean(vatAddress) },
  });

  // Get par from Spotter (needed to calculate liquidation ratio)
  const { data: par } = useReadContract({
    address: spotterAddress,
    abi: spotterABI.abi as any,
    functionName: "par",
    query: { enabled: Boolean(spotterAddress) },
  });

  // Debug logging for ilk parameters
  useEffect(() => {
    if (vatAddress && ilkData) {
      const ilkArray = ilkData as any[];
      console.log("📊 LQD Ilk Parameters (on-chain):", {
        Art: ilkArray[0]?.toString(),
        rate: ilkArray[1]?.toString(),
        spot: ilkArray[2]?.toString(),
        line: ilkArray[3]?.toString(),
        dust: ilkArray[4]?.toString(),
        par: par?.toString(),
      });
    }
    if (ilkError) {
      console.error("❌ Error fetching ilk parameters:", ilkError);
    }
  }, [vatAddress, ilkData, ilkError, par]);

  /**
   * Create a new vault
   * @param ilk The collateral type (ILK) as bytes32. Defaults to LQD_ILK if not provided.
   */
  const createVault = async (ilk?: `0x${string}`) => {
    if (!vatAddress) {
      throw new Error("Vat address not configured");
    }

    const ilkToUse = ilk || LQD_ILK;

    // Check if ILK is initialized before attempting to create vault
    try {
      const ilkCheck = (await publicClient?.readContract({
        address: vatAddress,
        abi: vatABI.abi as any,
        functionName: "getIlk",
        args: [ilkToUse],
      })) as any;

      if (ilkCheck && ilkCheck[0] === BigInt(0)) {
        throw new Error(
          `ILK ${ilkToUse} is not initialized. Please initialize the ILK first using the init() function.`,
        );
      }
    } catch (error: any) {
      // If it's our custom error, rethrow it
      if (error.message?.includes("not initialized")) {
        throw error;
      }
      // Otherwise, log but continue (might be a network error)
      console.warn("Could not check ILK initialization:", error);
    }

    try {
      const txHash = await createVaultAsync({
        address: vatAddress,
        abi: vatABI.abi as any,
        functionName: "createVault",
        args: [ilkToUse],
      });

      // Wait for transaction receipt to get vault ID from event
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });

        // Find VaultCreated event
        const vaultCreatedEvent = receipt.logs.find((log: any) => {
          try {
            const decoded = decodeEventLog({
              abi: vatABI.abi as any,
              data: log.data,
              topics: log.topics,
            }) as any;
            return decoded.eventName === "VaultCreated";
          } catch {
            return false;
          }
        });

        if (vaultCreatedEvent) {
          const decoded = decodeEventLog({
            abi: vatABI.abi as any,
            data: vaultCreatedEvent.data,
            topics: vaultCreatedEvent.topics,
          }) as any;
          const newVaultId = (decoded.args as any).vaultId as bigint;
          setSelectedVaultId(newVaultId);
        }
      }

      // Refetch user vaults after a short delay to ensure on-chain state is updated
      setTimeout(() => {
        refetchVaultIds();
      }, 2000);

      return txHash;
    } catch (error: any) {
      // Improve error messages for common revert reasons
      if (error?.message?.includes("revert")) {
        if (
          error?.message?.includes("InvalidIlk") ||
          error?.message?.includes("liqRatio == 0")
        ) {
          throw new Error(
            `ILK ${ilkToUse} is not initialized. The collateral type must be initialized before creating vaults.`,
          );
        }
        if (error?.message?.includes("not-live")) {
          throw new Error(
            "Vat contract is not live. Vault creation is currently disabled.",
          );
        }
      }
      throw error;
    }
  };

  /**
   * Deposit collateral into vault
   * @param vaultId - The vault ID
   * @param amountInTokenUnits - Amount in token native decimals (6 for SLQD)
   */
  const depositCollateral = async (
    vaultId: bigint,
    amountInTokenUnits: bigint,
  ) => {
    if (!gemJoinAddress || !collateralAddress || !vatAddress) {
      throw new Error("GemJoin, collateral, or Vat address not configured");
    }

    if (!publicClient) {
      throw new Error("Public client not available");
    }

    try {
      // Step 1: Approve GemJoin to spend collateral (approval uses token units)
      const approveTxHash = await approveCollateral(
        gemJoinAddress,
        amountInTokenUnits,
      );

      if (!approveTxHash) {
        throw new Error(
          "Approval transaction failed - no transaction hash returned",
        );
      }

      // Wait for approval transaction to be confirmed
      console.log(`⏳ Waiting for approval transaction: ${approveTxHash}`);
      const approveReceipt = await publicClient.waitForTransactionReceipt({
        hash: approveTxHash,
        timeout: 120_000, // 2 minute timeout
        confirmations: 1,
      });
      if (approveReceipt.status === "reverted") {
        throw new Error("Approval transaction reverted. Please try again.");
      }
      console.log(`✅ Approval transaction confirmed`);

      // Step 2.5: Verify balance right before join to catch any changes
      if (!userAddress || !collateralAddress) {
        throw new Error("User address or collateral address not available");
      }
      const currentBalance = (await publicClient.readContract({
        address: collateralAddress,
        abi: erc20ABI as any,
        functionName: "balanceOf",
        args: [userAddress],
      })) as bigint;

      if (currentBalance < amountInTokenUnits) {
        const decimals = COLLATERAL_DECIMALS;
        throw new Error(
          `Insufficient balance. You have ${(Number(currentBalance) / 10 ** decimals).toFixed(6)} tokens, but need ${(Number(amountInTokenUnits) / 10 ** decimals).toFixed(6)} tokens.`,
        );
      }

      // Step 3: Try join first - if it fails with NotAuthorized, then do hope
      // gemJoin.join() handles decimal conversion internally, so pass token units (6 decimals)
      let joinTxHash;
      let joinReceipt;

      try {
        joinTxHash = await gemJoinAsync({
          address: gemJoinAddress,
          abi: gemJoinABI.abi as any,
          functionName: "join",
          args: [vaultId, amountInTokenUnits],
        });

        if (!joinTxHash) {
          throw new Error(
            "Join transaction failed - no transaction hash returned",
          );
        }

        // Wait for join to be confirmed
        console.log(`⏳ Waiting for join transaction: ${joinTxHash}`);
        joinReceipt = await publicClient.waitForTransactionReceipt({
          hash: joinTxHash,
          timeout: 120_000,
          confirmations: 1,
        });

        if (joinReceipt.status === "reverted") {
          // Check if it's a NotAuthorized error
          const errorMessage = "Join transaction reverted";
          throw new Error(`${errorMessage}. This may require authorization.`);
        }
        console.log(`✅ Join transaction confirmed`);
      } catch (joinError: any) {
        // If join fails with NotAuthorized, try hope first
        if (
          joinError?.message?.includes("NotAuthorized") ||
          joinError?.message?.includes("not authorized") ||
          joinError?.message?.includes("authorization")
        ) {
          console.log(
            `⚠️ Join failed - authorization required. Attempting hope...`,
          );

          // Step 2: Authorize GemJoin to move collateral on behalf of user
          try {
            const hopeTxHash = await hopeAsync({
              address: vatAddress,
              abi: vatABI.abi as any,
              functionName: "hope",
              args: [gemJoinAddress],
            });

            if (hopeTxHash) {
              console.log(`⏳ Waiting for hope transaction: ${hopeTxHash}`);
              const hopeReceipt = await publicClient.waitForTransactionReceipt({
                hash: hopeTxHash,
                timeout: 120_000,
                confirmations: 1,
              });

              if (hopeReceipt.status === "reverted") {
                throw new Error(
                  "Hope transaction reverted. Authorization failed.",
                );
              }
              console.log(`✅ GemJoin authorized`);

              // Now retry join after authorization
              joinTxHash = await gemJoinAsync({
                address: gemJoinAddress,
                abi: gemJoinABI.abi as any,
                functionName: "join",
                args: [vaultId, amountInTokenUnits],
              });

              if (!joinTxHash) {
                throw new Error(
                  "Join transaction failed - no transaction hash returned",
                );
              }

              console.log(
                `⏳ Waiting for join transaction (retry): ${joinTxHash}`,
              );
              joinReceipt = await publicClient.waitForTransactionReceipt({
                hash: joinTxHash,
                timeout: 120_000,
                confirmations: 1,
              });

              if (joinReceipt.status === "reverted") {
                throw new Error(
                  "Join transaction reverted after authorization. Please try again.",
                );
              }
              console.log(`✅ Join transaction confirmed`);
            }
          } catch (hopeError: any) {
            throw new Error(
              `Authorization failed: ${hopeError?.message || "Please authorize GemJoin and try again."}`,
            );
          }
        } else {
          // Re-throw other errors
          throw joinError;
        }
      }

      // Verify tokens were actually moved to Vat by checking balance after join
      // Wait a bit for state to update after transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const balanceAfterJoin = (await publicClient.readContract({
        address: collateralAddress,
        abi: erc20ABI as any,
        functionName: "balanceOf",
        args: [userAddress],
      })) as bigint;

      const expectedBalanceAfterJoin = currentBalance - amountInTokenUnits;
      // Allow for small rounding differences (within 1 token unit to account for any rounding)
      const tolerance = BigInt(10 ** COLLATERAL_DECIMALS); // 1 token unit in native decimals
      if (balanceAfterJoin > expectedBalanceAfterJoin + tolerance) {
        // Only warn, don't throw - transaction receipt already confirmed success
        console.warn(
          `Balance verification: Expected ${expectedBalanceAfterJoin.toString()}, got ${balanceAfterJoin.toString()}. Transaction receipt shows success, so this may be a timing issue.`,
        );
      }

      // Step 4: Frob - credit collateral to vault (dink = positive amount, dart = 0)
      // Only proceed if join was successful
      // Frob handles decimal conversion internally, so pass token units (6 decimals)
      const frobTxHash = await frobAsync({
        address: vatAddress,
        abi: vatABI.abi as any,
        functionName: "frob",
        args: [vaultId, amountInTokenUnits, BigInt(0)], // dink = amountInTokenUnits (add collateral), dart = 0 (no debt change)
      });

      if (!frobTxHash) {
        throw new Error(
          "Frob transaction failed - no transaction hash returned",
        );
      }

      console.log(`✅ Frob transaction sent: ${frobTxHash}`);
      return frobTxHash;
    } catch (error: any) {
      console.error("Error in depositCollateral:", error);
      if (
        error?.message?.includes("user rejected") ||
        error?.message?.includes("User rejected")
      ) {
        throw new Error("Transaction was rejected. Please try again.");
      }
      throw error;
    }
  };

  /**
   * Withdraw collateral from vault
   * @param vaultId The vault ID
   * @param amountInTokenUnits Amount in token native decimals (6 for SLQD)
   */
  const withdrawCollateral = async (
    vaultId: bigint,
    amountInTokenUnits: bigint,
  ) => {
    if (!gemJoinAddress || !userAddress) {
      throw new Error("GemJoin address or user address not configured");
    }

    // Convert from token units (6 decimals) to WAD (18 decimals) for exit
    // gemJoin.exit() handles decimal conversion internally, so pass token units (6 decimals)
    return gemJoinAsync({
      address: gemJoinAddress,
      abi: gemJoinABI.abi as any,
      functionName: "exit",
      args: [vaultId, userAddress, amountInTokenUnits],
    });
  };

  /**
   * Borrow stablecoin (frob to create debt, then exit to mint tokens)
   * @param vaultId The vault ID
   * @param borrowAmountInTokenUnits Amount in stablecoin native decimals (18 decimals = WAD)
   */
  const borrow = async (vaultId: bigint, borrowAmountInTokenUnits: bigint) => {
    if (
      !vatAddress ||
      !stablecoinJoinAddress ||
      !userAddress ||
      !publicClient
    ) {
      throw new Error(
        "Vat, StablecoinJoin, user address, or public client not configured",
      );
    }

    // SPUS has 18 decimals, so borrowAmountInTokenUnits is already in WAD format
    // No conversion needed - use directly for calculation
    const borrowAmountInWAD = borrowAmountInTokenUnits;

    // Get the global borrow rate from Vat contract
    const vaultRate = (await publicClient.readContract({
      address: vatAddress,
      abi: vatABI.abi as any,
      functionName: "getGlobalBorrowRate",
      args: [],
    })) as bigint;

    if (!vaultRate || vaultRate === BigInt(0)) {
      throw new Error(
        "Global borrow rate is zero or invalid. Cannot calculate debt amount.",
      );
    }

    // Calculate dart: dart = (stablecoinAmount * RAY) / vaultRate
    // This gives us the normalized debt amount (art) to create
    const RAY = BigInt(10 ** 27);

    // Log the actual rate for debugging
    const rateAsNumber = Number(vaultRate) / Number(RAY);
    console.log(
      `📊 Global borrow rate: ${vaultRate.toString()} (${rateAsNumber.toFixed(6)} in decimal)`,
    );

    // FIX: Handle the case where vaultRate === RAY exactly to avoid rounding errors
    // When vaultRate === RAY (rate = 1.0), dart should equal borrowAmountInWAD exactly
    // If the rate is different (e.g., 1.05 for 5% interest), we need to do the division
    let dart: bigint;
    if (vaultRate === RAY) {
      // Special case: if rate is exactly 1.0 (RAY), dart = borrowAmountInWAD exactly
      // This avoids precision errors from division
      console.log(
        "✅ Using special case: vaultRate === RAY (rate = 1.0), dart = borrowAmountInWAD",
      );
      dart = borrowAmountInWAD;
    } else {
      // For other rates (e.g., 1.05 RAY = 5% interest), calculate with division
      // Formula: dart = (borrowAmountInWAD * RAY) / vaultRate
      console.log(
        `📐 Calculating dart with rate ${rateAsNumber.toFixed(6)}: (${borrowAmountInWAD.toString()} * ${RAY.toString()}) / ${vaultRate.toString()}`,
      );
      dart = (borrowAmountInWAD * RAY) / vaultRate;
    }

    // Get current vault state to check for overflow
    const vault = (await publicClient.readContract({
      address: vatAddress,
      abi: vatABI.abi as any,
      functionName: "getVault",
      args: [vaultId],
    })) as any;

    // Extract current art (normalized debt) from vault data
    // getVault returns: [owner, ilk, ink, art]
    const currentArt = Array.isArray(vault)
      ? (vault[3] as bigint)
      : (vault.art as bigint);

    // Calculate new art after borrowing
    const newArt = currentArt + dart;

    // IMPORTANT: Ensure dart fits in int256 (signed)
    // int256 max = 2^255 - 1, but we need to ensure it's positive
    const MAX_INT256 = BigInt(
      "57896044618658097711785492504343953926634992332820282019728792003956564819967",
    );
    if (dart > MAX_INT256) {
      throw new Error(
        `dart too large for int256: ${dart.toString()}. Cannot borrow this amount.`,
      );
    }

    // MAX_UINT96 = 2^96 - 1 = 79228162514264337593543950335
    const MAX_UINT96 = BigInt("79228162514264337593543950335");

    // Check for overflow before calling frob
    if (newArt > MAX_UINT96) {
      const errorMessage =
        `Art overflow: Cannot borrow ${borrowAmountInWAD.toString()} stablecoin.\n` +
        `Current debt (art): ${currentArt.toString()}\n` +
        `New debt would be: ${newArt.toString()}\n` +
        `Max allowed: ${MAX_UINT96.toString()}\n` +
        `Dart: ${dart.toString()}\n` +
        `Vault rate: ${vaultRate.toString()}`;

      console.error("❌ Borrow Debug:", {
        borrowAmount: borrowAmountInWAD.toString(),
        vaultRate: vaultRate.toString(),
        dart: dart.toString(),
        currentArt: currentArt.toString(),
        newArt: newArt.toString(),
        maxAllowed: MAX_UINT96.toString(),
      });

      throw new Error(errorMessage);
    }

    // Debug logging
    console.log("📊 Borrow Debug:", {
      borrowAmount: borrowAmountInWAD.toString(),
      vaultRate: vaultRate.toString(),
      dart: dart.toString(),
      currentArt: currentArt.toString(),
      newArt: newArt.toString(),
      maxAllowed: MAX_UINT96.toString(),
    });

    // First authorize StablecoinJoin (one-time per user)
    try {
      await hopeAsync({
        address: vatAddress,
        abi: vatABI.abi as any,
        functionName: "hope",
        args: [stablecoinJoinAddress],
      });
    } catch (error) {
      // Ignore if already authorized
      console.log("Hope may already be set:", error);
    }

    // Create debt via frob (dink = 0, dart = calculated dart)
    const frobTxHash = await frobAsync({
      address: vatAddress,
      abi: vatABI.abi as any,
      functionName: "frob",
      args: [vaultId, BigInt(0), dart],
    });

    console.log("📤 Frob transaction sent:", frobTxHash);

    // Wait for frob transaction to be confirmed before calling exit
    // With paid Alchemy RPC, this should be reliable, but we handle edge cases
    if (frobTxHash && publicClient) {
      try {
        // Small delay to ensure transaction is in mempool before waiting
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: frobTxHash,
          timeout: 120_000, // 2 minute timeout (should be plenty with paid RPC)
          pollingInterval: 2_000, // Poll every 2 seconds
        });

        if (receipt.status === "reverted") {
          // Try to get the revert reason from the transaction
          let revertReason = "Unknown revert reason";
          let errorData: `0x${string}` | undefined;

          try {
            const tx = await publicClient.getTransaction({ hash: frobTxHash });

            // Try to simulate the call to get the revert reason
            try {
              await publicClient.call({
                to: tx.to!,
                data: tx.input,
                value: tx.value,
                account: tx.from,
              });
            } catch (callError: any) {
              // Extract error data from various possible locations
              errorData =
                callError.data ||
                callError.cause?.data ||
                callError.cause?.cause?.data;

              if (
                errorData &&
                typeof errorData === "string" &&
                errorData.startsWith("0x")
              ) {
                try {
                  const decoded = decodeErrorResult({
                    abi: vatABI.abi as any,
                    data: errorData as `0x${string}`,
                  });
                  revertReason = `${decoded.errorName}${decoded.args ? `: ${JSON.stringify(decoded.args)}` : ""}`;
                } catch (decodeErr) {
                  // If decoding fails, try to see if it's a custom error
                  console.warn(
                    "Could not decode error data:",
                    errorData,
                    decodeErr,
                  );
                  revertReason = `Raw error data: ${errorData.slice(0, 10)}...`;
                }
              } else if (callError.shortMessage) {
                revertReason = callError.shortMessage;
              } else if (callError.message) {
                revertReason = callError.message;
              }
            }
          } catch (decodeError) {
            console.warn("Could not decode revert reason:", decodeError);
          }

          // Get vault state and ILK parameters for debugging
          const vaultState = (await publicClient.readContract({
            address: vatAddress,
            abi: vatABI.abi as any,
            functionName: "getVault",
            args: [vaultId],
          })) as any;

          const vaultInk = Array.isArray(vaultState)
            ? vaultState[2]
            : vaultState.ink;
          const vaultArt = Array.isArray(vaultState)
            ? vaultState[3]
            : vaultState.art;
          const vaultIlk = Array.isArray(vaultState)
            ? vaultState[1]
            : vaultState.ilk;

          // Get ILK parameters to check constraints
          const ilkParams = (await publicClient.readContract({
            address: vatAddress,
            abi: vatABI.abi as any,
            functionName: "getIlk",
            args: [vaultIlk],
          })) as any;

          const liqRatio = Array.isArray(ilkParams)
            ? ilkParams[0]
            : ilkParams.liqRatio;
          const spot = Array.isArray(ilkParams) ? ilkParams[5] : ilkParams.spot;

          console.error("❌ Frob transaction reverted:", {
            txHash: frobTxHash,
            revertReason,
            errorData,
            vaultId: vaultId.toString(),
            dart: dart.toString(),
            borrowAmountInWAD: borrowAmountInWAD.toString(),
            vaultRate: vaultRate.toString(),
            currentInk: vaultInk?.toString(),
            currentArt: vaultArt?.toString(),
            liqRatio: liqRatio?.toString(),
            spot: spot?.toString(),
          });

          // Calculate if this is a collateralization issue
          const inkInTokens = vaultInk ? Number(vaultInk) / 1e18 : 0;
          const borrowAmountInTokens = Number(borrowAmountInWAD) / 1e18;

          throw new Error(
            `Frob transaction reverted: ${revertReason}. ` +
              `Vault has ${inkInTokens.toFixed(6)} tokens collateral, trying to borrow ${borrowAmountInTokens.toFixed(6)} tokens. ` +
              `This likely exceeds the maximum borrowable amount based on collateralization ratio. ` +
              `Check vault constraints (liquidation ratio, debt ceiling, etc.).`,
          );
        }

        console.log("✅ Frob transaction confirmed:", receipt.transactionHash);
      } catch (error) {
        // With paid Alchemy RPC, these errors are rare but can happen during network congestion
        if (
          error instanceof Error &&
          (error.message.includes("block not found") ||
            error.message.includes("timeout") ||
            error.message.includes("Requested resource not found"))
        ) {
          console.warn(
            "⚠️ RPC issue waiting for frob confirmation - transaction may still be pending. Proceeding with exit...",
            error.message,
          );
          // Don't throw - proceed with exit and let it fail if debt wasn't created
          // The transaction will eventually confirm, and exit will work once it does
        } else if (
          error instanceof Error &&
          error.message.includes("reverted")
        ) {
          // If transaction actually reverted, throw with the error message
          throw error;
        } else {
          // For other errors, log but proceed - exit will fail if needed
          console.warn(
            "⚠️ Error waiting for frob transaction, proceeding anyway:",
            error,
          );
        }
      }
    }

    // Convert internal DAI to stablecoin tokens (exit expects WAD = 18 decimals)
    // exit should mint the ERC20 tokens - no liquidity required
    // The amount passed should match what was borrowed
    console.log("🔄 Calling exit to mint stablecoin tokens:", {
      userAddress,
      borrowAmountInWAD: borrowAmountInWAD.toString(),
      stablecoinJoinAddress,
    });

    try {
      return await stablecoinJoinAsync({
        address: stablecoinJoinAddress,
        abi: stablecoinJoinABI.abi as any,
        functionName: "exit",
        args: [userAddress, borrowAmountInWAD],
      });
    } catch (error: any) {
      // Try to extract more detailed error information
      let detailedError = error.message || "Unknown error";
      let revertReason = "";

      try {
        // Try to decode the error if it's a contract error
        if (error.cause || error.data) {
          const contractError = getContractError(error, {
            abi: stablecoinJoinABI.abi as any,
            functionName: "exit",
            args: [userAddress, borrowAmountInWAD],
          });
          if (contractError) {
            revertReason =
              contractError.shortMessage || contractError.message || "";
            detailedError = `${error.message} - ${revertReason}`;
          }
        }
      } catch (decodeError) {
        // If decoding fails, use the original error
        console.warn("Could not decode error:", decodeError);
      }

      console.error("❌ Exit failed:", {
        error: error.message,
        revertReason,
        errorDetails: error,
        userAddress,
        borrowAmountInWAD: borrowAmountInWAD.toString(),
        stablecoinJoinAddress,
        dart: dart.toString(),
        vaultRate: vaultRate.toString(),
      });

      // Re-throw with more context
      throw new Error(
        `Exit failed after successful frob: ${detailedError}${revertReason ? ` (${revertReason})` : ""}. ` +
          `Debt was created in Vat (dart: ${dart.toString()}), but exit to mint tokens failed. ` +
          `Amount: ${borrowAmountInWAD.toString()} (WAD). ` +
          `Possible causes: authorization issue, contract not live, or invalid amount.`,
      );
    }
  };

  /**
   * Repay debt (join to burn tokens, then frob to destroy debt)
   * @param vaultId The vault ID
   * @param repayAmountInTokenUnits Amount in stablecoin native decimals (18 decimals = WAD)
   */
  const repay = async (vaultId: bigint, repayAmountInTokenUnits: bigint) => {
    if (!stablecoinJoinAddress || !vatAddress || !userAddress) {
      throw new Error("StablecoinJoin or Vat address not configured");
    }

    // SPUS has 18 decimals, so repayAmountInTokenUnits is already in WAD format
    // No conversion needed - use directly
    const repayAmountInWAD = repayAmountInTokenUnits;

    // Convert WAD to RAD (27 decimals) for frob
    const RAY = BigInt(10 ** 27);
    const rad = repayAmountInWAD * RAY;

    // Convert stablecoin tokens to internal DAI (join expects WAD = 18 decimals)
    await stablecoinJoinAsync({
      address: stablecoinJoinAddress,
      abi: stablecoinJoinABI.abi as any,
      functionName: "join",
      args: [userAddress, repayAmountInWAD],
    });

    // Repay debt via frob (negative dart to decrease debt)
    const negativeDart = -rad;
    return frobAsync({
      address: vatAddress,
      abi: vatABI.abi as any,
      functionName: "frob",
      args: [vaultId, BigInt(0), negativeDart],
    });
  };

  // Parse vault data
  const parseIlk = (ilkBytes: `0x${string}`): string => {
    try {
      // Remove null bytes and convert to string
      const hex = ilkBytes.slice(2);
      let result = "";
      for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.substr(i, 2), 16);
        if (byte === 0) break;
        result += String.fromCharCode(byte);
      }
      return result;
    } catch {
      return ilkBytes;
    }
  };

  const vault = vaultData
    ? {
        owner: (vaultData as any)[0] as string,
        ilk: parseIlk((vaultData as any)[1] as `0x${string}`),
        ink: (vaultData as any)[2] as bigint, // Collateral amount
        art: (vaultData as any)[3] as bigint, // Normalized debt
      }
    : null;

  const collateralBalanceFormatted = collateralBalance
    ? (collateralBalance as bigint)
    : BigInt(0);

  // Parse ilk parameters
  // Note: liqRatio (mat) is stored in Spotter but not exposed via public getter
  // We can calculate it from: mat = (price * par) / spot, but we need the oracle price
  // For now, we display what's available from getIlk
  const ilkParams = ilkData
    ? {
        Art: (ilkData as any)[0] as bigint, // Total normalized debt (wad)
        rate: (ilkData as any)[1] as bigint, // Accumulated stability fee rate (RAY)
        spot: (ilkData as any)[2] as bigint, // Adjusted collateral price (RAY) = price * par / mat
        line: (ilkData as any)[3] as bigint, // Maximum debt ceiling (RAD)
        dust: (ilkData as any)[4] as bigint, // Minimum debt amount (RAD)
        par: par as bigint | undefined, // Reference price from Spotter (RAY)
      }
    : null;

  return {
    // Addresses
    vatAddress,
    gemJoinAddress,
    stablecoinJoinAddress,
    collateralAddress,

    // Vault state
    userVaultIds: userVaultIds as bigint[] | undefined,
    selectedVaultId,
    setSelectedVaultId,
    vault,
    hasVault: firstVaultId !== null,

    // Ilk parameters (fetched on-chain)
    ilkParams,
    isIlkLoading,
    ilkError,

    // Balances
    collateralBalance: collateralBalanceFormatted,

    // Actions
    createVault,
    depositCollateral,
    withdrawCollateral,
    borrow,
    repay,

    // Loading states
    isCreateVaultPending,
    isFrobPending,
    isGemJoinPending,
    isStablecoinJoinPending,
    isApprovePending,
    isVaultIdsLoading,
    isVaultLoading,

    // Errors
    createVaultError,
    frobError,
    gemJoinError,
    stablecoinJoinError,

    // Refetch functions
    refetchVault,
    refetchVaultIds,
    refetchCollateralBalance,
    refetchIlk,
  };
}
