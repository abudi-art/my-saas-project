import Image from "next/image";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
  /** Hero: centered car mascot above lookup card. Toolbar: car + wordmark chip. */
  variant?: "hero" | "toolbar";
};

/** Car mascot from image-3 — readable on sky-to-navy gradient backgrounds. */
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
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 object-contain drop-shadow-[0_8px_24px_rgba(0,42,85,0.35)]"
          unoptimized
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center gap-2.5 rounded-2xl bg-[#003E7E]/95 px-3 py-2 shadow-[0_6px_20px_rgba(0,42,85,0.32)] ring-1 ring-white/25 backdrop-blur-sm ${className}`}
    >
      <Image
        src={BILCLEANIKEN_LOGO_URL}
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 shrink-0 object-contain"
        unoptimized
        priority
      />
      <span className="text-sm font-semibold tracking-tight text-white">
        {brandName}
      </span>
    </div>
  );
}
