import { db } from "@/db";
import { products, categories, banners } from "@/db/schema";

import {
  eq,
  asc,
  desc,
  ilike,
  or,
  and,
} from "drizzle-orm";

import ProductCard from "@/components/ProductCard";
import HomeFilters from "@/components/HomeFilters";
import HeroSlider from "@/components/HeroSlider";
import { getSiteSettings } from "@/lib/data";


export const dynamic = "force-dynamic";


export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
  }>;
}) {

  const params = await searchParams;

  const cat = params?.category || "all";
  const q = params?.q || "";
  const sort = params?.sort || "newest";


  /* =========================================================
     GET HERO BANNERS + CATEGORIES
     ========================================================= */

  const [heroBanners, activeCats, siteSettings] = await Promise.all([

    db.query.banners.findMany({
      where: eq(banners.isEnabled, true),
      orderBy: [
        asc(banners.order),
      ],
    }),

    db.query.categories.findMany({
      where: eq(categories.isEnabled, true),
      orderBy: [asc(categories.order)],
    }),

    getSiteSettings(),
  ]);


  /* =========================================================
     PRODUCT FILTERS
     ========================================================= */

  const conditions = [];


  /* Category */

  if (cat !== "all") {

    const selectedCategory = activeCats.find(
      (category) => category.slug === cat
    );

    if (selectedCategory) {
      conditions.push(
        eq(products.categoryId, selectedCategory.id)
      );
    }

  }


  /* Search */

  if (q.trim()) {

    conditions.push(
      or(
        ilike(products.name, `%${q.trim()}%`),
        ilike(products.shortName, `%${q.trim()}%`)
      )
    );

  }


  /* =========================================================
     SORTING
     ========================================================= */

  let orderBy = [
    desc(products.createdAt),
  ];


  if (sort === "price_low") {
    orderBy = [
      asc(products.price),
    ];
  }


  if (sort === "price_high") {
    orderBy = [
      desc(products.price),
    ];
  }


  if (sort === "rating") {
    orderBy = [
      desc(products.rating),
    ];
  }


  /* =========================================================
     GET PRODUCTS
     ========================================================= */

  const all = await db.query.products.findMany({

    where:
      conditions.length > 0
        ? and(...conditions)
        : undefined,

    orderBy,

  });


  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <main className="min-h-screen overflow-hidden pb-20">


      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="animate-fadeIn">

        <HeroSlider banners={heroBanners} siteName={siteSettings.siteName || "AffiliateShop.lk"} tagline={siteSettings.siteTagline || "Best Deals in Sri Lanka"} />

      </section>


      {/* =====================================================
          PRODUCTS
          ===================================================== */}

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">


        {/* Filters */}

        <div className="relative z-30 animate-fadeIn">

          <HomeFilters categories={activeCats} title={siteSettings.featuredTitle || "Featured Deals"} />

        </div>


        {/* ===================================================
            PRODUCT GRID
            =================================================== */}

        {all.length > 0 ? (

          <div
            className={
              siteSettings.productLayout === "list"
                ? "flex flex-col gap-4"
                : "responsive-product-grid product-grid grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8"
            }
          >

            {all.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
                layout={siteSettings.productLayout === "list" ? "list" : "grid"}
              />

            ))}

          </div>

        ) : (

          /* =================================================
             NO PRODUCTS
             ================================================= */

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
              py-20
              text-center
            "
          >

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white/70
                px-8
                py-10
                shadow-sm
                backdrop-blur
              "
            >

              <p
                className="
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-400
                "
              >
                No products found
              </p>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}
