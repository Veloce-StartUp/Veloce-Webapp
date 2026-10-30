import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AmbientBackground } from "@/components/ambient-background";
import { Navigation } from "@/components/navigation";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import {
  DeferredSplashCursor,
  DesktopChapterIndex,
  DesktopScrollRuler,
} from "@/components/deferred-effects";
import { SocialRail } from "@/components/social-rail";
import { siteConfig } from "@/lib/site";

import { Instrument_Serif, VT323 } from "next/font/google";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  // Only the small arc of text around the logo, far down the page.
  preload: false,
});

/** Serif italic for the highlighted words in headlines. */
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

// Social preview images come from app/opengraph-image.tsx and app/twitter-image.tsx.
export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Veloce Technology",
    "Veloce",
    "software development company Sri Lanka",
    "software company Sri Lanka",
    "web development Sri Lanka",
    "mobile app development Sri Lanka",
    "custom software development",
    "event registration system",
    "awards judging platform",
    "membership management platform",
    "cloud solutions",
    "AI and automation",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@velocetech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "zMWdK_ukoSAwnhEDE6aipp8ZBKV5-AtpJihzZc8T83I",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${vt323.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#000000" />
        <noscript>
          <style>{`[data-reveal],.hero-root [data-hero]{opacity:1!important}[data-split]{visibility:visible!important}`}</style>
        </noscript>
      </head>
      <body
        className={`font-sans bg-black text-white antialiased ${GeistSans.variable} ${GeistMono.variable} ${vt323.variable}`}
        suppressHydrationWarning={true}
      >
        <AmbientBackground />
        <DeferredSplashCursor
          SPLAT_FORCE={1500}
          SPLAT_RADIUS={0.1}
          DISABLE_ON_INTERACTIVE={true}
        />
        <Navigation />
        <SmoothScroll>{children}</SmoothScroll>
        <DesktopChapterIndex />
        <DesktopScrollRuler />
        <SocialRail />
        <ScrollToTop />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
