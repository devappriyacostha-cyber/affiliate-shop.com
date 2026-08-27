"use client";

import React, {
  useState,
  useEffect,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SiteSettings {
  siteName?: string;
  logoUrl?: string;
  searchPlaceholder?: string;
}

export default function Header({
  categories,
  settings = {},
}: {
  categories: Category[];
  settings?: SiteSettings;
}) {

  const [searchQuery, setSearchQuery] =
    useState("");

  const [suggestions, setSuggestions] =
    useState<any[]>([]);

  const [history, setHistory] =
    useState<string[]>([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  // Tracks which top-menu dropdown (categories or a custom submenu) is
  // currently open on desktop. Holds the item's index, or null if none.
  const [openMenuIndex, setOpenMenuIndex] =
    useState<number | null>(null);

  // Tracks which custom submenu is expanded inside the mobile menu.
  const [openMobileSubmenu, setOpenMobileSubmenu] =
    useState<number | null>(null);

  const router = useRouter();

  const menuItems = (() => {
    try {
      const parsed = JSON.parse((settings as any).navMenu || "[]");
      return Array.isArray(parsed) && parsed.length ? parsed : [
        { label: "Home", href: "/" },
        { label: "Items", type: "categories" },
      ];
    } catch {
      return [
        { label: "Home", href: "/" },
        { label: "Items", type: "categories" },
      ];
    }
  })();

  useEffect(() => {

    const savedHistory =
      localStorage.getItem(
        "search_history"
      );

    if (savedHistory) {

      try {
        setHistory(
          JSON.parse(savedHistory)
        );
      } catch {
        setHistory([]);
      }

    }

  }, []);

  useEffect(() => {

    const delay =
      setTimeout(() => {

        if (searchQuery.length >= 2) {

          fetch(
            `/api/search/suggestions?q=${encodeURIComponent(
              searchQuery
            )}`
          )
            .then((res) =>
              res.json()
            )
            .then((data) =>
              setSuggestions(data)
            )
            .catch(() =>
              setSuggestions([])
            );

        } else {

          setSuggestions([]);

        }

      }, 300);

    return () =>
      clearTimeout(delay);

  }, [searchQuery]);

  const handleSearch = (
    e: React.FormEvent | null,
    overrideQuery?: string
  ) => {

    if (e) {
      e.preventDefault();
    }

    const finalQuery =
      overrideQuery ||
      searchQuery;

    if (!finalQuery.trim()) {
      return;
    }

    const newHistory = [
      finalQuery,
      ...history.filter(
        (h) => h !== finalQuery
      ),
    ].slice(0, 5);

    setHistory(newHistory);

    localStorage.setItem(
      "search_history",
      JSON.stringify(newHistory)
    );

    router.push(
      `/search?q=${encodeURIComponent(
        finalQuery
      )}`
    );

    setShowDropdown(false);
  };

  // Shared suggestions/history dropdown, rendered under BOTH the
  // desktop search bar and the mobile search bar so search results
  // actually show up on phones too.
  const renderSearchDropdown = () => {
    if (!showDropdown || !(searchQuery.length > 0 || history.length > 0)) {
      return null;
    }

    return (
      <div className="
        absolute
        top-full left-0
        w-full
        bg-white
        mt-2
        rounded-2xl
        shadow-2xl
        border border-gray-100
        overflow-hidden
        z-[60]
      ">

        {searchQuery.length > 0 ? (

          <div>

            {suggestions.length > 0 ? (

              suggestions.map(
                (suggestion) => (

                  <Link
                    key={suggestion.id}
                    href={`/product/${suggestion.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center
                      gap-3 p-3
                      transition
                    "
                    onClick={() =>
                      setShowDropdown(
                        false
                      )
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "color-mix(in srgb, var(--hover) 6%, white)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "";
                    }}
                  >

                    <Image
                      src={
                        suggestion
                          .imageUrls?.[0] ||
                        "/logo.png"
                      }
                      alt=""
                      width={40}
                      height={40}
                      className="
                        w-10 h-10
                        object-contain
                        rounded
                      "
                    />

                    <div>

                      <div className="
                        text-sm
                        font-bold
                        text-gray-800
                        line-clamp-1
                      ">
                        {suggestion.name}
                      </div>

                      <div
                        className="
                          text-xs
                          font-bold
                        "
                        style={{
                          color:
                            "var(--header-cta)",
                        }}
                      >
                        Rs.{" "}
                        {parseFloat(
                          suggestion.price
                        ).toLocaleString()}
                      </div>

                    </div>

                  </Link>

                )
              )

            ) : (

              <div className="
                p-4
                text-center
                text-gray-400
                text-sm
                italic
              ">
                No products found
              </div>

            )}

          </div>

        ) : (

          history.length > 0 && (

            <div className="p-2">

              <div className="
                flex
                items-center
                justify-between
                px-3 py-2
              ">

                <div className="
                  text-[10px]
                  font-bold
                  text-gray-400
                  uppercase
                  tracking-widest
                ">
                  Recent Searches
                </div>

                <button
                  onMouseDown={(e) => {

                    e.preventDefault();

                    setHistory([]);

                    localStorage.removeItem(
                      "search_history"
                    );

                  }}
                  className="
                    text-[10px]
                    font-bold
                    hover:underline
                  "
                  style={{
                    color:
                      "var(--header-cta)",
                  }}
                >
                  Clear
                </button>

              </div>

              {history.map(
                (item, index) => (

                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {

                      e.preventDefault();

                      handleSearch(
                        null,
                        item
                      );

                    }}
                    className="
                      w-full
                      flex items-center
                      gap-3
                      px-3 py-2
                      hover:bg-gray-50
                      rounded-xl
                      transition
                      text-sm
                      text-gray-600
                      font-medium
                      text-left
                    "
                  >

                    <Search
                      size={14}
                      className="text-gray-400"
                    />

                    {item}

                  </button>

                )
              )}

            </div>

          )

        )}

      </div>
    );
  };

  return (
    <header className="
      theme-header sticky top-0 z-50
      bg-white shadow-md
    ">

      <div className="
        container mx-auto px-4
      ">

        {/* TOP BAR */}
        <div className="
          flex items-center
          justify-between
          py-3 gap-4
          border-b border-gray-50
        ">

          {/* LOGO + NAV */}
          <div className="
            flex items-center gap-6
          ">

            <Link
              href="/"
              className="
                flex items-center
                gap-2 shrink-0 group
              "
            >

              <Image
                src={
                  settings.logoUrl ||
                  "/logo.png"
                }
                alt={
                  settings.siteName ||
                  "Affiliate Shop"
                }
                width={40}
                height={40}
                priority
                className="
                  h-10 w-10
                  object-contain
                  group-hover:scale-105
                  transition duration-300
                "
              />

              <div className="
                flex flex-col
                leading-none
              ">

                <span
                  className="
                    text-xl font-black
                    tracking-tighter
                    uppercase
                  "
                  style={{
                    color:
                      "var(--header-cta)",
                  }}
                >
                  {settings.siteName ||
                    "AffiliateShop.lk"}
                </span>

              </div>

            </Link>

            {/* NAV */}
            <nav className="hidden md:flex items-center gap-6 ml-4">
              {menuItems.map((item: any, index: number) => {
                const hasDropdown =
                  item.type === "categories" ||
                  (item.type === "dropdown" && Array.isArray(item.children) && item.children.length > 0);

                if (!hasDropdown) {
                  return (
                    <Link key={`${item.label}-${index}`} href={item.href || "#"} className="font-bold text-gray-700 transition hover:text-[var(--hover)]">
                      {item.label}
                    </Link>
                  );
                }

                const isOpen = openMenuIndex === index;
                const dropdownItems =
                  item.type === "categories"
                    ? categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` }))
                    : item.children;

                return (
                  <div key={`${item.label}-${index}`} className="relative group">
                    <button
                      onMouseEnter={() => setOpenMenuIndex(index)}
                      className="flex items-center gap-1 py-2 font-bold text-gray-700 transition hover:text-[var(--hover)]"
                    >
                      {item.label || "Items"} <ChevronDown size={16} />
                    </button>
                    <div
                      onMouseLeave={() => setOpenMenuIndex((current) => (current === index ? null : current))}
                      className={`absolute left-0 top-full w-64 rounded-b-2xl border border-gray-100 bg-white py-3 shadow-2xl transition-all duration-300 ${
                        isOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                      }`}
                    >
                      {dropdownItems.map((sub: any) => (
                        <Link key={sub.href || sub.label} href={sub.href || "#"}
                          target={sub.newTab ? "_blank" : undefined}
                          rel={sub.newTab ? "noopener noreferrer" : undefined}
                          className="flex items-center justify-between px-5 py-3 text-[13px] font-bold text-gray-600 transition hover:bg-[color-mix(in_srgb,var(--hover)_8%,white)] hover:text-[var(--hover)]"
                          onClick={() => setOpenMenuIndex(null)}>
                          {sub.label}<ChevronRight size={14} />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>

          </div>

          {/* SEARCH */}
          <div className="
            flex-1
            max-w-xl
            relative
            hidden sm:block
          ">

            <form
              onSubmit={handleSearch}
              className="relative"
            >

              <input
                type="text"
                placeholder={
                  settings.searchPlaceholder ||
                  "Search products..."
                }
                className="
                  w-full
                  bg-gray-50
                  border border-gray-200
                  rounded-full
                  py-2 px-6
                  outline-none
                  transition
                "
                value={searchQuery}
                onFocus={() =>
                  setShowDropdown(true)
                }
                onBlur={() =>
                  setTimeout(
                    () =>
                      setShowDropdown(false),
                    200
                  )
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    setShowDropdown(false);
                  }
                }}
              />

              {/* SEARCH CTA */}
              <button
                type="submit"
                className="
                  absolute
                  right-1.5 top-1.5
                  h-7 w-7
                  text-white
                  rounded-full
                  flex items-center
                  justify-center
                  transition-all
                  hover:scale-105
                "
                style={{
                  backgroundColor:
                    "var(--header-cta)",
                }}
              >

                <Search size={14} />

              </button>

            </form>

            {/* SEARCH DROPDOWN */}
            {renderSearchDropdown()}

          </div>

          {/* MOBILE */}
          <div className="
            flex items-center
            gap-4 text-gray-600
          ">

            <button
              className="sm:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 active:scale-95 touch-manipulation"
              onClick={() =>
                setIsMenuOpen(
                  !isMenuOpen
                )
              }
            >

              {isMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}

            </button>

          </div>

        </div>

        {/* MOBILE SEARCH */}
        <div className="
          sm:hidden
          pb-3 relative
        ">

          <form
            onSubmit={handleSearch}
            className="relative"
          >

            <input
              type="text"
              placeholder={
                settings.searchPlaceholder ||
                "Search products..."
              }
              aria-label="Search products"
              className="
                w-full
                bg-gray-50
                border border-gray-200
                rounded-full
                py-3 pl-5 pr-12
                outline-none
              "
              value={searchQuery}
              onFocus={() =>
                setShowDropdown(true)
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setShowDropdown(false),
                  200
                )
              }
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  setShowDropdown(false);
                }
              }}
            />

            <button
              type="submit"
              aria-label="Search"
              className="
                absolute
                right-1.5 top-1.5
                h-9 w-9
                text-white
                rounded-full
                flex items-center
                justify-center
              "
              style={{
                backgroundColor:
                  "var(--header-cta)",
              }}
            >

              <Search size={16} />

            </button>

          </form>

          {renderSearchDropdown()}

        </div>

      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (

        <div className="md:hidden absolute left-0 right-0 top-full max-h-[calc(100svh-110px)] overflow-y-auto overscroll-contain bg-white/95 p-4 shadow-2xl backdrop-blur-xl border-t border-gray-100 animate-in slide-in-from-top duration-300">

          <nav className="
            flex flex-col gap-4
          ">

            {menuItems.map((item: any, index: number) => {
              const isCategories = item.type === "categories";
              const isDropdown = item.type === "dropdown" && Array.isArray(item.children) && item.children.length > 0;

              if (!isCategories && !isDropdown) {
                return (
                  <Link
                    key={`${item.label}-${index}`}
                    href={item.href || "#"}
                    target={item.newTab ? "_blank" : undefined}
                    rel={item.newTab ? "noopener noreferrer" : undefined}
                    className="text-lg font-bold text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              const subItems = isCategories
                ? categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` }))
                : item.children;

              const isExpanded = openMobileSubmenu === index;

              return (
                <div key={`${item.label}-${index}`}>
                  <button
                    type="button"
                    onClick={() => setOpenMobileSubmenu(isExpanded ? null : index)}
                    className="flex w-full items-center justify-between border-t pt-2 text-left font-bold"
                    style={{ color: "var(--header-cta)" }}
                  >
                    {item.label || "Items"}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {subItems.map((sub: any) => (
                        <Link
                          key={sub.href || sub.label}
                          href={sub.href || "#"}
                          target={sub.newTab ? "_blank" : undefined}
                          rel={sub.newTab ? "noopener noreferrer" : undefined}
                          className="flex min-h-11 items-center rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-600 transition active:scale-[0.98] touch-manipulation"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenMobileSubmenu(null);
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          </nav>

        </div>

      )}

    </header>
  );
}
