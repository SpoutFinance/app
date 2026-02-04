"use client";
import Image from "next/image";

import { Linkedin, Mail, Twitter, Fingerprint, Users } from "lucide-react";
import { CTASection } from "../root";

const teamMembers = [
  {
    name: "Marc Ryan",
    title: "Co-Founder & CEO",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F124fa7d8b30741e3b582951ae96e0e12%2Fc8a0c783871f423da7867c0a72ddeaeb",
    description:
      "Former tech investment banker at HSBC, covering fintech and software. Founder of FlipVault, a web3 bartering platform. Angel investor in several blockchain AI companies, including Theoriq, PIN AI, and GAIB AI.",
    links: {
      email: "mailto:marc@spout.finance",
      twitter: "https://x.com/0xmryan",
      linkedin: "https://www.linkedin.com/in/marc-ryan/",
    },
  },
  {
    name: "Paul van Mierlo",
    title: "Co-Founder & CTO",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F124fa7d8b30741e3b582951ae96e0e12%2Fa5a7799be5fe438dbc9ee43a6e98295e",
    description:
      "Paul brings years of expertise in programming having won major hackathon competitions on different blockchain ecosystems with privacy, payments and DeFi solutions.",
    links: {
      email: "mailto:paul@spout.finance",
      twitter: "https://x.com/Mierlo1999",
      linkedin: "https://www.linkedin.com/in/paul-van-mierlo-063b9417a/",
    },
  },
  {
    name: "Paul Jan Reijn",
    title: "Co-Founder & General Counsel",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F124fa7d8b30741e3b582951ae96e0e12%2F2e3ffc42f7c94567a1967833a8d3ebf5",
    description:
      "Legal counsel with years of experience in software. Architect of the legal framework for various succesful software products, such as payments and factory automation.",
    links: {
      email: "mailto:pauljan@spout.finance",
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/paul-jan-reijn-70b635227/",
    },
  },
  {
    name: "Onuorah Gabriel (Justme)",
    title: "Chief Marketing Officer",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F124fa7d8b30741e3b582951ae96e0e12%2F2e3ffc42f7c94567a1967833a8d3ebf5",
    description:
      "Growth operator with hands-on go-to-market experience. Led community systems and partnerships at Santa Browser and supported GTM strategy, education initiatives, and growth campaigns at GemXBT to drive users and revenue.",
    links: {
      email: "#",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Mihir Sahu",
    title: "Head of Blockchain",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F124fa7d8b30741e3b582951ae96e0e12%2Ffce54c748c2d436da64235d5f4ddaa3e",
    description:
      "Web3 engineer with expertise in privacy, cross-chain systems, and decentralized finance. Experience at Inco building TEE-powered applications for confidential DeFi and payments, and recognized at major hackathon competitions.",
    links: {
      email: "#",
      twitter: "https://x.com/0xmihirsahu",
      linkedin: "https://www.linkedin.com/in/0xmihirsahu/",
    },
  },
  {
    name: "Lovish Badlani",
    title: "Head of Engineering",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F124fa7d8b30741e3b582951ae96e0e12%2F08c9e404faeb40cc825c7e6c317c05d0",
    description:
      "Former BlackRock engineer, experienced in scaling institutional fintech apps. Led engineering at DEX token launchpad with 150K+ users, $150M+ TVL. Skilled in EVM chains and Solana deployment, recognized at global hackathons.",
    links: {
      email: "mailto:lovish@spout.finance",
      twitter: "https://x.com/BadlaniLovish",
      linkedin: "https://www.linkedin.com/in/lovish-badlani-250a05151/",
    },
  },
];

// Gradient divider colors between team cards (per the Figma design)
const rowDividerColors = [
  // Row 1
  [
    { from: "#abffe1", to: "#dcffe2" }, // mint
    { from: "#fec8bb", to: "#ffe4c8" }, // peach
    { from: "#ade1ff", to: "#e8fbf9" }, // light blue
  ],
  // Row 2
  [
    { from: "#ffefad", to: "#fbf9e8" }, // yellow
    { from: "#d9adff", to: "#f3e8fb" }, // purple
    { from: "#ffadad", to: "#fbefe8" }, // pink
  ],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-x-clip">
      <div className="relative z-50">
        <main className="relative flex flex-col gap-12 sm:gap-16 lg:gap-[100px]">
          {/* Hero Section */}
          <section className="flex justify-center items-center w-full relative px-4 sm:px-6 lg:px-0">
            <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
            <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
            {/* Left Hero Group - hidden below lg */}
            <div className="z-10 hidden lg:block">
              <div className="w-96 h-5 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-88 h-10 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-80 h-10 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-72 h-10 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-60 h-10 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-72 h-10 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-80 h-10 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-88 h-10 relative bg-gradient-to-r from-blue-600 to-lime-200" />
              <div className="w-96 h-5 relative bg-gradient-to-r from-blue-600 to-lime-200" />
            </div>

            {/* Horizontal gradient accent - visible only on small/medium screens */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-lime-200 to-blue-600 lg:hidden" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-lime-200 to-blue-600 lg:hidden" />

            <div className="mx-auto text-center relative z-10 flex flex-col justify-center items-center">
              <div className="w-fit self-center items-center justify-center px-2.5 py-1 rounded-[3px] bg-spout-accent/35 mb-4">
                <span className="text-sm sm:text-base font-medium text-spout-text-secondary">
                  About Us
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal text-spout-primary font-lora leading-tight mb-3">
                Our Story
              </h1>

              <p className="text-base sm:text-lg text-spout-text-muted max-w-[646px] mx-auto leading-7 px-2 sm:px-0">
                We are building next-generation investment infrastructure that
                prioritizes security, transparency, and returns.
              </p>
            </div>

            {/* Right Hero Group - hidden below lg */}
            <div className="z-10 hidden lg:flex flex-col items-end">
              <div className="w-96 h-5 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-88 h-10 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-80 h-10 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-72 h-10 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-60 h-10 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-72 h-10 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-80 h-10 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-88 h-10 relative bg-gradient-to-r from-lime-200 to-blue-600" />
              <div className="w-96 h-5 relative bg-gradient-to-r from-lime-200 to-blue-600" />
            </div>
          </section>

          {/* Bordered container: vertical lines via border-x on centered container,
              horizontal lines via absolutely-positioned full-width divs */}
          <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 lg:border-x-2 lg:border-gray-100">
            {/* ── Manifesto Section ── */}
            <div className="relative">
              {/* Full-width horizontal lines */}
              <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              {/* Blue Banner */}
              <div className="bg-[#0168ff] py-3.5 sm:py-4 text-center">
                <span className="font-mono text-white text-base sm:text-xl tracking-tight leading-7">
                  MANIFESTO
                </span>
              </div>

              {/* Manifesto Content */}
              <div className="bg-white overflow-hidden flex flex-col lg:flex-row">
                {/* Left Column - Text */}
                <div className="flex-1 px-5 sm:px-8 py-8 sm:py-10 space-y-10">
                  {/* Block 1 */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-1.5 bg-spout-primary rounded-[3px]">
                        <Fingerprint className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-[28px] font-medium text-spout-primary leading-7 font-noto-sans">
                        Access is a right, not a privilege
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg text-spout-text-muted leading-7">
                      The global financial system is rigged: institutions borrow
                      for free, while everyone else pays the price. We refuse to
                      accept that status quo. Spout is building the first truly
                      level playing field, taking the &apos;cheat codes&apos; of
                      the wealthy — asset efficiency and 0% loans — and putting
                      them on-chain for the world to use. We aren&apos;t just
                      democratizing finance; we&apos;re open-sourcing it.
                    </p>
                  </div>

                  {/* Block 2 */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-1.5 bg-spout-primary rounded-[3px]">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-[28px] font-medium text-spout-primary leading-7 font-noto-sans">
                        Built by defectors
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg text-spout-text-muted leading-7">
                      We are ex-bankers and engineers who saw the unfair
                      advantages from the inside — and left to share them with
                      you. We bridge the gap between institutional structure and
                      DeFi speed. Our code is permission-less, our team is
                      global, and our goal is simple: To make sure no one&apos;s
                      capital ever has to sit &apos;dead&apos; again.
                    </p>
                  </div>
                </div>

                {/* Right Column - Decorative Image */}
                <div className="relative w-full lg:w-[421px] h-[300px] sm:h-[350px] lg:h-auto overflow-hidden border-t lg:border-t-0 lg:border-l-[6px] border-gray-100 flex-shrink-0">
                  {/* Decorative gradient chevrons */}

                  <div className="relative w-full h-full border border-[#0168ff]">
                    <Image
                      src="/svg-assets/landingpage/globe-bg.png"
                      alt=""
                      width={638}
                      height={425}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      unoptimized
                    />
                    <Image
                      src="/svg-assets/landingpage/globe.png"
                      alt="Manifesto illustration"
                      width={638}
                      height={425}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gap between manifesto bottom line and team top line */}
            <div className="h-12 sm:h-16 lg:h-[100px]" />

            {/* ── Meet the Team Section ── */}
            <div className="relative pt-8 sm:pt-12 lg:pt-15 mb-12 sm:mb-16 lg:mb-[100px]">
              {/* Full-width horizontal line at top of team section */}
              <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />

              <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-lora text-spout-primary text-center mb-8 sm:mb-12 lg:mb-15">
                Meet the Team
              </h2>

              {/* Row 1 — top + bottom full-width lines */}
              <div className="relative mb-6 sm:mb-8 lg:mb-15">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <TeamRow
                  members={teamMembers.slice(0, 3)}
                  dividerColors={rowDividerColors[0]}
                />
              </div>

              {/* Row 2 — top + bottom full-width lines */}
              <div className="relative">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
                <TeamRow
                  members={teamMembers.slice(3, 6)}
                  dividerColors={rowDividerColors[1]}
                />
              </div>
            </div>

            {/* ── Newsletter CTA Section — top + bottom full-width lines ── */}
            <div className="relative">
              <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-screen border-t-2 border-gray-100 pointer-events-none" />
              <CTASection />
            </div>

            {/* Gap before footer — vertical lines continue through here */}
            <div className="h-16 sm:h-20 lg:h-24" />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Team Row ─── */
function TeamRow({
  members,
  dividerColors,
}: {
  members: typeof teamMembers;
  dividerColors: { from: string; to: string }[];
}) {
  return (
    <>
      {/* Desktop: cards with gradient dividers */}
      <div className="hidden lg:flex">
        {members.map((member, i) => (
          <div key={member.name} className="flex">
            <TeamCard {...member} />
            <div
              className="w-[22px] self-stretch flex-shrink-0"
              style={{
                background: `linear-gradient(to bottom, ${dividerColors[i].from}, ${dividerColors[i].to})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Tablet: 2-column grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 sm:gap-6">
        {members.map((member) => (
          <TeamCard key={member.name} {...member} />
        ))}
      </div>

      {/* Mobile: single column */}
      <div className="grid sm:hidden grid-cols-1 gap-6">
        {members.map((member) => (
          <TeamCard key={member.name} {...member} />
        ))}
      </div>
    </>
  );
}

/* ─── Team Card ─── */
function TeamCard({
  name,
  title,
  image,
  description,
  links,
}: {
  name: string;
  title: string;
  image: string;
  description: string;
  links?: {
    email?: string;
    twitter?: string;
    linkedin?: string;
  };
}) {
  return (
    <div className="w-full lg:w-[370px] bg-white flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden border-b border-spout-border">
        <Image
          src={image}
          alt={name}
          width={370}
          height={224}
          className="w-full h-full object-cover object-[center_26%]"
          loading="lazy"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title Badge */}
        <div className="inline-flex items-center px-2.5 py-1 border border-spout-accent bg-spout-accent/35 rounded-[3px] mb-4 w-fit">
          <span className="text-sm sm:text-base font-medium text-spout-text-secondary font-noto-sans">
            {title}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-semibold text-spout-primary mb-2 font-noto-sans">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-spout-text-muted leading-7 mb-6 flex-1 font-noto-sans">
          {description}
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-5 mt-auto">
          {links?.email && (
            <a
              href={links.email}
              className="text-spout-text-secondary hover:text-spout-primary transition-colors"
              aria-label={`Email ${name}`}
            >
              <Mail className="w-6 h-6" />
            </a>
          )}
          {links?.twitter && (
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-spout-text-secondary hover:text-spout-primary transition-colors"
              aria-label={`${name}'s Twitter`}
            >
              <Twitter className="w-6 h-6" />
            </a>
          )}
          {links?.linkedin && (
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-spout-text-secondary hover:text-spout-primary transition-colors"
              aria-label={`${name}'s LinkedIn`}
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
