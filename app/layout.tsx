import {
  ConditionalFooter,
  ConditionalNavbar,
} from "@/components/conditionalNavbar";
import { cn } from "@/lib/utils";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import {
  DM_Mono,
  DM_Sans,
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
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
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

export const metadata: Metadata = {
  title: "Spout Finance",
  description:
    "Spout Finance is a RWA platform tokenizing efficient collateral assets and building the next generation of collateral infrastructure",
  keywords: [
    "finance",
    "portfolio",
    "trading",
    "stocks",
    "investment",
    "RWA",
    "Corporate Bonds",
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
        alt: "Spout Finance - Whale Logo",
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
  icons: {
    icon: "/Whale.png",
    apple: "/Whale.png",
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
        )}
      >
        {/* <AnnouncementBarWrapper /> */}
        <ConditionalNavbar />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
