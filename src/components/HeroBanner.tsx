"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


interface Slide {
  id: number;
  imageUrl: string;
  title?: string | null;
}


const MotionImage = motion(Image);


export default function HeroBanner({
  initialSlides = [],
}: {
  initialSlides?: Slide[];
}) {

  const [current, setCurrent] = useState(0);


  const displaySlides =
    initialSlides.length > 0
      ? initialSlides
      : [
          {
            id: 0,
            imageUrl: "/banner.jpg",
            title: "Welcome",
          },
        ];


  /* =========================================================
     AUTO PLAY
     ========================================================= */

  useEffect(() => {

    if (displaySlides.length <= 1) {
      return;
    }


    const timer = window.setInterval(() => {

      setCurrent(
        (previous) =>
          (previous + 1) %
          displaySlides.length
      );

    }, 5000);


    return () => {
      window.clearInterval(timer);
    };

  }, [displaySlides.length]);


  /* =========================================================
     NAVIGATION
     ========================================================= */

  const next = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {

    event.preventDefault();

    setCurrent(
      (previous) =>
        (previous + 1) %
        displaySlides.length
    );
  };


  const previous = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {

    event.preventDefault();

    setCurrent(
      (previous) =>
        (previous - 1 + displaySlides.length) %
        displaySlides.length
    );
  };


  const slide =
    displaySlides[
      current % displaySlides.length
    ];


  return (
    <div
      className="
        relative
        aspect-[21/9]
        w-full
        overflow-hidden
        rounded-xl
        bg-slate-200
        shadow-inner
        md:aspect-[3/1]
      "
    >

      <AnimatePresence mode="wait">

        <MotionImage
          key={slide.id}
          src={slide.imageUrl}
          alt={
            slide.title ||
            "AffiliateShop banner"
          }
          fill
          sizes="100vw"
          priority
          initial={{
            opacity: 0,
            scale: 1.03,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.02,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

      </AnimatePresence>


      {/* Navigation */}

      {displaySlides.length > 1 && (

        <>

          <button
            type="button"
            onClick={previous}
            aria-label="Previous slide"
            className="
              absolute
              left-2
              top-1/2
              z-20
              -translate-y-1/2
              rounded-full
              bg-black/30
              p-2
              text-white
              backdrop-blur-sm
              transition
              hover:bg-black/50
              md:left-4
              md:p-3
            "
          >
            <ChevronLeft
              className="h-5 w-5 md:h-8 md:w-8"
            />
          </button>


          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="
              absolute
              right-2
              top-1/2
              z-20
              -translate-y-1/2
              rounded-full
              bg-black/30
              p-2
              text-white
              backdrop-blur-sm
              transition
              hover:bg-black/50
              md:right-4
              md:p-3
            "
          >
            <ChevronRight
              className="h-5 w-5 md:h-8 md:w-8"
            />
          </button>

        </>

      )}


      {/* Dots */}

      {displaySlides.length > 1 && (

        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-20
            flex
            -translate-x-1/2
            gap-2
          "
        >

          {displaySlides.map(
            (item, index) => (

              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setCurrent(index)
                }
                aria-label={`Go to slide ${index + 1}`}
                className={`
                  h-2
                  rounded-full
                  transition-all

                  ${
                    index === current
                      ? "w-6 bg-orange-500"
                      : "w-2 bg-white/60"
                  }
                `}
              />

            )
          )}

        </div>

      )}

    </div>
  );
}
