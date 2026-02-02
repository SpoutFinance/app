import AboutPage from "@/components/features/about/about-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Spout Finance - Our Mission & Team",
  description:
    "Meet the team behind Spout Finance. Learn about our mission to revolutionize DeFi through secure, transparent tokenized real-world assets on Solana.",
  keywords: [
    "Spout Finance team",
    "RWA DeFi company",
    "tokenized assets company",
    "Solana DeFi team",
    "blockchain finance",
  ],
  openGraph: {
    title: "About Us | Spout Finance - Our Mission & Team",
    description:
      "Meet the team behind Spout Finance. Learn about our mission to revolutionize DeFi through secure, transparent tokenized real-world assets on Solana.",
    url: "https://spout.finance/company",
    siteName: "Spout Finance",
    images: [
      {
        url: "/Whale.png",
        width: 1200,
        height: 630,
        alt: "Spout Finance Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Spout Finance - Our Mission & Team",
    description:
      "Meet the team behind Spout Finance. Learn about our mission to revolutionize DeFi through secure, transparent tokenized real-world assets.",
    images: ["/Whale.png"],
  },
};

export default function AboutPageRoot() {
  return (
    <>
      <AboutPage />
    </>
  );
}
