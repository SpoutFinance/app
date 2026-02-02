import { useContractAddress } from "@/lib/addresses";
import { useTokenBalance } from "./useTokenBalance";
import { useAccount } from "wagmi";

export function useCollateralTokenBalance() {
  // Use SLQD token (SpoutLQDtoken) as collateral instead of TCOL
  const slqdToken = useContractAddress("SpoutLQDtoken") as `0x${string}`;
  const { address } = useAccount();
  return useTokenBalance(slqdToken, (address ?? null) as any);
}
