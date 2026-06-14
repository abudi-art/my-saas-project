import { authenticateMerchant } from "@/lib/auth/api-key";
import {
  conflictError,
  forbiddenError,
  internalError,
  notFoundError,
  validationError,
} from "@/lib/api/errors";
import { db } from "@/lib/db";
import { createPassSchema } from "@/lib/validators/passes";

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

  const parsed = createPassSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.errors[0]?.message ?? "Invalid request body");
  }

  const { programId, customerIdentifier } = parsed.data;

  const program = await db.loyaltyProgram.findUnique({
    where: { id: programId },
  });

  if (!program) {
    return notFoundError("Loyalty program not found");
  }

  if (program.merchantId !== auth.merchant.id) {
    return forbiddenError("Program does not belong to this merchant");
  }

  try {
    const pass = await db.pass.create({
      data: {
        programId,
        customerIdentifier,
      },
    });

    return Response.json(
      {
        passId: pass.id,
        programId: pass.programId,
        customerIdentifier: pass.customerIdentifier,
        stampCount: pass.stampCount,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return conflictError("Pass already exists for this customer and program");
    }

    return internalError();
  }
}
