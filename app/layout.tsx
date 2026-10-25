import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { AmbientBackground } from "@/components/ambient-background";
import { Navigation } from "@/components/navigation";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ChapterIndex } from "@/components/chapters/chapter-index";
import { ScrollRuler } from "@/components/chapters/scroll-ruler";
import { SocialRail } from "@/components/social-rail";

import { Instrument_Serif, VT323 } from "next/font/google";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

/** Serif italic for the highlighted words in headlines. */
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Veloce - Innovative Software Solutions for Modern Businesses",
    template: "%s | Veloce",
  },
  description:
    "Veloce designs and develops cutting-edge software solutions that empower businesses to grow, scale, and lead the future. Custom web applications, mobile apps, and enterprise solutions.",
  keywords: [
    "software development",
    "web applications",
    "mobile apps",
    "enterprise solutions",
    "custom software",
    "technology consulting",
  ],
  authors: [{ name: "Veloce Technology" }],
  creator: "Veloce Technology",
  publisher: "Veloce Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://veloce-technology.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Veloce - Innovative Software Solutions for Modern Businesses",
    description:
      "Veloce designs and develops cutting-edge software solutions that empower businesses to grow, scale, and lead the future.",
    url: "https://veloce-technology.com",
    siteName: "Veloce",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Veloce - Innovative Software Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veloce - Innovative Software Solutions for Modern Businesses",
    description:
      "Veloce designs and develops cutting-edge software solutions that empower businesses to grow, scale, and lead the future.",
    images: ["/twitter-image.jpg"],
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
  manifest: "/manifest.webmanifest",
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
        <SplashCursor
          SPLAT_FORCE={1500}
          SPLAT_RADIUS={0.1}
          DISABLE_ON_INTERACTIVE={true}
        />
        <Navigation />
        <SmoothScroll>{children}</SmoothScroll>
        <ChapterIndex />
        <ScrollRuler />
        <SocialRail />
        <ScrollToTop />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
