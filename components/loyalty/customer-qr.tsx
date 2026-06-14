"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import type { LoyaltyCopy } from "@/lib/i18n/loyalty";
import {
  buildLoyaltyPageUrl,
  getCustomerCode,
} from "@/lib/loyalty/stamps";

type CustomerQrProps = {
  phone: string;
  copy: LoyaltyCopy;
  appUrl?: string;
};

const QR_OPTIONS = {
  errorCorrectionLevel: "H" as const,
  margin: 4,
  color: { dark: "#000000", light: "#ffffff" },
  width: 280,
};

export function CustomerQr({ phone, copy, appUrl }: CustomerQrProps) {
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const customerCode = getCustomerCode(phone);

  const qrPayload = useMemo(() => {
    const fromProp = appUrl?.trim().replace(/\/$/, "");
    if (fromProp) {
      return buildLoyaltyPageUrl(phone, fromProp);
    }

    if (typeof window !== "undefined") {
      return buildLoyaltyPageUrl(phone, window.location.origin);
    }

    return null;
  }, [phone, appUrl]);

  useEffect(() => {
    if (!qrPayload) {
      setQrSvg(null);
      setQrError("NEXT_PUBLIC_APP_URL is not configured");
      return;
    }

    let cancelled = false;

    QRCode.toString(qrPayload, { type: "svg", ...QR_OPTIONS })
      .then((svg) => {
        if (!cancelled) {
          setQrSvg(svg);
          setQrError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrSvg(null);
          setQrError(copy.walletError);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [qrPayload, copy.walletError]);

  async function downloadQr() {
    if (!qrPayload) return;

    try {
      const dataUrl = await QRCode.toDataURL(qrPayload, QR_OPTIONS);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${customerCode}.png`;
      link.click();
    } catch {
      setQrError(copy.walletError);
    }
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
        <div className="loyalty-qr-frame rounded-2xl shadow-inner">
          {qrSvg ? (
            <div
              className="loyalty-qr-svg"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
              aria-label={copy.myQrCode}
            />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center px-4 text-center text-sm text-slate-400">
              {qrError ?? copy.loading}
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500">{copy.showQrAtCheckout}</p>

        {qrPayload && (
          <p className="mt-2 max-w-full break-all px-2 text-center font-mono text-[10px] leading-relaxed text-slate-400">
            {qrPayload}
          </p>
        )}

        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-600">
          {copy.customerCode}: {customerCode}
        </span>

        <button
          type="button"
          onClick={() => void downloadQr()}
          disabled={!qrPayload}
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
