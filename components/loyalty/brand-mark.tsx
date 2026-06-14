import Image from "next/image";
import { BILCLEANIKEN_CAR_MARK_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
  /** toolbar = header row; hero = centered on home/landing */
  variant?: "toolbar" | "hero";
};

/** Car mascot + framed wordmark — car-only asset on navy badge, navy text on light bg. */
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
        className={`loyalty-car-mark relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#003E7E] via-[#003B6F] to-[#002A55] ring-[3px] ring-white ${
          isHero
            ? "p-3.5 shadow-[0_16px_40px_rgba(0,59,111,0.55)] sm:p-5"
            : "p-2.5 shadow-[0_12px_28px_rgba(0,59,111,0.5)] sm:p-3"
        }`}
      >
        <Image
          src={BILCLEANIKEN_CAR_MARK_URL}
          alt=""
          width={isHero ? 128 : 80}
          height={isHero ? 104 : 72}
          className={
            isHero
              ? "h-[4.5rem] w-auto scale-110 object-contain sm:h-[5.25rem] sm:scale-[1.15]"
              : "h-[3.25rem] w-auto scale-110 object-contain sm:h-14 sm:scale-[1.15]"
          }
          priority={isHero}
          unoptimized
        />
      </div>

      <span
        className={`border-2 border-[#003E7E] bg-white font-semibold tracking-tight text-[#003E7E] shadow-sm ${
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
