import { authenticateMerchant } from "@/lib/auth/api-key";
import {
  forbiddenError,
  internalError,
  notFoundError,
  validationError,
} from "@/lib/api/errors";
import { db } from "@/lib/db";
import { scanStampSchema } from "@/lib/validators/stamps";
import { dispatchWalletUpdate } from "@/lib/wallet/dispatch-update";

export async function POST(request: Request) {
  const auth = await authenticateMerchant(request);
  if ("error" in auth) {
    return auth.error;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError("Request body must be valid JSON");
  }

  const parsed = scanStampSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.errors[0]?.message ?? "Invalid request body");
  }

  const { passId } = parsed.data;

  const pass = await db.pass.findUnique({
    where: { id: passId },
    include: { program: true },
  });

  if (!pass) {
    return notFoundError("Pass not found");
  }

  if (pass.program.merchantId !== auth.merchant.id) {
    return forbiddenError("Pass does not belong to this merchant");
  }

  try {
    const updatedPass = await db.$transaction(async (tx) => {
      const nextPass = await tx.pass.update({
        where: { id: passId },
        data: {
          stampCount: { increment: 1 },
          lastVisitedAt: new Date(),
        },
      });

      await tx.stampEvent.create({
        data: {
          passId,
          merchantId: auth.merchant.id,
        },
      });

      return nextPass;
    });

    void dispatchWalletUpdate(passId);

    return Response.json({
      passId: updatedPass.id,
      stampCount: updatedPass.stampCount,
      stampThreshold: pass.program.stampThreshold,
      rewardDescription: pass.program.rewardDescription,
      rewardEarned: updatedPass.stampCount >= pass.program.stampThreshold,
    });
  } catch {
    return internalError();
  }
}
