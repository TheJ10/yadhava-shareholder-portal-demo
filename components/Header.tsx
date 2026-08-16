import Image from "next/image";
import Link from "next/link";

/**
 * Static masthead. Fixed to the top of the viewport, constant height,
 * no scroll listener, no size/position change of any kind. Page content
 * reserves HEADER_HEIGHT of top padding (see app/layout.tsx) so nothing
 * is ever hidden underneath it.
 */
export const HEADER_HEIGHT = 116;

export default function Header() {
  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-to-b from-navy to-navy-deep text-cream after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:opacity-85"
    >
      <div className="h-full max-w-[480px] md:max-w-[560px] mx-auto flex flex-col items-center justify-center px-4">
        <Link href="/" className="flex items-center justify-center gap-2.5 max-w-full">
          <span className="relative flex items-center justify-center rounded-full overflow-hidden shrink-0 w-9 h-9 sm:w-11 sm:h-11">
            <Image
              src="/krishna-logo.png"
              alt="Yadhava Convention Hall emblem"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>
          <span className="font-serif font-bold text-gold-soft tracking-wide text-[20px] sm:text-[26px] whitespace-nowrap">
            Yadhava Convention Hall
          </span>
        </Link>
        <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-gold-mist/85 font-semibold mt-2">
          Shareholder Portal
        </p>
      </div>
    </header>
  );
}
