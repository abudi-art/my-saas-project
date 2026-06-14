import { createClient } from "@supabase/supabase-js";
import { CARD_TARGET_POINTS } from "@/lib/i18n/loyalty";
import { getPhoneLookupVariants } from "@/lib/phone/normalize";

type EnrollRequest = {
  phone?: string;
  platform?: "apple" | "google";
};

export async function POST(request: Request) {
  let body: EnrollRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { phone, platform } = body;
  if (!phone || !platform) {
    return Response.json(
      { error: "phone and platform are required" },
      { status: 400 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const lookupVariants = getPhoneLookupVariants(phone);
  const { data } = await supabase
    .from("loyalty_data")
    .select("*")
    .in("phone", lookupVariants)
    .limit(1);

  const customer = data?.[0];
  if (!customer) {
    return Response.json({ error: "Customer not found" }, { status: 404 });
  }

  // Phase 2: return .pkpass file (Apple) or Google Wallet Save JWT URL
  if (platform === "apple") {
    return Response.json(
      {
        status: "not_implemented",
        message:
          "Apple Wallet enrollment requires Pass Type ID certificates. Configure PASSKIT_* env vars in Phase 2.",
        customer: {
          phone: customer.phone,
          points: customer.points,
          target: CARD_TARGET_POINTS,
        },
      },
      { status: 501 },
    );
  }

  return Response.json(
    {
      status: "not_implemented",
      message:
        "Google Wallet enrollment requires a service account. Configure GOOGLE_WALLET_* env vars in Phase 2.",
      customer: {
        phone: customer.phone,
        points: customer.points,
        target: CARD_TARGET_POINTS,
      },
    },
    { status: 501 },
  );
}
