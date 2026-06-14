import Image from "next/image";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
  /** Hero: centered car mascot. Toolbar: car + wordmark for page header. */
  variant?: "hero" | "toolbar";
};

/** Car mascot from brand assets — readable on sky-to-navy gradient backgrounds. */
export function BrandMark({
  brandName = "Bilcleaniken",
  className = "",
  variant = "toolbar",
}: BrandMarkProps) {
  if (variant === "hero") {
    return (
      <div className={`flex justify-center ${className}`}>
        <Image
          src={BILCLEANIKEN_LOGO_URL}
          alt={brandName}
          width={72}
          height={72}
          className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-2xl object-cover shadow-[0_8px_24px_rgba(0,42,85,0.35)] ring-2 ring-white/50"
          unoptimized
          priority
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={BILCLEANIKEN_LOGO_URL}
        alt=""
        width={48}
        height={48}
        className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-[0_2px_8px_rgba(0,42,85,0.35)] ring-2 ring-white/50"
        unoptimized
        priority
      />
      <span className="text-[15px] font-semibold tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,42,85,0.65)]">
        {brandName}
      </span>
    </div>
  );
}
