"use client";

import { useEffect, useState } from "react";
import type { LoyaltyCopy } from "@/lib/i18n/loyalty";
import { detectWalletPlatform, type WalletPlatform } from "@/lib/wallet/platform";

type WalletButtonsProps = {
  phone: string;
  copy: LoyaltyCopy;
};

export function WalletButtons({ phone, copy }: WalletButtonsProps) {
  const [platform, setPlatform] = useState<WalletPlatform>("unknown");
  const [loading, setLoading] = useState<WalletPlatform | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPlatform(detectWalletPlatform(navigator.userAgent));
  }, []);

  async function enroll(targetPlatform: "apple" | "google") {
    setLoading(targetPlatform);
    setError(null);

    try {
      if (targetPlatform === "apple") {
        window.location.href = `/api/wallet/apple/${encodeURIComponent(phone)}`;
        return;
      }

      const response = await fetch("/api/wallet/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, platform: "google" }),
      });

      const data = await response.json();

      if (data.saveUrl) {
        window.location.href = data.saveUrl;
        return;
      }

      if (!response.ok) {
        setError(copy.walletError);
      }
    } catch {
      setError(copy.walletError);
    } finally {
      setLoading(null);
    }
  }

  const showApple = platform === "apple" || platform === "unknown";
  const showGoogle = platform === "google" || platform === "unknown";

  return (
    <div className="loyalty-card-surface rounded-2xl p-5">
      <p className="mb-4 text-center text-sm text-[#1E293B]/65">{copy.walletHint}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {showApple && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => enroll("apple")}
            className="loyalty-btn-primary flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            {loading === "apple" ? copy.walletLoading : copy.addToAppleWallet}
          </button>
        )}

        {showGoogle && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => enroll("google")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#004a80]/20 bg-white px-4 py-3.5 text-sm font-semibold text-[#1E293B] transition hover:border-[#004a80]/40 hover:bg-[#004a80]/5 disabled:opacity-60"
          >
            <span className="text-lg font-bold text-[#004a80]" aria-hidden>
              G
            </span>
            {loading === "google" ? copy.walletLoading : copy.addToGoogleWallet}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
