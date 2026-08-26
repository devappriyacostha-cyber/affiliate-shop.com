import { db } from "@/db";
import { clickLogs, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isFinite(id)) return NextResponse.redirect(new URL("/", request.url));

  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product?.affiliateUrl) return NextResponse.redirect(new URL(`/product/${id}`, request.url));

  try {
    const h = await headers();
    await db.insert(clickLogs).values({
      productId: id,
      userAgent: h.get("user-agent"),
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    });
    await db.update(products).set({ clicks: sql`${products.clicks} + 1` }).where(eq(products.id, id));
  } catch (error) {
    console.error("Affiliate analytics error:", error);
  }

  return NextResponse.redirect(product.affiliateUrl);
}
