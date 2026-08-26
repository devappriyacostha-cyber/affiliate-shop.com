import React from 'react';
import { db } from '@/db';
import { products } from '@/db/schema';
import { and, asc, desc, gte, ilike, lte, or, eq } from 'drizzle-orm';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getSiteSettings } from '@/lib/data';

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; category?: string; min?: string; max?: string; flash?: string; sort?: string }> 
}) {
  const { q = '', category, min, max, flash, sort = 'newest' } = await searchParams;
  const siteSettings = await getSiteSettings();
  const layout = siteSettings.productLayout === "list" ? "list" : "grid";

  let conditions: any[] = [];

  if (q) {
    conditions.push(or(ilike(products.name, `%${q}%`), ilike(products.shortName, `%${q}%`)));
  }

  if (category && category !== 'all') {
    // category query logic stays here
  }

  if (min) conditions.push(gte(products.price, min));
  if (max) conditions.push(lte(products.price, max));
  
  // Flash sale filter logic - fixed
  if (flash === 'true') {
    // @ts-ignore
    conditions.push(eq(products.isFlashSale, true));
  }

  let orderBy: any = [desc(products.createdAt)];
  if (sort === 'price_asc') orderBy = [asc(products.price)];
  if (sort === 'price_desc') orderBy = [desc(products.price)];

  const results = await db.query.products.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: orderBy,
    with: { category: true }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
          <Search size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase italic">Search Results</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{results.length} items found for "{q}"</p>
        </div>
      </div>

      <div className={layout === "list" ? "flex flex-col gap-4" : "responsive-product-grid product-grid grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8"}>
        {results.map(p => <ProductCard key={p.id} product={p} layout={layout} />)}
      </div>

      {results.length === 0 && (
        <div className="py-24 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-slate-300 font-black uppercase text-xs tracking-widest italic">No matches found for your search.</p>
        </div>
      )}
    </div>
  );
}
