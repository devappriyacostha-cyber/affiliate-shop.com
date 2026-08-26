"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Package, Tag, Image as ImageIcon, LogOut, Settings, BarChart3,
  Trash2, Edit3, Plus, ExternalLink, MousePointerClick, TrendingUp,
  Layers3, Sparkles, RefreshCw, CheckCircle2, AlertTriangle
} from "lucide-react";
import {
  deleteProduct, upsertCategory, deleteCategory, upsertBanner, deleteBanner,
  logout, clearAnalytics, deleteUser, clearAllUsers, deleteClickLog, updateClickLogProduct
} from "./actions";
import AdminSettings from "./settings/page";

type Props = {
  products: any[];
  categories: any[];
  banners: any[];
  initialSettings: Record<string, string>;
  clickStats: any[];
  users: any[];
  analytics: { totalClicks: number; todayClicks: number; last7Clicks: number };
};

const tabs = [
  ["overview", BarChart3, "Overview"],
  ["products", Package, "Products"],
  ["categories", Tag, "Categories"],
  ["banners", ImageIcon, "Banners"],
  ["analytics", TrendingUp, "Analytics"],
  ["settings", Settings, "Settings"],
  ["users", Layers3, "Users"],
] as const;

export default function AdminUI({ products, categories, banners, initialSettings, clickStats, users, analytics }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [busy, setBusy] = useState(false);
  const [catName, setCatName] = useState("");
  const [catIcon, setCatIcon] = useState("");
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [banner, setBanner] = useState<any>({ title:"", subtitle:"", imageUrl:"", buttonText:"View Deal", buttonUrl:"/", order:0, isEnabled:true });
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [notice, setNotice] = useState("");
  const [editingLogId, setEditingLogId] = useState<number | null>(null);

  async function run(action: () => Promise<any>, message = "Saved successfully") {
    setBusy(true); setNotice("");
    try { await action(); setNotice(message); window.location.reload(); }
    catch (e) { alert(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  async function saveCategory(e: FormEvent) {
    e.preventDefault();
    if (!catName.trim()) return;
    await run(() => upsertCategory({
      id: editingCat?.id,
      name: catName,
      icon: catIcon,
      order: editingCat?.order ?? categories.length + 1,
      isEnabled: true,
    }), "Category saved");
  }

  function startEditCategory(cat: any) {
    setEditingCat(cat); setCatName(cat.name); setCatIcon(cat.icon || ""); setActiveTab("categories");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetCategory() { setEditingCat(null); setCatName(""); setCatIcon(""); }

  async function saveBanner(e: FormEvent) {
    e.preventDefault();
    await run(() => upsertBanner({ ...banner, id: editingBanner?.id }), "Banner saved");
  }

  function editBannerItem(item: any) {
    setEditingBanner(item); setBanner(item); setActiveTab("banners"); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function resetAnalytics(period: "all"|"today"|"7days"|"30days") {
    if (!confirm(`Clear ${period === "all" ? "all" : period} analytics?`)) return;
    await run(() => clearAnalytics(period), "Analytics cleared");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {busy && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 backdrop-blur-sm"><div className="rounded-3xl bg-white px-8 py-6 font-black shadow-2xl"><RefreshCw className="mr-2 inline animate-spin text-orange-500" size={18}/> Saving...</div></div>}

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-slate-950 p-6 text-white lg:flex">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-2 flex items-center gap-2 text-orange-400"><Sparkles size={16}/><span className="text-[10px] font-black uppercase tracking-[.2em]">Control Center</span></div>
          <div className="text-xl font-black tracking-tight">{initialSettings.siteName || "AffiliateShop.lk"}</div>
          <div className="mt-1 text-xs text-slate-500">Advanced website manager</div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {tabs.map(([id, Icon, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-xs font-black uppercase tracking-wider transition-all duration-200 ${activeTab===id ? "bg-orange-600 text-white shadow-lg shadow-orange-950/30 translate-x-0.5" : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-0.5"}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${activeTab===id ? "bg-white/15" : "bg-white/0 group-hover:bg-white/10"}`}><Icon size={16}/></span>
              {label}
            </button>
          ))}
        </nav>
        <Link href="/" target="_blank" className="mb-2 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold text-slate-500 hover:bg-white/5 hover:text-white"><ExternalLink size={16}/> View live site</Link>
        <button onClick={async()=>{await logout(); window.location.href="/admin/login";}} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-red-500/10 hover:text-red-400"><LogOut size={17}/> Logout</button>
      </aside>

      {/* MOBILE TAB BAR — the sidebar above is desktop-only, so phones
          need their own compact, horizontally scrollable tab strip or
          there is no way to switch sections at all on a phone. */}
      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-950 px-3 py-3 lg:hidden">
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="min-w-0 truncate text-sm font-black text-white">{initialSettings.siteName || "AffiliateShop.lk"}</div>
          <button onClick={async()=>{await logout(); window.location.href="/admin/login";}} className="shrink-0 rounded-xl bg-white/5 p-2 text-slate-400"><LogOut size={15}/></button>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {tabs.map(([id, Icon, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wide transition ${activeTab===id ? "bg-orange-600 text-white" : "bg-white/5 text-slate-400"}`}>
              <Icon size={14}/> {label}
            </button>
          ))}
        </nav>
      </div>

      <main className="min-h-screen lg:pl-72">
        <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-5 py-4 backdrop-blur-xl lg:px-10">
          <div className="flex items-center justify-between">
            <div><div className="text-[10px] font-black uppercase tracking-[.2em] text-orange-500">Admin / {activeTab}</div><h1 className="text-2xl font-black capitalize tracking-tight">{activeTab}</h1></div>
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-black uppercase text-emerald-700 sm:flex"><CheckCircle2 size={14}/> System ready</div>
          </div>
        </div>

        <div className="p-5 lg:p-10">
          {notice && <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700">{notice}</div>}

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Products", products.length, Package],
                  ["Categories", categories.length, Tag],
                  ["Banners", banners.length, ImageIcon],
                  ["Clicks", analytics.totalClicks, MousePointerClick],
                ].map(([label,value,Icon]: any) => <div key={label} className="rounded-[28px] border bg-white p-6 shadow-sm"><div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><Icon size={20}/></div><div className="text-3xl font-black">{Number(value).toLocaleString()}</div><div className="mt-1 text-xs font-black uppercase tracking-widest text-slate-400">{label}</div></div>)}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border bg-white p-7 shadow-sm">
                  <div className="mb-5 flex items-center justify-between"><h2 className="font-black">Top products</h2><button onClick={()=>setActiveTab("analytics")} className="text-xs font-black text-orange-600">View analytics →</button></div>
                  <div className="space-y-3">{products.slice().sort((a,b)=>(b.clicks||0)-(a.clicks||0)).slice(0,6).map(p=><div key={p.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div className="min-w-0"><div className="truncate text-sm font-bold">{p.shortName||p.name}</div><div className="text-[10px] font-bold uppercase text-slate-400">{p.category?.name||"Uncategorized"}</div></div><div className="ml-4 font-black text-orange-600">{p.clicks||0}</div></div>)}</div>
                </div>
                <div className="rounded-[28px] bg-slate-950 p-7 text-white shadow-xl"><div className="mb-6 flex items-center gap-2 text-orange-400"><Sparkles size={17}/><span className="text-xs font-black uppercase tracking-widest">Optimization status</span></div><div className="space-y-4 text-sm"><div className="flex justify-between"><span className="text-slate-400">Products with images</span><b>{products.filter(p=>p.imageUrls?.length).length}/{products.length}</b></div><div className="flex justify-between"><span className="text-slate-400">Discounted products</span><b>{products.filter(p=>Number(p.originalPrice)>Number(p.price)).length}</b></div><div className="flex justify-between"><span className="text-slate-400">Enabled categories</span><b>{categories.filter(c=>c.isEnabled).length}</b></div><div className="flex justify-between"><span className="text-slate-400">Live banners</span><b>{banners.filter(b=>b.isEnabled).length}</b></div></div></div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="rounded-[28px] border bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-black">Product inventory</h2><p className="text-xs text-slate-400">Edit every product detail from one place.</p></div><Link href="/admin/products/new" className="rounded-2xl bg-orange-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-orange-700"><Plus size={16} className="mr-2 inline"/> Add product</Link></div>
              <div className="divide-y">{products.map(p=><div key={p.id} className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4"><img src={p.imageUrls?.[0]||"/logo.png"} alt="" className="h-16 w-16 rounded-2xl border bg-white object-contain p-1"/><div className="min-w-0"><div className="truncate font-black">{p.shortName||p.name}</div><div className="text-xs text-slate-400">{p.category?.name||"Uncategorized"} · {p.clicks||0} clicks</div><div className="mt-1 flex gap-2 text-xs"><b>Rs. {Number(p.price).toLocaleString()}</b>{p.originalPrice&&<span className="text-slate-400 line-through">Rs. {Number(p.originalPrice).toLocaleString()}</span>}</div></div></div><div className="flex items-center gap-2"><Link href={`/product/${p.id}`} target="_blank" className="rounded-xl border p-2 text-slate-400 hover:text-orange-600"><ExternalLink size={17}/></Link><Link href={`/admin/products/${p.id}/edit`} className="rounded-xl border p-2 text-slate-400 hover:border-orange-500 hover:text-orange-600"><Edit3 size={17}/></Link><button onClick={()=>confirm("Delete this product?")&&run(()=>deleteProduct(p.id),"Product deleted")} className="rounded-xl border p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 size={17}/></button></div></div>)}</div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-[28px] border bg-white shadow-sm"><div className="border-b p-6 font-black">Categories</div><div className="divide-y">{categories.map(c=><div key={c.id} className="flex items-center justify-between p-5 hover:bg-slate-50"><div><div className="font-black">{c.name}</div><div className="text-xs text-slate-400">/{c.slug} · order {c.order}</div></div><div className="flex gap-2"><button onClick={()=>startEditCategory(c)} className="rounded-xl border p-2 text-slate-400 hover:text-orange-600"><Edit3 size={16}/></button><button onClick={()=>confirm("Delete category? Products will become uncategorized.")&&run(()=>deleteCategory(c.id),"Category deleted")} className="rounded-xl border p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></div></div>)}</div></div>
              <form onSubmit={saveCategory} className="h-fit rounded-[28px] border bg-white p-6 shadow-sm"><h2 className="mb-5 font-black">{editingCat?"Edit category":"New category"}</h2><label className="field-label">Name</label><input value={catName} onChange={e=>setCatName(e.target.value)} className="field mb-4" placeholder="Electronics"/><label className="field-label">Icon name</label><input value={catIcon} onChange={e=>setCatIcon(e.target.value)} className="field mb-5" placeholder="Laptop"/><div className="flex gap-2"><button className="flex-1 rounded-2xl bg-slate-950 py-3 font-black text-white hover:bg-orange-600">{editingCat?"Update":"Create"}</button>{editingCat&&<button type="button" onClick={resetCategory} className="rounded-2xl bg-slate-100 px-4 font-black">Cancel</button>}</div></form>
            </div>
          )}

          {activeTab === "banners" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-4">{banners.map(b=><div key={b.id} className="overflow-hidden rounded-[28px] border bg-white shadow-sm"><div className="relative aspect-[21/8]"><img src={b.imageUrl} alt={b.title||""} className="h-full w-full object-cover"/><div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/70 p-4 pt-12"><button onClick={()=>editBannerItem(b)} className="rounded-xl bg-white px-4 py-2 text-xs font-black">Edit</button><button onClick={()=>confirm("Delete banner?")&&run(()=>deleteBanner(b.id),"Banner deleted")} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white">Delete</button></div></div><div className="p-4"><div className="font-black">{b.title||"Untitled banner"}</div><div className="text-xs text-slate-400">{b.subtitle||"No subtitle"}</div></div></div>)}</div>
              <form onSubmit={saveBanner} className="h-fit rounded-[28px] border bg-white p-6 shadow-sm"><h2 className="mb-5 font-black">{editingBanner?"Edit banner":"New banner"}</h2><input value={banner.title||""} onChange={e=>setBanner({...banner,title:e.target.value})} className="field mb-3" placeholder="Title"/><input value={banner.subtitle||""} onChange={e=>setBanner({...banner,subtitle:e.target.value})} className="field mb-3" placeholder="Subtitle"/><input required value={banner.imageUrl||""} onChange={e=>setBanner({...banner,imageUrl:e.target.value})} className="field mb-3" placeholder="Image URL"/><input value={banner.buttonText||""} onChange={e=>setBanner({...banner,buttonText:e.target.value})} className="field mb-3" placeholder="Button text"/><input value={banner.buttonUrl||"/"} onChange={e=>setBanner({...banner,buttonUrl:e.target.value})} className="field mb-5" placeholder="Button URL"/><div className="flex gap-2"><button className="flex-1 rounded-2xl bg-slate-950 py-3 font-black text-white hover:bg-orange-600">{editingBanner?"Update":"Publish"}</button>{editingBanner&&<button type="button" onClick={()=>{setEditingBanner(null);setBanner({title:"",subtitle:"",imageUrl:"",buttonText:"View Deal",buttonUrl:"/",order:0,isEnabled:true})}} className="rounded-2xl bg-slate-100 px-4 font-black">Cancel</button>}</div></form>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-3">{[["All time",analytics.totalClicks],["Today",analytics.todayClicks],["Last 7 days",analytics.last7Clicks]].map(([label,value])=><div key={label} className="rounded-[28px] border bg-white p-7 shadow-sm"><div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div><div className="mt-3 text-4xl font-black">{Number(value).toLocaleString()}</div></div>)}</div>

              <div className="rounded-[28px] border bg-white shadow-sm"><div className="flex items-center justify-between border-b p-6"><h2 className="font-black">Analytics controls</h2><div className="flex flex-wrap gap-2">{(["today","7days","30days","all"] as const).map(p=><button key={p} onClick={()=>resetAnalytics(p)} className="rounded-xl border px-3 py-2 text-[10px] font-black uppercase hover:border-red-400 hover:text-red-600">Clear {p}</button>)}</div></div><div className="divide-y">{products.slice().sort((a,b)=>(b.clicks||0)-(a.clicks||0)).map(p=><div key={p.id} className="flex justify-between p-5"><span className="font-bold">{p.shortName||p.name}</span><span className="font-black text-orange-600">{p.clicks||0} clicks</span></div>)}</div></div>

              <div className="rounded-[28px] border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b p-6">
                  <div>
                    <h2 className="font-black">Recent click activity</h2>
                    <p className="text-xs text-slate-400">Delete individual entries, e.g. test clicks or bad data.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">{clickStats.length} logged</span>
                </div>
                <div className="max-h-[520px] divide-y overflow-y-auto">
                  {clickStats.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No click activity logged yet.</div>}
                  {clickStats.slice(0, 200).map((log:any) => {
                    const p = products.find((pr:any) => pr.id === log.productId);
                    const isEditing = editingLogId === log.id;
                    return (
                      <div key={log.id} className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold">{p?.shortName || p?.name || "Deleted product"}</div>
                            <div className="text-[11px] text-slate-400">{new Date(log.clickedAt).toLocaleString()}</div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button onClick={()=>setEditingLogId(isEditing ? null : log.id)} className={`rounded-xl border p-2 transition ${isEditing ? "border-orange-300 bg-orange-50 text-orange-600" : "text-slate-400 hover:border-orange-200 hover:text-orange-600"}`}><Edit3 size={16}/></button>
                            <button onClick={()=>confirm("Delete this click log entry?")&&run(()=>deleteClickLog(log.id),"Entry deleted")} className="rounded-xl border p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 size={16}/></button>
                          </div>
                        </div>
                        {isEditing && (
                          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                            <span className="text-[10px] font-black uppercase text-slate-400">Reassign to</span>
                            <select
                              defaultValue={log.productId ?? ""}
                              onChange={(e)=>{
                                const newId = Number(e.target.value);
                                if (!newId) return;
                                run(()=>updateClickLogProduct(log.id, newId), "Entry updated").then(()=>setEditingLogId(null));
                              }}
                              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold outline-none"
                            >
                              <option value="" disabled>Choose a product</option>
                              {products.map((pr:any)=>(<option key={pr.id} value={pr.id}>{pr.shortName||pr.name}</option>))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && <AdminSettings initialSettings={initialSettings}/>}
          {activeTab === "users" && (
            <div className="rounded-[28px] border bg-white shadow-sm"><div className="flex items-center justify-between border-b p-6"><h2 className="font-black">Visitors / users</h2><button onClick={()=>confirm("Clear all users?")&&run(clearAllUsers,"Users cleared")} className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600"><AlertTriangle size={14} className="mr-1 inline"/> Clear all</button></div><div className="divide-y">{users.map(u=><div key={u.id} className="flex items-center justify-between p-5"><div><div className="font-bold">{u.name||"Visitor"}</div><div className="text-xs text-slate-400">{u.email||"No email"}</div></div><button onClick={()=>confirm("Delete user?")&&run(()=>deleteUser(u.id),"User deleted")} className="text-slate-300 hover:text-red-600"><Trash2 size={17}/></button></div>)}</div></div>
          )}
        </div>
      </main>
    </div>
  );
}
