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
    <header className={`loyalty-top-bar w-full px-5 py-5 sm:px-6 ${className}`}>
      <Image
        src={BILCLEANIKEN_BADGE_URL}
        alt={brandName}
        width={176}
        height={52}
        className="loyalty-logo-official h-10 w-auto shrink-0 sm:h-11"
        priority
        unoptimized
      />
      {trailing}
    </header>
  );
}
