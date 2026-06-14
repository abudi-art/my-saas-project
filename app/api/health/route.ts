import { db } from "@/lib/db";
import { internalError } from "@/lib/api/errors";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" });
  } catch {
    return internalError("Database connection failed");
  }
}
