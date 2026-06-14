import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getPhoneLookupVariants } from "@/lib/phone/normalize";
import { pushWalletPassUpdate } from "@/lib/wallet/update-pass";

const stampRequestSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  stamps: z.number().int().min(1).max(12).default(1),
  transactionId: z.string().trim().optional(),
});

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function notConfigured() {
  return Response.json(
    { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
    { status: 503 },
  );
}

export async function POST(request: Request) {
  const staffKey = request.headers.get("x-staff-key")?.trim();
  const expectedKey = process.env.STAFF_API_KEY?.trim();

  if (!expectedKey || staffKey !== expectedKey) {
    return unauthorized();
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return notConfigured();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = stampRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { phone, stamps, transactionId } = parsed.data;
  const lookupVariants = getPhoneLookupVariants(phone);

  const { data: existingRows, error: lookupError } = await supabase
    .from("loyalty_data")
    .select("*")
    .in("phone", lookupVariants)
    .limit(1);

  if (lookupError) {
    return Response.json({ error: lookupError.message }, { status: 500 });
  }

  const existing = existingRows?.[0];
  if (!existing) {
    return Response.json({ error: "Customer not found" }, { status: 404 });
  }

  const nextPoints = Number(existing.points ?? 0) + stamps;

  const { data: updated, error: updateError } = await supabase
    .from("loyalty_data")
    .update({ points: nextPoints })
    .eq("phone", existing.phone)
    .select("*")
    .single();

  if (updateError || !updated) {
    return Response.json(
      { error: updateError?.message ?? "Update failed" },
      { status: 500 },
    );
  }

  void pushWalletPassUpdate({
    phone: existing.phone,
    points: nextPoints,
    customerName:
      typeof existing.customer_name === "string"
        ? existing.customer_name
        : undefined,
  });

  return Response.json({
    phone: updated.phone,
    points: updated.points,
    stampsAdded: stamps,
    transactionId: transactionId ?? null,
    customerName: updated.customer_name ?? null,
  });
}

export async function GET(request: Request) {
  const staffKey = request.headers.get("x-staff-key")?.trim();
  const expectedKey = process.env.STAFF_API_KEY?.trim();

  if (!expectedKey || staffKey !== expectedKey) {
    return unauthorized();
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return notConfigured();
  }

  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");

  if (!phone) {
    return Response.json({ error: "phone query param is required" }, { status: 400 });
  }

  const lookupVariants = getPhoneLookupVariants(phone);
  const { data, error } = await supabase
    .from("loyalty_data")
    .select("*")
    .in("phone", lookupVariants)
    .limit(1);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const customer = data?.[0];
  if (!customer) {
    return Response.json({ error: "Customer not found" }, { status: 404 });
  }

  return Response.json({ customer });
}
