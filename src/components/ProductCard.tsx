"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Flame,
  Star,
  ExternalLink,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  shortName?: string | null;
  price: string | number;
  originalPrice?: string | number | null;
  discountPercent?: number | null;
  discountLabel?: string | null;
  imageUrls: string[];
  rating?: string | number | null;
  isHot?: boolean;
};

export default function ProductCard({
  product,
  layout = "grid",
}: {
  product: Product;
  layout?: "grid" | "list";
}) {

  const price = Number(product.price);

  const original = product.originalPrice
    ? Number(product.originalPrice)
    : 0;

  const discount =
    product.discountPercent ??
    (
      original > price
        ? Math.round(
            ((original - price) / original) * 100
          )
        : 0
    );

  const image =
    product.imageUrls?.[0] ||
    "/logo.png";

  const rating =
    Number(product.rating || 0);

  if (layout === "list") {
    return (
      <article
        className="
          group relative flex gap-4 sm:gap-6
          overflow-hidden rounded-[24px] sm:rounded-[28px]
          border border-slate-200/80
          bg-white p-3 sm:p-5
          shadow-[0_8px_30px_rgba(15,23,42,0.05)]
          transition duration-500
          hover:shadow-[0_16px_45px_rgba(15,23,42,0.1)]
        "
      >
        <Link
          href={`/product/${product.id}`}
          className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-50 p-2 sm:w-40 sm:p-4"
        >
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 96px, 160px"
            className="object-contain transition duration-700 group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute left-1.5 top-1.5 z-20 rounded-full bg-red-600 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-lg">
              {discount}% OFF
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">

          <div>
            <div className="mb-1 flex items-center gap-1 text-xs">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  className={i < Math.floor(rating) ? "text-amber-400" : "text-slate-200"}
                />
              ))}
              {product.isHot && (
                <span className="ml-1 flex items-center gap-0.5 rounded-full bg-slate-950/90 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                  <Flame size={9} className="text-orange-400" /> Hot
                </span>
              )}
            </div>

            <Link
              href={`/product/${product.id}`}
              className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-900 sm:text-base"
            >
              {product.shortName || product.name}
            </Link>
          </div>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
            <div className="flex flex-wrap items-end gap-2">
              <span className="text-lg font-black tracking-tight text-slate-950 sm:text-2xl">
                Rs. {price.toLocaleString("en-LK")}
              </span>
              {original > price && (
                <span className="pb-0.5 text-xs font-semibold text-slate-400 line-through sm:text-sm">
                  Rs. {original.toLocaleString("en-LK")}
                </span>
              )}
            </div>

            <Link
              href={`/product/${product.id}`}
              className="flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-95 sm:px-4 sm:py-3 sm:text-xs"
              style={{ backgroundColor: "var(--view-deal)" }}
            >
              View Deal
              <ArrowUpRight size={13} />
            </Link>
          </div>

        </div>

      </article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985, y: -1 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="
        theme-card-surface group relative z-0 flex h-full min-w-0 flex-col
        overflow-hidden rounded-[20px] sm:rounded-[28px]
        border border-slate-200/80
        bg-white
        shadow-[0_12px_40px_rgba(15,23,42,0.06)]
        transition duration-500
        hover:-translate-y-1
        hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]
      "
    >

      {/* DISCOUNT */}
      {discount > 0 && (
        <div className="absolute left-4 top-4 z-20 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
          {discount}% OFF
        </div>
      )}

      {/* HOT */}
      {product.isHot && (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-slate-950/90 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">

          <Flame
            size={12}
            className="text-orange-400"
          />

          Hot

        </div>
      )}

      {/* IMAGE */}
      <Link
        href={`/product/${product.id}`}
        className="block"
      >

        <div className="relative aspect-square overflow-hidden bg-slate-50 p-3 sm:p-5">

          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 45vw, 280px"
            className="object-contain p-4 transition duration-700 group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/5 to-transparent opacity-0 transition group-hover:opacity-100" />

        </div>

      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">

        {/* RATING */}
        <div className="mb-2 flex items-center gap-1 text-xs">

          {[0, 1, 2, 3, 4].map((i) => (

            <Star
              key={i}
              size={12}
              fill={
                i < Math.floor(rating)
                  ? "currentColor"
                  : "none"
              }
              className={
                i < Math.floor(rating)
                  ? "text-amber-400"
                  : "text-slate-200"
              }
            />

          ))}

          {rating > 0 && (
            <span className="ml-1 font-bold text-slate-400">
              {rating.toFixed(1)}
            </span>
          )}

        </div>

        {/* PRODUCT NAME */}
        <Link
          href={`/product/${product.id}`}
          className="
            line-clamp-2
            min-w-0
            break-words
            text-[13px] sm:text-[15px]
            font-extrabold
            leading-6
            text-slate-900
            transition
          "
        >
          {product.shortName ||
            product.name}
        </Link>

        <div className="mt-auto pt-5">

          {/* PRICE */}
          <div className="flex flex-wrap items-end gap-2">

            <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-950">
              Rs.{" "}
              {price.toLocaleString("en-LK")}
            </span>

            {original > price && (
              <span className="pb-0.5 text-sm font-semibold text-slate-400 line-through">
                Rs.{" "}
                {original.toLocaleString("en-LK")}
              </span>
            )}

          </div>

          {/* ACTIONS */}
          <div className="mt-4 flex gap-2">

            {/* VIEW DEAL */}
            <Link
              href={`/product/${product.id}`}
              className="
                flex flex-1
                items-center justify-center gap-2
                rounded-2xl
                px-4 py-3
                text-xs
                font-black
                uppercase
                tracking-wider
                text-white
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:brightness-95
              "
              style={{
                backgroundColor:
                  "var(--view-deal)",
              }}
            >
              View Deal

              <ArrowUpRight
                size={15}
              />

            </Link>

            {/* EXTERNAL */}
            <a
              href={`/go/${product.id}`}
              aria-label="Open affiliate link"
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl
                border
                border-slate-200
                bg-white
                text-slate-500
                transition-all
                hover:-translate-y-0.5
              "
              style={{
                ["--button-hover" as string]:
                  "var(--hover)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--hover)";

                e.currentTarget.style.color =
                  "var(--hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "#e2e8f0";

                e.currentTarget.style.color =
                  "#64748b";
              }}
            >

              <ExternalLink
                size={16}
              />

            </a>

          </div>

        </div>

      </div>

    </motion.article>
  );
}
