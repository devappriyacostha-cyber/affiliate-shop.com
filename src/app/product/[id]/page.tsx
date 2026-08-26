import React from 'react';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, Truck, RefreshCw, ExternalLink, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { getProductById, getSiteSettings } from '@/lib/data';
import ProductGallery from '@/components/ProductGallery';

// getProductById is wrapped in React's cache(), so calling it here and again
// in the page component below only hits the DB/cache once per request
// instead of twice (previously generateMetadata and the page each ran an
// identical, separate query for the same product).
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  const product = await getProductById(productId);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - Best Price in Sri Lanka | AffiliateShop`,
    description: product.description?.slice(0, 160),
    openGraph: {
      images: product.imageUrls,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  const [product, siteSettings] = await Promise.all([getProductById(productId), getSiteSettings()]);

  if (!product) {
    notFound();
  }

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = product.originalPrice ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice) : null;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: product.imageUrls,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: { '@type': 'Offer', priceCurrency: 'LKR', price, availability: 'https://schema.org/InStock', url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.id}` },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <nav className="text-sm text-gray-500 mb-6 flex gap-2">
        <a href="/" className="hover:text-orange-500">Home</a>
        <span>/</span>
        {product.category ? <a href={`/category/${product.category.slug}`} className="hover:text-orange-500">{product.category.name}</a> : null}
        <span>/</span>
        <span className="text-gray-900 line-clamp-1">{product.name}</span>
      </nav>

      <div className="theme-panel rounded-3xl border bg-white p-6 shadow-sm lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <ProductGallery images={product.imageUrls} name={product.name} />

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(parseFloat(product.rating || '0')) ? 'currentColor' : 'none'} className={i < Math.floor(parseFloat(product.rating || '0')) ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
                <span className="ml-2 text-blue-600 text-sm">{product.rating} Ratings</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">Brand: <span className="text-blue-600">{product.brand}</span></span>
            </div>

            <hr className="mb-6" />

            <div className="space-y-2 mb-8">
              <div className="text-3xl font-bold text-orange-500">
                Rs. {price.toLocaleString()}
              </div>
              {originalPrice && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 line-through text-lg">Rs. {originalPrice.toLocaleString()}</span>
                  <span className="bg-orange-100 text-orange-600 text-sm font-bold px-2 py-0.5 rounded">
                    -{product.discountPercent}%
                  </span>
                </div>
              )}
              <div className="text-[10px] text-gray-400 font-medium pt-1 italic">
                * Price last verified: {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'Recently'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <ShieldCheck className="text-green-600" size={20} />
                <div>
                  <div className="text-sm font-bold text-gray-800">Daraz Marketplace</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black">View seller details on Daraz</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <Truck className="text-blue-600" size={20} />
                <div>
                  <div className="text-sm font-bold text-gray-800">Delivery & Stock</div>
                  <div className="text-[10px] text-gray-500 uppercase font-black">Check latest details on Daraz</div>
                </div>
              </div>
            </div>

            {/* Affiliate Button */}
            <div className="space-y-4">
              <a
                href={`/go/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-white text-center py-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: siteSettings.viewDealColor || "var(--view-deal)" }}
              >
                {siteSettings.productDealText || "CHECK PRICE ON DARAZ"} <ExternalLink size={22} />
              </a>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                <Info className="text-blue-500 shrink-0" size={18} />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  <span className="font-bold uppercase tracking-wider block mb-1">Affiliate Disclosure:</span>
                  As a Daraz Affiliate, we may earn a small commission from qualifying purchases made through our links at no extra cost to you. Prices and availability are accurate as of our last update.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <div className="flex flex-col items-center gap-1.5 flex-1 text-center">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="text-[9px] text-gray-500 font-black uppercase">Verified</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="flex flex-col items-center gap-1.5 flex-1 text-center">
                  <RefreshCw size={18} className="text-blue-600" />
                  <span className="text-[9px] text-gray-500 font-black uppercase">Price Watch</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="flex flex-col items-center gap-1.5 flex-1 text-center">
                  <AlertCircle size={18} className="text-orange-500" />
                  <span className="text-[9px] text-gray-500 font-black uppercase">Stock Alert</span>
               </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6 italic tracking-tight border-l-4 border-orange-500 pl-4 uppercase">Product Details</h2>
          <div className="prose max-w-none whitespace-pre-line text-gray-700 leading-loose bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
