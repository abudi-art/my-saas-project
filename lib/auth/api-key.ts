import type { Merchant } from "@/app/generated/prisma/client";
import { db } from "@/lib/db";
import { unauthorizedError } from "@/lib/api/errors";

export type AuthenticatedMerchant = {
  merchant: Merchant;
};

export type AuthResult =
  | AuthenticatedMerchant
  | { error: Response };

function extractApiKey(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim() || null;
  }

  const apiKey = request.headers.get("x-api-key");
  return apiKey?.trim() || null;
}

export async function authenticateMerchant(
  request: Request,
): Promise<AuthResult> {
  const apiKey = extractApiKey(request);
  if (!apiKey) {
    return { error: unauthorizedError() };
  }

  const merchant = await db.merchant.findUnique({
    where: { apiKey },
  });

  if (!merchant) {
    return { error: unauthorizedError() };
  }

  return { merchant };
}
