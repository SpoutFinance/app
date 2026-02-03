"use client";

import Image from "next/image";
import { useState } from "react";

export default function NewsletterCta() {
  return (
    <div className="bg-white overflow-hidden flex flex-col lg:flex-row">
      {/* Left Column - Text + Form */}
      <div className="flex-1 p-6 sm:p-8 lg:p-9 flex flex-col justify-center">
        <h2 className="text-xl sm:text-2xl font-medium text-spout-primary leading-7 mb-4">
          Ready to Start Earning Stable Yields?
        </h2>
        <p className="text-sm sm:text-base text-spout-text-muted leading-7 mb-6">
          Join thousands of users who are already earning consistent returns
          from investment-grade corporate bonds on the blockchain.
        </p>
        <MailingListForm />
      </div>

      {/* Blue gradient divider */}
      <div className="h-[6px] lg:h-auto lg:w-[18px] bg-gradient-to-r lg:bg-gradient-to-b from-[#0168ff] to-[#02bfff] flex-shrink-0" />

      {/* Right Column - Stacked images */}
      <div className="relative w-full lg:w-[523px] h-[250px] sm:h-[300px] lg:h-[312px] overflow-hidden flex-shrink-0">
        <Image
          src="/svg-assets/landingpage/building-bg.png"
          alt=""
          width={523}
          height={312}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          unoptimized
        />
        <Image
          src="/svg-assets/landingpage/building.png"
          alt="Investment landscape"
          width={523}
          height={312}
          className="absolute inset-0 w-full h-full object-cover z-10"
          loading="lazy"
          unoptimized
        />
      </div>
    </div>
  );
}

function MailingListForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Thank you for joining!");
        setEmail("");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col sm:flex-row gap-3 sm:gap-3.5"
      >
        <input
          type="email"
          placeholder="Enter your email to join our mailing list"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
          className="flex-1 max-w-[395px] h-11 px-5 bg-white border-[1.5px] border-[#e2e2e2] rounded-md text-sm text-spout-text-muted placeholder:text-[#6e6e6e] focus:outline-none focus:border-spout-primary transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-4 sm:w-[92px] bg-spout-primary border border-spout-accent rounded-md text-white text-lg sm:text-xl font-medium hover:bg-spout-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Join"}
        </button>
      </form>
      {message && (
        <p className="mt-2 text-sm text-emerald-600 font-medium">{message}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
