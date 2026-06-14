"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomerQr } from "@/components/loyalty/customer-qr";
import { StampGrid } from "@/components/loyalty/stamp-grid";
import { WalletButtons } from "@/components/loyalty/wallet-buttons";
import {
  BILCLEANIKEN_BADGE_URL,
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
  appUrl?: string;
};

function LanguageSwitcher({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="loyalty-lang-switcher" role="group" aria-label="Language">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={
            locale === code ? "loyalty-lang-btn loyalty-lang-btn--active" : "loyalty-lang-btn"
          }
          aria-pressed={locale === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function HeroHeaderRow({
  locale,
  onLocaleChange,
  copy,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  copy: ReturnType<typeof getLoyaltyCopy>;
}) {
  return (
    <header className="loyalty-top-bar">
      <div className="loyalty-logo-badge-wrap">
        <Image
          src={BILCLEANIKEN_BADGE_URL}
          alt={copy.brandName}
          width={176}
          height={52}
          className="loyalty-logo-official h-9 w-auto sm:h-10"
          priority
        />
      </div>
      <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
    </header>
  );
}

export function LoyaltyView({ phone, customer, configError, appUrl }: LoyaltyViewProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [points, setPoints] = useState(customer?.points ?? 0);
  const [animatingStamp, setAnimatingStamp] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stampGridPulse, setStampGridPulse] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);
  const prevPointsRef = useRef(points);
  const toastTimerRef = useRef<number | null>(null);
  const animTimerRef = useRef<number | null>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const celebrationTimerRef = useRef<number | null>(null);

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

  const triggerStampFeedback = useCallback(
    (prev: number, nextPoints: number) => {
      if (nextPoints <= prev) return;

      const stampIndex = getStampsOnCard(nextPoints) - 1;
      setAnimatingStamp(stampIndex);
      setStampGridPulse(true);
      setToast(copy.stampAdded);

      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (celebrationTimerRef.current) {
        window.clearTimeout(celebrationTimerRef.current);
      }

      animTimerRef.current = window.setTimeout(() => setAnimatingStamp(null), 900);
      pulseTimerRef.current = window.setTimeout(() => setStampGridPulse(false), 700);
      toastTimerRef.current = window.setTimeout(() => setToast(null), 2500);

      if (
        nextPoints % CARD_TARGET_POINTS === 0 &&
        nextPoints >= CARD_TARGET_POINTS
      ) {
        setShowCelebration(true);
        celebrationTimerRef.current = window.setTimeout(
          () => setShowCelebration(false),
          1800,
        );
      }
    },
    [copy.stampAdded],
  );

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
            triggerStampFeedback(prev, nextPoints);
            prevPointsRef.current = nextPoints;
            return nextPoints;
          });
        },
      )
      .subscribe((status) => {
        setLiveConnected(status === "SUBSCRIBED");
      });

    return () => {
      setLiveConnected(false);
      void supabase.removeChannel(channel);
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (celebrationTimerRef.current) {
        window.clearTimeout(celebrationTimerRef.current);
      }
    };
  }, [customer?.phone, triggerStampFeedback]);

  return (
    <div
      className="loyalty-page"
      dir={rtl ? "rtl" : "ltr"}
    >
      {toast && (
        <div className="stamp-toast fixed start-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {showCelebration && (
        <div className="celebration-overlay pointer-events-none fixed inset-0 z-40" aria-hidden />
      )}

      <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6 sm:px-6">
        {notFound ? (
          <>
            <article className="loyalty-hero-card overflow-hidden rounded-3xl shadow-xl shadow-blue-900/20">
              <HeroHeaderRow
                locale={locale}
                onLocaleChange={setLocale}
                copy={copy}
              />
            </article>

            <section className="mt-5 flex flex-1 flex-col items-center justify-center">
              <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
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
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                  {copy.customerNotFoundHint}
                </p>
                <p className="mt-5 text-xs font-medium text-slate-400">
                  {copy.phoneLabel}: {phone}
                </p>
              </div>
            </section>
          </>
        ) : (
          <section className="flex flex-1 flex-col gap-4 pb-8">
            <article className="loyalty-hero-card overflow-hidden rounded-3xl shadow-xl shadow-blue-900/20">
              <HeroHeaderRow
                locale={locale}
                onLocaleChange={setLocale}
                copy={copy}
              />

              <div className="loyalty-hero-body text-white">
                <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-200/90">
                  {copy.tagline}
                </p>
                {liveConnected && (
                  <span
                    className="loyalty-live-badge inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-400/30"
                    aria-live="polite"
                  >
                    <span className="loyalty-live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {copy.liveSync}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-[1.65rem]">
                {formatGreeting(copy, customerName)}
              </h1>
              <p className="mt-2 text-sm font-medium text-blue-100/90">
                {cardComplete
                  ? copy.rewardUnlocked
                  : `${stampsOnCard}/${CARD_TARGET_POINTS} — ${copy.collectStamps}`}
              </p>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-blue-200/80">
                    {copy.totalPoints}
                  </p>
                  <p className="text-4xl font-semibold tabular-nums tracking-tight">
                    {points}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-blue-200/80">
                    {copy.stampsLabel}
                  </p>
                  <p className="text-2xl font-semibold tabular-nums tracking-tight">
                    {stampsOnCard}/{CARD_TARGET_POINTS}
                  </p>
                </div>
                <div className="w-full text-end sm:w-auto">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-blue-200/80">
                    {copy.phoneLabel}
                  </p>
                  <p className="font-mono text-sm font-medium">{canonicalPhone}</p>
                </div>
              </div>
              </div>
            </article>

            <CustomerQr phone={canonicalPhone} copy={copy} appUrl={appUrl} />

            <div className={stampGridPulse ? "stamp-grid-sync-pulse" : undefined}>
              <StampGrid
                points={points}
                copy={copy}
                animatingIndex={animatingStamp}
              />
            </div>

            <WalletButtons phone={canonicalPhone} copy={copy} />

            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-slate-800">
                {copy.rulesTitle}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-700">
                    +1
                  </span>
                  {copy.exteriorWash}
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
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
