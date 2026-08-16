"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { Member } from "./types";
import { getMemberByMobile, verifyOtp as verifyOtpAgainstData } from "./data";

type AuthStatus = "loading" | "guest" | "pending" | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  member: Member | null;
  pendingMobile: string | null;
  /** Step 1: submit a registered mobile number. Returns false if not registered. */
  requestOtp: (mobile: string) => boolean;
  /** Step 2: confirm the OTP for the pending mobile. Returns false if incorrect. */
  confirmOtp: (otp: string) => boolean;
  /** Clear the pending mobile and return to the entry screen. */
  cancelOtp: () => void;
  /** Fully sign out. */
  logout: () => void;
}

const AUTH_KEY = "yadhava_auth_session";
const PENDING_KEY = "yadhava_pending_mobile";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [member, setMember] = useState<Member | null>(null);
  const [pendingMobile, setPendingMobile] = useState<string | null>(null);

  // Hydrate from persisted storage on first mount. This is what makes the
  // session survive page refreshes and the mobile browser back gesture:
  // navigation between routes never resets this state, it only re-reads it.
  useEffect(() => {
    try {
      const savedAuth = window.sessionStorage.getItem(AUTH_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth) as { mobile: string };
        const found = getMemberByMobile(parsed.mobile);
        if (found) {
          setMember(found);
          setStatus("authenticated");
          return;
        }
      }
      const savedPending = window.sessionStorage.getItem(PENDING_KEY);
      if (savedPending) {
        setPendingMobile(savedPending);
        setStatus("pending");
        return;
      }
      setStatus("guest");
    } catch {
      setStatus("guest");
    }
  }, []);

  const requestOtp = useCallback((mobile: string) => {
    const found = getMemberByMobile(mobile);
    if (!found) return false;
    window.sessionStorage.setItem(PENDING_KEY, mobile);
    setPendingMobile(mobile);
    setStatus("pending");
    return true;
  }, []);

  const confirmOtp = useCallback(
    (otp: string) => {
      if (!pendingMobile) return false;
      const ok = verifyOtpAgainstData(pendingMobile, otp);
      if (!ok) return false;
      const found = getMemberByMobile(pendingMobile);
      if (!found) return false;
      window.sessionStorage.setItem(AUTH_KEY, JSON.stringify({ mobile: pendingMobile }));
      window.sessionStorage.removeItem(PENDING_KEY);
      window.sessionStorage.setItem("yadhava_just_verified", "1");
      setMember(found);
      setPendingMobile(null);
      setStatus("authenticated");
      return true;
    },
    [pendingMobile]
  );

  const cancelOtp = useCallback(() => {
    window.sessionStorage.removeItem(PENDING_KEY);
    setPendingMobile(null);
    setStatus("guest");
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(PENDING_KEY);
    setMember(null);
    setPendingMobile(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({ status, member, pendingMobile, requestOtp, confirmOtp, cancelOtp, logout }),
    [status, member, pendingMobile, requestOtp, confirmOtp, cancelOtp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
