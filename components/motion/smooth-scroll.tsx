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

/**
 * Endless decorative CSS loops. Their animation is removed entirely while off screen (globals.css):
 * pausing is not enough, as just having one keeps the browser rebuilding its layers every frame.
 */
const LOOPS = ".animate-pulse-ring, .animate-pulse, .border-beam";

/** Elements that `bindScrollEffects` acts on. */
const BINDABLE = `[data-reveal], [data-split], [data-speed], [data-lag], ${LOOPS}`;

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
const MAX_TOUCH_STAGGER_STEPS = 2;

/** How long the page's height has to hold still before trigger positions are re-measured (ms). */
const REFRESH_DELAY = 150;

/** Touch reveals start this far below the screen (fraction of its height), so they are under way on arrival. */
const ARRIVAL_LEAD = 0.15;
/** A reveal that would start with the element's top above this line (fraction of the screen) is too late. */
const ARRIVAL_CUTOFF = 0.95;

/** Everything observed through `whenArriving`, so a route change can let go of the old page. */
const arrivalObservers = new Set<IntersectionObserver>();

let loopObserver: IntersectionObserver | null = null;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchOnly() {
  return ScrollTrigger.isTouch === 1;
}

/**
 * Touch scrolling runs ahead of JavaScript, so content hidden until a script reacts can fly past
 * blank, and a one-time reveal then plays after the visitor has gone. So on touch, content stays
 * visible (see globals.css) until `animate` claims it just below the screen. If that comes too
 * late, because the element is already on screen, `settle` runs instead and nothing flashes.
 */
function whenArriving(
  elements: HTMLElement[],
  animate: (el: HTMLElement, order: number) => void,
  settle: (el: HTMLElement) => void,
) {
  const observer = new IntersectionObserver(
    (entries) => {
      let order = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const el = entry.target as HTMLElement;
        if (entry.boundingClientRect.top < window.innerHeight * ARRIVAL_CUTOFF) settle(el);
        else animate(el, order++);
      });
    },
    { rootMargin: `0px 0px ${ARRIVAL_LEAD * 100}% 0px` },
  );

  elements.forEach((el) => observer.observe(el));
  arrivalObservers.add(observer);
}

function playReveal(el: HTMLElement, order: number) {
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

  if (isTouchOnly()) {
    whenArriving(
      elements,
      (el, order) => playReveal(el, Math.min(order, MAX_TOUCH_STAGGER_STEPS)),
      (el) => el.classList.add("is-revealed"),
    );
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

        playReveal(el, Math.min(index++, MAX_STAGGER_STEPS));
      });
    },
  });
}

function splitHeading(el: HTMLElement, scrollTrigger?: ScrollTrigger.Vars) {
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
        scrollTrigger,
      });
    },
  });
  splitInstances.add(split);
}

/** Splits `[data-split]` headings into masked lines that slide up when they scroll into view. */
function bindSplits(root: ParentNode, reduced: boolean) {
  const headings = Array.from(
    root.querySelectorAll<HTMLElement>("[data-split]:not([data-split-bound])"),
  );
  headings.forEach((el) => el.setAttribute("data-split-bound", ""));

  if (reduced) {
    headings.forEach((el) => el.classList.add("is-split"));
    return;
  }

  if (isTouchOnly()) {
    whenArriving(
      headings,
      (el) => splitHeading(el),
      (el) => el.classList.add("is-split"),
    );
    return;
  }

  headings.forEach((el) => splitHeading(el, { trigger: el, start: "top 90%", once: true }));
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

/** Marks `LOOPS` elements while they are near the screen, which is what lets them animate. */
function bindLoops(root: ParentNode) {
  loopObserver ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => entry.target.toggleAttribute("data-on-screen", entry.isIntersecting));
    },
    { rootMargin: "100px 0px" },
  );

  const observer = loopObserver;
  root.querySelectorAll(LOOPS).forEach((el) => observer.observe(el));
}

function bindScrollEffects(root: ParentNode, reduced: boolean) {
  bindSpeedEffects(root);
  bindReveals(root, reduced);
  bindSplits(root, reduced);
  bindLoops(root);
}

function releaseObservers() {
  arrivalObservers.forEach((observer) => observer.disconnect());
  arrivalObservers.clear();
  loopObserver?.disconnect();
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
    const mutationObserver = new MutationObserver((mutations) => {
      // Most changes are small UI updates (the typing code card adds a node per letter).
      const hasNewEffects = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some(
          (node) => node instanceof Element && (node.matches(BINDABLE) || node.querySelector(BINDABLE)),
        ),
      );
      if (!hasNewEffects) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => bindScrollEffects(content, reduced));
    });

    // Layout moved (fonts swapped in, a filter removed cards), so trigger positions are stale.
    // Observing the size, rather than reading it, never forces a layout.
    let lastHeight = content.offsetHeight;
    let refreshTimer = 0;
    const resizeObserver = new ResizeObserver(() => {
      const height = content.offsetHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), REFRESH_DELAY);
    });

    mutationObserver.observe(content, { childList: true, subtree: true });
    resizeObserver.observe(content);
    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.clearTimeout(refreshTimer);
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
    releaseObservers();

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
    // `canBind` rather than `ready`: a context change before the page has hydrated would make
    // React hydrate all of it in one blocking task, instead of in small steps around the visitor.
    <SmoothReadyContext.Provider value={canBind}>
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
