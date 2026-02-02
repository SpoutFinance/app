"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useNetworkSwitch } from "@/hooks/use-network-switch";
import { toast } from "sonner";

interface NetworkContextType {
  isBase: boolean;
  currentChain: number | undefined;
  checkAndSwitchNetwork: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isConnected } = useAccount();
  const { checkAndSwitchNetwork, isBase, currentChain } = useNetworkSwitch();

  // Automatically switch to Base Sepolia when wallet connects
  // Only run once when connection status changes, not on every chainId change
  useEffect(() => {
    if (isConnected && !isBase) {
      checkAndSwitchNetwork().catch((error) => {
        console.error("Failed to switch network:", error);
        toast.error("Failed to switch to Base Sepolia network");
      });
    }
  }, [isConnected, isBase, checkAndSwitchNetwork]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo<NetworkContextType>(
    () => ({
      isBase,
      currentChain,
      checkAndSwitchNetwork,
    }),
    [isBase, currentChain, checkAndSwitchNetwork],
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};
