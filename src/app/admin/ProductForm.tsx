"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Save, X, Image as ImageIcon, Link2, Sparkles } from "lucide-react";
import { addProduct, updateProduct } from "./actions";

type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  shortName?: string | null;
  description?: string | null;
  brand?: string | null;
  price: string;
  originalPrice?: string | null;
  categoryId?: number | null;
  affiliateUrl: string;
  imageUrls: string[];
  rating?: string | null;
  isFeatured?: boolean;
  isHot?: boolean;
};

export default function ProductForm({ categories = [], initialData }: { categories: Category[]; initialData?: Product }) {
  const router = useRouter();
  const editing = Boolean(initialData);
  const [saving, setSaving] = useState(false);

  const initialImages = (initialData?.imageUrls ?? []).slice(0, 4);

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    shortName: initialData?.shortName ?? "",
    description: initialData?.description ?? "",
    brand: initialData?.brand ?? "",
    originalPrice: initialData?.originalPrice ?? "",
    price: initialData?.price ?? "",
    categoryId: initialData?.categoryId ? String(initialData.categoryId) : "",
    affiliateUrl: initialData?.affiliateUrl ?? "",
    rating: initialData?.rating ?? "0",
    isFeatured: initialData?.isFeatured ?? false,
    isHot: initialData?.isHot ?? false,
  });

  const [images, setImages] = useState<string[]>([
    initialImages[0] ?? "",
    initialImages[1] ?? "",
    initialImages[2] ?? "",
    initialImages[3] ?? "",
  ]);

  const setImage = (index: number, value: string) => {
    setImages((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const set = (key: string, value: string | boolean) => setForm((v) => ({ ...v, [key]: value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const imageUrls = images.map((url) => url.trim()).filter(Boolean).slice(0, 4);
    if (!form.name.trim() || !form.price || !form.affiliateUrl.trim()) return;
    setSaving(true);
    const payload = { ...form, categoryId: form.categoryId || null, imageUrls: imageUrls.join("\n") };
    if (editing) await updateProduct(initialData!.id, payload);
    else await addProduct(payload);
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600"><Sparkles size={14} /> Pro Product Manager</div><h1 className="text-3xl font-black tracking-tight">{editing ? "Edit Product" : "Add Product"}</h1><p className="mt-2 text-sm text-slate-500">Everything important for a high-converting product card.</p></div>
        <button onClick={() => router.push("/admin")} className="rounded-2xl border bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-red-500"><X size={16} className="mr-2 inline" /> Cancel</button>
      </div>

      <form onSubmit={submit} className="grid gap-6">
        <section className="rounded-[30px] border bg-white p-7 shadow-sm">
          <h2 className="mb-5 font-black">Product information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2"><span className="field-label">Product name</span><input required value={form.name} onChange={(e) => set("name", e.target.value)} className="field" placeholder="Premium Wireless Headphones" /></label>
            <label><span className="field-label">Short name</span><input value={form.shortName} onChange={(e) => set("shortName", e.target.value)} className="field" placeholder="Wireless Headphones" /></label>
            <label><span className="field-label">Brand</span><input value={form.brand} onChange={(e) => set("brand", e.target.value)} className="field" placeholder="Sony" /></label>
            <label className="md:col-span-2"><span className="field-label">Description</span><textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="field min-h-32" placeholder="Describe the product..." /></label>
          </div>
        </section>

        <section className="rounded-[30px] border bg-white p-7 shadow-sm">
          <h2 className="mb-5 font-black">Pricing & deal</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <label><span className="field-label text-red-500">Original price</span><input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} className="field" placeholder="75000" /></label>
            <label><span className="field-label text-orange-600">Discount price</span><input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className="field font-black" placeholder="59900" /></label>
            <label><span className="field-label">Rating</span><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} className="field" /></label>
          </div>
          {Number(form.originalPrice) > Number(form.price) && (
            <div className="mt-5 rounded-2xl bg-orange-50 p-4 text-sm font-black text-orange-700">
              Automatic discount: {Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)}% OFF
            </div>
          )}
        </section>

        <section className="rounded-[30px] border bg-white p-7 shadow-sm">
          <h2 className="mb-5 font-black">Destination & media</h2>
          <div className="grid gap-5">
            <label><span className="field-label">Category</span><select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="field"><option value="">No category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label><span className="field-label">Affiliate / product URL</span><div className="relative"><Link2 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input required value={form.affiliateUrl} onChange={(e) => set("affiliateUrl", e.target.value)} className="field pl-11" placeholder="https://..." /></div></label>

            <div>
              <span className="field-label">Product images (max 4)</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <ImageIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={url}
                      onChange={(e) => setImage(index, e.target.value)}
                      className="field pl-10"
                      placeholder={index === 0 ? "https://image-1.jpg (main image)" : `https://image-${index + 1}.jpg`}
                    />
                  </div>
                ))}
              </div>
              <span className="mt-2 flex items-center gap-2 text-xs text-slate-400"><ImageIcon size={14} /> First image is used as the main product image. Up to 4 images per product.</span>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border bg-white p-7 shadow-sm">
          <h2 className="mb-5 font-black">Visibility</h2>
          <div className="flex flex-wrap gap-4">
            <label className="toggle"><input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} /><span>Featured deal</span></label>
            <label className="toggle"><input type="checkbox" checked={form.isHot} onChange={(e) => set("isHot", e.target.checked)} /><span>Hot deal</span></label>
          </div>
        </section>

        <div className="flex gap-3">
          <button disabled={saving} type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-orange-600 disabled:opacity-50"><Save size={18} /> {saving ? "Saving..." : editing ? "Save Changes" : "Publish Product"}</button>
          <button type="button" onClick={() => router.push("/admin")} className="rounded-2xl bg-slate-100 px-8 py-4 font-black uppercase tracking-widest text-slate-500 hover:bg-red-50 hover:text-red-600">Cancel</button>
        </div>
      </form>
    </div>
  );
}
