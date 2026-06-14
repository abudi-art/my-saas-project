"use client";

import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { StampGrid } from "@/components/loyalty/stamp-grid";
import {
  CARD_TARGET_POINTS,
  defaultLocale,
  getLoyaltyCopy,
  isRtlLocale,
  locales,
  type Locale,
} from "@/lib/i18n/loyalty";
import { getStaffCopy } from "@/lib/i18n/staff";
import { getStampsOnCard, parsePhoneFromQrPayload } from "@/lib/loyalty/stamps";

type CustomerPreview = {
  phone: string;
  points: number;
  customer_name?: string | null;
};

const SCANNER_ID = "staff-qr-scanner";

export function StaffScanView() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [staffKey, setStaffKey] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [stamps, setStamps] = useState(1);
  const [customer, setCustomer] = useState<CustomerPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const copy = getStaffCopy(locale);
  const loyaltyCopy = getLoyaltyCopy(locale);
  const rtl = isRtlLocale(locale);

  const lookupCustomer = useCallback(
    async (rawPhone: string) => {
      if (!staffKey.trim()) {
        setError(copy.unauthorized);
        return;
      }

      setLoading(true);
      setError(null);
      setMessage(null);

      try {
        const response = await fetch(
          `/api/loyalty/stamp?phone=${encodeURIComponent(rawPhone)}`,
          { headers: { "X-Staff-Key": staffKey.trim() } },
        );
        const data = await response.json();

        if (!response.ok) {
          setCustomer(null);
          setError(data.error === "Customer not found" ? copy.notFound : copy.apiError);
          return;
        }

        setCustomer(data.customer);
        setPhone(data.customer.phone);
        setMessage(copy.customerFound);
      } catch {
        setError(copy.apiError);
      } finally {
        setLoading(false);
      }
    },
    [staffKey, copy],
  );

  async function addStamps() {
    if (!phone.trim()) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/loyalty/stamp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Staff-Key": staffKey.trim(),
        },
        body: JSON.stringify({
          phone: phone.trim(),
          stamps,
          transactionId: transactionId.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          response.status === 401
            ? copy.unauthorized
            : data.error === "Customer not found"
              ? copy.notFound
              : copy.apiError,
        );
        return;
      }

      setCustomer({
        phone: data.phone,
        points: data.points,
        customer_name: data.customerName,
      });
      setMessage(copy.success);
    } catch {
      setError(copy.apiError);
    } finally {
      setLoading(false);
    }
  }

  async function startCamera() {
    if (cameraActive) return;

    try {
      const scanner = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          const parsedPhone = parsePhoneFromQrPayload(decoded);
          if (parsedPhone) {
            void lookupCustomer(parsedPhone);
            void stopCamera();
          }
        },
        () => undefined,
      );
      setCameraActive(true);
      setError(null);
    } catch {
      setError(copy.cameraError);
    }
  }

  async function stopCamera() {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch {
      // Scanner may already be stopped.
    }

    scannerRef.current = null;
    setCameraActive(false);
  }

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-950 text-white"
      dir={rtl ? "rtl" : "ltr"}
    >
      <main className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <Link
              href="/"
              className="text-xs text-slate-400 transition hover:text-white"
            >
              ← Bilcleaniken
            </Link>
            <h1 className="mt-2 text-2xl font-bold">{copy.title}</h1>
            <p className="mt-1 text-sm text-slate-400">{copy.subtitle}</p>
          </div>

          <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
            {locales.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  locale === code
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
            {copy.staffKeyPlaceholder}
          </span>
          <input
            type="password"
            value={staffKey}
            onChange={(event) => setStaffKey(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none ring-blue-500 focus:ring-2"
            autoComplete="off"
          />
        </label>

        <div className="mb-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div id={SCANNER_ID} className="min-h-[220px]" />
          {!cameraActive && (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-slate-400">{copy.scanning}</p>
              <button
                type="button"
                onClick={() => void startCamera()}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
              >
                {copy.startCamera}
              </button>
            </div>
          )}
          {cameraActive && (
            <div className="border-t border-slate-800 p-3">
              <button
                type="button"
                onClick={() => void stopCamera()}
                className="w-full rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
              >
                {copy.stopCamera}
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
              {copy.phonePlaceholder}
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none ring-blue-500 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
              {copy.transactionPlaceholder}
            </span>
            <input
              type="text"
              value={transactionId}
              onChange={(event) => setTransactionId(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none ring-blue-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
          <span className="text-sm text-slate-300">{copy.stampsToAdd}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStamps((value) => Math.max(1, value - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-lg hover:bg-slate-700"
            >
              −
            </button>
            <span className="min-w-8 text-center text-lg font-bold tabular-nums">
              {stamps}
            </span>
            <button
              type="button"
              onClick={() =>
                setStamps((value) => Math.min(CARD_TARGET_POINTS, value + 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-lg hover:bg-blue-500"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading || !phone.trim()}
            onClick={() => void lookupCustomer(phone.trim())}
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold hover:bg-slate-900 disabled:opacity-50"
          >
            {copy.lookupCustomer}
          </button>
          <button
            type="button"
            disabled={loading || !phone.trim() || !staffKey.trim()}
            onClick={() => void addStamps()}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "…" : copy.addStamp}
          </button>
        </div>

        {message && (
          <p className="mt-4 rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}

        {customer && (
          <section className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm font-semibold text-white">
                {customer.customer_name ?? customer.phone}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-400">
                {customer.phone}
              </p>
              <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">
                {copy.currentStamps}
              </p>
              <p className="text-2xl font-bold tabular-nums">
                {getStampsOnCard(customer.points)}/{CARD_TARGET_POINTS}
              </p>
            </div>

            <StampGrid points={customer.points} copy={loyaltyCopy} />
          </section>
        )}
      </main>
    </div>
  );
}
