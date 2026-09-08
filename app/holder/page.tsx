"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/Guards";
import { depositTotals, memberTotalShares } from "@/lib/data";
import DepositCard from "@/components/DepositCard";

export default function HolderPage() {
  return (
    <RequireAuth>
      <HolderDetails />
    </RequireAuth>
  );
}

function HolderDetails() {
  const { member } = useAuth();
  // Show the verified seal only right after login, not on every visit/back-nav.
  const [justArrived] = useState(() => {
    if (typeof window === "undefined") return false;
    const flagged = window.sessionStorage.getItem("yadhava_just_verified");
    if (flagged) {
      window.sessionStorage.removeItem("yadhava_just_verified");
      return true;
    }
    return false;
  });

  if (!member) return null;

  const bankTotals = depositTotals(member.deposits.bank);
  const cashTotals = depositTotals(member.deposits.cash);
  const total = memberTotalShares(member);

  return (
    <div>
      {justArrived && (
        <div
          className="w-[52px] h-[52px] rounded-full border-[1.5px] border-gold flex items-center justify-center mx-auto mb-4 relative animate-sealPop before:content-[''] before:absolute before:inset-[5px] before:border before:border-gold-mist before:rounded-full"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[22px] h-[22px] text-navy-deep">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className="bg-paper border border-line rounded shadow-card px-[22px] py-[26px] mb-[18px] animate-fadeIn">
        <h3 className="font-serif font-bold text-[13px] tracking-[0.16em] uppercase text-gold mb-5">
          Holder Details
        </h3>
        <p className="font-serif font-bold text-[31px] text-navy-deep tracking-wide mb-2.5">
          {member.name}
        </p>
        <hr className="w-[38px] h-[2px] bg-gold border-none mb-[22px] opacity-85" />
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-[18px]">
          <Field label="Folio Number" value={member.folio} />
          <Field label="Mobile Number" value={member.mobile} />
          <Field label="Area" value={member.area} />
          <Field label="Total Shares" value={total.toLocaleString("en-IN")} accent />
        </div>
      </div>

      <DepositCard
        type="bank"
        label={member.deposits.bank.label}
        tag={member.deposits.bank.tag}
        shares={bankTotals.shares}
        count={bankTotals.count}
      />
      <DepositCard
        type="cash"
        label={member.deposits.cash.label}
        tag={member.deposits.cash.tag}
        shares={cashTotals.shares}
        count={cashTotals.count}
      />
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide font-semibold text-ink-faint mb-[5px]">
        {label}
      </div>
      <div className={`font-semibold tabular-nums ${accent ? "text-[19px] text-navy-deep" : "text-[15px] text-ink"}`}>
        {value}
      </div>
    </div>
  );
}
