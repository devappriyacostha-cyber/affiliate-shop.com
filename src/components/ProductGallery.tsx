"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images && images.length ? images : ["/logo.png"];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance through every photo the admin has added for this
  // product, pausing whenever the visitor is interacting with the
  // gallery (hover / touch) or there's only one photo.
  useEffect(() => {
    if (gallery.length <= 1 || paused) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % gallery.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [gallery.length, paused]);

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square overflow-hidden rounded-2xl border bg-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        {gallery.map((url, i) => (
          <Image
            key={url + i}
            src={url}
            alt={name}
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            quality={95}
            className={`object-contain transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {gallery.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-white p-1 transition-all ${
                i === active
                  ? "border-[var(--other-primary)] ring-2 ring-[var(--other-primary)]/30"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="120px"
                quality={90}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
