"use client";

import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { AuthProvider } from "@/context/AuthContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { base } from "@/lib/chainconfigs/base";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

const queryClient = new QueryClient();

// Custom config with more reliable RPC endpoints
const projectId =
  process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID ||
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
  "";

// Note: projectId warning removed - check env vars if wallet connection fails

const config = getDefaultConfig({
  appName: "Spout Finance",
  projectId: projectId,
  chains: [base],
  transports: {
    [base.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/8kJGY10SfG5kZWlOzrlJJ",
    ),
  },
  ssr: true,
});

function WalletConnectionPrompt() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const pathname = usePathname();

  // Only show wallet connection prompt on /app routes, not on landing page
  const shouldShowPrompt = pathname?.startsWith("/app");

  useEffect(() => {
    if (shouldShowPrompt && !isConnected) {
      toast("Wallet not connected", {
        description: "Please connect your wallet to continue.",
        action: {
          label: "Connect Wallet",
          onClick: openConnectModal ?? (() => {}),
        },
        duration: Infinity,
      });
    }
  }, [isConnected, openConnectModal, shouldShowPrompt]);

  return null;
}

const Providers = ({ children }: { children: ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <AuthProvider>
          <NetworkProvider>
            <WalletConnectionPrompt />
            {children}
          </NetworkProvider>
        </AuthProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export { Providers };
