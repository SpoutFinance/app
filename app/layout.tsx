import { RumInit } from "@/aws/rum-init";
import { AnnouncementBarWrapper } from "@/components/announcement-bar-wrapper";
import {
  ConditionalFooter,
  ConditionalNavbar,
} from "@/components/conditionalNavbar";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import {
  DM_Mono,
  DM_Sans,
  Figtree,
  IBM_Plex_Mono,
  Lora,
  Noto_Sans,
  PT_Serif,
  Public_Sans,
} from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"], // Optimized: removed unused 500 and 700 weights (~50KB savings)
  variable: "--font-mono",
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "300"],
  variable: "--font-dm-mono",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spout.finance"),
  title: {
    default: "Spout Finance | Tokenized Real-World Assets on Solana",
    template: "%s | Spout Finance",
  },
  description:
    "Spout Finance is a RWA platform tokenizing efficient collateral assets and building the next generation of collateral infrastructure",
  keywords: [
    "Spout Finance",
    "tokenized assets",
    "RWA",
    "real world assets",
    "Solana DeFi",
    "tokenized bonds",
    "T-Bills crypto",
    "corporate bonds DeFi",
    "proof of reserves",
    "0% APR borrowing",
    "DeFi yield",
    "tokenized equities",
    "institutional DeFi",
  ],
  authors: [{ name: "Spout Finance" }],
  creator: "Spout Finance",
  publisher: "Spout Finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    creator: "@0xSpout",
  },
  icons: {
    icon: "/Whale.png",
    apple: "/Whale.png",
  },
  verification: {
    // Add your verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen flex flex-col bg-white font-sans antialiased",
          publicSans.variable,
          ibmPlexMono.variable,
          lora.variable,
          notoSans.variable,
          ptSerif.variable,
          dmSans.variable,
          dmMono.variable,
          figtree.variable,
        )}
      >
        <RumInit />
        <Providers>
          <AnnouncementBarWrapper />
          <ConditionalNavbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
