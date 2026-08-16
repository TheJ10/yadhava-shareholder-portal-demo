import Link from "next/link";
import { Certificate, DepositType } from "@/lib/types";

export default function CertificateRow({
  cert,
  type,
}: {
  cert: Certificate;
  type: DepositType;
}) {
  return (
    <div className="border border-line rounded bg-paper p-[18px] mb-3.5">
      <div className="flex justify-between items-baseline mb-3.5 pb-3.5 border-b border-line-soft">
        <span className="font-serif text-[17px] font-semibold text-navy-deep">
          Certificate No. {cert.certNo}
        </span>
        <span className="text-[13px] font-semibold text-ink-soft">
          {cert.shares.toLocaleString("en-IN")} shares
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-3.5 mb-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-wide font-semibold text-ink-faint mb-1">
            Issued
          </div>
          <div className="text-[13px] font-semibold text-ink">{cert.dateShort}</div>
        </div>
        <div>
          <div className="text-[10.5px] uppercase tracking-wide font-semibold text-ink-faint mb-1">
            Distinctive Numbers
          </div>
          <div className="text-[13px] font-semibold text-ink">{cert.distinctive}</div>
        </div>
      </div>
      <div className="flex gap-2.5">
        <Link
          href={`/certificate/${type}/${cert.certNo}`}
          className="flex-1 text-center py-3 rounded bg-navy text-cream font-semibold text-[11.5px] tracking-wide uppercase"
        >
          View Certificate
        </Link>
        <Link
          href={`/certificate/${type}/${cert.certNo}?download=1`}
          className="flex-1 text-center py-3 rounded border-[1.3px] border-line text-ink font-semibold text-[11.5px] tracking-wide uppercase"
        >
          Download
        </Link>
      </div>
    </div>
  );
}
