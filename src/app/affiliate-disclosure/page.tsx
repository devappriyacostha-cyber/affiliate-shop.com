import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Affiliate Disclosure' };

export default function AffiliateDisclosurePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
        <h1 className="text-3xl font-black mb-6">Affiliate Disclosure</h1>
        <div className="space-y-4 text-gray-600 leading-7">
          <p>AffiliateShop.lk may use affiliate links to products on Daraz and other partner marketplaces.</p>
          <p>If you click an affiliate link and make a qualifying purchase, we may receive a commission at no extra cost to you.</p>
          <p>Prices, discounts, delivery charges, stock and product availability can change. Always confirm the latest information on the retailer’s website before purchasing.</p>
          <p>We aim to keep product information accurate, but the retailer’s listing is the final source for current price, seller, shipping and availability.</p>
        </div>
      </article>
    </main>
  );
}
