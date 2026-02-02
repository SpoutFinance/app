import { useAccount, useSwitchChain } from "wagmi";
import { base } from "@/lib/chainconfigs/base";
import { useCallback } from "react";

export const useNetworkSwitch = () => {
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const checkAndSwitchNetwork = useCallback(async () => {
    if (!chainId) {
      throw new Error("No chain detected. Please connect your wallet.");
    }

    if (chainId !== base.id) {
      try {
        await switchChainAsync({ chainId: base.id });
      } catch (err) {
        console.error("Error switching network:", err);
        throw new Error("Failed to switch to Base Sepolia network");
      }
    }
  }, [chainId, switchChainAsync]);

  return {
    checkAndSwitchNetwork,
    isBase: chainId === base.id,
    currentChain: chainId,
  };
};
