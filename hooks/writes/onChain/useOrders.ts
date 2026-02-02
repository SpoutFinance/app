import { useWriteContract } from "wagmi";
import ordersABIFile from "@/abi/ordersChainlink.json";
import { useContractAddress } from "@/lib/addresses";

const ordersABI = Array.isArray(ordersABIFile)
  ? ordersABIFile
  : ordersABIFile.abi;

const DEFAULT_CHAINLINK_SUBSCRIPTION_ID = BigInt(
  process.env.NEXT_PUBLIC_CHAINLINK_SUBSCRIPTION_ID || 522,
);

export function useOrdersContract() {
  const orders = useContractAddress("orders");
  const { writeContract, data, isPending, isSuccess, error } =
    useWriteContract();

  function buyAsset(
    asset: string,
    ticker: string,
    token: `0x${string}`,
    usdcAmount: bigint,
    subscriptionId: bigint = DEFAULT_CHAINLINK_SUBSCRIPTION_ID,
  ) {
    const ordersAddress = orders as `0x${string}`;

    // Validate inputs
    if (
      !ordersAddress ||
      ordersAddress === "0x0000000000000000000000000000000000000000"
    ) {
      throw new Error("Orders contract address is not configured");
    }

    if (!asset || typeof asset !== "string" || asset.trim() === "") {
      throw new Error("Invalid asset parameter: must be a non-empty string");
    }

    if (!ticker || typeof ticker !== "string" || ticker.trim() === "") {
      throw new Error("Invalid ticker parameter: must be a non-empty string");
    }

    if (
      !token ||
      token === "0x0000000000000000000000000000000000000000" ||
      !token.startsWith("0x")
    ) {
      throw new Error(`Invalid token address: ${token}`);
    }

    if (!usdcAmount || usdcAmount <= BigInt(0)) {
      throw new Error(
        `Invalid USDC amount: ${usdcAmount?.toString() || "undefined"}`,
      );
    }

    if (!subscriptionId || subscriptionId <= BigInt(0)) {
      throw new Error(
        `Invalid subscription ID: ${subscriptionId?.toString() || "undefined"}`,
      );
    }

    console.log("🔍 buyAsset called with:", {
      asset,
      ticker,
      token,
      usdcAmount: usdcAmount.toString(),
      subscriptionId: subscriptionId.toString(),
      ordersAddress,
    });

    try {
      writeContract({
        address: ordersAddress as `0x${string}`,
        abi: ordersABI,
        functionName: "buyAsset",
        args: [asset, ticker, token, usdcAmount, subscriptionId, ordersAddress],
        gas: BigInt(500000),
      });
      // writeContract returns void - the transaction hash will be available in the hook's data property
      // Errors will be thrown synchronously if validation fails
    } catch (err: any) {
      console.error("❌ Error in buyAsset writeContract call:", err);
      throw new Error(
        err?.message || err?.reason || "Failed to submit buy transaction",
      );
    }
  }

  function sellAsset(
    asset: string,
    ticker: string,
    token: `0x${string}`,
    tokenAmount: bigint,
    subscriptionId: bigint = DEFAULT_CHAINLINK_SUBSCRIPTION_ID,
  ) {
    const ordersAddress = orders as `0x${string}`;

    // Validate inputs
    if (
      !ordersAddress ||
      ordersAddress === "0x0000000000000000000000000000000000000000"
    ) {
      throw new Error("Orders contract address is not configured");
    }

    if (!asset || typeof asset !== "string" || asset.trim() === "") {
      throw new Error("Invalid asset parameter: must be a non-empty string");
    }

    if (!ticker || typeof ticker !== "string" || ticker.trim() === "") {
      throw new Error("Invalid ticker parameter: must be a non-empty string");
    }

    if (
      !token ||
      token === "0x0000000000000000000000000000000000000000" ||
      !token.startsWith("0x")
    ) {
      throw new Error(`Invalid token address: ${token}`);
    }

    if (!tokenAmount || tokenAmount <= BigInt(0)) {
      throw new Error(
        `Invalid token amount: ${tokenAmount?.toString() || "undefined"}`,
      );
    }

    if (!subscriptionId || subscriptionId <= BigInt(0)) {
      throw new Error(
        `Invalid subscription ID: ${subscriptionId?.toString() || "undefined"}`,
      );
    }

    console.log("🔍 sellAsset called with:", {
      asset,
      ticker,
      token,
      tokenAmount: tokenAmount.toString(),
      subscriptionId: subscriptionId.toString(),
      ordersAddress,
    });

    try {
      writeContract({
        address: ordersAddress as `0x${string}`,
        abi: ordersABI,
        functionName: "sellAsset",
        args: [
          asset,
          ticker,
          token,
          tokenAmount,
          subscriptionId,
          ordersAddress,
        ],
        gas: BigInt(500000),
      });
      // writeContract returns void - the transaction hash will be available in the hook's data property
      // Errors will be thrown synchronously if validation fails
    } catch (err: any) {
      console.error("❌ Error in sellAsset writeContract call:", err);
      throw new Error(
        err?.message || err?.reason || "Failed to submit sell transaction",
      );
    }
  }

  return {
    buyAsset,
    sellAsset,
    data,
    isPending,
    isSuccess,
    error,
  };
}
