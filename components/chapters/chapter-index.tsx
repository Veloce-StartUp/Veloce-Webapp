"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { usePageChapters, type PageChapter } from "@/components/chapters/use-page-chapters";
import { cn } from "@/lib/utils";

function ChapterLink({
  chapter,
  index,
  size,
  hidden = false,
}: {
  chapter: PageChapter;
  index: number;
  size: "small" | "large";
  hidden?: boolean;
}) {
  return (
    <button
      type="button"
      tabIndex={hidden ? -1 : undefined}
      aria-label={`Go to ${chapter.label}`}
      onClick={() => scrollToTarget(chapter.el)}
      className={cn(
        "block text-right uppercase transition-colors duration-300",
        size === "large"
          ? "text-[2.1rem] font-semibold leading-none tracking-tight text-white"
          : "text-[10px] font-medium leading-4 tracking-[0.24em] text-gray-300 hover:text-green-300",
        hidden ? "pointer-events-none" : "pointer-events-auto",
      )}
    >
      {/* Every letter has a stable flip id, so it can fly between the list and the title. */}
      {Array.from(chapter.label).map((char, letter) => (
        <span
          key={letter}
          data-flip-id={`chapter-${index}-${letter}`}
          className={cn("inline-block whitespace-pre", hidden && "opacity-0")}
        >
          {char}
        </span>
      ))}
    </button>
  );
}

/**
 * Fixed chapter index (desktop): chapters already read are stacked small at the top right,
 * the current one is set large beneath them and the rest wait at the bottom right. When the
 * chapter changes, each letter flies to its new place.
 */
export function ChapterIndex() {
  const chapters = usePageChapters();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // Past the last chapter (the footer) the index steps aside.
  const [isPastEnd, setIsPastEnd] = useState(false);
  const activeRef = useRef(0);
  const flipState = useRef<Flip.FlipState | null>(null);
  const flipTimeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    activeRef.current = 0;
    setActive(0);

    const goTo = (index: number) => {
      const root = rootRef.current;
      if (!root || index === activeRef.current) return;
      // Settle any flight still in progress so the new one starts from real positions.
      flipTimeline.current?.progress(1);
      flipState.current = Flip.getState(root.querySelectorAll("[data-flip-id]"), {
        props: "opacity",
      });
      activeRef.current = index;
      setActive(index);
    };

    const triggers = chapters.map((chapter, index) =>
      ScrollTrigger.create({
        trigger: chapter.el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) goTo(index);
        },
      }),
    );

    setIsPastEnd(false);
    const last = chapters[chapters.length - 1];
    if (last) {
      triggers.push(
        ScrollTrigger.create({
          trigger: last.el,
          start: "bottom 65%",
          onEnter: () => setIsPastEnd(true),
          onLeaveBack: () => setIsPastEnd(false),
        }),
      );
    }
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [chapters]);

  useLayoutEffect(() => {
    const state = flipState.current;
    const root = rootRef.current;
    flipState.current = null;
    if (!state || !root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    flipTimeline.current = Flip.from(state, {
      targets: root.querySelectorAll("[data-flip-id]"),
      duration: 0.9,
      ease: "expo.inOut",
      absolute: true,
      scale: true,
      stagger: { amount: 0.3, from: "random" },
    });
  }, [active]);

  if (chapters.length < 2) return null;

  // The opening chapter is the hero itself, so its title only appears once the visitor moves on.
  const isOpening = active === 0;

  return (
    // The two lists are plain flex children of this full-screen layer, so while letters fly
    // (absolutely positioned) they're placed against the screen. Positioned, right-anchored
    // lists would shrink once their letters lift out and throw the letters off the page.
    <nav
      ref={rootRef}
      aria-label="Page chapters"
      className={cn(
        "pointer-events-none fixed inset-0 z-40 hidden flex-col items-end justify-between pb-8 pr-8 pt-28 transition-opacity duration-500 min-[1400px]:pr-[4.5rem] xl:flex",
        isPastEnd && "opacity-0 [&_button]:pointer-events-none",
      )}
    >
      {/* Frosted corners (behind the lists): content passing under the index is blurred and
          dimmed, fading out softly so there is no hard edge. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute right-0 top-20 -z-10 h-[26rem] w-[30rem] bg-black/55 backdrop-blur-md transition-opacity duration-700 [mask-image:radial-gradient(ellipse_at_top_right,#000_30%,transparent_70%)]",
          isOpening && "opacity-0",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 -z-10 h-[22rem] w-[28rem] bg-black/55 backdrop-blur-md [mask-image:radial-gradient(ellipse_at_bottom_right,#000_30%,transparent_70%)]"
      />

      <div className="flex flex-col items-end gap-0.5">
        {chapters.map(
          (chapter, index) =>
            index < active && (
              <ChapterLink key={chapter.label} chapter={chapter} index={index} size="small" />
            ),
        )}
        <div className="mt-2">
          <ChapterLink chapter={chapters[active]} index={active} size="large" hidden={isOpening} />
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        {chapters.map(
          (chapter, index) =>
            index > active && (
              <ChapterLink key={chapter.label} chapter={chapter} index={index} size="small" />
            ),
        )}
      </div>
    </nav>
  );
}
