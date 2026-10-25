"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { usePageChapters } from "@/components/chapters/use-page-chapters";
import { cn } from "@/lib/utils";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScrollToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  // On desktop, pages with chapters show the chapter index and scroll ruler in this corner instead.
  const hasChapters = usePageChapters().length > 1;

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => {
        ringRef.current?.style.setProperty(
          "stroke-dashoffset",
          String(CIRCUMFERENCE * (1 - self.progress)),
        );
        if (buttonRef.current) {
          buttonRef.current.dataset.visible = String(self.scroll() > 400);
        }
      },
    });
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      data-visible="false"
      onClick={() => scrollToTarget(0)}
      aria-label="Scroll to top"
      className={cn(
        "glass group fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-green-300 transition-all duration-500 hover:text-white data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-4 data-[visible=false]:opacity-0 sm:bottom-8 sm:right-8",
        hasChapters && "xl:hidden",
      )}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={RADIUS} className="fill-none stroke-white/10" strokeWidth="2" />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={RADIUS}
          className="fill-none stroke-green-400"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
