import Image from "next/image";
import type { ReactNode } from "react";
import { BILCLEANIKEN_COLORS } from "@/lib/brand/colors";
import { BILCLEANIKEN_BADGE_URL } from "@/lib/i18n/loyalty";

type BrandTopBarProps = {
  brandName?: string;
  trailing?: ReactNode;
  /** When true, rounds only the top corners (inside a card). */
  embedded?: boolean;
  className?: string;
};

export function BrandTopBar({
  brandName = "Bilcleaniken",
  trailing,
  embedded = false,
  className = "",
}: BrandTopBarProps) {
  return (
    <header
      className={`loyalty-top-bar flex w-full min-h-[4.25rem] items-center justify-between gap-4 px-5 py-4 sm:min-h-[4.5rem] sm:px-6 ${
        embedded ? "rounded-t-2xl" : ""
      } ${className}`}
      style={{
        background: `linear-gradient(135deg, ${BILCLEANIKEN_COLORS.navy} 0%, ${BILCLEANIKEN_COLORS.navyMid} 52%, ${BILCLEANIKEN_COLORS.navyDark} 100%)`,
      }}
    >
      <Image
        src={BILCLEANIKEN_BADGE_URL}
        alt={brandName}
        width={190}
        height={56}
        className="h-10 w-auto max-w-[11.5rem] shrink-0 object-contain sm:h-11"
        priority
        unoptimized
      />
      {trailing}
    </header>
  );
}
