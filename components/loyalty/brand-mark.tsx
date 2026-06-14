import Image from "next/image";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
};

/** Compact logo for gradient backgrounds — car mark + readable wordmark. */
export function BrandMark({
  brandName = "Bilcleaniken",
  className = "",
}: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={BILCLEANIKEN_LOGO_URL}
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-white/40"
        unoptimized
        priority
      />
      <span className="text-[15px] font-semibold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,42,85,0.45)]">
        {brandName}
      </span>
    </div>
  );
}
