import Link from "next/link";

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-[7px] mb-[18px] text-[13px] font-semibold text-navy"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </Link>
  );
}
