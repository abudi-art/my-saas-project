import Image from "next/image";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
  /** toolbar = header row; hero = centered on home/landing */
  variant?: "toolbar" | "hero";
};

/** Car mascot + framed wordmark — car mark is emphasized in a navy badge. */
export function BrandMark({
  brandName = "Bilcleaniken",
  className = "",
  variant = "toolbar",
}: BrandMarkProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`flex items-center ${isHero ? "gap-4 sm:gap-5" : "gap-2.5 sm:gap-3"} ${className}`}
    >
      <div
        className={`loyalty-car-mark relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#003E7E] via-[#003B6F] to-[#002A55] ring-[3px] ring-white ${
          isHero
            ? "p-3 shadow-[0_12px_32px_rgba(0,59,111,0.45)] sm:p-4"
            : "p-2 shadow-[0_8px_22px_rgba(0,59,111,0.4)] sm:p-2.5"
        }`}
      >
        <Image
          src={BILCLEANIKEN_LOGO_URL}
          alt=""
          width={isHero ? 96 : 64}
          height={isHero ? 96 : 64}
          className={
            isHero
              ? "h-16 w-16 object-contain sm:h-[4.5rem] sm:w-[4.5rem]"
              : "h-11 w-11 object-contain sm:h-12 sm:w-12"
          }
          priority={isHero}
          unoptimized
        />
      </div>

      <span
        className={`border-2 border-[#003E7E] font-semibold tracking-tight text-[#003E7E] ${
          isHero
            ? "px-3.5 py-1 text-base sm:text-lg"
            : "px-2.5 py-0.5 text-sm sm:text-[15px]"
        }`}
      >
        {brandName}
      </span>
    </div>
  );
}
