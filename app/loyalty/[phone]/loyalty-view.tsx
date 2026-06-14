"use client";

import { useState } from "react";
import {
  defaultLocale,
  getLoyaltyCopy,
  locales,
  type Locale,
} from "@/lib/i18n/loyalty";

type LoyaltyCustomer = {
  phone: string;
  points: number;
  [key: string]: unknown;
};

type LoyaltyViewProps = {
  phone: string;
  customer: LoyaltyCustomer | null;
  configError?: boolean;
};

export function LoyaltyView({ phone, customer, configError }: LoyaltyViewProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const copy = getLoyaltyCopy(locale);

  const notFound = configError || !customer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-blue-50">
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-8 sm:px-6">
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
                <p className="text-xs font-medium uppercase tracking-wider text-blue-100">
                  {copy.phoneLabel}
                </p>
                <p className="mt-1 font-mono text-lg text-white">{phone}</p>
              </div>

              <div className="px-6 py-12 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                  {copy.yourPoints}
                </p>
                <p className="mt-4 text-8xl font-bold tabular-nums tracking-tight text-blue-800">
                  {customer.points}
                </p>
                <p className="mt-2 text-base font-medium text-gray-500">
                  {copy.pointsUnit}
                </p>
              </div>
            </article>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    ✦
                  </span>
                  {copy.exteriorWash}
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    ✦
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
