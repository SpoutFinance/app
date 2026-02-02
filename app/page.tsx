import { LandingContent } from "@/components/features/root";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spout Finance",
  description:
    "Spout Finance is a RWA platform tokenizing efficient collateral assets and building the next generation of collateral infrastructure",
  keywords: [
    "tokenized assets",
    "RWA",
    "real world assets",
    "Solana DeFi",
    "tokenized bonds",
    "T-Bills crypto",
    "corporate bonds DeFi",
    "proof of reserves",
    "institutional DeFi",
    "yield farming",
  ],
  openGraph: {
    title: "Spout Finance",
    description:
      "Spout Finance is a RWA platform tokenizing efficient collateral assets and building the next generation of collateral infrastructure",
    url: "https://spout.finance",
    siteName: "Spout Finance",
    images: [
      {
        url: "/Whale.png",
        width: 1200,
        height: 630,
        alt: "Spout Finance - Tokenized Real-World Assets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spout Finance",
    description:
      "Spout Finance is a RWA platform tokenizing efficient collateral assets and building the next generation of collateral infrastructure",
    images: ["/Whale.png"],
  },
};

export default function HomePage() {
  return <LandingContent />;
}
