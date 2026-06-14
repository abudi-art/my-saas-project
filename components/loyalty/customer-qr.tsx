"use client";

import { useEffect, useState } from "react";
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
  width: 260,
};

export function CustomerQr({ phone, copy, appUrl }: CustomerQrProps) {
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const customerCode = getCustomerCode(phone);

  useEffect(() => {
    const url = buildLoyaltyPageUrl(phone, appUrl);
    setQrPayload(url);
    if (!url) {
      setQrSvg(null);
      setQrError(copy.qrLinkError);
    }
  }, [phone, appUrl, copy.qrLinkError]);

  useEffect(() => {
    if (!qrPayload) return;

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
          setQrError(copy.qrGenerateError);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [qrPayload, copy.qrGenerateError]);

  async function downloadQr() {
    if (!qrPayload) return;

    try {
      const dataUrl = await QRCode.toDataURL(qrPayload, QR_OPTIONS);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${customerCode}.png`;
      link.click();
    } catch {
      setQrError(copy.qrGenerateError);
    }
  }

  return (
    <article className="loyalty-qr-card rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 text-center">
        <h3 className="text-base font-medium text-slate-800">{copy.myQrCode}</h3>
        <p className="mt-1 text-sm font-medium text-slate-500">{copy.scanAtArrival}</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="loyalty-qr-frame">
          {qrSvg ? (
            <div
              className="loyalty-qr-svg"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
              aria-label={copy.myQrCode}
            />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center px-4 text-center text-sm font-medium text-slate-400">
              {qrError ?? copy.loading}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm font-medium text-slate-500">
          {copy.showQrAtCheckout}
        </p>

        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-medium text-slate-600">
          {copy.customerCode}: {customerCode}
        </span>

        {qrPayload && (
          <p className="mt-3 max-w-full break-all px-2 text-center font-mono text-[10px] font-medium leading-relaxed text-slate-400">
            {qrPayload}
          </p>
        )}

        <button
          type="button"
          onClick={() => void downloadQr()}
          disabled={!qrPayload}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
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
