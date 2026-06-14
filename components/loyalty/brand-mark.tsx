import Image from "next/image";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
  /** Hero: centered car mascot above lookup card. Toolbar: car + wordmark chip. */
  variant?: "hero" | "toolbar";
};

/** Car mascot from image-2 brand assets — readable on sky-to-navy gradient backgrounds. */
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
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 object-contain drop-shadow-[0_6px_20px_rgba(0,42,85,0.35)]"
          unoptimized
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-xl bg-[#003E7E]/92 px-2.5 py-1.5 shadow-[0_4px_16px_rgba(0,42,85,0.28)] ring-1 ring-white/20 backdrop-blur-sm ${className}`}
    >
      <Image
        src={BILCLEANIKEN_LOGO_URL}
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 object-contain"
        unoptimized
        priority
      />
      <span className="text-sm font-semibold tracking-tight text-white">
        {brandName}
      </span>
    </div>
  );
}
