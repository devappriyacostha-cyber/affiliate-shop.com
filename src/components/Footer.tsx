"use client";

import Link from "next/link";

interface FooterProps { settings: Record<string, string>; }

type FooterItem = { label: string; details?: string; href?: string; newTab?: boolean };

function parseJson<T>(value: string | undefined, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value || "");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function Footer({ settings }: FooterProps) {
  const customerCare = parseJson<FooterItem>(settings.footerCustomerCare, [
    { label: "Help Center", details: "Get help with shopping and orders.", href: "/" },
    { label: "How to Buy", details: "Simple shopping guidance.", href: "/" },
    { label: "Returns & Refunds", details: "Learn about returns.", href: "/" },
    { label: "Contact Us", details: "Contact our team.", href: "/" },
  ]);
  const affiliateShop = parseJson<FooterItem>(settings.footerAffiliateShop, [
    { label: "About Us", details: "About AffiliateShop", href: "/about" },
    { label: "Affiliate Disclosure", details: "Affiliate information.", href: "/affiliate-disclosure" },
    { label: "Privacy Policy", details: "Privacy information.", href: "/" },
  ]);

  const linkClass = "transition-colors hover:text-[var(--footer-action)]";
  const Section = ({ title, items }: { title: string; items: FooterItem[] }) => (
    <div>
      <h3 className="mb-6 border-l-4 pl-4 text-lg font-black uppercase tracking-tight text-white"
        style={{ borderColor: "var(--footer-action)" }}>{title}</h3>
      <ul className="space-y-4 text-[13px]">
        {items.map((item) => (
          <li key={`${title}-${item.label}`}>
            {item.newTab ? (
              <a href={item.href || "#"} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {item.label}
              </a>
            ) : (
              <Link href={item.href || "#"} className={linkClass}>
                {item.label}
              </Link>
            )}
            {item.details && <span className="mt-1 block text-[10px] leading-4 text-gray-500">{item.details}</span>}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="theme-footer mt-20 bg-[#0f172a] py-16 text-gray-400">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-3">
        <Section title="Customer Care" items={customerCare} />
        <Section title="AffiliateShop" items={affiliateShop} />

        <div>
          <h3 className="mb-6 border-l-4 pl-4 text-lg font-black uppercase tracking-tight text-white"
            style={{ borderColor: "var(--footer-action)" }}>Follow Us</h3>
          <div className="flex gap-3">
            {[
              { href: settings.facebookUrl || "#", label: "Facebook" },
              { href: settings.instagramUrl || "#", label: "Instagram" },
              { href: settings.youtubeUrl || "#", label: "YouTube" },
            ].map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-[var(--footer-action)] hover:bg-[var(--footer-action)]">
                {social.label === "Facebook" && (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-gray-300 group-hover:text-white"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1z"/></svg>
                )}
                {social.label === "Instagram" && (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current text-gray-300 group-hover:text-white"><rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2"/><circle cx="12" cy="12" r="4" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                )}
                {social.label === "YouTube" && (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-gray-300 group-hover:text-white"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2C2 8.9 2 12 2 12s0 3.1.4 4.8a2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2C22 15.1 22 12 22 12s0-3.1-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-16 flex flex-col items-center justify-between border-t border-white/5 px-4 pt-8 text-[11px] font-bold uppercase tracking-widest text-gray-500 md:flex-row">
        <p>&copy; {new Date().getFullYear()} {settings.siteName || "AffiliateShop.lk"} | {settings.siteTagline || "Affiliate shopping guide"}</p>
        <Link href="/admin" className="mt-6 flex items-center gap-2 opacity-10 transition hover:opacity-100 md:mt-0" style={{ color: "var(--footer-action)" }}>
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: "var(--footer-action)" }} />
          Secure System Portal
        </Link>
      </div>
    </footer>
  );
}
