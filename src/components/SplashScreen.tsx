"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  stylePreset?: string;
  duration?: number;
  showProgress?: boolean;
  background?: string;
  backgroundImageUrl?: string;
  backgroundBlur?: number;
  showLogo?: boolean;
  showName?: boolean;
  accent?: string;
};

export default function SplashScreen({
  siteName = "AffiliateShop.lk",
  tagline = "Best Deals in Sri Lanka",
  logoUrl = "/logo.png",
  stylePreset = "gradient",
  duration = 1500,
  showProgress = false,
  background = "#020617",
  backgroundImageUrl = "",
  backgroundBlur = 0,
  showLogo = true,
  showName = true,
  accent = "#f97316",
}: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), Math.min(1200, Math.max(350, duration)));
    return () => window.clearTimeout(timer);
  }, [duration]);

  const logo = logoUrl?.trim();

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45 }}
          className={`splash-screen splash-${stylePreset} ${stylePreset === "scan" ? "splash-scan" : ""} fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden`}
          style={{
            backgroundColor: background,
          }}
        >
          {backgroundImageUrl?.trim() && (
            <div className="absolute inset-0 -z-10 scale-105" style={{ background: `url(${backgroundImageUrl.trim()}) center/cover no-repeat`, filter: `blur(${Math.min(24, Math.max(0, backgroundBlur))}px)`, opacity: 0.96 }} />
          )}
          <div className="splash-orb splash-orb-one" style={{ background: accent }} />
          <div className="splash-orb splash-orb-two" style={{ background: accent }} />

          <div className="relative z-10 w-full max-w-xl px-6 text-center">
            {showLogo && logo && (
              <motion.div
                initial={{ opacity: 0, scale: stylePreset === "zoom" ? 0.35 : 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-white/10 p-3 shadow-2xl ring-1 ring-white/15 backdrop-blur"
              >
                <img src={logo} alt="" className="h-full w-full object-contain" />
              </motion.div>
            )}

            {showName && <motion.h1
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55 }}
              className="text-4xl font-black tracking-tight text-white md:text-7xl"
            >
              {siteName}
            </motion.h1>}

            {showProgress && (
              <motion.div
                className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-white/10 md:w-72"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: Math.max(0.5, duration / 1000 - 0.1), ease: "easeInOut" }}
                  className="h-full origin-left rounded-full"
                  style={{ background: accent }}
                />
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-5 text-xs font-medium uppercase tracking-[0.3em] text-white/55"
            >
              {tagline}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
