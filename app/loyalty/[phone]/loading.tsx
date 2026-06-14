import { defaultLocale, getLoyaltyCopy } from "@/lib/i18n/loyalty";

export default function LoyaltyLoading() {
  const copy = getLoyaltyCopy(defaultLocale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-blue-50 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />
        <p className="text-sm font-medium text-gray-500">{copy.loading}</p>
      </div>
    </div>
  );
}
