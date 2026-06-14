import { pushWalletPassUpdate } from "@/lib/wallet/update-pass";

type SupabaseWebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: {
    phone?: string;
    points?: number;
    customer_name?: string;
  } | null;
  old_record: {
    phone?: string;
    points?: number;
  } | null;
};

function verifyWebhookSecret(request: Request): boolean {
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!secret) return false;
  return request.headers.get("x-webhook-secret") === secret;
}

export async function POST(request: Request) {
  if (!verifyWebhookSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: SupabaseWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.table !== "loyalty_data" || payload.type === "DELETE") {
    return Response.json({ ok: true, skipped: true });
  }

  const record = payload.record;
  if (!record?.phone || typeof record.points !== "number") {
    return Response.json({ error: "Missing phone or points" }, { status: 400 });
  }

  // Fire-and-forget wallet update (Phase 2: APNs + Google Wallet API)
  void pushWalletPassUpdate({
    phone: record.phone,
    points: record.points,
    customerName: record.customer_name,
  });

  return Response.json({ ok: true });
}
