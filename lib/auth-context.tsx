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
import {
  requestDevOtp,
  verifyDevOtp,
} from "./api";
import { getCurrentMember } from "./data";

type AuthStatus = "loading" | "guest" | "pending" | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  member: Member | null;
  pendingMobile: string | null;
  /** Step 1: submit a registered mobile number. Returns false if not registered. */
  requestOtp: (mobile: string) => Promise<boolean>;
  /** Step 2: confirm the OTP for the pending mobile. Returns false if incorrect. */
  confirmOtp: (otp: string) => Promise<boolean>;
  /** Clear the pending mobile and return to the entry screen. */
  cancelOtp: () => void;
  /** Fully sign out. */
  logout: () => void;
}

const AUTH_KEY = "yadhava_auth_session";
const PENDING_KEY = "yadhava_pending_mobile";
const DEV_MEMBER_KEY = "yadhava_dev_member_id";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [member, setMember] = useState<Member | null>(null);
  const [pendingMobile, setPendingMobile] = useState<string | null>(null);

  const loadAuthenticatedMember = useCallback(async () => {
    try {
      const currentMember = await getCurrentMember();

      setMember(currentMember);
      setStatus("authenticated");

      return true;
    } catch {
      window.sessionStorage.removeItem(AUTH_KEY);
      window.sessionStorage.removeItem(DEV_MEMBER_KEY);

      setMember(null);
      setStatus("guest");

      return false;
    }
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const savedAuth = window.sessionStorage.getItem(AUTH_KEY);

        if (savedAuth) {
          const parsed = JSON.parse(savedAuth) as {
            memberId?: string;
          };

          if (parsed.memberId) {
            window.sessionStorage.setItem(
              DEV_MEMBER_KEY,
              parsed.memberId
            );

            await loadAuthenticatedMember();
            return;
          }
        }

        const savedPending =
          window.sessionStorage.getItem(PENDING_KEY);

        if (savedPending) {
          setPendingMobile(savedPending);
          setStatus("pending");
          return;
        }

        setStatus("guest");
      } catch {
        setStatus("guest");
      }
    };

    void hydrate();
  }, [loadAuthenticatedMember]);

  const requestOtp = useCallback(async (mobile: string) => {
    try {
      await requestDevOtp(mobile);

      window.sessionStorage.setItem(PENDING_KEY, mobile);
      setPendingMobile(mobile);
      setStatus("pending");

      return true;
    } catch {
      return false;
    }
  }, []);

  const confirmOtp = useCallback(
    async (otp: string) => {
      if (!pendingMobile) return false;

      try {
        const result = await verifyDevOtp(
          pendingMobile,
          otp
        );

        window.sessionStorage.setItem(
          AUTH_KEY,
          JSON.stringify({
            memberId: result.member_id,
          })
        );

        window.sessionStorage.setItem(
          DEV_MEMBER_KEY,
          result.member_id
        );

        window.sessionStorage.removeItem(PENDING_KEY);
        window.sessionStorage.setItem(
          "yadhava_just_verified",
          "1"
        );

        setPendingMobile(null);

        const loaded = await loadAuthenticatedMember();

        if (!loaded) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    },
    [pendingMobile, loadAuthenticatedMember]
  );

  const cancelOtp = useCallback(() => {
    window.sessionStorage.removeItem(PENDING_KEY);

    setPendingMobile(null);
    setStatus("guest");
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(PENDING_KEY);
    window.sessionStorage.removeItem(DEV_MEMBER_KEY);

    setMember(null);
    setPendingMobile(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({
      status,
      member,
      pendingMobile,
      requestOtp,
      confirmOtp,
      cancelOtp,
      logout,
    }),
    [
      status,
      member,
      pendingMobile,
      requestOtp,
      confirmOtp,
      cancelOtp,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}
