import { fetchLoyaltyCustomerByPhone } from "@/lib/wallet/fetch-loyalty-customer";
import { generateApplePassBuffer } from "@/lib/wallet/generate-apple-pass";
import { isPasskitConfigured } from "@/lib/wallet/passkit-certificates";

type RouteContext = {
  params: Promise<{ phone: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { phone: rawPhone } = await context.params;
  const phone = decodeURIComponent(rawPhone);

  const { customer, error } = await fetchLoyaltyCustomerByPhone(phone);

  if (error) {
    return Response.json(
      { error: { code: "CONFIG_ERROR", message: "Supabase is not configured" } },
      { status: 500 },
    );
  }

  if (!customer) {
    return Response.json(
      { error: { code: "NOT_FOUND", message: "Customer not found" } },
      { status: 404 },
    );
  }

  if (!isPasskitConfigured()) {
    return Response.json(
      {
        error: {
          code: "PASSKIT_NOT_CONFIGURED",
          message:
            "Apple Wallet certificates are missing. Set PASSKIT_* environment variables.",
        },
      },
      { status: 503 },
    );
  }

  try {
    const points =
      typeof customer.points === "number" ? customer.points : Number(customer.points);

    if (Number.isNaN(points)) {
      return Response.json(
        { error: { code: "INVALID_DATA", message: "Invalid points value" } },
        { status: 500 },
      );
    }

    const pkpass = await generateApplePassBuffer({
      phone: customer.phone,
      points,
      customerName:
        typeof customer.customer_name === "string"
          ? customer.customer_name
          : null,
    });

    return new Response(new Uint8Array(pkpass), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="bilcleaniken-${customer.phone}.pkpass"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (cause) {
    console.error("Failed to generate Apple Wallet pass:", cause);
    return Response.json(
      {
        error: {
          code: "PASS_GENERATION_FAILED",
          message: "Failed to generate Apple Wallet pass",
        },
      },
      { status: 500 },
    );
  }
}
