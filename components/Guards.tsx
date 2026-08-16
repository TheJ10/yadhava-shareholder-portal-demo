"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Wrap any protected page. Redirects to "/" if there is no valid session.
 * Because auth state is read from sessionStorage on every mount (see
 * AuthProvider), this check survives refreshes and the browser back/forward
 * gesture without ever tearing down a valid session.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "guest" || status === "pending") {
      router.replace("/");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }
  return <>{children}</>;
}

/**
 * Wrap the mobile-entry and OTP pages. If the user is already authenticated
 * (e.g. they pressed back to here after logging in), send them straight to
 * Holder Details instead of showing the login form again.
 */
export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/holder");
    }
  }, [status, router]);

  if (status === "authenticated" || status === "loading") {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }
  return <>{children}</>;
}
