"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { LoyaltyCopy } from "@/lib/i18n/loyalty";
import { getCustomerCode, getLoyaltyQrPayload } from "@/lib/loyalty/stamps";

type CustomerQrProps = {
  phone: string;
  copy: LoyaltyCopy;
};

export function CustomerQr({ phone, copy }: CustomerQrProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const customerCode = getCustomerCode(phone);

  useEffect(() => {
    const payload = getLoyaltyQrPayload(phone);

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [phone]);

  function downloadQr() {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${customerCode}.png`;
    link.click();
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 5h4v4H4V5zm0 10h4v4H4v-4zm10-10h4v4h-4V5zm0 10h4v4h-4v-4z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{copy.myQrCode}</h3>
          <p className="text-xs text-slate-500">{copy.scanAtArrival}</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-inner">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt={copy.myQrCode}
              width={240}
              height={240}
              className="h-48 w-48"
            />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center text-sm text-slate-400">
              {copy.loading}
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-slate-500">{copy.showQrAtCheckout}</p>

        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-600">
          {copy.customerCode}: {customerCode}
        </span>

        <button
          type="button"
          onClick={downloadQr}
          disabled={!qrDataUrl}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
            />
          </svg>
          {copy.downloadQr}
        </button>
      </div>
    </article>
  );
}
