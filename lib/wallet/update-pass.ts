/**
 * Phase 2: push updated pass data to Apple (APNs) and Google Wallet.
 * Called automatically from the Supabase loyalty webhook.
 */
export type LoyaltyWalletPayload = {
  phone: string;
  points: number;
  customerName?: string;
};

export async function pushWalletPassUpdate(
  payload: LoyaltyWalletPayload,
): Promise<void> {
  // TODO: Apple — send empty APNs push so device re-fetches .pkpass
  // TODO: Google — PATCH LoyaltyObject with new points / progress
  console.log("wallet pass update queued (Phase 2)", payload);
}
