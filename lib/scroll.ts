"use client";

import { ScrollSmoother } from "@/lib/gsap";

/** Space left above a section when scrolling to it, so the floating nav doesn't cover the heading. */
export const NAV_OFFSET = 96;

export function getHashTarget(hash: string): HTMLElement | null {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  return id ? document.getElementById(id) : null;
}

/** Scrolls to an element (or y position) through ScrollSmoother when it is active, natively otherwise. */
export function scrollToTarget(target: Element | number, smooth = true) {
  const smoother = ScrollSmoother.get();

  if (smoother) {
    smoother.scrollTo(target, smooth, typeof target === "number" ? undefined : `top ${NAV_OFFSET}px`);
    return;
  }

  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
}
