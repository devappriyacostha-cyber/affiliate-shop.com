import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import PageTransition from "@/components/PageTransition";

import {
  getCategories,
  getSiteSettings,
} from "@/lib/data";

import type {
  CSSProperties,
  ReactNode,
} from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {

  const settings = await getSiteSettings();

  const faviconUrl = settings.faviconUrl?.trim();

  return {
    title: settings.siteName || "AffiliateShop.lk",

    description:
      settings.siteTagline ||
      "Best Deals in Sri Lanka",

    icons: {
      // If an admin has set a custom favicon URL in Settings, use it
      // directly so the browser tab icon can be changed at any time
      // without touching any files. Otherwise fall back to the
      // built-in generated icon.
      icon: faviconUrl || "/icon",
      shortcut: faviconUrl || "/icon",
      apple: faviconUrl || "/apple-icon.png",
    },

    openGraph: {
      title:
        settings.siteName ||
        "AffiliateShop.lk",

      description:
        settings.siteTagline ||
        "Best Deals in Sri Lanka",

      siteName:
        settings.siteName ||
        "AffiliateShop.lk",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {

  const [
    categories,
    settings,
  ] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  /*
   * MAIN COLORS
   */

  const primary =
    settings.primaryColor ||
    "#f97316";

  const accent =
    settings.accentColor ||
    "#0f172a";

  const bg =
    settings.backgroundColor ||
    "#fafafa";

  const bg2 =
    settings.backgroundColorTwo ||
    bg;

  const bgAngle = `${
    parseInt(settings.backgroundAngle || "135", 10) || 135
  }deg`;

  // "solid" | "gradient" | "animated"
  const bgStyle =
    settings.backgroundStyle ||
    "solid";

  /*
   * NEW SEPARATE UI COLORS
   */

  const viewDeal =
    settings.viewDealColor ||
    "#2563eb";

  const categorySelected =
    settings.categorySelectedColor ||
    "#2563eb";

  const sortSelected =
    settings.sortSelectedColor ||
    "#2563eb";

  const hover =
    settings.hoverColor ||
    "#2563eb";

  const headerCta =
    settings.headerCtaColor ||
    "#2563eb";

  const footerAction =
    settings.footerActionColor ||
    "#2563eb";

  const otherPrimary =
    settings.otherPrimaryColor ||
    "#2563eb";

  const animation =
    settings.animation ||
    "smooth";

  const themePreset = settings.themePreset || "sunset";
  const mobileProductColumns = ["1", "2", "3"].includes(settings.mobileProductColumns || "")
    ? settings.mobileProductColumns
    : "2";

  /*
   * CSS VARIABLES
   */

  const cssVariables = {
    "--primary": primary,
    "--accent": accent,
    "--site-bg": bg,
    "--site-bg-2": bg2,
    "--bg-angle": bgAngle,

    "--view-deal": viewDeal,
    "--view-deal-text": `"${(settings.viewDealText || "View Deal").replace(/"/g, "\\\"")}"`,
    "--category-selected": categorySelected,
    "--sort-selected": sortSelected,
    "--hover": hover,
    "--header-cta": headerCta,
    "--footer-action": footerAction,
    "--other-primary": otherPrimary,
    "--mobile-product-columns": mobileProductColumns,
    "--splash-background": settings.splashBackground || accent,
    "--splash-accent": settings.splashAccent || primary,
  } as CSSProperties;

  return (
    <html
      lang="en"
      data-animation={animation}
      data-bg-style={bgStyle}
      data-theme={themePreset}
    >

      <body
        className={`${inter.className} animated-bg min-h-screen flex flex-col antialiased`}
        style={cssVariables}
      >

        <SplashScreen
          siteName={settings.splashName?.trim() || settings.siteName || "AffiliateShop.lk"}
          tagline={settings.siteTagline || "Best Deals in Sri Lanka"}
          logoUrl={settings.splashPhotoUrl || settings.logoUrl || "/logo.png"}
          stylePreset={settings.splashStyle || "gradient"}
          duration={Number(settings.splashDuration || 650)}
          showProgress={settings.splashShowProgress === "true"}
          background={settings.splashBackground || accent}
          backgroundImageUrl={settings.splashBackgroundImage || ""}
          backgroundBlur={Number(settings.splashBackgroundBlur || 0)}
          showLogo={settings.splashShowLogo !== "false"}
          showName={settings.splashShowName !== "false"}
          accent={settings.splashAccent || primary}
        />

        <Header
          categories={categories}
          settings={settings}
        />

        <main className="relative z-10 flex-1">

          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center p-20 text-center">

                <div className="font-bold tracking-widest text-slate-400">
                  LOADING...
                </div>

              </div>
            }
          >

            <PageTransition>
              {children}
            </PageTransition>

          </Suspense>

        </main>

        <Footer
          settings={settings}
        />

      </body>

    </html>
  );
}
