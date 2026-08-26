import { db } from "@/db";
import { products } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const suggestions = await db.query.products.findMany({
      where: ilike(products.name, `%${q}%`),
      columns: { id: true, name: true, price: true, imageUrls: true },
      limit: 6,
    });
    return NextResponse.json(suggestions, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
