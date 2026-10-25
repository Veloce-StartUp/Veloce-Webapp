"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "@/lib/gsap";
import { getHashTarget, scrollToTarget } from "@/lib/scroll";

/**
 * True once ScrollSmoother exists (or has been skipped on touch / reduced-motion devices).
 * ScrollTriggers that pin must be created after this, so they use transform pinning.
 */
const SmoothReadyContext = createContext(false);

export function useSmoothReady() {
  return useContext(SmoothReadyContext);
}

const splitInstances = new Set<SplitText>();

const REVEAL_FROM: Record<string, gsap.TweenVars> = {
  up: { y: 56 },
  down: { y: -56 },
  left: { x: -64 },
  right: { x: 64 },
  scale: { scale: 0.92 },
  fade: {},
};

/** Reveals in one batch stagger by 0.08s each, up to this many steps. */
const MAX_STAGGER_STEPS = 5;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fades in every `[data-reveal]` element the first time it scrolls into view. */
function bindReveals(root: ParentNode, reduced: boolean) {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-bound])"),
  );
  if (!elements.length) return;

  elements.forEach((el) => el.setAttribute("data-reveal-bound", ""));

  if (reduced) {
    elements.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  ScrollTrigger.batch(elements, {
    start: "top 90%",
    once: true,
    onEnter: (batch) => {
      // A jump (anchor link, fast fling) enters everything it passed in one batch,
      // so skip what is already off-screen and cap the stagger for the rest.
      let index = 0;
      (batch as HTMLElement[]).forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) {
          el.classList.add("is-revealed");
          return;
        }

        const order = Math.min(index++, MAX_STAGGER_STEPS);
        const from = REVEAL_FROM[el.dataset.reveal || "up"] ?? REVEAL_FROM.up;
        gsap.fromTo(
          el,
          { opacity: 0, x: 0, y: 0, scale: 1, ...from },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "expo.out",
            delay: order * 0.08 + (Number(el.dataset.revealDelay) || 0),
            onComplete: () => {
              el.classList.add("is-revealed");
              gsap.set(el, { clearProps: "opacity,transform" });
            },
          },
        );
      });
    },
  });
}

/** Splits `[data-split]` headings into masked lines that slide up when they scroll into view. */
function bindSplits(root: ParentNode, reduced: boolean) {
  const headings = Array.from(
    root.querySelectorAll<HTMLElement>("[data-split]:not([data-split-bound])"),
  );

  headings.forEach((el) => {
    el.setAttribute("data-split-bound", "");

    if (reduced) {
      el.classList.add("is-split");
      return;
    }

    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        el.classList.add("is-split");
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      },
    });
    splitInstances.add(split);
  });
}

/** Parallax for `[data-speed]` / `[data-lag]` elements (needs ScrollSmoother). */
function bindSpeedEffects(root: ParentNode) {
  const smoother = ScrollSmoother.get();
  if (!smoother) return;

  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-speed]:not([data-speed-bound]), [data-lag]:not([data-speed-bound])",
    ),
  );
  if (!elements.length) return;

  elements.forEach((el) => el.setAttribute("data-speed-bound", ""));
  smoother.effects(elements);
}

function bindScrollEffects(root: ParentNode, reduced: boolean) {
  bindSpeedEffects(root);
  bindReveals(root, reduced);
  bindSplits(root, reduced);
}

function revertDetachedSplits() {
  splitInstances.forEach((split) => {
    if (split.elements.some((el) => el.isConnected)) return;
    split.revert();
    splitInstances.delete(split);
  });
}

/** One pointer listener drives the cursor spotlight (`.spotlight`) and 3D tilt (`[data-tilt]`) on every card. */
function bindPointerEffects() {
  let tiltEl: HTMLElement | null = null;

  const resetTilt = () => {
    if (!tiltEl) return;
    tiltEl.style.setProperty("--rx", "0deg");
    tiltEl.style.setProperty("--ry", "0deg");
    tiltEl = null;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const target = event.target instanceof Element ? event.target : null;

    const spot = target?.closest<HTMLElement>(".spotlight");
    if (spot) {
      const rect = spot.getBoundingClientRect();
      spot.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      spot.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }

    const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
    if (tilt !== tiltEl) resetTilt();
    if (!tilt) return;

    tiltEl = tilt;
    const rect = tilt.getBoundingClientRect();
    const max = Number(tilt.dataset.tilt) || 6;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.style.setProperty("--ry", `${(x * max * 2).toFixed(2)}deg`);
    tilt.style.setProperty("--rx", `${(-y * max * 2).toFixed(2)}deg`);
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", resetTilt);

  return () => {
    document.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener("pointerleave", resetTilt);
  };
}

/** Same-page hash links scroll smoothly instead of jumping. */
function bindAnchorLinks() {
  const onClick = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const anchor =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[href]")
        : null;
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    const url = new URL(anchor.href, window.location.href);
    if (
      url.origin !== window.location.origin ||
      url.pathname !== window.location.pathname ||
      !url.hash
    ) {
      return;
    }

    const target = getHashTarget(url.hash);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);
  };

  // Capture phase, so Next.js <Link> sees the event as handled.
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

/** Rendered after the page inside the Suspense boundary, so its effect runs once the page has hydrated. */
function HydrationSignal({ onHydrated }: { onHydrated: () => void }) {
  useEffect(() => onHydrated(), [onHydrated]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRoute = useRef(true);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const markHydrated = useCallback(() => setHydrated(true), []);
  const pathname = usePathname();

  // Effects, reveals and splits change the page's DOM, so they wait until React has hydrated it.
  const canBind = ready && hydrated;

  useGSAP(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (!prefersReducedMotion() && ScrollTrigger.isTouch !== 1) {
      ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 1.15,
        effects: false,
        smoothTouch: false,
      });
    }

    setReady(true);
  }, []);

  useEffect(() => {
    const cleanPointer = bindPointerEffects();
    const cleanAnchors = bindAnchorLinks();
    return () => {
      cleanPointer();
      cleanAnchors();
    };
  }, []);

  // Bind anything mounted after the first pass (filters, tabs, route changes).
  useEffect(() => {
    const content = contentRef.current;
    if (!canBind || !content) return;

    const reduced = prefersReducedMotion();
    let frame = 0;
    let lastHeight = content.offsetHeight;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        bindScrollEffects(content, reduced);

        // Layout moved (e.g. a filter removed cards), so trigger positions are stale.
        const height = content.offsetHeight;
        if (height !== lastHeight) {
          lastHeight = height;
          ScrollTrigger.refresh();
        }
      });
    });

    observer.observe(content, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [canBind]);

  useEffect(() => {
    const content = contentRef.current;
    if (!canBind || !content) return;

    const reduced = prefersReducedMotion();
    const isFirst = isFirstRoute.current;
    isFirstRoute.current = false;

    // Triggers and splits whose elements left with the previous page.
    ScrollTrigger.getAll().forEach((trigger) => {
      const el = trigger.trigger;
      if (el && !el.isConnected) trigger.kill();
    });
    revertDetachedSplits();

    if (!isFirst) {
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.scrollTop(0);
      else window.scrollTo(0, 0);
    }

    bindScrollEffects(content, reduced);

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const target = window.location.hash ? getHashTarget(window.location.hash) : null;
      if (target) scrollToTarget(target, !isFirst);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, canBind]);

  return (
    <SmoothReadyContext.Provider value={ready}>
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          <Suspense fallback={null}>
            {children}
            <HydrationSignal onHydrated={markHydrated} />
          </Suspense>
        </div>
      </div>
    </SmoothReadyContext.Provider>
  );
}
