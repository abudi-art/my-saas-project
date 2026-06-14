import Image from "next/image";
import type { ReactNode } from "react";
import { BILCLEANIKEN_BADGE_URL } from "@/lib/i18n/loyalty";

type BrandTopBarProps = {
  brandName?: string;
  trailing?: ReactNode;
  className?: string;
};

export function BrandTopBar({
  brandName = "Bilcleaniken",
  trailing,
  className = "",
}: BrandTopBarProps) {
  return (
    <header
      className={`flex items-center justify-between gap-4 bg-[#003E7E] px-5 py-5 sm:px-6 ${className}`}
    >
      <Image
        src={BILCLEANIKEN_BADGE_URL}
        alt={brandName}
        width={176}
        height={52}
        className="h-10 w-auto max-w-[11rem] shrink-0 object-contain sm:h-11"
        priority
        unoptimized
      />
      {trailing}
    </header>
  );
}
