"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CustomerQr } from "@/components/loyalty/customer-qr";
import { StampGrid } from "@/components/loyalty/stamp-grid";
import { WalletButtons } from "@/components/loyalty/wallet-buttons";
import {
  BILCLEANIKEN_LOGO_URL,
  CARD_TARGET_POINTS,
  defaultLocale,
  formatGreeting,
  getLoyaltyCopy,
  isRtlLocale,
  locales,
  type Locale,
} from "@/lib/i18n/loyalty";
import { getStampsOnCard, isCardComplete } from "@/lib/loyalty/stamps";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

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

export function LoyaltyView({ phone, customer, configError }: LoyaltyViewProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [points, setPoints] = useState(customer?.points ?? 0);
  const [animatingStamp, setAnimatingStamp] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const prevPointsRef = useRef(points);

  const copy = getLoyaltyCopy(locale);
  const rtl = isRtlLocale(locale);
  const notFound = configError || !customer;
  const canonicalPhone = customer?.phone ?? phone;
  const customerName =
    typeof customer?.customer_name === "string"
      ? customer.customer_name
      : undefined;
  const stampsOnCard = getStampsOnCard(points);
  const cardComplete = isCardComplete(points);

  useEffect(() => {
    setPoints(customer?.points ?? 0);
    prevPointsRef.current = customer?.points ?? 0;
  }, [customer?.points]);

  useEffect(() => {
    if (!customer?.phone) return;

    let supabase;
    try {
      supabase = createBrowserSupabaseClient();
    } catch {
      return;
    }

    const channel = supabase
      .channel(`loyalty:${customer.phone}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "loyalty_data",
          filter: `phone=eq.${customer.phone}`,
        },
        (payload) => {
          const nextPoints =
            typeof payload.new === "object" &&
            payload.new !== null &&
            "points" in payload.new
              ? Number((payload.new as LoyaltyCustomer).points)
              : null;

          if (nextPoints === null || Number.isNaN(nextPoints)) return;

          setPoints((prev) => {
            if (nextPoints > prev) {
              const nextStampIndex = Math.min(nextPoints, CARD_TARGET_POINTS) - 1;
              setAnimatingStamp(nextStampIndex);
              setToast(copy.stampAdded);
              window.setTimeout(() => setAnimatingStamp(null), 900);
              window.setTimeout(() => setToast(null), 2500);

              if (
                nextPoints % CARD_TARGET_POINTS === 0 &&
                nextPoints >= CARD_TARGET_POINTS
              ) {
                setShowCelebration(true);
                window.setTimeout(() => setShowCelebration(false), 1800);
              }
            }
            prevPointsRef.current = nextPoints;
            return nextPoints;
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [customer?.phone, copy.stampAdded]);

  return (
    <div
      className="loyalty-page min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50"
      dir={rtl ? "rtl" : "ltr"}
    >
      {toast && (
        <div className="stamp-toast fixed start-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      {showCelebration && (
        <div className="celebration-overlay pointer-events-none fixed inset-0 z-40" aria-hidden />
      )}

      <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Image
            src={BILCLEANIKEN_LOGO_URL}
            alt={copy.brandName}
            width={160}
            height={44}
            className="h-9 w-auto"
            priority
          />

          <div
            className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
            role="group"
            aria-label="Language"
          >
            {locales.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  locale === code
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
                aria-pressed={locale === code}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {notFound ? (
          <section className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
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
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {copy.customerNotFoundHint}
              </p>
              <p className="mt-5 text-xs text-slate-400">
                {copy.phoneLabel}: {phone}
              </p>
            </div>
          </section>
        ) : (
          <section className="flex flex-1 flex-col gap-5 pb-8">
            <article className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-900 p-6 text-white shadow-xl shadow-blue-900/20">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                {copy.tagline}
              </p>
              <h1 className="mt-2 text-2xl font-bold">
                {formatGreeting(copy, customerName)}
              </h1>
              <p className="mt-2 text-sm text-blue-100">
                {cardComplete
                  ? copy.rewardUnlocked
                  : `${stampsOnCard}/${CARD_TARGET_POINTS} — ${copy.collectStamps}`}
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-blue-200">
                    {copy.totalPoints}
                  </p>
                  <p className="text-4xl font-bold tabular-nums">{points}</p>
                </div>
                <div className="text-end">
                  <p className="text-[10px] uppercase tracking-wider text-blue-200">
                    {copy.phoneLabel}
                  </p>
                  <p className="font-mono text-sm">{canonicalPhone}</p>
                </div>
              </div>
            </article>

            <StampGrid
              points={points}
              copy={copy}
              animatingIndex={animatingStamp}
            />

            <CustomerQr phone={canonicalPhone} copy={copy} />

            <WalletButtons phone={canonicalPhone} copy={copy} />

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                {copy.rulesTitle}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                    +1
                  </span>
                  {copy.exteriorWash}
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                    +2
                  </span>
                  {copy.fullService}
                </li>
              </ul>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
