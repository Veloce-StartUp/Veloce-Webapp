"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, useGSAP);
}

/** Pauses an endless animation whenever `trigger` is off screen, so hidden sections cost nothing. */
export function playWhileVisible(animation: gsap.core.Animation, trigger: gsap.DOMTarget) {
  animation.pause();
  return ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? animation.resume() : animation.pause()),
  });
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP };
