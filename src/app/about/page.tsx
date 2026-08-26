import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "AffiliateShop.lk";

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <h1 className="mb-6 text-3xl font-black">About Us</h1>
        <div className="space-y-4 leading-7 text-gray-600">
          <p>
            {siteName} helps shoppers in Sri Lanka discover good deals across
            popular online marketplaces, all in one place.
          </p>
          <p>
            We hand-pick products, track prices and highlight discounts so you
            can spend less time searching and more time saving.
          </p>
          <p>
            {siteName} is an affiliate shopping guide — when you buy through a
            link on our site, we may earn a small commission at no extra cost
            to you. See our{" "}
            <a
              href="/affiliate-disclosure"
              className="font-bold text-[var(--footer-action)] hover:underline"
            >
              Affiliate Disclosure
            </a>{" "}
            for details.
          </p>
        </div>
      </article>
    </main>
  );
}
