import { db } from "@/db";
import { products, categories, banners, settings, clickLogs, users } from "@/db/schema";
import { desc, gte, sql } from "drizzle-orm";
import AdminUI from "./AdminUI";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [allProducts, allCats, allBanners, allSettings, allClicks, allUsers] = await Promise.all([
    db.query.products.findMany({ with: { category: true }, orderBy: [desc(products.createdAt)] }),
    db.query.categories.findMany({ orderBy: [desc(categories.order)] }),
    db.query.banners.findMany({ orderBy: [desc(banners.order)] }),
    db.query.settings.findMany(),
    db.query.clickLogs.findMany({ orderBy: [desc(clickLogs.clickedAt)], limit: 5000 }),
    db.query.users.findMany({ orderBy: [desc(users.createdAt)], limit: 500 }),
  ]);

  const settingsObj = allSettings.reduce<Record<string,string>>((acc, row) => { acc[row.key] = row.value ?? ""; return acc; }, {});
  const now = new Date();
  const today = new Date(now); today.setHours(0,0,0,0);
  const last7 = new Date(now); last7.setDate(last7.getDate()-7);

  const analytics = {
    totalClicks: allClicks.length,
    todayClicks: allClicks.filter(c => c.clickedAt >= today).length,
    last7Clicks: allClicks.filter(c => c.clickedAt >= last7).length,
  };

  return <AdminUI products={allProducts} categories={allCats} banners={allBanners} initialSettings={settingsObj} clickStats={allClicks} users={allUsers} analytics={analytics}/>;
}
