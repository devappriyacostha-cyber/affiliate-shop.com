"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  LayoutGrid,
  ChevronDown,
  Check,
} from "lucide-react";

import Link from "next/link";

export default function HomeFilters({
  categories,
  title = "Featured Deals",
}: {
  categories: any[];
  title?: string;
}) {

  const router = useRouter();
  const searchParams =
    useSearchParams();

  const [isOpen, setIsOpen] =
    useState(false);

  const dropRef =
    useRef<HTMLDivElement>(null);

  const selectedCat =
    searchParams.get("category") ||
    "all";

  const sortOrder =
    searchParams.get("sort") ||
    "newest";

  const options = [
    {
      v: "newest",
      l: "Latest Arrivals",
    },
    {
      v: "price_low",
      l: "Price: Low to High",
    },
    {
      v: "price_high",
      l: "Price: High to Low",
    },
    {
      v: "rating",
      l: "Top Rated Deals",
    },
  ];

  const updateSort = (
    value: string
  ) => {

    const p =
      new URLSearchParams(
        searchParams.toString()
      );

    if (value === "newest") {
      p.delete("sort");
    } else {
      p.set("sort", value);
    }

    router.push(
      `/?${p.toString()}`,
      {
        scroll: false,
      }
    );

    setIsOpen(false);
  };

  useEffect(() => {

    const close = (
      e: MouseEvent
    ) => {

      if (
        dropRef.current &&
        !dropRef.current.contains(
          e.target as Node
        )
      ) {
        setIsOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      close
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );

  }, []);

  return (
    <div className="mb-6 space-y-5 sm:mb-10 sm:space-y-8">

      {/* TITLE + SORT */}
      <div className="flex flex-row items-center justify-between gap-3 md:items-end md:gap-6">

        <div>

          <h2 className="text-lg font-[1000] text-slate-900 tracking-tight uppercase italic sm:text-3xl sm:tracking-tighter">
            {title}
          </h2>

          <div
            className="mt-1.5 h-1 w-10 rounded-full sm:mt-2 sm:h-1.5 sm:w-16"
            style={{
              backgroundColor:
                "var(--other-primary)",
            }}
          />

        </div>

        {/* SORT */}
        <div
          className="relative shrink-0"
          ref={dropRef}
        >

          <button
            onClick={() =>
              setIsOpen(!isOpen)
            }
            className="
              flex items-center justify-between gap-2
              bg-white
              border border-slate-200
              px-3 py-2.5
              rounded-xl
              shadow-sm
              transition-all
              sm:w-64 sm:gap-0 sm:px-6 sm:py-3.5 sm:rounded-2xl
            "
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "var(--hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "#e2e8f0";
            }}
          >

            <div className="flex flex-col items-start leading-tight">

              <span className="hidden text-[9px] font-black uppercase text-slate-400 mb-0.5 sm:block">
                Sort Results
              </span>

              <span className="max-w-[110px] truncate text-xs font-bold text-slate-800 sm:max-w-none sm:text-sm">
                {
                  options.find(
                    (o) =>
                      o.v === sortOrder
                  )?.l
                }
              </span>

            </div>

            <ChevronDown
              size={16}
              className={`
                shrink-0
                text-slate-400
                transition-transform
                sm:h-[18px] sm:w-[18px]
                ${isOpen ? "rotate-180" : ""}
              `}
            />

          </button>

          {/* SORT DROPDOWN */}
          {isOpen && (

            <div className="
              absolute
              top-[110%]
              right-0
              w-56
              sm:w-full
              bg-white
              border border-slate-100
              rounded-2xl
              shadow-2xl
              z-[100]
              p-2
              animate-in
              fade-in
              slide-in-from-top-2
            ">

              {options.map(
                (option) => {

                  const selected =
                    sortOrder ===
                    option.v;

                  return (

                    <button
                      key={option.v}
                      onClick={() =>
                        updateSort(
                          option.v
                        )
                      }
                      className="
                        w-full
                        flex items-center
                        justify-between
                        px-4 py-3
                        rounded-xl
                        font-bold
                        text-xs
                        uppercase
                        tracking-wider
                        transition-all
                      "
                      style={
                        selected
                          ? {
                              backgroundColor:
                                "color-mix(in srgb, var(--sort-selected) 10%, white)",
                              color:
                                "var(--sort-selected)",
                            }
                          : undefined
                      }
                      onMouseEnter={(e) => {

                        if (!selected) {

                          e.currentTarget.style.backgroundColor =
                            "color-mix(in srgb, var(--hover) 8%, white)";

                          e.currentTarget.style.color =
                            "var(--hover)";

                        }

                      }}
                      onMouseLeave={(e) => {

                        if (!selected) {

                          e.currentTarget.style.backgroundColor =
                            "";

                          e.currentTarget.style.color =
                            "";

                        }

                      }}
                    >

                      {option.l}

                      {selected && (
                        <Check
                          size={14}
                        />
                      )}

                    </button>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>

      {/* CATEGORIES */}
      <div className="
        flex gap-1.5 sm:gap-2
        overflow-x-auto
        pb-2
        no-scrollbar
      ">

        {/* ALL */}
        <Link
          href="/"
          className="
            flex items-center gap-1.5 sm:gap-2
            px-4 py-2.5 sm:px-8 sm:py-3.5
            rounded-xl
            text-[9px] sm:text-[10px]
            font-black
            uppercase
            tracking-widest
            border
            transition-all
            whitespace-nowrap
          "
          style={
            selectedCat === "all"
              ? {
                  backgroundColor:
                    "var(--category-selected)",
                  color: "#fff",
                  borderColor:
                    "var(--category-selected)",
                  boxShadow:
                    "0 12px 25px color-mix(in srgb, var(--category-selected) 20%, transparent)",
                }
              : undefined
          }
          onMouseEnter={(e) => {

            if (selectedCat !== "all") {

              e.currentTarget.style.borderColor =
                "var(--hover)";

              e.currentTarget.style.color =
                "var(--hover)";

            }

          }}
          onMouseLeave={(e) => {

            if (selectedCat !== "all") {

              e.currentTarget.style.borderColor =
                "#e2e8f0";

              e.currentTarget.style.color =
                "#64748b";

            }

          }}
        >

          <LayoutGrid
            size={14}
          />

          All Deals

        </Link>

        {/* CATEGORIES */}
        {categories.map(
          (category) => {

            const selected =
              selectedCat ===
              category.slug;

            return (

              <Link
                key={category.id}
                href={`/?category=${category.slug}`}
                className="
                  px-4 py-2.5 sm:px-8 sm:py-3.5
                  rounded-xl
                  text-[9px] sm:text-[10px]
                  font-black
                  uppercase
                  tracking-widest
                  border
                  transition-all
                  whitespace-nowrap
                "
                style={
                  selected
                    ? {
                        backgroundColor:
                          "var(--category-selected)",
                        color: "#fff",
                        borderColor:
                          "var(--category-selected)",
                        boxShadow:
                          "0 12px 25px color-mix(in srgb, var(--category-selected) 20%, transparent)",
                      }
                    : undefined
                }
                onMouseEnter={(e) => {

                  if (!selected) {

                    e.currentTarget.style.borderColor =
                      "var(--hover)";

                    e.currentTarget.style.color =
                      "var(--hover)";

                  }

                }}
                onMouseLeave={(e) => {

                  if (!selected) {

                    e.currentTarget.style.borderColor =
                      "#e2e8f0";

                    e.currentTarget.style.color =
                      "#64748b";

                  }

                }}
              >

                {category.name}

              </Link>

            );

          }
        )}

      </div>

    </div>
  );
}
