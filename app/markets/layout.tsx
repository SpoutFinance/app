import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markets - Spout Finance",
  description:
    "Track real-time stock prices and market data. View live quotes for AAPL, TSLA, MSFT, GOOGL, and more popular stocks.",
  keywords: [
    "stock market",
    "real-time prices",
    "market data",
    "stock quotes",
    "trading",
    "AAPL",
    "TSLA",
    "NVDA",
  ],
  openGraph: {
    title: "Markets - Spout Finance",
    description:
      "Track real-time stock prices and market data on Spout Finance.",
    url: "https://spout.finance/markets",
  },
};

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
