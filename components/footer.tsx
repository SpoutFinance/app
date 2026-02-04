"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
interface LinkItem {
  href: string;
  label: string;
}

interface FooterProps {
  leftLinks: LinkItem[];
  rightLinks: LinkItem[];
  copyrightText: string;
  barCount?: number;
}

export const Footer: React.FC<FooterProps> = ({
  leftLinks,
  rightLinks,
  copyrightText,
}) => {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    const currentFooterRef = footerRef.current;
    if (currentFooterRef) {
      observer.observe(currentFooterRef);
    }

    return () => {
      if (currentFooterRef) {
        observer.unobserve(currentFooterRef);
      }
    };
  }, []);

  useEffect(() => {
    let t = 0;

    const animateWave = () => {
      const waveElements = waveRefs.current;
      let offset = 0;

      waveElements.forEach((element, index) => {
        if (element) {
          offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
          element.style.transform = `translateY(${index + offset}px)`;
        }
      });

      t += 0.1;
      animationFrameRef.current = requestAnimationFrame(animateWave);
    };

    if (isVisible) {
      animateWave();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="bg-white text-gray-900 relative flex flex-col w-full h-full justify-between select-none z-0"
    >
      <div className="border-b-2 border-[#F3F4F6]  flex flex-col lg:flex-row justify-between w-full gap-12  relative z-10">
        {/* Mobile Layout - Logo and copyright at top, links below */}
        <div className="lg:hidden space-y-8">
          {/* Logo and copyright */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Image
                src="/Spout_complete.png"
                alt="Spout Finance logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-gray-600">{copyrightText}</p>
          </div>

          {/* Links in three separate divs */}
          <div className="space-y-6">
            {/* Platform and Company on left */}
            <div className="flex justify-between">
              {/* Platform Column */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-400 mb-3 text-sm uppercase tracking-wider">
                  PLATFORM
                </h4>
                <ul className="space-y-2">
                  {leftLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-900 hover:text-[#004040] transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-400 mb-3 text-sm uppercase tracking-wider">
                  COMPANY
                </h4>
                <ul className="space-y-2">
                  {rightLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-900 hover:text-[#004040] transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social on right */}
            <div>
              <h4 className="font-semibold text-gray-400 mb-3 text-sm uppercase tracking-wider">
                SOCIAL
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.linkedin.com/company/spoutfinance/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-[#004040] transition-colors duration-200 text-sm"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/+BCqhsA4Nmv0wZDU5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-[#004040] transition-colors duration-200 text-sm"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/0xspout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-[#004040] transition-colors duration-200 text-sm"
                  >
                    X
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Original layout */}
        <div className="hidden lg:flex lg:flex-row lg:justify-between lg:w-full lg:gap-12 max-w-[1305px] mx-auto">
          {/* Left side - Logo and copyright */}
          <div className="space-y-5 pt-[52px] pb-[104px] border-r-2  border-[#F3F4F6] pr-[55px]">
            <div className="flex items-center mb-4">
              <Image
                src="/Spout_complete.png"
                alt="Spout Finance logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm font-dm-sans">{copyrightText}</p>
          </div>

          {/* Right side - Links grid */}
          <div className="grid grid-cols-3 gap-16 py-12 font-noto-sans mr-16">
            {/* Platform Column */}
            <div>
              <h4 className="text-[#8C9BAA] font-['DM_Sans'] text-sm font-medium leading-[22.4px] tracking-[-0.24px] mb-4 uppercase">
                PLATFORM
              </h4>
              <ul className="space-y-3">
                {leftLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-black font-['DM_Sans'] text-sm font-normal leading-[22.4px] tracking-[-0.24px] hover:text-[#004040] transition-colors duration-200 "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-[#8C9BAA] font-['DM_Sans'] text-sm font-medium leading-[22.4px] tracking-[-0.24px] mb-4 uppercase">
                COMPANY
              </h4>
              <ul className="space-y-3">
                {rightLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-black font-['DM_Sans'] text-sm font-normal leading-[22.4px] tracking-[-0.24px] hover:text-[#004040] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Column */}
            <div>
              <h4 className="text-[#8C9BAA] font-['DM_Sans'] text-sm font-medium leading-[22.4px] tracking-[-0.24px] mb-4 uppercase">
                SOCIAL
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.linkedin.com/company/spoutfinance/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-['DM_Sans'] text-sm font-normal leading-[22.4px] tracking-[-0.24px] hover:text-[#004040] transition-colors duration-200"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/0xspout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-['DM_Sans'] text-sm font-normal leading-[22.4px] tracking-[-0.24px] hover:text-[#004040] transition-colors duration-200"
                  >
                    X
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/+BCqhsA4Nmv0wZDU5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-['DM_Sans'] text-sm font-normal leading-[22.4px] tracking-[-0.24px] hover:text-[#004040] transition-colors duration-200"
                  >
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Section - Hidden on mobile */}
      <div className="hidden md:block  relative z-10 w-full max-w-[1305px] mx-auto h-[85px]">
        <div className="flex flex-col gap-2 py-10 ml-[-4px] max-w-[755px] font-dm-sans ">
          <h5 className="text-[#525252] font-['DM_Sans'] text-[18px] not-italic font-medium leading-[28px] tracking-[-0.072px]">
            Disclaimer
          </h5>
          <p className="text-[#525252] font-['DM_Sans'] text-[14px] not-italic font-normal leading-[24px] tracking-[-0.056px]">
            All provided information has been carefully researched and checked.
            In spite of taking due care, Spout Finance does not accept any
            warranty for the information being correct, complete, and up to
            date.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Default footer component with Spout Finance links
const DefaultFooter = () => {
  const leftLinks = [{ href: "/app/trade", label: "Trading" }];

  const rightLinks = [
    { href: "/company", label: "About Us" },
    {
      href: "https://drive.google.com/file/d/1fklbqmZhgxzIzXN0aEjsf2NFat2QdpFp/view",
      label: "Whitepaper",
    },
  ];

  return (
    <Footer
      leftLinks={leftLinks}
      rightLinks={rightLinks}
      copyrightText={`${new Date().getFullYear()} Spout Finance. All rights reserved.`}
      barCount={25}
    />
  );
};

export default DefaultFooter;
