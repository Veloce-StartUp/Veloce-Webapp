"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentProps } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { SplashCursor as SplashCursorType } from "@/components/ui/splash-cursor";

/*
 * Decorative layers that stay out of the first load. Hiding the desktop-only ones with CSS is not
 * enough: a hidden chapter index still ran its Flip animation on every chapter change, which
 * measured each `display: none` letter one by one and froze phones mid-scroll. So they are not
 * mounted, or even downloaded, on small screens.
 */
const SplashCursor = dynamic(
  () => import("@/components/ui/splash-cursor").then((module) => module.SplashCursor),
  { ssr: false },
);
const ChapterIndex = dynamic(
  () => import("@/components/chapters/chapter-index").then((module) => module.ChapterIndex),
  { ssr: false },
);
const ScrollRuler = dynamic(
  () => import("@/components/chapters/scroll-ruler").then((module) => module.ScrollRuler),
  { ssr: false },
);

/** Phones load the splash once the page has been still this long: its shaders compile on the main thread. */
const TOUCH_SPLASH_DELAY = 1500;

export function DeferredSplashCursor(props: ComponentProps<typeof SplashCursorType>) {
  const allowed = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const [isDue, setIsDue] = useState(false);

  useEffect(() => {
    if (isDue) return;
    if (!window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      setIsDue(true);
      return;
    }

    let timer = window.setTimeout(() => setIsDue(true), TOUCH_SPLASH_DELAY);
    const postpone = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIsDue(true), TOUCH_SPLASH_DELAY);
    };
    window.addEventListener("scroll", postpone, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", postpone);
    };
  }, [isDue]);

  return allowed && isDue ? <SplashCursor {...props} /> : null;
}

export function DesktopChapterIndex() {
  return useMediaQuery("(min-width: 1280px)") ? <ChapterIndex /> : null;
}

export function DesktopScrollRuler() {
  return useMediaQuery("(min-width: 1400px)") ? <ScrollRuler /> : null;
}
