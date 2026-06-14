import { CARD_TARGET_POINTS } from "@/lib/i18n/loyalty";

export function getStampsOnCard(points: number): number {
  if (points <= 0) return 0;
  const remainder = points % CARD_TARGET_POINTS;
  return remainder === 0 && points >= CARD_TARGET_POINTS
    ? CARD_TARGET_POINTS
    : remainder;
}

export function isCardComplete(points: number): boolean {
  return points > 0 && points % CARD_TARGET_POINTS === 0;
}

export function getCardProgressPercent(points: number): number {
  return Math.min((getStampsOnCard(points) / CARD_TARGET_POINTS) * 100, 100);
}

export function getCustomerCode(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const suffix = digits.slice(-8).toUpperCase() || "00000000";
  return `BIL-${suffix}`;
}

export function resolveAppBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "";
}

export function buildLoyaltyPageUrl(phone: string, appUrl?: string): string | null {
  const base = (appUrl ?? resolveAppBaseUrl()).replace(/\/$/, "");
  if (!base) return null;

  const normalizedPhone = decodeURIComponent(phone.trim());
  return `${base}/loyalty/${encodeURIComponent(normalizedPhone)}`;
}

export function getLoyaltyQrPayload(phone: string, appUrl?: string): string {
  const url = buildLoyaltyPageUrl(phone, appUrl);
  if (!url) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  }
  return url;
}

export function parsePhoneFromQrPayload(payload: string): string | null {
  const trimmed = payload.trim();

  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/loyalty\/([^/?#]+)/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch {
    // Not a URL — fall through to raw phone/code parsing.
  }

  if (trimmed.startsWith("BIL-")) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 7) {
    return trimmed;
  }

  return null;
}
