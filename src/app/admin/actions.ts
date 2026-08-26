"use server";

import { db } from "@/db";
import {
  banners,
  categories,
  clickLogs,
  products,
  settings,
  users,
} from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import { isValidAdminToken, COOKIE_NAME } from "@/lib/auth";

const PRODUCT_PATHS = ["/", "/search"];
const ADMIN_PATHS = ["/admin"];

async function requireAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!isValidAdminToken(token)) throw new Error("Unauthorized");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function cleanUrl(value: unknown) {
  const url = String(value ?? "").trim();
  if (!url) return "";
  return url;
}

function calculateDiscount(originalPrice: unknown, price: unknown) {
  const original = Number(originalPrice);
  const current = Number(price);
  if (!Number.isFinite(original) || !Number.isFinite(current) || original <= 0 || current >= original) {
    return 0;
  }
  return Math.max(0, Math.round(((original - current) / original) * 100));
}

function revalidateAll() {
  for (const path of [...PRODUCT_PATHS, ...ADMIN_PATHS]) revalidatePath(path);
  revalidateTag("categories", "max");
  revalidateTag("banners", "max");
  revalidateTag("settings", "max");
}

export async function login(password: string) {
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) throw new Error("ADMIN_PASSWORD is not configured");
  if (password !== adminPass) return { success: false };

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const token = createHmac("sha256", secret).update("authenticated").digest("hex");
  const store = await cookies();

  store.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function logout() {
  (await cookies()).delete("admin_session");
}

export async function addProduct(data: Record<string, unknown>) {
  await requireAdmin();
  const price = String(data.price ?? "0");
  const originalPrice = data.originalPrice ? String(data.originalPrice) : null;
  const images = Array.isArray(data.imageUrls)
    ? data.imageUrls.map(String).filter(Boolean)
    : String(data.imageUrls ?? "").split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean);

  await db.insert(products).values({
    name: String(data.name ?? "").trim(),
    shortName: String(data.shortName ?? "").trim() || null,
    description: String(data.description ?? "").trim() || null,
    brand: String(data.brand ?? "").trim() || null,
    price,
    originalPrice,
    discountPercent: calculateDiscount(originalPrice, price),
    discountLabel: calculateDiscount(originalPrice, price) > 0 ? `${calculateDiscount(originalPrice, price)}% OFF` : null,
    categoryId: data.categoryId ? Number(data.categoryId) : null,
    affiliateUrl: cleanUrl(data.affiliateUrl),
    imageUrls: images,
    isFeatured: Boolean(data.isFeatured),
    isHot: Boolean(data.isHot),
    rating: String(data.rating ?? "0"),
  });

  revalidateAll();
}

export async function updateProduct(id: number, data: Record<string, unknown>) {
  await requireAdmin();
  const price = String(data.price ?? "0");
  const originalPrice = data.originalPrice ? String(data.originalPrice) : null;
  const discount = calculateDiscount(originalPrice, price);
  const images = Array.isArray(data.imageUrls)
    ? data.imageUrls.map(String).filter(Boolean)
    : String(data.imageUrls ?? "").split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean);

  await db.update(products).set({
    name: String(data.name ?? "").trim(),
    shortName: String(data.shortName ?? "").trim() || null,
    description: String(data.description ?? "").trim() || null,
    brand: String(data.brand ?? "").trim() || null,
    price,
    originalPrice,
    discountPercent: discount,
    discountLabel: discount > 0 ? `${discount}% OFF` : null,
    categoryId: data.categoryId ? Number(data.categoryId) : null,
    affiliateUrl: cleanUrl(data.affiliateUrl),
    imageUrls: images,
    isFeatured: Boolean(data.isFeatured),
    isHot: Boolean(data.isHot),
    rating: String(data.rating ?? "0"),
    updatedAt: new Date(),
  }).where(eq(products.id, id));

  revalidateAll();
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, id));
  revalidateAll();
}

export async function upsertCategory(data: Record<string, unknown>) {
  await requireAdmin();
  const name = String(data.name ?? "").trim();
  const slug = slugify(String(data.slug ?? name));
  if (!name) throw new Error("Category name is required");

  const values = {
    name,
    slug,
    icon: String(data.icon ?? "").trim() || null,
    order: Number(data.order ?? 0),
    isEnabled: data.isEnabled !== false,
  };

  if (data.id) {
    await db.update(categories).set(values).where(eq(categories.id, Number(data.id)));
  } else {
    await db.insert(categories).values(values);
  }
  revalidateAll();
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, id));
  revalidateAll();
}

export async function upsertBanner(data: Record<string, unknown>) {
  await requireAdmin();
  const values = {
    imageUrl: cleanUrl(data.imageUrl),
    title: String(data.title ?? "").trim() || null,
    subtitle: String(data.subtitle ?? "").trim() || null,
    buttonText: String(data.buttonText ?? "").trim() || null,
    buttonUrl: cleanUrl(data.buttonUrl) || "/",
    order: Number(data.order ?? 0),
    isEnabled: data.isEnabled !== false,
  };

  if (!values.imageUrl) throw new Error("Banner image URL is required");

  if (data.id) {
    await db.update(banners).set(values).where(eq(banners.id, Number(data.id)));
  } else {
    await db.insert(banners).values(values);
  }
  revalidateAll();
}

export async function deleteBanner(id: number) {
  await requireAdmin();
  await db.delete(banners).where(eq(banners.id, id));
  revalidateAll();
}

export async function updateSetting(key: string, value: string) {
  await requireAdmin();
  await db.insert(settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: new Date() },
    });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidateTag("settings", "max");
}

export async function updateSettings(values: Record<string, string>) {
  await requireAdmin();
  await db.transaction(async (tx) => {
    for (const [key, value] of Object.entries(values)) {
      await tx.insert(settings)
        .values({ key, value: String(value ?? ""), updatedAt: new Date() })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value: String(value ?? ""), updatedAt: new Date() },
        });
    }
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidateTag("settings", "max");
}

export async function deleteUser(id: number) {
  await requireAdmin();
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin");
}

export async function clearAllUsers() {
  await requireAdmin();
  await db.delete(users);
  revalidatePath("/admin");
}

export async function deleteClickLog(id: number) {
  await requireAdmin();
  await db.delete(clickLogs).where(eq(clickLogs.id, id));
  revalidatePath("/admin");
}

export async function updateClickLogProduct(id: number, productId: number) {
  await requireAdmin();
  await db.update(clickLogs).set({ productId }).where(eq(clickLogs.id, id));
  revalidatePath("/admin");
}

export async function clearAnalytics(period: "today" | "7days" | "30days" | "all" = "all") {
  await requireAdmin();
  if (period === "all") {
    await db.delete(clickLogs);
    await db.update(products).set({ clicks: 0 });
  } else {
    const days = period === "today" ? 0 : period === "7days" ? 7 : 30;
    const cutoff = new Date();
    if (days === 0) cutoff.setHours(0, 0, 0, 0);
    else cutoff.setDate(cutoff.getDate() - days);
    await db.delete(clickLogs).where(gte(clickLogs.clickedAt, cutoff));
    const remaining = await db.select({ productId: clickLogs.productId, count: sql<number>`count(*)` }).from(clickLogs).groupBy(clickLogs.productId);
    await db.update(products).set({ clicks: 0 });
    for (const row of remaining) {
      if (row.productId) {
        await db.update(products).set({ clicks: Number(row.count) }).where(eq(products.id, row.productId));
      }
    }
  }
  revalidatePath("/admin");
}

export async function logAffiliateClick(productId: number, userAgent?: string, ip?: string) {
  await db.insert(clickLogs).values({ productId, userAgent: userAgent || null, ip: ip || null });
  await db.update(products).set({ clicks: sql`${products.clicks} + 1` }).where(eq(products.id, productId));
}
