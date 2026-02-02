"use client";

import { useState } from "react";
import Link from "next/link";
import { DiagonalPattern } from "@/components/slant-dashes-svg";
import BgGrain from "@/components/bg-grain-svg";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question:
        "How does Spout bring traditional assets like equities to DeFi?",
      answer:
        'Traditional brokerages trap your wealth in a "walled garden" where accessing liquidity requires either selling your assets (triggering taxes) or paying predatory margin rates of 8–12%. Spout eliminates this friction by tokenizing the asset, allowing you to borrow against your portfolio at 0% APR while keeping your long-term position intact. Furthermore, Spout democratizes sophisticated prime brokerage services—like instant liquidity and automated yield—for global users who are typically gatekept from high-quality US credit markets.',
    },
    {
      question:
        "What guarantees that Spout tokens are secure and fully backed?",
      answer:
        "Spout tokens are fully backed 1:1 by real-world equities held in segregated accounts with Alpaca, a FINRA-regulated U.S. broker-dealer, ensuring that for every digital token minted, a physical share is legally custodying.\n\nSecurity is enforced on-chain using Solana's Token-2022 standard, which embeds identity verification and regulatory compliance (Reg D/S) directly into the token's transfer logic. This hybrid model guarantees that users have both the legal protection of a regulated securities account and the cryptographic certainty of a permissioned blockchain asset.",
    },
    {
      question: "How can investors generate yield through Spout's platform?",
      answer:
        "Investors generate yield on the Lending Side by depositing stablecoins (USDC) into liquidity pools to earn a target 10-15% APY, which is funded directly by the option premiums harvested from the volatility of borrower collateral.\n\nOn the Borrowing Side, investors generate yield by enabling Spout's automated covered call strategy on their deposited equities, turning idle assets into productive, cash-flowing positions. This yield is primarily used to subsidize the cost of credit, allowing borrowers to access liquidity at 0% APR without selling their stock. Any yield generated in excess of the borrowing cost is automatically applied to pay down the loan principal, creating a \"self-repaying\" loan structure that increases the investor's net equity over time.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-4 sm:py-6 lg:py-8 relative">
      {/* Background grain for this section */}
      <BgGrain className="absolute inset-0 w-full h-full z-0 optimized" />
      {/* Section content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left Column - Header */}
          <div>
            <div className="text-xs sm:text-sm font-medium text-[#475569] mb-3 sm:mb-4 tracking-wider">
              [ FAQ ]
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-lora font-normal text-[#004040] mb-4 sm:mb-6">
              Frequently Asked
              <br />
              Questions
            </h2>
            <p className="text-base sm:text-lg font-noto-sans font-normal text-[#475569] leading-relaxed">
              Everything you need to know about Spout and
              <br />
              how we&apos;re changing decentralized investing
            </p>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border bg-white border-gray-300 rounded-none overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm sm:text-base lg:text-lg font-noto-sans font-medium text-[#004040] pr-2 sm:pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-[#004040] flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2 border-t bg-white border-gray-200">
                    <p className="text-sm sm:text-base font-noto-sans text-[#475569] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 sm:mt-6">
              <Link
                href="/faq"
                className="inline-flex items-center text-sm sm:text-base font-noto-sans font-medium text-[#004040] hover:text-[#003030] transition-colors underline"
              >
                See more
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal blue lines at bottom */}
      <div className="relative z-10 w-full mt-20 px-4 py-2">
        <DiagonalPattern
          width="100%"
          height={34}
          color="#A7C6ED"
          strokeWidth={2}
          spacing={14}
        />
      </div>
    </section>
  );
}
