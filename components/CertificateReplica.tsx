import { forwardRef } from "react";
import { Certificate, Company } from "@/lib/types";

interface Props {
  cert: Certificate;
  company: Company;
}

const CertificateReplica = forwardRef<HTMLDivElement, Props>(function CertificateReplica(
  { cert, company },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded bg-paper border-2 border-navy p-[26px_20px] before:content-[''] before:absolute before:inset-[7px] before:border before:border-gold before:rounded-sm before:pointer-events-none"
    >
      <p className="text-center text-[10px] tracking-[0.14em] uppercase text-ink-faint font-semibold mb-2">
        Form No. SH-1
      </p>
      <p className="text-center font-serif font-bold text-[23px] text-navy-deep tracking-wide mb-1">
        Share Certificate
      </p>
      <p className="text-center text-[9.5px] text-ink-faint leading-relaxed mb-4 px-2">
        Pursuant to sub-section (3) of section 46 of the Companies Act, 2013 and rule 5(2) of
        the Companies (Share Capital and Debentures) Rules 2014
      </p>
      <p className="text-center font-serif text-[15px] font-semibold text-ink mb-[3px]">
        {company.name}
      </p>
      <p className="text-center text-[10px] text-ink-faint mb-2.5">CIN: {company.cin}</p>
      <p className="text-center text-[10.5px] text-ink-faint leading-relaxed mb-4">
        Registered office:
        <br />
        {company.office}
      </p>
      <p className="text-[11px] leading-relaxed text-ink-soft text-justify mb-4">
        This is to certify that the person(s) named in this Certificate is/are the Registered
        Holder(s) of the within-mentioned Share(s) bearing the distinctive number(s) herein
        specified, subject to the Memorandum and Articles of Association of the Company, and
        that the amount endorsed hereon has been paid up on each such Share.
      </p>
      <p className="text-center text-[10.5px] font-bold tracking-wide border-y border-line py-2.5 mb-4 text-navy-deep">
        Equity Shares Each of Rupees Ten — Amount Paid Up Per Share Rupees Ten
      </p>
      <div className="border border-line rounded-sm p-[15px] mb-4">
        <Row k="Reg. Folio No" v={cert.folio} />
        <Row k="Certificate No" v={cert.certNo} />
        <Row k="Name of the Holder" v={cert.holder} />
        <Row k="No. of Shares" v={cert.shares.toLocaleString("en-IN")} />
        <Row k="Distinctive Numbers" v={cert.distinctive} last />
      </div>
      <p className="text-center text-[10.5px] text-ink-faint italic mb-[18px]">
        Given under the Common Seal of the Company at Chennai on this {cert.dateSeal}
      </p>
      <div className="flex justify-between text-[10px] text-ink-faint pt-3 border-t border-line">
        <span>Chairman/Director</span>
        <span>Director</span>
      </div>
    </div>
  );
});

function Row({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div className={`flex justify-between gap-2.5 py-[7px] text-[12.5px] ${last ? "" : "border-b border-dashed border-line"}`}>
      <span className="text-ink-soft font-semibold">{k}</span>
      <span className="font-bold text-ink text-right tabular-nums">{v}</span>
    </div>
  );
}

export default CertificateReplica;
