import { authenticateMerchant } from "@/lib/auth/api-key";
import { forbiddenError, notFoundError } from "@/lib/api/errors";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ passId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await authenticateMerchant(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { passId } = await context.params;

  const pass = await db.pass.findUnique({
    where: { id: passId },
    include: {
      program: true,
    },
  });

  if (!pass) {
    return notFoundError("Pass not found");
  }

  if (pass.program.merchantId !== auth.merchant.id) {
    return forbiddenError("Pass does not belong to this merchant");
  }

  return Response.json({
    passId: pass.id,
    programId: pass.programId,
    customerIdentifier: pass.customerIdentifier,
    stampCount: pass.stampCount,
    stampThreshold: pass.program.stampThreshold,
    rewardDescription: pass.program.rewardDescription,
    lastVisitedAt: pass.lastVisitedAt,
    pushNotificationsEnabled: pass.pushNotificationsEnabled,
  });
}
