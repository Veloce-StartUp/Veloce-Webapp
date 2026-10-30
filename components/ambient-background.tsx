"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Fixed glow + grid layer behind the whole site; it's what the glass panels blur. */
export function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Full-screen layers moving under every scroll frame are too much for a phone's GPU.
      if (ScrollTrigger.isTouch === 1) return;

      // The orbs drift as the page scrolls, so every section sits on a slightly different glow.
      const scrollTrigger = {
        start: 0,
        end: "max",
        scrub: 1.5,
        refreshPriority: -1,
      };
      gsap.to(".orb-a", { yPercent: 70, xPercent: 20, ease: "none", scrollTrigger });
      gsap.to(".orb-b", { yPercent: -40, xPercent: -15, ease: "none", scrollTrigger });
      gsap.to(".orb-c", { yPercent: -60, ease: "none", scrollTrigger });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      <div className="ambient-grid absolute inset-0" />
      <div className="orb-a absolute inset-0">
        <div className="ambient-orb ambient-orb-a" />
      </div>
      <div className="orb-b absolute inset-0">
        <div className="ambient-orb ambient-orb-b" />
      </div>
      <div className="orb-c absolute inset-0">
        <div className="ambient-orb ambient-orb-c" />
      </div>
      <div className="ambient-noise absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(0_0_0/0.7)_100%)]" />
    </div>
  );
}
