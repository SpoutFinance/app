"use client";

import { LoadingSpinner } from "@/components/loadingSpinner";
import { Button as JoinButton } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

export function JoinMailingList() {
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
    <div className="flex flex-col justify-start items-start">
      <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col sm:flex-row gap-3 w-full items-center"
    >
      {!joined && (
        <input
          type="email"
          placeholder="Enter your email to join our mailing list"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          autoComplete="email"
          className={`text-[#9F9F9F] w-[395px] flex h-[44px] py-[14px] pr-[88px] pl-[20px] items-center font-dm-sans text-sm not-italic font-normal leading-4 outline-none border-[#E2E2E2] border rounded-[6px] focus-visible:border-primary focus-visible:border-2 ${
            error ? "border-2 border-red-300 focus-visible:ring-red-400" : ""
          }`}
          disabled={loading}
        />
      )}
      <AnimatePresence initial={false} mode="wait">
        {!joined ? (
          <motion.div
            key="join"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center items-center "
          >
            <JoinButton
              type="submit"
              className="bg-[#DAE5F2] hover:bg-[#DAE5F2] rounded-md data-[hovered]:bg-[#DAE5F2] border-[1.5px] border-[#A7C6ED] text-[#3D5678] w-[105px] h-[40px] font-['DM_Sans'] text-[20px] not-italic font-medium leading-normal disabled:opacity-50 disabled:cursor-not-allowed"
              isDisabled={
                loading || (email.length > 0 && !isValidEmail(email.trim()))
              }
            >
              {loading ? <LoadingSpinner size="sm" /> : "Join"}
            </JoinButton>
          </motion.div>
        ) : null}
      </AnimatePresence>
    
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
  );
}
