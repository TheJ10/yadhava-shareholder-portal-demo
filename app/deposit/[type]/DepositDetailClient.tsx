"use client";

import { useAuth } from "@/lib/auth-context";
import { RequireAuth } from "@/components/Guards";
import { depositTotals, getDeposit } from "@/lib/data";
import { DepositType } from "@/lib/types";
import BackLink from "@/components/BackLink";
import CertificateRow from "@/components/CertificateRow";

export default function DepositDetailClient({ type }: { type: string }) {
  return (
    <RequireAuth>
      <DepositDetail type={type as DepositType} />
    </RequireAuth>
  );
}

function DepositDetail({ type }: { type: DepositType }) {
  const { member } = useAuth();
  if (!member) return null;

  const dep = getDeposit(member, type);
  const totals = depositTotals(dep);
  const titleColor = type === "bank" ? "text-bank-deep" : "text-cash-deep";

  return (
    <div className="animate-fadeIn">
      <BackLink href="/holder" label="Holder Details" />
      <h2 className={`font-serif font-bold text-[25px] tracking-wide mb-1 ${titleColor}`}>
        {dep.label}
      </h2>
      <p className="text-[11.5px] tracking-wide uppercase text-ink-faint font-semibold mb-5">
        {totals.count} {totals.count === 1 ? "certificate" : "certificates"} ·{" "}
        {totals.shares.toLocaleString("en-IN")} shares
      </p>
      {dep.certificates.map((cert) => (
        <CertificateRow key={cert.certNo} cert={cert} type={type} />
      ))}
    </div>
  );
}
