import { db } from "@/db";
import { banners } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.query.banners.findMany({
      // isActive වෙනුවට isEnabled ලෙස වෙනස් කරන ලදී
      where: eq(banners.isEnabled, true),
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
