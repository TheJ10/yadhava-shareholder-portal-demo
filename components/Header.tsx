"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

/**
 * Static masthead. Fixed to the top of the viewport, constant height,
 * no scroll listener, no size/position change of any kind. Page content
 * reserves HEADER_HEIGHT of top padding (see app/layout.tsx) so nothing is
 * ever hidden underneath it.
 */
export const HEADER_HEIGHT = 116;

export default function Header() {
  const { status, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isAuthenticated = status === "authenticated";

  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-to-b from-navy to-navy-deep text-cream after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:opacity-85"
    >
      <div className="relative h-full max-w-[480px] md:max-w-[560px] mx-auto flex flex-col items-center justify-center px-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 max-w-full"
        >
          <span className="relative flex items-center justify-center rounded-full overflow-hidden shrink-0 w-9 h-9 sm:w-11 sm:h-11">
            <Image
              src="/krishna-logo.png"
              alt="Yadhava Convention Hall emblem"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>

          <span className="font-serif font-bold text-gold-soft tracking-wide text-[20px] sm:text-[26px] whitespace-nowrap">
            Yadhava Convention Hall
          </span>
        </Link>

        <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-gold-mist/85 font-semibold mt-2">
          Shareholder Portal
        </p>

        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Logout"
            title="Logout"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gold-mist/40 text-gold-soft transition-colors hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-[17px] w-[17px]"
              aria-hidden="true"
            >
              <path
                d="M15.75 8.25V5.5A1.5 1.5 0 0 0 14.25 4h-8.5a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 5.75 20h8.5a1.5 1.5 0 0 0 1.5-1.5v-2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 12h8.25m0 0-3.25-3.25M20.25 12 17 15.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {isAuthenticated && showLogoutConfirm && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div className="w-full max-w-[360px] rounded-lg border border-line bg-paper px-6 py-7 shadow-card">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    className="h-[18px] w-[18px] text-gold-soft"
                    aria-hidden="true"
                  >
                    <path
                      d="M15.75 8.25V5.5A1.5 1.5 0 0 0 14.25 4h-8.5a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 5.75 20h8.5a1.5 1.5 0 0 0 1.5-1.5v-2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12h8.25m0 0-3.25-3.25M20.25 12 17 15.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2
                  id="logout-title"
                  className="font-serif font-bold text-[18px] tracking-wide text-navy-deep"
                >
                  Logout
                </h2>

                <p className="mt-2 text-[13px] leading-5 text-ink-soft">
                  Are you sure you want to logout from your shareholder
                  account?
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded border border-line py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft transition-colors hover:border-navy-deep hover:text-navy-deep"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logout();
                  }}
                  className="rounded bg-navy-deep py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream transition-opacity hover:opacity-90"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}