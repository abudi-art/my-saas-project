"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BILCLEANIKEN_LOGO_URL,
  CARD_TARGET_POINTS,
  defaultLocale,
  getLoyaltyCopy,
  locales,
  type Locale,
} from "@/lib/i18n/loyalty";
import { detectWalletPlatform, type WalletPlatform } from "@/lib/wallet/platform";

type LoyaltyCustomer = {
  phone: string;
  points: number;
  customer_name?: string;
  [key: string]: unknown;
};

type LoyaltyViewProps = {
  phone: string;
  customer: LoyaltyCustomer | null;
  configError?: boolean;
};

function WalletButtons({
  phone,
  copy,
}: {
  phone: string;
  copy: ReturnType<typeof getLoyaltyCopy>;
}) {
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
      const response = await fetch("/api/wallet/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, platform: targetPlatform }),
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/vnd.apple.pkpass")) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.location.href = url;
        return;
      }

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
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-center text-sm text-gray-500">{copy.walletHint}</p>

      <div className="flex flex-col gap-3">
        {showApple && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => enroll("apple")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-60"
          >
            <span aria-hidden>🍎</span>
            {loading === "apple" ? copy.walletLoading : copy.addToAppleWallet}
          </button>
        )}

        {showGoogle && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => enroll("google")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <span aria-hidden>G</span>
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

export function LoyaltyView({ phone, customer, configError }: LoyaltyViewProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const copy = getLoyaltyCopy(locale);

  const notFound = configError || !customer;
  const currentPoints = customer?.points ?? 0;
  const progressPercent = Math.min(
    (currentPoints / CARD_TARGET_POINTS) * 100,
    100,
  );
  const cardComplete = currentPoints >= CARD_TARGET_POINTS;
  const customerName =
    typeof customer?.customer_name === "string"
      ? customer.customer_name
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-blue-50">
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-8 sm:px-6">
        <div className="mb-6 flex justify-center">
          <Image
            src={BILCLEANIKEN_LOGO_URL}
            alt={copy.brandName}
            width={180}
            height={48}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </div>

        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              {copy.tagline}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {copy.brandName}
            </h1>
          </div>

          <div
            className="flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
            role="group"
            aria-label="Language"
          >
            {locales.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  locale === code
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
                aria-pressed={locale === code}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        {notFound ? (
          <section className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <svg
                  className="h-7 w-7 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9A3.75 3.75 0 1 1 8.25 9m7.5 0a3.75 3.75 0 1 0-7.5 0M4.5 19.5a8.25 8.25 0 0 1 15 0"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                {copy.customerNotFound}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                {copy.customerNotFoundHint}
              </p>
              <p className="mt-5 text-xs text-gray-400">
                {copy.phoneLabel}: {phone}
              </p>
            </div>
          </section>
        ) : (
          <section className="flex flex-1 flex-col justify-center gap-5">
            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-blue-900/5">
              <div className="border-b border-gray-100 bg-blue-700 px-6 py-4">
                {customerName && (
                  <p className="text-lg font-semibold text-white">
                    {customerName}
                  </p>
                )}
                <p className="text-xs font-medium uppercase tracking-wider text-blue-100">
                  {copy.phoneLabel}
                </p>
                <p className="mt-1 font-mono text-lg text-white">{phone}</p>
              </div>

              <div className="px-6 py-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                  {copy.yourPoints}
                </p>
                <p className="mt-4 text-8xl font-bold tabular-nums tracking-tight text-blue-800">
                  {currentPoints}
                </p>
                <p className="mt-2 text-base font-medium text-gray-500">
                  {copy.pointsUnit}
                </p>

                <div className="mt-8 text-left">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">
                      {cardComplete ? copy.cardComplete : copy.cardGoal}
                    </span>
                    <span className="tabular-nums font-semibold text-blue-800">
                      {Math.min(currentPoints, CARD_TARGET_POINTS)} /{" "}
                      {CARD_TARGET_POINTS}
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-gray-200"
                    role="progressbar"
                    aria-valuenow={Math.min(currentPoints, CARD_TARGET_POINTS)}
                    aria-valuemin={0}
                    aria-valuemax={CARD_TARGET_POINTS}
                    aria-label={copy.cardGoal}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${
                        cardComplete ? "bg-green-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>

            <WalletButtons phone={phone} copy={copy} />

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                    +1
                  </span>
                  {copy.exteriorWash}
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                    +2
                  </span>
                  {copy.fullService}
                </li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
