import Image from "next/image";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";

type BrandMarkProps = {
  brandName?: string;
  className?: string;
};

/** Compact logo for light backgrounds — car mark + framed navy wordmark. */
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
        className="h-10 w-10 shrink-0 object-contain"
        unoptimized
      />
      <span className="border border-[#003E7E] px-2.5 py-0.5 text-sm font-semibold tracking-tight text-[#003E7E]">
        {brandName}
      </span>
    </div>
  );
}
