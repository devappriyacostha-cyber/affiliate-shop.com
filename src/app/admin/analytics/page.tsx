import { db } from "@/db";
import { clickLogs, products } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [logs, items] = await Promise.all([
    db.query.clickLogs.findMany({ with: { product: true }, orderBy: [desc(clickLogs.clickedAt)], limit: 500 }),
    db.query.products.findMany({ orderBy: [desc(products.clicks)] }),
  ]);
  return <div className="min-h-screen bg-slate-100 p-8"><div className="mx-auto max-w-6xl"><h1 className="text-4xl font-black">Analytics</h1><p className="mt-2 text-slate-500">Recent affiliate activity.</p><div className="mt-8 grid gap-5 md:grid-cols-3"><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-xs font-black uppercase tracking-widest text-slate-400">Logged clicks</div><div className="mt-3 text-4xl font-black">{logs.length}</div></div><div className="rounded-3xl bg-white p-7 shadow-sm"><div className="text-xs font-black uppercase tracking-widest text-slate-400">Products</div><div className="mt-3 text-4xl font-black">{items.length}</div></div><div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm"><div className="text-xs font-black uppercase tracking-widest text-slate-400">Top clicks</div><div className="mt-3 text-4xl font-black">{items[0]?.clicks ?? 0}</div></div></div></div></div>;
}
