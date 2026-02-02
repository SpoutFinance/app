"use client";

import { useAccount, useReadContract } from "wagmi";
import { toast } from "sonner";
import { useOnchainID } from "@/hooks/view/onChain/useOnchainID";
import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getAppRoute, normalizePathname } from "@/lib/utils";
import { useContractAddress } from "@/lib/addresses";
import { useUSDCTokenBalance } from "@/hooks/view/onChain/useUSDCTokenBalance";
import identityABI from "@/abi/identity.json";

export default function OnchainIDChecker() {
  const { address: userAddress } = useAccount();
  const idFactoryAddress = "0xb04eAce0e3D886Bc514e84Ed42a7C43FC2183536";
  const issuerAddress = useContractAddress("issuer");
  const {
    hasOnchainID,
    hasEverHadOnchainID,
    hasKYCClaim,
    onchainIDAddress,
    kycClaim,
    loading: onchainIDLoading,
    kycLoading,
  } = useOnchainID({
    userAddress,
    idFactoryAddress,
    issuer: issuerAddress,
    topic: 1,
  });

  // Check isClaimValid on ClaimIssuer contract
  const canCheckClaimValid =
    !!onchainIDAddress &&
    !!issuerAddress &&
    !!kycClaim &&
    Array.isArray(kycClaim);
  const claimSignature = canCheckClaimValid
    ? (kycClaim[3] as string)
    : undefined;
  const claimData = canCheckClaimValid ? (kycClaim[4] as string) : undefined;

  const { data: isClaimValid, isLoading: isClaimValidLoading } =
    useReadContract({
      address: canCheckClaimValid
        ? (issuerAddress as `0x${string}`)
        : undefined,
      abi: identityABI.abi as any,
      functionName: "isClaimValid",
      args:
        canCheckClaimValid && onchainIDAddress && claimSignature && claimData
          ? [
              onchainIDAddress as `0x${string}`,
              BigInt(1), // topic
              claimSignature as `0x${string}`,
              claimData as `0x${string}`,
            ]
          : undefined,
      query: { enabled: canCheckClaimValid && !!claimSignature && !!claimData },
    });

  // Determine if claim is actually valid
  const claimIsValid =
    canCheckClaimValid && isClaimValid !== undefined
      ? Boolean(isClaimValid)
      : kycClaim
        ? hasKYCClaim
        : false;

  // Track if we've already shown the KYC toast to prevent duplicates
  const [hasShownKYCToast, setHasShownKYCToast] = React.useState(false);

  // Track if we've waited for data to settle
  const [hasWaitedForSettlement, setHasWaitedForSettlement] =
    React.useState(false);
  const { amountUi: usdcBalance, isLoading: usdcLoading } =
    useUSDCTokenBalance();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Wait for data to settle before making any decisions
  React.useEffect(() => {
    const isLoading = onchainIDLoading || kycLoading || isClaimValidLoading;

    if (!isLoading && !hasWaitedForSettlement) {
      const timer = setTimeout(() => {
        setHasWaitedForSettlement(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    hasOnchainID,
    onchainIDLoading,
    kycLoading,
    isClaimValidLoading,
    hasWaitedForSettlement,
    hasEverHadOnchainID,
    claimIsValid,
  ]);

  // Immediately dismiss any existing KYC toasts if KYC is completed
  React.useEffect(() => {
    if (
      hasOnchainID === true &&
      claimIsValid === true &&
      !onchainIDLoading &&
      !kycLoading &&
      !isClaimValidLoading
    ) {
      toast.dismiss("kyc-toast");
    }
  }, [
    hasOnchainID,
    claimIsValid,
    onchainIDLoading,
    kycLoading,
    isClaimValidLoading,
  ]);

  React.useEffect(() => {
    // Dismiss toast if already on the KYC tab
    if (
      normalizePathname(pathname ?? "") === "/app/profile" &&
      searchParams?.get("tab") === "kyc"
    ) {
      toast.dismiss("kyc-toast");
    }

    // Also dismiss if KYC is completed, regardless of page
    if (
      hasOnchainID === true &&
      claimIsValid === true &&
      !onchainIDLoading &&
      !kycLoading &&
      !isClaimValidLoading
    ) {
      toast.dismiss("kyc-toast");
    }
  }, [
    pathname,
    searchParams,
    hasOnchainID,
    claimIsValid,
    onchainIDLoading,
    kycLoading,
    isClaimValidLoading,
  ]);

  // Dismiss KYC toast when KYC is completed
  React.useEffect(() => {
    if (
      hasOnchainID === true &&
      claimIsValid === true &&
      !onchainIDLoading &&
      !kycLoading &&
      !isClaimValidLoading
    ) {
      toast.dismiss("kyc-toast");
    }
  }, [
    hasOnchainID,
    hasKYCClaim,
    isClaimValid,
    claimIsValid,
    onchainIDLoading,
    kycLoading,
    isClaimValidLoading,
  ]);

  // Show 'Claim USDC' Sonner if user has no USDC, but only on the trade page
  React.useEffect(() => {
    // Dismiss USDC toast if user has USDC balance
    if (!usdcLoading && Number(usdcBalance) > 50) {
      toast.dismiss("usdc-toast");
      return;
    }

    if (
      !usdcLoading &&
      Number(usdcBalance) <= 0 &&
      normalizePathname(pathname ?? "") === "/app/trade"
    ) {
      toast.warning(
        "You need USDC to start trading. Claim your testnet USDC to begin.",
        {
          id: "usdc-toast",
          action: {
            label: "Claim USDC",
            onClick: () => {
              window.open("https://testnet.zenithswap.xyz/swap", "_blank");
              toast.dismiss("usdc-toast");
            },
          },
          duration: Infinity,
        },
      );
    }
  }, [usdcBalance, usdcLoading, pathname, searchParams]);

  // Show 'Complete Profile' Sonner if user has not completed KYC or claim is not valid
  React.useEffect(() => {
    // Wait for all loading to complete
    const isLoading = onchainIDLoading || kycLoading || isClaimValidLoading;

    // Don't do anything while loading or before data has settled
    if (isLoading || !hasWaitedForSettlement) {
      return;
    }

    // Don't show toast on KYC page
    if (
      normalizePathname(pathname ?? "") === "/app/profile" &&
      searchParams?.get("tab") === "kyc"
    ) {
      toast.dismiss("kyc-toast");
      return;
    }

    // FIRST: Check if claim is valid - if so, dismiss toast and return early
    if (hasOnchainID && claimIsValid === true) {
      toast.dismiss("kyc-toast");
      setHasShownKYCToast(false);
      return;
    }

    // SECOND: Show toast if user has identity but claim is not valid (or doesn't exist)
    if (hasOnchainID && claimIsValid !== true && !hasShownKYCToast) {
      setHasShownKYCToast(true);
      toast.warning(
        "Complete KYC and create your onchainIdentity to buy equities",
        {
          id: "kyc-toast",
          action: {
            label: "Complete Profile",
            onClick: () => {
              router.push(getAppRoute("/app/profile?tab=kyc"));
              toast.dismiss("kyc-toast");
            },
          },
          duration: Infinity,
        },
      );
      return;
    } else if (
      !hasOnchainID &&
      hasEverHadOnchainID === false &&
      !hasShownKYCToast
    ) {
      // THIRD: Show toast if user has never had an onchain ID
      setHasShownKYCToast(true);
      toast.warning(
        "Complete KYC and create your onchainIdentity to buy equities",
        {
          id: "kyc-toast",
          action: {
            label: "Complete Profile",
            onClick: () => {
              router.push(getAppRoute("/app/profile?tab=kyc"));
              toast.dismiss("kyc-toast");
            },
          },
          duration: Infinity,
        },
      );
    }
  }, [
    hasOnchainID,
    hasEverHadOnchainID,
    hasKYCClaim,
    isClaimValid,
    claimIsValid,
    onchainIDLoading,
    kycLoading,
    isClaimValidLoading,
    router,
    pathname,
    searchParams,
    hasShownKYCToast,
    hasWaitedForSettlement,
  ]);

  // Always dismiss KYC toast if claim is valid and data has settled
  if (
    hasOnchainID === true &&
    claimIsValid === true &&
    !onchainIDLoading &&
    !kycLoading &&
    !isClaimValidLoading &&
    hasWaitedForSettlement
  ) {
    toast.dismiss("kyc-toast");
  }

  return null;
}
