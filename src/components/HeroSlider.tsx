"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

interface Banner {
  id: number;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
}

interface HeroSliderProps {
  banners: Banner[];
  siteName?: string;
  tagline?: string;
}

export default function HeroSlider({
  banners,
  siteName = "AffiliateShop.lk",
  tagline = "{tagline}",
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  /* =========================================================
     AUTO SLIDE
     ========================================================= */

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrent((previous) => {
        return (previous + 1) % banners.length;
      });
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [banners.length]);

  /* =========================================================
     EMPTY BANNER
     ========================================================= */

  if (!banners || banners.length === 0) {
    return (
      <section
        className="
          relative
          mb-10
          flex
          h-[260px]
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-gradient-to-br
          from-orange-50
          via-white
          to-slate-100
          md:h-[500px]
        "
      >
        <div className="text-center">
          <h1
            className="
              text-3xl
              font-black
              tracking-tight
              text-slate-800
              md:text-6xl
            "
          >
            {siteName}
          </h1>

          <p className="mt-3 text-sm text-slate-500 md:text-base">
            {tagline}
          </p>
        </div>
      </section>
    );
  }

  /* =========================================================
     CURRENT BANNER
     ========================================================= */

  const banner = banners[current] || banners[0];

  return (
    <section
      className="
        relative
        mb-12
        h-[280px]
        w-full
        overflow-hidden
        bg-slate-100
        shadow-sm
        md:h-[500px]
      "
    >
      {/* =====================================================
          IMAGE
          ===================================================== */}

      {banners.map((item, index) => (
        <div
          key={item.id}
          className={`
            absolute
            inset-0
            transition-all
            duration-1000
            ease-in-out

            ${
              index === current
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-105 opacity-0"
            }
          `}
        >
          <Image
            src={item.imageUrl}
            alt={
              item.title ||
              "AffiliateShop banner"
            }
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />

          {/* =================================================
              DARK OVERLAY
              ================================================= */}

          {(item.title || item.subtitle) && (
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/70
                via-black/20
                to-transparent
              "
            />
          )}

          {/* =================================================
              TEXT
              ================================================= */}

          {(item.title || item.subtitle) && (
            <div
              className="
                absolute
                inset-x-0
                bottom-0
                z-10
                mx-auto
                flex
                max-w-5xl
                flex-col
                items-center
                px-6
                pb-16
                text-center
                text-white
                md:pb-20
              "
            >
              {item.title && (
                <h1
                  className="
                    mb-3
                    text-3xl
                    font-black
                    uppercase
                    tracking-tight
                    drop-shadow-lg
                    md:text-6xl
                  "
                >
                  {item.title}
                </h1>
              )}

              {item.subtitle && (
                <p
                  className="
                    max-w-2xl
                    text-sm
                    font-medium
                    opacity-95
                    drop-shadow-md
                    md:text-xl
                  "
                >
                  {item.subtitle}
                </p>
              )}

              {item.buttonText && item.buttonUrl && (
                <a
                  href={item.buttonUrl}
                  className="mt-5 rounded-2xl bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-orange-600 hover:scale-105"
                >
                  {item.buttonText}
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      {/* =====================================================
          NAVIGATION BUTTONS
          ===================================================== */}

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              setCurrent(
                (current - 1 + banners.length) %
                banners.length
              )
            }
            aria-label="Previous banner"
            className="
              absolute
              left-3
              top-1/2
              z-20
              -translate-y-1/2
              rounded-full
              bg-black/30
              px-4
              py-3
              text-xl
              text-white
              backdrop-blur-sm
              transition
              hover:bg-black/50
              md:left-6
            "
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrent(
                (current + 1) %
                banners.length
              )
            }
            aria-label="Next banner"
            className="
              absolute
              right-3
              top-1/2
              z-20
              -translate-y-1/2
              rounded-full
              bg-black/30
              px-4
              py-3
              text-xl
              text-white
              backdrop-blur-sm
              transition
              hover:bg-black/50
              md:right-6
            "
          >
            ›
          </button>
        </>
      )}

      {/* =====================================================
          DOTS
          ===================================================== */}

      {banners.length > 1 && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-30
            flex
            -translate-x-1/2
            items-center
            gap-2
          "
        >
          {banners.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-500

                ${
                  index === current
                    ? "w-8 bg-orange-500"
                    : "w-2 bg-white/70 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}
