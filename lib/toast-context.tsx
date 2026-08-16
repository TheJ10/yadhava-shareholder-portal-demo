"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`fixed bottom-[22px] left-1/2 -translate-x-1/2 bg-navy-deep text-cream px-[22px] py-3 rounded-full text-[12.5px] font-semibold shadow-[0_6px_20px_rgba(0,0,0,0.22)] z-50 pointer-events-none whitespace-nowrap transition-all duration-250 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
        }`}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
