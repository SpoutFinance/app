"use client";
import BgGrain from "@/components/bg-grain-svg";
import { DiagonalPattern } from "@/components/slant-dashes-svg";
import lovish from "@/public/HeadshotLovish.jpg";
import marc from "@/public/HeadshotMarc.png";
import mihir from "@/public/HeadshotMihir.png";
import pauljan from "@/public/HeadshotPJ.png";
import paul from "@/public/HeadshotPaul.jpg";
import { Linkedin, Mail, Twitter } from "lucide-react";
import Image, { StaticImageData } from "next/image";

const teamMembers = [
  {
    name: "Marc Ryan",
    title: "Co-Founder & CEO",
    image: marc,
    description:
      "Former tech investment banker at HSBC, covering fintech and software. Founder of FlipVault, a web3 bartering platform. Angel investor in several blockchain AI companies, including Theoriq, PIN AI, and GAIB AI.",
  },
  {
    name: "Paul van Mierlo",
    title: "Co-Founder & CTO",
    image: paul,
    description:
      "Paul brings years of expertise in programming having won major hackathon competitions on different blockchain ecosystems with privacy, payments and DeFi solutions.",
  },
  {
    name: "Paul Jan Reijn",
    title: "Co-Founder & General Counsel",
    image: pauljan,
    description:
      "Legal counsel with years of experience in software. Architect of the legal framework for various succesful software products, such as payments and factory automation.",
  },
  {
    name: "Mihir Sahu",
    title: "Head of Privacy",
    image: mihir,
    description:
      "Web3 engineer with expertise in privacy, cross-chain systems, and decentralized finance. Experience at Inco building TEE-powered applications for confidential DeFi and payments, and recognized at major hackathon competitions.",
  },
  {
    name: "Lovish Badlani",
    title: "Head of Engineering",
    image: lovish,
    description:
      "Former BlackRock engineer, experienced in scaling institutional fintech apps. Led engineering at DEX token launchpad with 150K+ users, $150M+ TVL. Skilled in EVM chains and Solana deployment, recognized at global hackathons.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative ">
      {/* Background grain for this section */}
      <BgGrain
        className="absolute inset-0 w-full h-full z-0 optimized"
        style={{
          zIndex: 1,
        }}
      />

      <div className="relative z-50">
        {/* Top horizontal line - hidden on mobile */}
        <div className="hidden md:block absolute top-0 left-0 w-full h-[1.5px] bg-[#A7C6ED]"></div>

        {/* Top right diamond */}
        <div className="hidden lg:block absolute -top-2 right-2 z-50">
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

        {/* Top left diamond */}
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
          <div className="absolute left-4 top-0 bottom-0 w-[1.5px] bg-[#A7C6ED]"></div>
          <div className="absolute right-4 top-0 bottom-0 w-[1.5px] bg-[#A7C6ED]"></div>
        </div>

        <main className="relative">
          {/* Hero Section */}
          <section className="py-16 px-6 md:px-12 lg:px-24 relative">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:35px_35px]"></div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-[3px] bg-spout-accent/35 mb-8">
                <span className="text-base font-medium text-spout-text-secondary">
                  About Us
                </span>
              </div>

              <h1 className="text-4xl capitalize md:text-5xl lg:text-[56px] font-bold text-spout-primary font-lora leading-tight mb-6">
                Our Story
              </h1>

              <p className="text-lg text-spout-text-muted max-w-2xl mx-auto leading-7">
                We are building next-generation investment infrastructure that
                prioritizes security, transparency, and returns.
              </p>

              <p className="text-base font-medium text-spout-primary uppercase mt-8 tracking-wide">
                [ Join us as we continue to reshape the future of digital asset
                investing ]
              </p>
            </div>
          </section>

          {/* Diagonal pattern */}
          <div className="relative z-10 w-full px-4 py-2  overflow-hidden">
            <DiagonalPattern
              width="100%"
              height={34}
              color="#A7C6ED"
              strokeWidth={1.5}
              spacing={14}
            />
          </div>

          {/* Meet the Team Section */}
          <section className="py-16 px-6 md:px-12 lg:px-24">
            <h2 className="text-4xl capitalize font-bold font-lora text-spout-primary text-center mb-12">
              Meet the <span className="font-bold">Team</span>
            </h2>

            {/* Team Grid - First Row (3 members) */}
            {/* <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
              {teamMembers.slice(0, 3).map((member, index) => (
                <TeamCard key={index} {...member} />
              ))}
            </div> */}

            {/* Team Grid - Second Row (2 members centered) */}
            {/* <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
              {teamMembers.slice(3, 5).map((member, index) => (
                <TeamCard key={index + 3} {...member} />
              ))}
            </div> */}
            <div className="flex justify-center flex-wrap gap-10 max-w-7xl mx-auto items-stretch">
              {teamMembers.map((member, index) => (
                <TeamCard key={index + 3} {...member} />
              ))}
            </div>
          </section>

          {/* Diagonal pattern */}
          <div className="relative z-10 w-full px-4 py-2  overflow-hidden">
            <DiagonalPattern
              width="100%"
              height={34}
              color="#A7C6ED"
              strokeWidth={1.5}
              spacing={14}
            />
          </div>

          {/* CTA Section */}
          <section className="px-6 md:px-12 lg:px-24 py-20">
            <div className="max-w-6xl lg:max-w-max mx-auto">
              <div className="relative border-2 border-spout-border bg-white/40 rounded-sm">
                <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
                <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>

                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="p-10 lg:p-14 flex flex-col justify-center">
                    <h2 className="text-3xl capitalize font-bold text-spout-primary mb-5 leading-tight">
                      Ready to Start Earning Stable Yields?
                    </h2>
                    <p className="text-lg text-spout-text-muted leading-7 mb-8">
                      Join thousands of users who are already earning consistent
                      returns from investment-grade corporate bonds on the
                      blockchain.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded border border-spout-accent bg-spout-primary text-white text-xl font-medium hover:bg-spout-primary/90 transition-colors">
                        Get Started
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.4302 5.92993L20.5002 11.9999L14.4302 18.0699"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.5 12H20.33"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button className="inline-flex items-center justify-center px-5 py-2.5 rounded border-[1.5px] border-spout-border bg-white text-black text-xl font-medium hover:bg-gray-50 transition-colors">
                        Contact Sales
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -top-1.5 -left-1 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white hidden lg:block"></div>
                    <div className="absolute -bottom-1.5 -left-1 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white hidden lg:block"></div>
                    <Image
                      src="/svg-assets/landingpage/spout-wallstreet.png"
                      alt="Stock Exchange Building"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover border-4 border-spout-border min-h-[300px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Diagonal pattern */}
          <div className="relative z-10 w-full py-2 px-4 mb-2 overflow-hidden">
            <DiagonalPattern
              width="100%"
              height={34}
              color="#A7C6ED"
              strokeWidth={1.5}
              spacing={14}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function TeamCard({
  name,
  title,
  image,
  description,
}: {
  name: string;
  title: string;
  image: StaticImageData;
  description: string;
}) {
  return (
    <div className="relative max-w-[390px]">
      <div className="relative border-2 border-spout-border bg-white h-full w-full flex flex-col">
        {/* Corner diamonds */}
        <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
        <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
        <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>
        <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 rotate-45 border-2 border-spout-accent bg-white z-10"></div>

        {/* Image Section */}
        <div className="relative w-full h-56 overflow-hidden border-b border-spout-border">
          <Image
            src={image}
            alt={name}
            fill
            objectFit="cover"
            objectPosition="50% 24%"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1">
          {/* Title Badge */}
          <div className="inline-flex items-center px-2.5 py-1 border border-spout-accent bg-spout-accent/35 rounded mb-4">
            <span className="text-base font-medium text-spout-text-secondary">
              {title}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-2xl font-semibold text-spout-primary mb-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-base text-spout-text-muted leading-7 mb-6 flex-1">
            {description}
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-5 mt-auto">
            <button className="text-spout-text-secondary hover:text-spout-primary transition-colors">
              <Mail className="w-6 h-6" />
            </button>
            <button className="text-spout-text-secondary hover:text-spout-primary transition-colors">
              <Twitter className="w-6 h-6" />
            </button>
            <button className="text-spout-text-secondary hover:text-spout-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
