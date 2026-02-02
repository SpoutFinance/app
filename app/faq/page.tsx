import FaqPage from "@/components/features/faq/faq-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Spout Finance - Tokenized RWA Questions Answered",
  description:
    "Get answers about Spout Finance: 0% APR borrowing, tokenized equities, proof of reserves, and DeFi yield strategies. Learn how to trade RWAs on Solana.",
  keywords: [
    "Spout Finance FAQ",
    "tokenized equities questions",
    "RWA DeFi help",
    "0% APR borrowing",
    "proof of reserves",
    "Solana DeFi FAQ",
    "covered call strategy",
  ],
  openGraph: {
    title: "FAQ | Spout Finance - Tokenized RWA Questions Answered",
    description:
      "Get answers about Spout Finance: 0% APR borrowing, tokenized equities, proof of reserves, and DeFi yield strategies on Solana.",
    url: "https://spout.finance/faq",
    siteName: "Spout Finance",
    images: [
      {
        url: "/Whale.png",
        width: 1200,
        height: 630,
        alt: "Spout Finance FAQ",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Spout Finance - Tokenized RWA Questions Answered",
    description:
      "Get answers about Spout Finance: 0% APR borrowing, tokenized equities, proof of reserves, and DeFi yield strategies.",
    images: ["/Whale.png"],
  },
};

// JSON-LD structured data for FAQ rich snippets
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why not just use a traditional off-chain brokerage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Traditional brokerages trap your wealth in a "walled garden" where accessing liquidity requires either selling your assets (triggering taxes) or paying predatory margin rates of 8–12%. Spout eliminates this friction by tokenizing the asset, allowing you to borrow against your portfolio at 0% APR while keeping your long-term position intact.',
      },
    },
    {
      "@type": "Question",
      name: "How does Spout handle off-hour market liquidations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Spout handles after-hours liquidations through an Internal Buyout Protocol where the Lending Pool acts as the "Buyer of Last Resort" to prevent gap risk. If a liquidation is triggered when markets are closed, the Lending Pool automatically purchases the distressed collateral from the borrower at a pre-defined discount.',
      },
    },
    {
      "@type": "Question",
      name: "How do I get started with Spout?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To get started with Spout, you simply choose your role based on your capital needs. Equity buyers and borrowers first complete a quick on-chain KYC verification to mint tokenized assets, which can then be locked in vaults to access 0% APR liquidity. Lenders can participate permissionlessly by connecting their wallet and depositing stablecoins to earn 10–15% APY.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Spout option strategy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Spout utilizes an automated covered call strategy to generate yield that completely subsidizes your borrowing costs, enabling 0% APR loans. We algorithmically target deep Out-of-the-Money strike prices, ensuring you retain the vast majority of your asset's upside potential.",
      },
    },
    {
      "@type": "Question",
      name: "What chains does Spout support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Spout currently supports Solana and Solayer (SVM) to leverage their high-speed, low-cost infrastructure for real-time asset settlement. We plan to deploy on additional high-performance chains in the future as we scale.",
      },
    },
    {
      "@type": "Question",
      name: "How does Spout verify asset backing and reserves?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Spout verifies asset backing through a real-time proof of reserve system where all underlying equities are held in segregated, SIPC-insured accounts at our regulated U.S. Broker-Dealer. We bridge this custody data on-chain via an automated API that constantly synchronizes minted assets with held shares to ensure a 1:1 match.",
      },
    },
  ],
};

export default function FaqPageRoot() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqPage />
    </>
  );
}
