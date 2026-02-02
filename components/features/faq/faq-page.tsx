"use client";

import Image from "next/image";
import BgGrain from "@/components/bg-grain-svg";
import { DiagonalPattern } from "@/components/slant-dashes-svg";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "Why not just use a traditional off-chain brokerage?",
    answer:
      'Traditional brokerages trap your wealth in a "walled garden" where accessing liquidity requires either selling your assets (triggering taxes) or paying predatory margin rates of 8–12%. Spout eliminates this friction by tokenizing the asset, allowing you to borrow against your portfolio at 0% APR while keeping your long-term position intact. Furthermore, Spout democratizes sophisticated prime brokerage services—like instant liquidity and automated yield—for global users who are typically gatekept from high-quality US credit markets.',
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
    question: "Why not just use another tokenized equity provider?",
    answer:
      "Existing tokenized equity players issue static wrappers—you buy the token, and it sits idle in your wallet. To access liquidity, you would have to find a third-party lending market (if one even accepts the asset) and pay exorbitant interest rates of 8–12%.\n\nSpout issues productive assets that natively monetize volatility through our internal options engine. This allows us to subsidize your borrowing costs down to 0% APR, effectively combining the issuer, the hedge fund, and the bank into a single platform. With Spout, your asset works for you; with others, it just sits there.",
  },
  {
    question: "Why is DeFi an enormous evolutionary leap for equities?",
    answer:
      'DeFi transforms equities from static records into programmable, global money by replacing archaic T+2 settlement cycles with instant, 24/7 liquidity that reacts to information in real-time. It unlocks the latent utility of assets, turning idle stocks into composable "Money Legos" that can be instantly pledged as collateral for loans or automated yield strategies without a bank\'s permission. This evolution democratizes prime brokerage, allowing users anywhere in the world to access high-quality U.S. markets and sophisticated financial services without the friction of traditional banking borders.',
  },
  {
    question: "How do I get started with Spout?",
    answer:
      "To get started with Spout, you simply choose your role based on your capital needs. Equity buyers and borrowers first complete a quick on-chain KYC verification to mint tokenized assets (like spTSLA) using stablecoins, which can then be locked in vaults to access 0% APR liquidity via our automated yield strategy. Conversely, lenders can participate permissionlessly by simply connecting their wallet and depositing stablecoins into our liquidity pools to earn 10–15% APY generated from option premiums, with no identity verification required.",
  },
  {
    question: "What is the Spout option strategy?",
    answer:
      'Spout utilizes an automated covered call Strategy to generate yield that completely subsidizes your borrowing costs, enabling 0% APR loans. We algorithmically target deep Out-of-the-Money (OTM) strike prices, ensuring you retain the vast majority of your asset\'s upside potential. You simply trade away the extreme, unlikely "tail-end" of a rally in exchange for free liquidity, allowing you to capture significant market gains while your portfolio pays for itself.',
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
    <div className="min-h-screen bg-white relative">
      {/* Background grain for this section */}
      <BgGrain
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
        }}
      />
      <div className="relative z-50">
        {/* top horizontal line  - hidden on mobile*/}
        <div className="hidden md:block absolute top-0 left-0 w-full h-[1.5px] bg-[#A7C6ED]"></div>
        {/* top right diamond */}
        <div className="hidden lg:block absolute -top-2 right-2 z-20">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-blue-300"
          >
            <path
              d="M12 2L22 12L12 22L2 12L12 2Z"
              stroke="currentColor"
              strokeWidth="3"
              fill="white"
            />
          </svg>
        </div>
        {/* top left diamond */}
        <div className="hidden lg:block absolute -top-2 left-2 z-20">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-blue-300"
          >
            <path
              d="M12 2L22 12L12 22L2 12L12 2Z"
              stroke="currentColor"
              strokeWidth="3"
              fill="white"
            />
          </svg>
        </div>
        {/* Vertical lines on both sides - hidden on mobile */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
          {/* Left vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-[1.5px] bg-[#A7C6ED]"></div>
          {/* Right vertical line */}
          <div className="absolute right-4 top-0 bottom-0 w-[1.5px] bg-[#A7C6ED]"></div>
        </div>

        <main className="relative font-noto-sans">
          <section className="py-16 px-6 md:px-12 lg:px-24 relative">
            {/* Background grid pattern - only for hero area */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[35px_35px]"></div>

            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-[3px] bg-spout-accent/35 mb-8">
                <span className="text-base font-medium text-spout-text-secondary">
                  FAQs
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-normal text-spout-primary font-lora leading-tight mb-6">
                Frequently Asked Questions
              </h1>

              <p className="text-lg text-spout-text-muted max-w-2xl mx-auto leading-7">
                Everything you need to know about Spout and how we&apos;re
                changing decentralized investing
              </p>
            </div>
          </section>

          {/* Diagonal pattern */}
          <div className="relative z-10 w-full px-4 py-2 overflow-hidden">
            <DiagonalPattern
              width="100%"
              height={34}
              color="#A7C6ED"
              strokeWidth={1.5}
              spacing={14}
            />
          </div>

          <div className="relative py-12">
            <section className="px-6 md:px-12 lg:px-24 pt-12">
              <div className="max-w-3xl mx-auto">
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
                        className={`border border-spout-border mb-px last:mb-0 ${isOpen ? "bg-white" : "bg-[#FFFDFB]"}`}
                      >
                        <AccordionTrigger className="px-8 py-5 text-lg font-medium text-black text-left hover:no-underline [&>svg]:hidden">
                          <div className="flex items-center justify-between w-full">
                            <span className="pr-4">{faq.question}</span>
                            <ChevronDown
                              className={`h-6 w-6 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </AccordionTrigger>
                        {faq.answer && (
                          <AccordionContent className="px-8 pb-5 pt-3 text-base font-medium text-spout-text-muted leading-7">
                            {faq.answer}
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </section>
          </div>

          {/* Diagonal pattern */}
          <div className="relative z-10 w-full px-4 py-2 overflow-hidden">
            <DiagonalPattern
              width="100%"
              height={34}
              color="#A7C6ED"
              strokeWidth={1.5}
              spacing={14}
            />
          </div>

          <div className="relative py-20">
            <section className="px-6 md:px-12 lg:px-24 2xl:px-28">
              <div className="max-w-6xl lg:max-w-max mx-auto">
                <div className="relative border-2 border-spout-border bg-white/40 rounded-sm">
                  <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>

                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-10 lg:p-14 flex flex-col justify-center">
                      <h2 className="text-3xl font-semibold text-spout-primary mb-5 leading-tight">
                        Ready to Start Earning Stable Yields?
                      </h2>
                      <p className="text-lg text-spout-text-muted leading-7 mb-8">
                        Join thousands of users who are already earning
                        consistent returns from investment-grade corporate bonds
                        on the blockchain
                      </p>
                      <button className="inline-flex items-center gap-3 px-5 py-2.5 rounded border border-spout-accent bg-spout-primary text-white text-xl font-medium hover:bg-spout-primary/90 transition-colors w-fit">
                        Get Started
                        <ArrowRight className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="relative ">
                      <div className="absolute -top-1.5 -left-1 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white hidden lg:block"></div>
                      <div className="absolute -bottom-1.5 -left-1 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white hidden lg:block"></div>
                      <Image
                        src="/bank_image.png"
                        alt="Financial building"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover border-2 border-spout-border"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        {/* Diagonal pattern */}
        <div className="relative z-40 w-full px-4 py-2 overflow-hidden">
          <DiagonalPattern
            width="100%"
            height={34}
            color="#A7C6ED"
            strokeWidth={1.5}
            spacing={14}
          />
        </div>
      </div>
    </div>
  );
}
