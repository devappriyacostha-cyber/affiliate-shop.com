import { db } from "@/db";
import { banners, categories, products, settings } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getCategories = unstable_cache(
  async () =>
    db.query.categories.findMany({
      where: eq(categories.isEnabled, true),
      orderBy: [asc(categories.order), asc(categories.name)],
    }),
  ["categories-list"],
  { revalidate: 300, tags: ["categories"] },
);

export const getEnabledCategories = getCategories;

export const getActiveBanners = unstable_cache(
  async () =>
    db.query.banners.findMany({
      where: eq(banners.isEnabled, true),
      orderBy: [asc(banners.order), desc(banners.id)],
    }),
  ["active-banners"],
  { revalidate: 300, tags: ["banners"] },
);

export const getSiteSettings = unstable_cache(
  async () => {
    const rows = await db.select().from(settings);
    return rows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value ?? "";
      return acc;
    }, {});
  },
  ["site-settings"],
  { revalidate: 300, tags: ["settings"] },
);

export const getProductById = (id: number) =>
  db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true },
  });

export const getCategoryBySlug = (slug: string) =>
  db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

export const getProductsByCategoryId = (categoryId: number) =>
  db.query.products.findMany({
    where: eq(products.categoryId, categoryId),
    orderBy: [desc(products.createdAt)],
  });
