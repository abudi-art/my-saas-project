import Image from "next/image";
import { BilCleanikenWordmark } from "@/components/loyalty/bilcleaniken-wordmark";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
  /** Hero: larger mark above lookup card. Toolbar: compact inline mark. */
  variant?: "hero" | "toolbar";
};

/**
 * Official BilCleaniken mark — 3D car (black tires, sky-blue body) + wordmark
 * from bilcleaniken.se. No frames or background chips.
 */
export function BrandMark({
  brandName = "Bilcleaniken",
  className = "",
  variant = "toolbar",
}: BrandMarkProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`flex shrink-0 items-center ${
        isHero ? "justify-center gap-3 sm:gap-3.5" : "gap-2.5"
      } ${className}`}
    >
      <Image
        src={BILCLEANIKEN_LOGO_URL}
        alt=""
        width={304}
        height={244}
        className={`shrink-0 object-contain ${
          isHero ? "h-[4.5rem] w-auto sm:h-[5rem]" : "h-11 w-auto"
        }`}
        unoptimized
        priority
      />
      <BilCleanikenWordmark
        className={`shrink-0 text-white ${
          isHero ? "h-[1.35rem] w-auto sm:h-6" : "h-[1.05rem] w-auto"
        }`}
        aria-label={brandName}
      />
    </div>
  );
}
