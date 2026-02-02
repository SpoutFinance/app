import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/utils/fetchWithTimeout";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, onchainIDAddress, claimData, topic, countryCode } =
      body;

    // Validate required fields
    if (
      !userAddress ||
      !onchainIDAddress ||
      !claimData ||
      !topic ||
      !countryCode
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Call the external API
    const response = await fetchWithTimeout(
      "https://rwa-deploy-backend-base-sepolia.onrender.com/user/kyc-signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.BACKEND_API_KEY ?? "",
        },
        body: JSON.stringify({
          userAddress,
          onchainIDAddress,
          claimData,
          topic,
          countryCode,
        }),
        timeoutMs: 8000,
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: "Failed to get KYC signature from external API" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Validate issuer address - the external API might return the deployment owner instead of the issuer contract
    const expectedIssuers = {
      "84532": "0xec0B601c4C0c49aa67ca40948C0A841292Bda3D5", // Base Sepolia - CORRECT ClaimIssuer
      "688688": "0xA5C77b623BEB3bC0071fA568de99e15Ccc06C7cb", // Pharos Testnet
    };

    // If the API returns the deployment owner address, replace it with the correct issuer
    if (data.issuerAddress === "0x369B11fb8C65d02b3BdD68b922e8f0D6FDB58717") {
      // Default to Base Sepolia issuer (since the API URL suggests Base Sepolia)
      data.issuerAddress = expectedIssuers["84532"];
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
