"use client";

import { useState } from "react";
import {
  Save,
  Palette,
  Globe2,
  Share2,
  Sparkles,
  MousePointer2,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { updateSettings } from "../actions";

const defaults: Record<string, string> = {
  siteName: "AffiliateShop.lk",
  siteTagline: "Best Deals in Sri Lanka",
  logoUrl: "/logo.png",
  faviconUrl: "",

  facebookUrl: "",
  youtubeUrl: "",
  instagramUrl: "",

  primaryColor: "#f97316",
  accentColor: "#0f172a",
  backgroundColor: "#fafafa",
  backgroundColorTwo: "#fafafa",
  backgroundStyle: "solid",
  backgroundAngle: "135",

  // NEW UI COLORS
  viewDealColor: "#2563eb",
  viewDealText: "View Deal",
  productDealText: "CHECK PRICE ON DARAZ",
  categorySelectedColor: "#2563eb",
  sortSelectedColor: "#2563eb",
  hoverColor: "#2563eb",
  headerCtaColor: "#2563eb",
  footerActionColor: "#2563eb",
  otherPrimaryColor: "#2563eb",

  animation: "smooth",
  themePreset: "sunset",

  productLayout: "grid",
  navMenu: JSON.stringify([{label:"Home",href:"/"},{label:"Items",type:"categories"}]),
  mobileProductColumns: "2",
  splashStyle: "gradient",
  splashDuration: "650",
  splashBackground: "#020617",
  splashAccent: "#f97316",
  splashPhotoUrl: "",
  splashShowProgress: "false",
  splashShowLogo: "true",
  splashShowName: "true",
  splashName: "",
  splashBackgroundImage: "",
  splashBackgroundBlur: "0",
  footerCustomerCare: JSON.stringify([{label:"Help Center",details:"Get help with shopping and orders.",href:"/",newTab:false}]),
  footerAffiliateShop: JSON.stringify([{label:"About Us",details:"About AffiliateShop",href:"/about",newTab:false}]),

  heroTitle: "Best Deals",
  heroSubtitle: "Discover products worth buying.",
  featuredTitle: "Featured Deals",
  searchPlaceholder: "Search products...",
};


const themePresets = [
  { id: "sunset", name: "Sunset Glow", primary: "#f97316", accent: "#0f172a", bg: "#fff7ed", bg2: "#ffedd5", other: "#2563eb", animation: "smooth" },
  { id: "midnight", name: "Midnight", primary: "#60a5fa", accent: "#020617", bg: "#0f172a", bg2: "#172554", other: "#38bdf8", animation: "smooth" },
  { id: "royal", name: "Royal Purple", primary: "#7c3aed", accent: "#1e1b4b", bg: "#faf5ff", bg2: "#ede9fe", other: "#2563eb", animation: "smooth" },
  { id: "ocean", name: "Ocean Blue", primary: "#06b6d4", accent: "#083344", bg: "#ecfeff", bg2: "#cffafe", other: "#0284c7", animation: "minimal" },
  { id: "emerald", name: "Emerald", primary: "#10b981", accent: "#052e16", bg: "#f0fdf4", bg2: "#d1fae5", other: "#059669", animation: "minimal" },
  { id: "ruby", name: "Ruby", primary: "#e11d48", accent: "#4c0519", bg: "#fff1f2", bg2: "#ffe4e6", other: "#be123c", animation: "smooth" },
  { id: "lavender", name: "Lavender", primary: "#a855f7", accent: "#3b0764", bg: "#faf5ff", bg2: "#f3e8ff", other: "#ec4899", animation: "smooth" },
  { id: "gold", name: "Luxury Gold", primary: "#d4a017", accent: "#171717", bg: "#fafaf9", bg2: "#f5f5f4", other: "#a16207", animation: "minimal" },
  { id: "forest", name: "Forest", primary: "#16a34a", accent: "#14532d", bg: "#f0fdf4", bg2: "#dcfce7", other: "#15803d", animation: "minimal" },
  { id: "neon", name: "Neon", primary: "#22d3ee", accent: "#020617", bg: "#020617", bg2: "#111827", other: "#a3e635", animation: "energetic" },
  { id: "rose", name: "Rose", primary: "#f43f5e", accent: "#4c0519", bg: "#fff1f2", bg2: "#fce7f3", other: "#db2777", animation: "smooth" },
  { id: "sky", name: "Sky", primary: "#0ea5e9", accent: "#0c4a6e", bg: "#f0f9ff", bg2: "#e0f2fe", other: "#2563eb", animation: "minimal" },
  { id: "mono", name: "Monochrome", primary: "#111827", accent: "#000000", bg: "#f9fafb", bg2: "#e5e7eb", other: "#374151", animation: "none" },
  { id: "aqua", name: "Aqua Glass", primary: "#14b8a6", accent: "#134e4a", bg: "#f0fdfa", bg2: "#ccfbf1", other: "#0d9488", animation: "smooth" },
  { id: "berry", name: "Berry", primary: "#9333ea", accent: "#2e1065", bg: "#faf5ff", bg2: "#fce7f3", other: "#c026d3", animation: "energetic" },
  { id: "coral", name: "Coral Breeze", primary: "#fb7185", accent: "#431407", bg: "#fff7f5", bg2: "#ffe4e6", other: "#f43f5e", animation: "smooth" },
  { id: "teal", name: "Deep Teal", primary: "#0f766e", accent: "#042f2e", bg: "#f0fdfa", bg2: "#ccfbf1", other: "#14b8a6", animation: "minimal" },
  { id: "indigo", name: "Indigo Night", primary: "#6366f1", accent: "#1e1b4b", bg: "#eef2ff", bg2: "#e0e7ff", other: "#8b5cf6", animation: "smooth" },
  { id: "candy", name: "Candy Pop", primary: "#ec4899", accent: "#500724", bg: "#fdf2f8", bg2: "#fce7f3", other: "#a855f7", animation: "energetic" },
  { id: "mint", name: "Fresh Mint", primary: "#34d399", accent: "#064e3b", bg: "#ecfdf5", bg2: "#d1fae5", other: "#10b981", animation: "smooth" },
  { id: "copper", name: "Copper", primary: "#c2410c", accent: "#431407", bg: "#fff7ed", bg2: "#fed7aa", other: "#ea580c", animation: "minimal" },
  { id: "slate", name: "Slate Pro", primary: "#475569", accent: "#0f172a", bg: "#f8fafc", bg2: "#e2e8f0", other: "#334155", animation: "minimal" },
  { id: "sapphire", name: "Sapphire", primary: "#2563eb", accent: "#172554", bg: "#eff6ff", bg2: "#dbeafe", other: "#0ea5e9", animation: "smooth" },
  { id: "plum", name: "Plum", primary: "#7e22ce", accent: "#3b0764", bg: "#faf5ff", bg2: "#f3e8ff", other: "#db2777", animation: "smooth" },
  { id: "aurora", name: "Aurora", primary: "#22c55e", accent: "#0f172a", bg: "#f0fdf4", bg2: "#e0f2fe", other: "#06b6d4", animation: "energetic" },
] as const;

type ColorItem = {
  key: string;
  label: string;
  description: string;
};

const uiColors: ColorItem[] = [
  {
    key: "viewDealColor",
    label: "View Deal",
    description: "Product card View Deal button",
  },
  {
    key: "categorySelectedColor",
    label: "Category Selected",
    description: "Selected category button",
  },
  {
    key: "sortSelectedColor",
    label: "Sort Selected",
    description: "Selected sorting option",
  },
  {
    key: "hoverColor",
    label: "Hover",
    description: "General hover effects",
  },
  {
    key: "headerCtaColor",
    label: "Header CTA",
    description: "Header search and CTA buttons",
  },
  {
    key: "footerActionColor",
    label: "Footer / Action",
    description: "Footer links and action buttons",
  },
  {
    key: "otherPrimaryColor",
    label: "Other Primary Buttons",
    description: "Other important primary buttons",
  },
];

/* =============================================================
   FOOTER ITEMS EDITOR
   A friendly form (instead of raw JSON) for editing a list of
   footer links: label, extra details text, the link URL, and
   whether the link should open in a new tab.
   ============================================================= */

type FooterItemRow = {
  label: string;
  details?: string;
  href?: string;
  newTab?: boolean;
};

function parseRows(value: string | undefined): FooterItemRow[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function FooterItemsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const rows = parseRows(value);

  const commit = (next: FooterItemRow[]) => onChange(JSON.stringify(next));

  const updateRow = (index: number, patch: Partial<FooterItemRow>) => {
    const next = rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
    commit(next);
  };

  const removeRow = (index: number) => commit(rows.filter((_, i) => i !== index));

  const moveRow = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  const addRow = () => commit([...rows, { label: "New Link", details: "", href: "/", newTab: false }]);

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Item {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveRow(index, -1)} disabled={index === 0}
                className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30">↑</button>
              <button type="button" onClick={() => moveRow(index, 1)} disabled={index === rows.length - 1}
                className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30">↓</button>
              <button type="button" onClick={() => removeRow(index)}
                className="rounded-lg px-2 py-1 text-xs font-black uppercase text-red-500 hover:bg-red-50">Remove</button>
            </div>
          </div>

          <input
            value={row.label || ""}
            onChange={(e) => updateRow(index, { label: e.target.value })}
            placeholder="Button text (e.g. Customer Care)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold outline-none"
          />
          <input
            value={row.details || ""}
            onChange={(e) => updateRow(index, { details: e.target.value })}
            placeholder="Short description (optional)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
          />
          <input
            value={row.href || ""}
            onChange={(e) => updateRow(index, { href: e.target.value })}
            placeholder="Link (e.g. /about or https://...)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
          />
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <input
              type="checkbox"
              checked={!!row.newTab}
              onChange={(e) => updateRow(index, { newTab: e.target.checked })}
            />
            Open in a new tab
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-xs font-black uppercase tracking-widest text-slate-400 transition hover:border-slate-400 hover:text-slate-600"
      >
        + Add Item
      </button>
    </div>
  );
}

/* =============================================================
   TOP MENU EDITOR
   A friendly form (instead of raw JSON) for editing the header
   navigation: plain links, the live "Items" category dropdown,
   or a custom submenu with its own list of links.
   ============================================================= */

type MenuChildRow = { label: string; href?: string; newTab?: boolean };
type MenuItemRow = {
  label: string;
  href?: string;
  type?: "categories" | "dropdown";
  children?: MenuChildRow[];
};

function parseMenuRows(value: string | undefined): MenuItemRow[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function MenuItemsEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const rows = parseMenuRows(value);

  const commit = (next: MenuItemRow[]) => onChange(JSON.stringify(next));

  const updateRow = (index: number, patch: Partial<MenuItemRow>) => {
    commit(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => commit(rows.filter((_, i) => i !== index));

  const moveRow = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  const addRow = () => commit([...rows, { label: "New Item", href: "/" }]);

  const updateChild = (rowIndex: number, childIndex: number, patch: Partial<MenuChildRow>) => {
    const row = rows[rowIndex];
    const children = (row.children || []).map((child, i) => (i === childIndex ? { ...child, ...patch } : child));
    updateRow(rowIndex, { children });
  };

  const addChild = (rowIndex: number) => {
    const row = rows[rowIndex];
    updateRow(rowIndex, { children: [...(row.children || []), { label: "New Link", href: "/" }] });
  };

  const removeChild = (rowIndex: number, childIndex: number) => {
    const row = rows[rowIndex];
    updateRow(rowIndex, { children: (row.children || []).filter((_, i) => i !== childIndex) });
  };

  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const kind = row.type === "categories" ? "categories" : row.type === "dropdown" ? "dropdown" : "link";

        return (
          <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Menu Item {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveRow(index, -1)} disabled={index === 0}
                  className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveRow(index, 1)} disabled={index === rows.length - 1}
                  className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30">↓</button>
                <button type="button" onClick={() => removeRow(index)}
                  className="rounded-lg px-2 py-1 text-xs font-black uppercase text-red-500 hover:bg-red-50">Remove</button>
              </div>
            </div>

            <input
              value={row.label || ""}
              onChange={(e) => updateRow(index, { label: e.target.value })}
              placeholder="Menu label (e.g. Home)"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold outline-none"
            />

            <div className="grid grid-cols-3 gap-2">
              {([
                ["link", "Link"],
                ["categories", "Live Categories"],
                ["dropdown", "Custom Submenu"],
              ] as const).map(([kindOption, kindLabel]) => (
                <button
                  key={kindOption}
                  type="button"
                  onClick={() =>
                    updateRow(index, {
                      type: kindOption === "link" ? undefined : kindOption,
                      children: kindOption === "dropdown" ? row.children || [] : undefined,
                      href: kindOption === "link" ? row.href || "/" : undefined,
                    })
                  }
                  className={`rounded-xl border py-2 text-[11px] font-black uppercase tracking-wide transition ${
                    kind === kindOption
                      ? "border-transparent bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {kindLabel}
                </button>
              ))}
            </div>

            {kind === "link" && (
              <input
                value={row.href || ""}
                onChange={(e) => updateRow(index, { href: e.target.value })}
                placeholder="Link (e.g. / or /category/phones)"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              />
            )}

            {kind === "categories" && (
              <p className="text-xs text-slate-400">
                Shows a live dropdown of your enabled product categories — nothing else to configure.
              </p>
            )}

            {kind === "dropdown" && (
              <div className="space-y-2 rounded-xl border border-dashed border-slate-300 p-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Submenu links
                </span>
                {(row.children || []).map((child, childIndex) => (
                  <div key={childIndex} className="flex items-center gap-2">
                    <input
                      value={child.label || ""}
                      onChange={(e) => updateChild(index, childIndex, { label: e.target.value })}
                      placeholder="Label"
                      className="w-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={child.href || ""}
                      onChange={(e) => updateChild(index, childIndex, { href: e.target.value })}
                      placeholder="Link"
                      className="w-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <button type="button" onClick={() => removeChild(index, childIndex)}
                      className="shrink-0 rounded-lg px-2 py-1 text-xs font-black uppercase text-red-500 hover:bg-red-50">✕</button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addChild(index)}
                  className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-400 hover:text-slate-600"
                >
                  + Add Submenu Link
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addRow}
        className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-xs font-black uppercase tracking-widest text-slate-400 transition hover:border-slate-400 hover:text-slate-600"
      >
        + Add Menu Item
      </button>
    </div>
  );
}

export default function AdminSettings({
  initialSettings = {},
}: {
  initialSettings?: Record<string, string>;
}) {
  const [form, setForm] = useState({
    ...defaults,
    ...initialSettings,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: string, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  async function save() {
    setSaving(true);
    setSaved(false);

    try {
      await updateSettings(form);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div>
        <div className="flex items-center gap-3">
          <Sparkles className="settings-primary-icon" />

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Site Settings
          </h1>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Control the main website identity, links, content and visual theme
          from one place.
        </p>
      </div>

      {/* BRAND + CONTENT */}
      <section className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-[28px] border bg-white p-7 shadow-sm">

          <div className="mb-6 flex items-center gap-3">
            <Globe2 className="settings-primary-icon" />

            <h2 className="font-black">
              Brand & Content
            </h2>
          </div>

          <div className="space-y-4">

            {[
              ["siteName", "Website name"],
              ["siteTagline", "Tagline"],
              ["logoUrl", "Logo URL"],
              ["faviconUrl", "Favicon URL (browser tab icon)"],
              ["heroTitle", "Hero title"],
              ["heroSubtitle", "Hero subtitle"],
              ["featuredTitle", "Featured section title"],
              ["searchPlaceholder", "Search placeholder"],
            ].map(([key, label]) => (

              <label key={key} className="block">

                <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {label}
                </span>

                <input
                  value={form[key] ?? ""}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[var(--other-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--other-primary)_10%,transparent)]"
                />

              </label>

            ))}

          </div>

          {(form.logoUrl || form.faviconUrl) && (
            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                {form.faviconUrl && (
                  <img
                    src={form.faviconUrl}
                    alt="Favicon preview"
                    className="h-6 w-6 rounded border border-slate-200 bg-white object-contain"
                  />
                )}
                <span className="text-xs font-bold text-slate-500">
                  {form.siteName || "Site name"}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Browser tab preview
              </span>
            </div>
          )}
        </div>

        {/* SOCIAL */}
        <div className="rounded-[28px] border bg-white p-7 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <Share2 className="settings-primary-icon" />

            <h2 className="font-black">
              Social Links
            </h2>

          </div>

          <div className="space-y-4">

            {[
              ["facebookUrl", "Facebook URL"],
              ["youtubeUrl", "YouTube channel URL"],
              ["instagramUrl", "Instagram URL"],
            ].map(([key, label]) => (

              <label key={key} className="block">

                <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {label}
                </span>

                <input
                  value={form[key] ?? ""}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[var(--other-primary)]"
                />

              </label>

            ))}

          </div>
        </div>

      </section>

      {/* THEME PRESETS */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="settings-primary-icon" />
            <div>
              <h2 className="font-black">Theme Presets</h2>
              <p className="text-xs text-slate-400">
                One click changes the complete color mood and animation style.
                Your logo, products and content stay untouched.
              </p>
            </div>
          </div>
          <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 sm:block">
            {themePresets.length} themes
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {themePresets.map((theme) => {
            const selected = form.themePreset === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    themePreset: theme.id,
                    primaryColor: theme.primary,
                    accentColor: theme.accent,
                    backgroundColor: theme.bg,
                    backgroundColorTwo: theme.bg2,
                    backgroundStyle: "animated",
                    backgroundAngle: "135",
                    otherPrimaryColor: theme.other,
                    viewDealColor: theme.other,
                    categorySelectedColor: theme.other,
                    sortSelectedColor: theme.other,
                    hoverColor: theme.primary,
                    headerCtaColor: theme.other,
                    footerActionColor: theme.other,
                    animation: theme.animation,
                  }));
                }}
                className={`theme-preset-card group relative overflow-hidden rounded-2xl border p-3 text-left transition ${
                  selected
                    ? "border-transparent ring-2 ring-[var(--other-primary)] ring-offset-2"
                    : "border-slate-200 hover:-translate-y-0.5 hover:shadow-md"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.bg}, ${theme.bg2})`,
                }}
              >
                <span
                  className="theme-preview-swatch mb-3 block h-14 w-full rounded-xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.other}, ${theme.bg2})`,
                  }}
                />
                <span className="block text-xs font-black text-slate-800">
                  {theme.name}
                </span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {theme.animation === "energetic" ? "Dynamic" : theme.animation}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* BASIC COLORS */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">

        <div className="mb-6 flex items-center gap-3">

          <Palette className="settings-primary-icon" />

          <div>
            <h2 className="font-black">
              Main Theme
            </h2>

            <p className="text-xs text-slate-400">
              Main website colors
            </p>
          </div>

        </div>

        <div className="grid gap-5 sm:grid-cols-3">

          {[
            ["primaryColor", "Primary color"],
            ["accentColor", "Dark accent"],
            ["backgroundColor", "Background"],
          ].map(([key, label]) => (

            <label
              key={key}
              className="flex items-center gap-3 rounded-2xl border bg-slate-50 p-3"
            >

              <input
                type="color"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className="h-12 w-14 cursor-pointer rounded-xl border-0 bg-transparent"
              />

              <div>

                <div className="text-xs font-black uppercase">
                  {label}
                </div>

                <div className="text-xs text-slate-400">
                  {form[key]}
                </div>

              </div>

            </label>

          ))}

        </div>

        {/* BACKGROUND STYLE */}
        <div className="mt-7 border-t border-dashed border-slate-200 pt-6">

          <div className="mb-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">
              Background style
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Turn the site background into a two-color gradient, and
              optionally have it slowly drift for a livelier feel.
              This never changes any other setting.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["solid", "Solid color"],
              ["gradient", "Gradient (static)"],
              ["animated", "Gradient (animated)"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => set("backgroundStyle", value)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-black uppercase tracking-wide transition ${
                  form.backgroundStyle === value
                    ? "border-transparent text-white"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
                style={
                  form.backgroundStyle === value
                    ? { backgroundColor: form.otherPrimaryColor }
                    : undefined
                }
              >
                {label}
              </button>
            ))}
          </div>

          {form.backgroundStyle !== "solid" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border bg-slate-50 p-3">
                <input
                  type="color"
                  value={form.backgroundColorTwo || form.backgroundColor}
                  onChange={(e) => set("backgroundColorTwo", e.target.value)}
                  className="h-12 w-14 cursor-pointer rounded-xl border-0 bg-transparent"
                />
                <div>
                  <div className="text-xs font-black uppercase">
                    Second color
                  </div>
                  <div className="text-xs text-slate-400">
                    {form.backgroundColorTwo || form.backgroundColor}
                  </div>
                </div>
              </label>

              <label className="block rounded-2xl border bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs font-black uppercase">
                  <span>Gradient angle</span>
                  <span className="text-slate-400">
                    {form.backgroundAngle || "135"}°
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={Number(form.backgroundAngle || 135)}
                  onChange={(e) => set("backgroundAngle", e.target.value)}
                  className="mt-3 w-full accent-[var(--other-primary)]"
                />
              </label>
            </div>
          )}

          {/* PREVIEW */}
          <div
            className="mt-5 h-20 w-full overflow-hidden rounded-2xl border border-slate-200"
            style={{
              backgroundColor: form.backgroundColor,
              backgroundImage:
                form.backgroundStyle !== "solid"
                  ? `linear-gradient(${form.backgroundAngle || 135}deg, ${form.backgroundColor}, ${form.backgroundColorTwo || form.backgroundColor})`
                  : undefined,
              backgroundSize:
                form.backgroundStyle !== "solid" ? "200% 200%" : undefined,
              animation:
                form.backgroundStyle === "animated"
                  ? "bgDrift 6s ease infinite"
                  : undefined,
            }}
          />
        </div>

      </section>

      {/* NEW UI COLOR CONTROL */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">

        <div className="mb-7 flex items-start gap-3">

          <MousePointer2 className="settings-primary-icon mt-0.5" />

          <div>

            <h2 className="text-xl font-black">
              Button & UI Colors
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Change each website UI color separately.
              Changing one color will not change the others.
            </p>

          </div>

        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {uiColors.map((item) => (

            <div
              key={item.key}
              className="group rounded-[22px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <div
                      className="h-3 w-3 rounded-full border border-white shadow-sm"
                      style={{
                        backgroundColor:
                          form[item.key] || "#2563eb",
                      }}
                    />

                    <div className="text-sm font-black text-slate-900">
                      {item.label}
                    </div>

                  </div>

                  <div className="mt-1 text-[11px] leading-4 text-slate-400">
                    {item.description}
                  </div>

                </div>

                <input
                  type="color"
                  value={form[item.key] || "#2563eb"}
                  onChange={(e) => set(item.key, e.target.value)}
                  title={`${item.label} color`}
                  className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
                />

              </div>

              <div className="mt-3 flex items-center gap-2">

                <input
                  type="text"
                  value={form[item.key] || "#2563eb"}
                  onChange={(e) => set(item.key, e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase outline-none focus:border-[var(--other-primary)]"
                />

                <div
                  className="h-8 w-8 shrink-0 rounded-lg shadow-inner"
                  style={{
                    backgroundColor:
                      form[item.key] || "#2563eb",
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* LIVE PREVIEW */}
        <div className="mt-7 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <SlidersHorizontal
              size={16}
              className="text-slate-400"
            />

            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Live Preview
            </span>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              style={{
                backgroundColor: form.viewDealColor,
              }}
              className="rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm"
            >
              View Deal
            </button>

            <button
              type="button"
              style={{
                backgroundColor: form.categorySelectedColor,
              }}
              className="rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm"
            >
              Selected Category
            </button>

            <button
              type="button"
              style={{
                backgroundColor: form.sortSelectedColor,
              }}
              className="rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm"
            >
              Selected Sort
            </button>

            <button
              type="button"
              style={{
                backgroundColor: form.headerCtaColor,
              }}
              className="rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm"
            >
              Header CTA
            </button>

            <button
              type="button"
              style={{
                backgroundColor: form.footerActionColor,
              }}
              className="rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm"
            >
              Footer Action
            </button>

            <button
              type="button"
              style={{
                backgroundColor: form.otherPrimaryColor,
              }}
              className="rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm"
            >
              Primary
            </button>

          </div>

        </div>

      </section>

      {/* MOTION + OPENING EXPERIENCE */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Sparkles className="settings-primary-icon" />
          <div>
            <h2 className="font-black">Motion & Opening Experience</h2>
            <p className="mt-1 text-xs text-slate-400">Fast, premium transitions. No percentage counter is shown.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Site animation</span>
            <select value={form.animation} onChange={(e)=>set("animation",e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold outline-none">
              <option value="smooth">Smooth & Premium</option><option value="minimal">Minimal & Fast</option><option value="energetic">Energetic</option><option value="none">Off</option>
            </select>
          </label>
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Opening duration (ms)</span>
            <input type="number" min="350" max="1200" step="50" value={form.splashDuration} onChange={(e)=>set("splashDuration",e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold outline-none"/>
          </label>
          <label className="flex items-center justify-between rounded-2xl border bg-slate-50 p-4"><span><b className="block text-sm">Show logo</b><small className="text-xs text-slate-400">Opening logo animation</small></span><input type="checkbox" checked={form.splashShowLogo !== "false"} onChange={(e)=>set("splashShowLogo",e.target.checked?"true":"false")} /></label>
          <label className="flex items-center justify-between rounded-2xl border bg-slate-50 p-4"><span><b className="block text-sm">Show website name</b><small className="text-xs text-slate-400">Clean animated title</small></span><input type="checkbox" checked={form.splashShowName !== "false"} onChange={(e)=>set("splashShowName",e.target.checked?"true":"false")} /></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Opening background image URL</span><input value={form.splashBackgroundImage} onChange={(e)=>set("splashBackgroundImage",e.target.value)} placeholder="https://..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-semibold outline-none"/></label>
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Opening background color</span><div className="flex gap-3"><input type="color" value={form.splashBackground} onChange={(e)=>set("splashBackground",e.target.value)} className="h-12 w-14 rounded-xl"/><input value={form.splashBackground} onChange={(e)=>set("splashBackground",e.target.value)} className="flex-1 rounded-2xl border bg-slate-50 px-4 font-bold"/></div></label>
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Background blur</span><input type="range" min="0" max="24" value={form.splashBackgroundBlur} onChange={(e)=>set("splashBackgroundBlur",e.target.value)} className="mt-4 w-full accent-[var(--other-primary)]"/><div className="mt-1 text-right text-xs font-black text-slate-400">{form.splashBackgroundBlur}px</div></label>
        </div>
      </section>

      {/* PRODUCT LAYOUT */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">

        <div className="mb-5 flex items-center gap-3">

          <LayoutGrid className="settings-primary-icon" />

          <div>
            <h2 className="font-black">
              Product Display
            </h2>
            <p className="text-xs text-slate-400">
              How products are laid out on the home, search and category pages.
            </p>
          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() => set("productLayout", "grid")}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
              form.productLayout === "grid"
                ? "border-[var(--other-primary)] bg-[color-mix(in_srgb,var(--other-primary)_6%,white)]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <LayoutGrid size={20} className="text-slate-700" />
            </span>
            <span>
              <span className="block text-sm font-black">Grid</span>
              <span className="block text-xs text-slate-400">Compact cards in columns — best for browsing quickly.</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => set("productLayout", "list")}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
              form.productLayout === "list"
                ? "border-[var(--other-primary)] bg-[color-mix(in_srgb,var(--other-primary)_6%,white)]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <ListIcon size={20} className="text-slate-700" />
            </span>
            <span>
              <span className="block text-sm font-black">List</span>
              <span className="block text-xs text-slate-400">Wide rows with more details visible per product.</span>
            </span>
          </button>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block"><span className="field-label">Product card button text</span><input value={form.viewDealText} onChange={e=>set("viewDealText",e.target.value)} className="field"/></label>
          <label className="block"><span className="field-label">Product page deal button text</span><input value={form.productDealText} onChange={e=>set("productDealText",e.target.value)} className="field"/></label>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Mobile Product Display</div>
          <p className="mb-4 text-xs text-slate-400">Choose how many product cards appear in each phone row. Desktop layout stays unchanged.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["1", "1 per row"],
              ["2", "2 per row"],
              ["3", "3 per row"],
            ].map(([value, label]) => (
              <button key={value} type="button" onClick={() => set("mobileProductColumns", value)}
                className={`rounded-2xl border p-4 text-center transition ${form.mobileProductColumns === value ? "border-transparent text-white shadow-lg" : "border-slate-200 bg-white text-slate-600"}`}
                style={form.mobileProductColumns === value ? { backgroundColor: form.otherPrimaryColor } : undefined}>
                <span className="block text-2xl font-black">{value}</span>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-widest">{label}</span>
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* SPLASH / OPENING ANIMATION */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-3"><Sparkles className="settings-primary-icon" /><div><h2 className="font-black">Opening Animation</h2><p className="text-xs text-slate-400">Control the first animation visitors see when the website opens.</p></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="field-label">Opening screen name (optional)</span><input value={form.splashName} onChange={e=>set("splashName",e.target.value)} placeholder={form.siteName || "Defaults to your website name"} className="field"/></label>
          <label className="block"><span className="field-label">Animation style</span><select value={form.splashStyle} onChange={e=>set("splashStyle",e.target.value)} className="field"><option value="gradient">Gradient Reveal</option><option value="minimal">Minimal Fade</option><option value="zoom">Logo Zoom</option><option value="scan">Progress Scan</option></select></label>
          <label className="block"><span className="field-label">Duration (ms)</span><input type="number" min="500" max="5000" step="100" value={form.splashDuration} onChange={e=>set("splashDuration",e.target.value)} className="field"/></label>
          <label className="block"><span className="field-label">Background color</span><input type="color" value={form.splashBackground} onChange={e=>set("splashBackground",e.target.value)} className="h-12 w-full rounded-xl border bg-white p-1"/></label>
          <label className="block"><span className="field-label">Progress / accent color</span><input type="color" value={form.splashAccent} onChange={e=>set("splashAccent",e.target.value)} className="h-12 w-full rounded-xl border bg-white p-1"/></label>
          <label className="block md:col-span-2"><span className="field-label">Opening photo / logo URL (optional)</span><input value={form.splashPhotoUrl} onChange={e=>set("splashPhotoUrl",e.target.value)} placeholder="https://... or /logo.png" className="field"/></label>
          <label className="toggle"><input type="checkbox" checked={form.splashShowProgress === "true"} onChange={e=>set("splashShowProgress",String(e.target.checked))}/><span>Show progress bar</span></label>
        </div>
      </section>

      {/* NAVIGATION MANAGER */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">
        <div className="mb-6">
          <h2 className="font-black">Top Menu Manager</h2>
          <p className="text-xs text-slate-400">Add, remove or reorder menu items. &quot;Live Categories&quot; shows your product categories automatically; &quot;Custom Submenu&quot; lets you build your own dropdown of links.</p>
        </div>
        <MenuItemsEditor value={form.navMenu || "[]"} onChange={(next) => set("navMenu", next)} />
      </section>

      {/* FOOTER CONTENT */}
      <section className="rounded-[28px] border bg-white p-7 shadow-sm">
        <div className="mb-6"><h2 className="font-black">Footer Content Manager</h2><p className="text-xs text-slate-400">Add, edit, reorder or remove the links shown in each footer column. Each link can optionally open in a new tab.</p></div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            ["footerCustomerCare","Customer Care"],["footerAffiliateShop","AffiliateShop"],
          ].map(([key,label])=>(
            <div key={key}>
              <span className="field-label">{label}</span>
              <div className="mt-2">
                <FooterItemsEditor value={form[key] || "[]"} onChange={(next) => set(key, next)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAVE */}
      <button
        disabled={saving}
        onClick={save}
        className="settings-save-button flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-black uppercase tracking-widest text-white shadow-xl transition hover:-translate-y-0.5 disabled:opacity-50"
      >

        <Save size={18} />

        {saving
          ? "Saving..."
          : saved
            ? "Saved ✓"
            : "Save Everything"}

      </button>

    </div>
  );
}
