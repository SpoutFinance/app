import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import onchainidABI from "@/abi/onchainid.json";
import { concatHex } from "viem";
import { ethers } from "ethers";
import { useState } from "react";

/**
 * Legacy add-claim hook (kept for backwards compatibility with other flows).
 * Mirrors the logic used before the inline port in `components/kycFlow.tsx`.
 */
export function useAddClaim() {
  const [error, setError] = useState<string>("");
  const {
    writeContract,
    data: addClaimHash,
    isPending: isAddingClaim,
  } = useWriteContract();
  const { isLoading: isConfirmingClaim, isSuccess: isClaimAdded } =
    useWaitForTransactionReceipt({
      hash: addClaimHash,
    });

  const addClaim = async ({
    onchainIDAddress,
    issuerAddress,
    signature,
    topic = 1,
    claimData = "KYC passed",
  }: {
    onchainIDAddress: string;
    issuerAddress: string;
    signature: { r: string; s: string; v: number };
    topic?: number;
    claimData?: string;
  }) => {
    setError("");
    try {
      // Prepare claim data hash - EXACT MATCH with backend script
      // Backend: ethers.utils.toUtf8Bytes(claimData)
      const claimDataBytes = ethers.toUtf8Bytes(claimData);
      // Backend: ethers.utils.keccak256(claimDataBytes)
      const claimDataHash = ethers.keccak256(claimDataBytes);

      // Prepare signature - EXACT MATCH with backend script
      const r = (
        signature.r.startsWith("0x") ? signature.r : `0x${signature.r}`
      ) as `0x${string}`;
      const s = (
        signature.s.startsWith("0x") ? signature.s : `0x${signature.s}`
      ) as `0x${string}`;
      const v =
        `0x${signature.v.toString(16).padStart(2, "0")}` as `0x${string}`;
      const sig = concatHex([r, s, v]) as `0x${string}`;

      // Prepare contract arguments - EXACT MATCH with backend script
      // Backend uses: ethers.utils.arrayify(claimDataHash) for the _data parameter
      // In ethers v6: ethers.getBytes() is equivalent to ethers.utils.arrayify()
      const claimDataHashBytes = ethers.getBytes(claimDataHash);

      // For wagmi, we need to pass hex string, but the bytes are the same as backend's arrayify
      // Backend passes: ethers.utils.arrayify(claimDataHash) which serializes to the same hex string
      const contractArgs = [
        topic,
        1, // scheme
        issuerAddress as `0x${string}`,
        sig,
        claimDataHash, // Pass as hex string (same bytes as backend's arrayify, wagmi will serialize correctly)
        "",
      ] as const;

      // Compute what the contract will verify to recover the signer
      // Contract's isClaimValid does:
      //   1. bytes32 dataHash = keccak256(abi.encode(_identity, claimTopic, data));
      //   2. bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash));
      //   3. address recovered = getRecoveredAddress(sig, prefixedHash);
      // Backend: ethers.utils.defaultAbiCoder
      // In ethers v6: ethers.AbiCoder.defaultAbiCoder() is equivalent
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();

      // Step 1: Compute dataHash (what contract computes) - EXACT MATCH with backend script
      // Backend: abiCoder.encode(["address", "uint256", "bytes"], [onchainIDAddress, topic, ethers.utils.arrayify(claimDataHash)])
      const encodedForDataHash = abiCoder.encode(
        ["address", "uint256", "bytes"],
        [onchainIDAddress, topic, claimDataHashBytes], // Use bytes array (equivalent to arrayify)
      );
      // Backend: ethers.utils.keccak256(encoded)
      const dataHash = ethers.keccak256(encodedForDataHash);

      // Step 2: Compute prefixedHash (what contract uses for signature recovery)
      const messagePrefix = "\x19Ethereum Signed Message:\n32";
      // Backend: ethers.utils.arrayify(dataHash)
      const dataHashBytes = ethers.getBytes(dataHash);
      // Backend: ethers.utils.concat([ethers.utils.toUtf8Bytes(messagePrefix), dataHashBytes])
      const prefixedHashBytes = ethers.concat([
        ethers.toUtf8Bytes(messagePrefix),
        dataHashBytes,
      ]);
      // Backend: ethers.utils.keccak256(prefixedHashBytes)
      const prefixedHash = ethers.keccak256(prefixedHashBytes);

      writeContract({
        address: onchainIDAddress as `0x${string}`,
        abi: onchainidABI as any,
        functionName: "addClaim",
        args: contractArgs,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to add claim");
    }
  };

  return {
    addClaim,
    isAddingClaim,
    isConfirmingClaim,
    isClaimAdded,
    error,
  };
}
