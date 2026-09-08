"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { RedirectIfAuthenticated } from "@/components/Guards";

export default function VerifyPage() {
  return (
    <RedirectIfAuthenticated>
      <VerifyForm />
    </RedirectIfAuthenticated>
  );
}

function VerifyForm() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(false);
  const { requestOtp } = useAuth();
  const router = useRouter();

  const digits = mobile.replace(/\D/g, "").slice(0, 10);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
    setError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (digits.length !== 10) return;
    const ok = await requestOtp(digits);
    if (ok) {
      router.push("/otp");
    } else {
      setError(true);
    }
  }

  return (
    <div className="bg-paper border border-line rounded shadow-card px-[22px] py-[26px] animate-fadeIn">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="mobileInput"
          className="block text-[11.5px] tracking-wide uppercase text-ink-soft font-semibold mb-[9px]"
        >
          Registered Mobile Number
        </label>
        <div className="flex items-stretch border-[1.5px] border-line rounded overflow-hidden bg-white focus-within:border-navy">
          <span className="flex items-center justify-center px-[13px] text-[15.5px] font-semibold text-ink-soft bg-cream-deep border-r-[1.5px] border-line">
            +91
          </span>
          <input
            id="mobileInput"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter mobile number"
            value={mobile}
            onChange={handleChange}
            autoFocus
            className="flex-1 min-w-0 border-none outline-none px-[14px] py-4 text-[17px] tracking-wide bg-transparent tabular-nums"
          />
        </div>
        {error && (
          <div className="mt-[14px] px-[14px] py-3 bg-cash-bg border border-cash text-cash-deep text-[13px] rounded">
            Mobile number not registered.
          </div>
        )}
        <button
          type="submit"
          disabled={digits.length !== 10}
          className="block w-full mt-6 py-4 rounded bg-navy text-cream font-semibold text-[14px] tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-colors enabled:hover:bg-navy-deep"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
