"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { RedirectIfAuthenticated } from "@/components/Guards";

export default function OtpPage() {
  return (
    <RedirectIfAuthenticated>
      <OtpForm />
    </RedirectIfAuthenticated>
  );
}

function OtpForm() {
  const { status, pendingMobile, confirmOtp, cancelOtp } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (status === "guest") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const code = digits.join("");

  function updateDigit(i: number, val: string) {
    const v = val.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    setError(false);
    if (v && inputsRef.current[i + 1]) inputsRef.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && inputsRef.current[i - 1]) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    const ok = confirmOtp(code);
    if (ok) {
      router.replace("/holder");
    } else {
      setError(true);
      setDigits(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    }
  }

  if (!pendingMobile) {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }

  return (
    <div className="bg-paper border border-line rounded shadow-card px-[22px] py-[26px] animate-fadeIn">
      <h2 className="font-serif font-bold text-[25px] text-navy-deep mb-[22px] tracking-wide">
        OTP Verification
      </h2>
      <p className="text-[14px] leading-relaxed text-ink-soft mb-[22px]">
        Enter the OTP sent to your registered mobile number.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 justify-between">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-full aspect-square text-center text-[20px] font-semibold border-[1.5px] border-line rounded bg-white outline-none focus:border-navy"
            />
          ))}
        </div>
        {error && (
          <div className="mt-[14px] px-[14px] py-3 bg-cash-bg border border-cash text-cash-deep text-[13px] rounded">
            Incorrect OTP. Please try again.
          </div>
        )}
        <button
          type="submit"
          disabled={code.length !== 6}
          className="block w-full mt-6 py-4 rounded bg-navy text-cream font-semibold text-[14px] tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-colors enabled:hover:bg-navy-deep"
        >
          Verify
        </button>
        <div className="flex justify-center gap-6 mt-5 text-[13px]">
          <button
            type="button"
            onClick={() => showToast("OTP resent")}
            className="font-semibold text-navy"
          >
            Resend OTP
          </button>
          <button type="button" onClick={cancelOtp} className="text-ink-faint underline">
            Change number
          </button>
        </div>
      </form>
    </div>
  );
}
