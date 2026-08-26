import { db } from '@/db';
import { categories } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cats = await db.query.categories.findMany({
      orderBy: [asc(categories.order)],
    });
    return NextResponse.json(cats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
