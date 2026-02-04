"use client";

import background from "@/assets/images/frame.svg";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

import { useState } from "react";


export function CTASection() {
    const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Do not set errors while typing to avoid disruptive UX
  };

  const handleEmailBlur = () => {
    if (email && !isValidEmail(email)) {
      setError("Please enter a valid email address");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Thank you for joining!");
        setEmail("");
        setJoined(true);
      } else {
        setError(data.error || data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <section className="w-[1176px] mx-auto mt-[-20px]">
      <div className=" w-screen bg-transparent border-b-2 border-[#F3F4F6] "></div>
      <div className="flex">
        {/* Left Content */}
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="flex flex-col gap-5 p-9 w-[635px]">
            <h2 className="text-[#004040] font-['DM_Sans'] text-[24px] not-italic font-medium leading-[28px] tracking-[-0.096px]">
              Ready to Start Earning Stable Yields?
            </h2>
            <p className="text-[#525252] font-['DM_Sans'] text-[16px] not-italic font-normal leading-[28px] tracking-[-0.064px]">
              Join thousands of users who are already earning consistent returns
              from investment-grade corporate bonds on the blockchain.
            </p>

            <div>
              <form onSubmit={handleSubmit} className="pt-2 sm:pt-0 flex gap-4">

              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Enter your email to join our mailing list"
                className={`flex h-[44px] pt-[14px] pr-[88px] pb-[14px] pl-[20px] items-center w-[395px] border text-[14px] border-gray-300 rounded-sm py-3 px-5 outline-none text-[#6E6E6E] font-dm-sans text-sm not-italic font-normal leading-4 focus-visible:border-primary focus-visible:border-2 ${
                  error ? "border-2 border-red-300 focus-visible:ring-red-400" : ""
                }`}
                disabled={loading}
              />

        {!joined ? (
         <button className="text-[#FFF] font-['DM_Sans'] text-[20px] not-italic font-medium leading-normal flex w-[92px] h-[44px] pt-[10px] pr-[12px] pb-[10px] pl-[16px] justify-center items-center gap-[10px] rounded-[6px] border-[1px] border-solid border-[#A7C6ED] bg-[#004040]">
                Join
          </button>
        ) : null}
              
            </form>
              {joined && (
                <div className="flex items-center justify-center w-full mt-2 flex-nowrap whitespace-nowrap">
                  <CheckCircle className="h-8 w-8 text-emerald-600 mr-2" />
                  <span className="text-emerald-700 font-semibold text-lg align-middle">
                    {message || "Already joined!"}
                  </span>
                </div>
              )}
               {error && !joined && (
                <div className="w-full text-start text-red-500 text-xs mt-2 ">
                  {error}
                </div>
              )}
            </div>
           
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full mt-4 sm:mt-0 flex mr-1">
          <div className="bg-linear-gradient-blue-2 w-[18px] h-auto "></div>

          <div className="w-[522px] h-[330px]">
            <Image
              src={background}
              alt="Stock Exchange Building"
              height={313}
              className="w-full h-full rounded-none object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
