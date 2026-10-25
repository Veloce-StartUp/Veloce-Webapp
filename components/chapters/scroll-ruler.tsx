"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { gsap, ScrollSmoother, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { usePageChapters } from "@/components/chapters/use-page-chapters";

const MAJOR_TICKS = Array.from({ length: 11 }, (_, index) => index * 10);

/**
 * Fixed scroll ruler on the right edge (wide desktop): ticks from 0 to 100, a live marker,
 * dots where chapters start, and click or drag to move through the page.
 */
export function ScrollRuler() {
  const chapters = usePageChapters();
  const trackRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const isDragging = useRef(false);
  const [marks, setMarks] = useState<Array<{ label: string; at: number }>>([]);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => {
        trackRef.current?.style.setProperty("--progress", self.progress.toFixed(4));
        if (valueRef.current) valueRef.current.textContent = String(Math.round(self.progress * 100));
      },
    });
  });

  // Chapter starts as fractions of the page, re-measured after every layout refresh.
  // Measured from layout rather than smoother.offset(), which can itself trigger a refresh
  // (and so call this listener again, endlessly).
  useEffect(() => {
    const measure = () => {
      const max = ScrollTrigger.maxScroll(window);
      if (!max) return;
      const scrolled = ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
      setMarks(
        chapters.map((chapter) => {
          const start = chapter.el.getBoundingClientRect().top + scrolled;
          return { label: chapter.label, at: gsap.utils.clamp(0, 1, start / max) };
        }),
      );
    };

    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    return () => ScrollTrigger.removeEventListener("refresh", measure);
  }, [chapters]);

  const pointerFraction = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return gsap.utils.clamp(0, 1, (event.clientY - rect.top) / rect.height);
  };

  const scrollToPointer = (event: PointerEvent<HTMLDivElement>) => {
    scrollToTarget(pointerFraction(event) * ScrollTrigger.maxScroll(window));
  };

  return (
    <div aria-hidden="true" className="fixed inset-y-0 right-0 z-40 hidden w-14 min-[1400px]:block">
      <div
        ref={trackRef}
        className="group absolute bottom-10 right-4 top-28 w-7 cursor-crosshair"
        onPointerDown={(event) => {
          isDragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          scrollToPointer(event);
        }}
        onPointerMove={(event) => {
          event.currentTarget.style.setProperty("--hover", pointerFraction(event).toFixed(4));
          if (isDragging.current) scrollToPointer(event);
        }}
        onPointerUp={() => {
          isDragging.current = false;
        }}
        onPointerCancel={() => {
          isDragging.current = false;
        }}
      >
        {/* Minor ticks every 2% */}
        <div className="absolute inset-y-0 right-0 w-1.5 bg-[linear-gradient(to_bottom,rgb(255_255_255/0.16)_1px,transparent_1px)] bg-[length:100%_2%]" />

        {MAJOR_TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute right-0 flex -translate-y-1/2 items-center gap-1"
            style={{ top: `${tick}%` }}
          >
            <span className="font-mono text-[9px] leading-none text-gray-500">{tick}</span>
            <span className="h-px w-3 bg-white/30" />
          </div>
        ))}

        {marks.map((mark) => (
          <span
            key={mark.label}
            title={mark.label}
            className="absolute -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-green-400/70"
            style={{ top: `${mark.at * 100}%` }}
          />
        ))}

        {/* Where a click would land */}
        <span
          className="pointer-events-none absolute right-0 h-px w-7 bg-white/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ top: "calc(var(--hover, 0) * 100%)" }}
        />

        {/* Current position */}
        <div
          className="pointer-events-none absolute -left-2 right-0 flex -translate-y-1/2 items-center justify-end gap-1.5"
          style={{ top: "calc(var(--progress, 0) * 100%)" }}
        >
          <span ref={valueRef} className="font-mono text-[9px] leading-none text-green-300">
            0
          </span>
          <span className="h-px w-5 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
        </div>
      </div>
    </div>
  );
}
