import Link from "next/link";
import { DepositType } from "@/lib/types";

interface Props {
  type: DepositType;
  label: string;
  tag: string;
  shares: number;
  count: number;
}

const THEME = {
  bank: {
    border: "border-bank/55",
    tagText: "text-bank-deep",
    titleText: "text-bank-deep",
    btnText: "text-bank-deep",
    btnBorder: "border-bank",
    btnHover: "hover:bg-bank-bg",
    displayTag: "INITIAL",
    displayTitle: "Initial Deposit",
  },
  cash: {
    border: "border-cash/55",
    tagText: "text-cash-deep",
    titleText: "text-cash-deep",
    btnText: "text-cash-deep",
    btnBorder: "border-cash",
    btnHover: "hover:bg-cash-bg",
    displayTag: "POST",
    displayTitle: "Post Deposit",
  },
} as const;

export default function DepositCard({ type, shares, count }: Props) {
  const t = THEME[type];

  return (
    <div
      className={`rounded bg-paper border-[1.3px] ${t.border} px-5 pt-[22px] pb-5 mb-4`}
    >
      <span
        className={`block text-[10.5px] tracking-[0.2em] uppercase font-bold mb-2.5 ${t.tagText}`}
      >
        {t.displayTag}
      </span>

      <h3
        className={`font-serif font-bold text-[21px] mb-[18px] tracking-wide ${t.titleText}`}
      >
        {t.displayTitle}
      </h3>

      <div className="flex gap-[26px] mb-[18px]">
        <div>
          <span className="block text-[25px] font-bold text-ink tabular-nums">
            {shares.toLocaleString("en-IN")}
          </span>

          <span className="text-[10.5px] uppercase tracking-wide text-ink-faint">
            Total Shares
          </span>
        </div>

        <div>
          <span className="block text-[25px] font-bold text-ink tabular-nums">
            {count}
          </span>

          <span className="text-[10.5px] uppercase tracking-wide text-ink-faint">
            {count === 1 ? "Certificate" : "Certificates"}
          </span>
        </div>
      </div>

      <Link
        href={`/deposit/${type}`}
        className={`block w-full text-center py-[13px] rounded border-[1.3px] font-semibold text-[12.5px] tracking-wide uppercase transition-colors ${t.btnText} ${t.btnBorder} ${t.btnHover}`}
      >
        View Certificates
      </Link>
    </div>
  );
}
