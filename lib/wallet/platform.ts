export type WalletPlatform = "apple" | "google" | "unknown";

export function detectWalletPlatform(userAgent: string): WalletPlatform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "apple";
  if (/Android/i.test(userAgent)) return "google";
  return "unknown";
}
