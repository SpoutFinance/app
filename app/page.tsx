import {
  CTASection,
  FAQSection,
  HeroSection,
  HowSpoutWorks,
  InTheNews,
  InvestmentDifferent,
  ProofOfReserveLanding,
  UnlockingFinance,
} from "@/components/features/root";
import { PartnerTicker } from "@/components/features/root/partner-ticker";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center relative bg-white">
        {/* Hero Section */}
        <div className="relative z-10 w-full overflow-hidden">
          <HeroSection />
        </div>

        {/* Partner Ticker */}
        <div className="relative z-10 w-screen border-t-2 border-b-2 border-[#F3F4F6] bg-white">
          <div className="max-w-[1178px] mx-auto hidden md:block optimized">
            <PartnerTicker />
          </div>
          <div className="block md:hidden optimized">
            <PartnerTicker />
          </div>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0 max-w-[1178px] mx-auto">
            {/* Left vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#F3F4F6] optimized"></div>
            {/* Right vertical line */}
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#F3F4F6] optimized"></div>
          </div>

          {/* How Spout Works Section */}
          <div className="relative z-10 w-full">
            <HowSpoutWorks />
          </div>
          <div className="h-[100px] w-screen bg-transparent border-b-2 border-[#F3F4F6] "></div>

          {/* Proof of Reserve Section */}
          <div className="relative z-10 w-full">
            <ProofOfReserveLanding />
          </div>

          {/* Unlocking Finance Section */}
          <div className="relative z-10 w-full">
            <UnlockingFinance />
          </div>
          <div className="h-[100px] w-screen bg-transparent border-t-2 border-b-2 border-[#F3F4F6] "></div>

          {/* Investment Different Section */}
          <div className="relative z-10 w-full">
            <InvestmentDifferent />
          </div>

          {/* In The News Section */}
          <div className="relative z-10 w-full">
            <InTheNews />
          </div>

          {/* FAQ Section */}
          <div className="relative z-10 w-full">
            <FAQSection />
          </div>


          {/* CTA Section */}
          <div className="relative z-10 w-full">
            <CTASection />
          </div>
          <div className="h-[100px] w-screen bg-transparent border-t-2 border-b-2 border-[#F3F4F6] "></div>
        </div>
      </div>
    </>
  );
}
