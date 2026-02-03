import Link from "next/link";
import Image from "next/image";

interface LinkItem {
  href: string;
  label: string;
  external?: boolean;
}

const platformLinks: LinkItem[] = [
  { href: "/app/trade", label: "Trading" },
  { href: "/app/portfolio", label: "Portfolio" },
];

const companyLinks: LinkItem[] = [
  { href: "/company", label: "About Us" },
  {
    href: "https://drive.google.com/file/d/1fklbqmZhgxzIzXN0aEjsf2NFat2QdpFp/view",
    label: "Whitepaper",
    external: true,
  },
  { href: "/brand-assets", label: "Brand Assets" },
];

const socialLinks: LinkItem[] = [
  {
    href: "https://www.linkedin.com/company/spoutfinance/posts/?feedView=all",
    label: "LinkedIn",
    external: true,
  },
  { href: "https://x.com/0xspout", label: "X", external: true },
  {
    href: "https://t.me/+BCqhsA4Nmv0wZDU5",
    label: "Telegram",
    external: true,
  },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: LinkItem[];
}) {
  return (
    <div>
      <h4 className="font-noto-sans font-medium text-[#8c9baa] text-sm tracking-[-0.24px] leading-[22.4px] mb-4">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-noto-sans font-normal text-sm text-black tracking-[-0.24px] leading-[22.4px] hover:text-[#004040] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="font-noto-sans font-normal text-sm text-black tracking-[-0.24px] leading-[22.4px] hover:text-[#004040] transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white w-full">
      {/* Main footer */}
      <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Desktop layout */}
        <div className="hidden lg:flex py-12">
          {/* Left side: Logo + copyright */}
          <div className="flex flex-col gap-6 pr-[72px] shrink-0">
            <Image
              src="/Spout_complete.png"
              alt="Spout Finance logo"
              width={170}
              height={45}
              className="w-[170px] h-auto object-contain"
            />
            <p className="font-noto-sans font-normal text-sm text-black tracking-[-0.194px] leading-[18px]">
              {new Date().getFullYear()} Spout Finance. All rights reserved.
            </p>
          </div>

          {/* Vertical divider — extends to kiss top/bottom lines */}
          <div className="w-[2px] -my-12 bg-gray-100 shrink-0" />

          {/* Right side: Link columns */}
          <div className="flex-1 flex justify-end">
            <div className="flex gap-[60px]">
              <FooterLinkColumn title="PLATFORM" links={platformLinks} />
              <FooterLinkColumn title="COMPANY" links={companyLinks} />
              <FooterLinkColumn title="SOCIAL" links={socialLinks} />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet layout */}
        <div className="lg:hidden py-8 sm:py-10">
          {/* Logo + copyright */}
          <div className="flex flex-col gap-4 mb-8">
            <Image
              src="/Spout_complete.png"
              alt="Spout Finance logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
            <p className="font-noto-sans font-normal text-sm text-black tracking-[-0.194px]">
              {new Date().getFullYear()} Spout Finance. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-8 sm:gap-12">
            <FooterLinkColumn title="PLATFORM" links={platformLinks} />
            <FooterLinkColumn title="COMPANY" links={companyLinks} />
            <FooterLinkColumn title="SOCIAL" links={socialLinks} />
          </div>
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="w-full border-t-2 border-gray-100" />

      {/* Disclaimer section */}
      <div className="max-w-[1176px] mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col gap-2 max-w-[755px]">
          <h5 className="font-noto-sans font-medium text-lg text-[#525252] tracking-[-0.072px] leading-7">
            Disclaimer
          </h5>
          <p className="font-noto-sans font-normal text-sm text-[#525252] tracking-[-0.056px] leading-6">
            All provided information has been carefully researched and checked.
            In spite of taking due care, Spout Finance does not accept any
            warranty for the information being correct, complete, and up to date.
          </p>
        </div>
      </div>
    </footer>
  );
}
