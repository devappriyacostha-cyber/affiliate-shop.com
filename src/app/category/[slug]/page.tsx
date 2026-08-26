import React from 'react';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategoryId, getSiteSettings } from '@/lib/data';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, siteSettings] = await Promise.all([
    getCategoryBySlug(slug),
    getSiteSettings(),
  ]);

  if (!category) {
    notFound();
  }

  // Was previously unbounded (`findMany` with no limit) — a large category
  // could return every matching row and render them all in one page. Capped
  // at 60, same as the cached query in src/lib/data.ts.
  const categoryProducts = await getProductsByCategoryId(category.id);
  const layout = siteSettings.productLayout === "list" ? "list" : "grid";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-gray-500 mt-2">Discover our best selection of {category.name.toLowerCase()} products.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters could go here too, similar to search page */}
        <div className="flex-1">
          <div className={layout === "list" ? "flex flex-col gap-4" : "responsive-product-grid product-grid grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 md:gap-4"}>
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} layout={layout} />
            ))}
          </div>

          {categoryProducts.length === 0 && (
            <div className="bg-white p-20 text-center rounded-lg shadow-sm">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
