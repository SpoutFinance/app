"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CTASection } from "../root";

const faqData = [
  {
    question: "How does Spout bring traditional assets like bonds to DeFi?",
    answer:
      "Spout brings traditional assets like bonds to DeFi by tokenizing U.S. investment-grade ETFs into secure, yield-bearing tokens backed 1:1 by real assets.",
  },
  {
    question: "How does Spout handle off-hour market liquidations?",
    answer:
      'Spout handles after-hours liquidations through an Internal Buyout Protocol where the Lending Pool acts as the "Buyer of Last Resort" to prevent gap risk. If a liquidation is triggered when markets are closed (e.g., overnight), the Lending Pool automatically purchases the distressed collateral from the borrower at a pre-defined discount (e.g., 5–10% below the last closing price). This discount protects lenders against the asset opening lower the next day. Once traditional markets reopen, the protocol sells the asset via our broker dealer to replenish the stablecoin pool, capturing the difference between the discounted buyout price and the market sell price as pure profit for the lenders.',
  },
  {
    question:
      "How can I integrate Spout's stablecoin into other DeFi protocols?",
    answer:
      "In Phase 1 (Launch), you cannot. To guarantee solvency and maintain closed-loop liquidity, the stablecoin is initially non-transferable and locked to the Spout platform; borrowers instantly swap into stablecoins (i.e. USDC) internally rather than taking the Spout stablecoin elsewhere.\n\nIn Phase 2 (Scale), once the peg is battle-tested, we will upgrade it to a standard SPL Token. At that point, integration becomes permissionless: other protocols (like Kamino or Save) can onboard it by simply whitelisting our oracle feed and setting up a liquid DEX pool for liquidations.",
  },
  {
    question: "How does Spout tokenize U.S. stocks, ETFs, and bonds?",
    answer:
      "Spout tokenizes U.S. securities through a regulated Broker-Dealer that holds the underlying assets in segregated, SIPC-insured accounts. When a user deposits stablecoins, the protocol purchases the corresponding shares via the broker and mints an equivalent tokenized representation (e.g., spTSLA) on-chain. Each token is backed 1:1 by real shares, with on-chain proof-of-reserves ensuring transparency and solvency at all times.",
  },
  {
    question: "What is the benefit of using Spout's tokenized assets in DeFi?",
    answer:
      "Spout's tokenized assets transform static holdings into productive, composable instruments. Instead of letting equities sit idle, users can pledge them as collateral for 0% APR loans, access instant liquidity without selling, and participate in automated yield strategies — all on-chain, 24/7, without needing a bank or broker's permission.",
  },
  {
    question: "How do I get started with Spout?",
    answer:
      "To get started with Spout, you simply choose your role based on your capital needs. Equity buyers and borrowers first complete a quick on-chain KYC verification to mint tokenized assets (like spTSLA) using stablecoins, which can then be locked in vaults to access 0% APR liquidity via our automated yield strategy. Conversely, lenders can participate permissionlessly by simply connecting their wallet and depositing stablecoins into our liquidity pools to earn 10–15% APY generated from option premiums, with no identity verification required.",
  },
  {
    question: "Is Spout compliant with U.S. regulations?",
    answer:
      "Yes. Spout operates through a regulated U.S. Broker-Dealer that holds all underlying assets in segregated, SIPC-insured accounts. Our tokenized securities are issued as ERC-3643 compliant security tokens with on-chain identity verification, ensuring full regulatory compliance while maintaining the composability benefits of DeFi.",
  },
  {
    question: "What privacy features does Spout offer?",
    answer:
      'Spout utilizes Inco\'s Fully Homomorphic Encryption (FHE) to secure user data, encrypting token balances on-chain so that position sizes and net worth remain completely invisible to the public and competitors. This allows users to trade and borrow with institutional privacy, preventing "whale watching" while ensuring regulatory compliance. Uniquely, FHE enables our smart contracts to mathematically verify collateral health and execute liquidations on this encrypted data without ever exposing the sensitive underlying values.',
  },
  {
    question: "Can I use Spout's assets as collateral for lending?",
    answer:
      "Yes, absolutely; utilizing your assets as collateral is the core function of the Spout platform. By depositing tokenized equities (like spTSLA), you can borrow stablecoins against them at 0% APR, as the yield generated from your collateral automatically subsidizes the interest costs. This unlocks flexible liquidity that you can use to either leverage your position by purchasing more equities or loop back into our lending pools to generate additional yield.",
  },
  {
    question: "What is the process for minting Spout's stablecoin?",
    answer:
      'The process is fully automated within the Spout dApp. You simply deposit your spAssets (tokenized equities) into a vault to use as collateral, and then initiate a "Borrow" transaction. Behind the scenes, the protocol instantly mints Spout\'s native stablecoin against your collateral value and deposits it directly into your account, giving you immediate access to the liquidity.',
  },
  {
    question:
      "How are collateralization rates determined for different assets?",
    answer:
      'Collateralization rates are determined dynamically based on the asset\'s risk profile, utilizing real-time Implied Volatility and Beta to set a specific Loan-to-Value (LTV) limit. We generally assign 60% LTV to high-volatility stocks (like NVDA) to buffer against rapid price swings, while stable "Blue Chip" equities (like JNJ) can access up to 75% LTV. This tiered approach ensures the protocol remains solvent, maintaining a safety buffer before any liquidation event is triggered.',
  },
  {
    question: "What chains does Spout support?",
    answer:
      "Spout currently supports Solana and Solayer (SVM) to leverage their high-speed, low-cost infrastructure for real-time asset settlement. While we are exclusively focused on the Solana ecosystem for our mainnet launch to maximize liquidity depth, we plan to deploy on additional high-performance chains in the future as we scale.",
  },
  {
    question: "How does Spout verify asset backing and reserves?",
    answer:
      'Spout verifies asset backing through a real-time proof of reserve system where all underlying equities are held in segregated, SIPC-insured accounts at our regulated U.S. Broker-Dealer. We bridge this custody data on-chain via an automated API that constantly synchronizes minted assets with held shares to ensure a 1:1 match. Additionally, we utilize Inco\'s FHE "Auditor View Keys," which allow regulators to mathematically verify solvency without ever exposing sensitive user positions or financial data to the public.',
  },
  {
    question:
      "What yield opportunities does Spout provide for tokenized assets?",
    answer:
      "Spout transforms static equities into productive yield-bearing instruments by monetizing their latent volatility to fully subsidize borrowing costs, unlocking 0% APR liquidity for users. This structure replaces the typical 8–12% margin interest with zero-cost capital, effectively creating yield through significant cost savings. Investors can utilize this free liquidity to leverage their positions and buy more stock without interest drag, or execute a risk-free carry trade by lending the borrowed stablecoins back to the protocol to earn 10–15% APY. Ultimately, Spout allows you to turn a passive portfolio into an active, cash-flowing asset while retaining your long-term market exposure.",
  },
  {
    question: "Can users from emerging markets access Spout?",
    answer:
      "Yes, absolutely—users from emerging markets are a primary target audience for Spout. We democratize access to high-quality U.S. financial markets by removing the need for a U.S. bank account or social security number; lenders can participate permissionlessly just by connecting a wallet, while borrowers can mint and trade tokenized U.S. equities after completing a simple on-chain KYC check. This allows users in regions with volatile local currencies or restrictive banking infrastructures to access stable U.S. assets and institutional-grade yield strategies directly from their phone.",
  },
];

export default function FaqPage() {
  const [openItem, setOpenItem] = useState<string>("item-0");

  return (
    <div className="min-h-screen bg-white relative overflow-x-clip">
      <div className="relative">
        <main className="relative flex flex-col gap-[100px]">
          {/* ── Hero Section ── */}
          <section className="relative w-full bg-white">
            <div className="hidden lg:block absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />

            {/* Left gradient chevrons — absolutely positioned, vw-based widths */}
            <div className="hidden lg:flex flex-col absolute left-0 top-0 bottom-0 pointer-events-none">
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "22vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "20vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "18vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "16vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "14vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "12vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "14vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "16vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "18vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "20vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-r from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "22vw" }}
              />
            </div>

            {/* Right gradient chevrons — absolutely positioned, vw-based widths */}
            <div className="hidden lg:flex flex-col items-end absolute right-0 top-0 bottom-0 pointer-events-none">
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "22vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "20vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "18vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "16vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "14vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "12vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "14vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "16vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "18vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "20vw" }}
              />
              <div
                className="flex-1 bg-gradient-to-l from-spout-gradient-red to-spout-gradient-peach"
                style={{ width: "22vw" }}
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-spout-gradient-peach via-spout-gradient-orange to-spout-gradient-red lg:hidden" />

            {/* Center content */}
            <div className="relative z-10 mx-auto text-center flex flex-col justify-center items-center py-16 sm:py-20 lg:py-24">
              <div className="w-fit px-2.5 py-1 rounded-[3px] bg-spout-accent/35 mb-4">
                <span className="text-sm sm:text-base font-medium text-slate-600 font-dm-sans">
                  FAQs
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal text-spout-primary font-pt-serif leading-tight mb-3">
                Frequently Asked Questions
              </h1>

              <p className="text-base sm:text-lg text-spout-text-muted max-w-[600px] mx-auto font-dm-sans leading-7 px-2 sm:px-0">
                Everything you need to know about Spout and how we&apos;re
                changing decentralized investing
              </p>
            </div>
          </section>

          {/* Wrapper so gap-[100px] doesn't separate gradient bar from bordered container */}
          <div>
            {/* ── Gradient bar separator ── */}
            <div className="flex w-full overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[44px] flex-1 bg-gradient-to-r from-blue-600 to-lime-200"
                />
              ))}
            </div>

            {/* ── Bordered container: vertical lines kiss the gradient bar ── */}
            <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 lg:border-x-2 lg:border-gray-100">
              {/* Space between gradient bar and FAQ accordion */}
              <div className="h-[72px]" />

              {/* Full-width horizontal line flush on top of FAQ accordion */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              </div>

              {/* ── FAQ Accordion Section ── */}
              <div className="relative">
                <div className="max-w-[716px] mx-auto pb-18">
                  <Accordion
                    type="single"
                    collapsible
                    value={openItem}
                    onValueChange={setOpenItem}
                  >
                    {faqData.map((faq, index) => {
                      const isOpen = openItem === `item-${index}`;
                      return (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className={`border border-gray-100 -mt-px first:mt-0`}
                        >
                          <AccordionTrigger className="px-4 sm:px-6 py-4 text-left hover:no-underline [&>svg]:hidden">
                            <div className="flex items-start justify-between w-full gap-4">
                              <span className="text-sm sm:text-base font-medium font-dm-sans text-black leading-7 tracking-[-0.064px]">
                                {faq.question}
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 shrink-0 mt-1.5 transition-transform duration-200 text-spout-text-muted ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </AccordionTrigger>
                          {faq.answer && (
                            <AccordionContent className="px-4 sm:px-6 pb-4 pt-0 text-sm sm:text-base text-spout-text-muted font-dm-sans leading-6 sm:leading-7">
                              {faq.answer}
                            </AccordionContent>
                          )}
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </div>

              {/* Full-width horizontal line at bottom of FAQ section */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              </div>

              {/* Gap between FAQ and Newsletter */}
              <div className="h-12 sm:h-16 lg:h-[100px]" />

              {/* ── Newsletter CTA — top + bottom full-width lines ── */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="overflow-hidden">
                  <CTASection />
                </div>
              </div>

              {/* Gap before footer — vertical lines continue through */}
              <div className="h-12 sm:h-16 lg:h-[100px]" />

            </div>
          </div>
        </main>
      </div>
      {/* Bottom horizontal line above footer */}
      <div className="w-full border-t-2 border-[#F3F4F6]" />
    </div>
  );
}
