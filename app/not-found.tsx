import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-10 animate-fadeIn">
      <h2 className="font-serif font-bold text-[22px] text-navy-deep mb-3">Page not found</h2>
      <p className="text-[14px] text-ink-soft mb-6">
        That page doesn&apos;t exist in the Shareholder Portal.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded bg-navy text-cream font-semibold text-[13px] uppercase tracking-wide"
      >
        Return home
      </Link>
    </div>
  );
}
