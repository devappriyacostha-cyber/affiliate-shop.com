import type { MetadataRoute } from "next";
import { db } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [productList, categoryList] = await Promise.all([
    db.query.products.findMany({ columns: { id: true, updatedAt: true } }),
    db.query.categories.findMany({ columns: { slug: true } }),
  ]);

  const entries = [
    { url: base, changeFrequency: "daily" as const, priority: 1 },

    ...categoryList.map((c) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),

    ...productList.map((p) => ({
      url: `${base}/product/${p.id}`,
      lastModified: p.updatedAt ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ] satisfies MetadataRoute.Sitemap;

  return entries;
}
