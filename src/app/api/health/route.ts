import { db } from "@/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("DB HOST:", new URL(process.env.DATABASE_URL!).host);
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("DB HEALTH ERROR:", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
