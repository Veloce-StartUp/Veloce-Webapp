"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { gsap, playWhileVisible, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

interface HeroProps {
  eyebrow?: string;
  title: string;
  /** Part of the title to render as the green serif accent. */
  highlight?: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/** Small copies of real product screenshots (full-size originals are 1–2 MB each). */
const orbitShots = [
  "/hero/digital-cssl.jpg",
  "/hero/nitc-2026.jpg",
  "/hero/dex-judging-platform.jpg",
  "/hero/slanshei-awards-platform.jpg",
  "/hero/cio-list-platform-cio-model.jpg",
  "/hero/nitc-2026-technology-partner.jpg",
  "/hero/logic-leaf-technologies.jpg",
  "/hero/cio-list-platform.jpg",
  "/hero/cssl-awards.jpg",
  "/hero/nitc-2025.jpg",
  "/hero/dex-judging-platform-dashboard.jpg",
  "/hero/bloodsmate.jpg",
  "/hero/nitc-2026-about.jpg",
  "/hero/digital-cssl-news.jpg",
  "/hero/cio-list-platform-dashboard.jpg",
  "/hero/slanshei-awards-platform-awards.jpg",
  "/hero/logic-leaf-products.jpg",
];

/** Rings are sized as a fraction of the hero's half-width and squashed into ellipses for depth. */
const RING_SQUASH = 0.5;
const rings = [
  { radius: 0.48, speed: 0.05, cards: 5, width: 150 },
  { radius: 0.7, speed: -0.035, cards: 6, width: 175 },
  { radius: 0.92, speed: 0.025, cards: 6, width: 200 },
];

const orbitCards = rings.flatMap((ring, ringIndex) =>
  Array.from({ length: ring.cards }, (_, k) => ({
    ring: ringIndex,
    angle: (k / ring.cards) * Math.PI * 2 + ringIndex * 0.7,
    width: ring.width,
  })),
).map((card, index) => ({ ...card, src: orbitShots[index % orbitShots.length] }));

/**
 * On portrait screens (phones, upright tablets) the text fills the width, so the rings stand
 * upright and carry the cards through the free space above and below it.
 * Radii are fractions of the hero's width (x) and height (y).
 */
const portraitRings = [
  { x: 0.42, y: 0.32 },
  { x: 0.56, y: 0.37 },
  { x: 0.7, y: 0.42 },
];

const capabilities = [
  "Web Development",
  "Mobile Apps",
  "Judging Portal",
  "Event Registration",
  "Cloud Solutions",
  "Data Engineering",
  "Cybersecurity",
  "AI & Automation",
  "Membership Platforms",
];

function renderTitle(title: string, highlight?: string) {
  const index = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || index === -1) return title;

  return (
    <>
      {title.slice(0, index)}
      <span className="hero-highlight text-gradient-green">{highlight}</span>
      {title.slice(index + highlight.length)}
    </>
  );
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  highlight,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#contact",
}: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const orbit = orbitRef.current!;
      const content = contentRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>(".orbit-card", orbit);
      const ringOutlines = gsap.utils.toArray<HTMLElement>(".orbit-ring", orbit);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Ring radii and the text's clear zone; measured on resize rather than every frame.
      let radii = rings.map(() => ({ x: 0, y: 0 }));
      const measure = () => {
        const width = orbit.offsetWidth;
        const height = orbit.offsetHeight;
        const portrait = height > width;
        // Landscape: half the hero width, or more on tall screens so cards circle the text instead of crossing it.
        const base = Math.max(width / 2, height * 0.62);
        radii = rings.map((ring, index) =>
          portrait
            ? { x: portraitRings[index].x * width, y: portraitRings[index].y * height }
            : { x: ring.radius * base, y: ring.radius * base * RING_SQUASH },
        );
        ringOutlines.forEach((outline, index) => {
          outline.style.width = `${radii[index].x * 2}px`;
          outline.style.height = `${radii[index].y * 2}px`;
        });
        orbit.dataset.layout = portrait ? "portrait" : "landscape";
        orbit.style.setProperty("--clear-top", `${content.offsetTop}px`);
        orbit.style.setProperty("--clear-bottom", `${content.offsetTop + content.offsetHeight}px`);
      };

      // Places every card on its ring. `spin` turns the rings, `spread` pushes them outward.
      let scrollProgress = 0;
      const placeCards = (time: number) => {
        const spin = scrollProgress * 1.4;
        const spread = 1 + scrollProgress * 0.7;
        cards.forEach((card, index) => {
          const { ring, angle } = orbitCards[index];
          const theta = angle + time * rings[ring].speed + spin * (ring % 2 ? -1 : 1);
          const depth = (Math.sin(theta) + 1) / 2; // 0 = back of the ring, 1 = front
          const x = Math.cos(theta) * radii[ring].x * spread;
          const y = Math.sin(theta) * radii[ring].y * spread;
          card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.62 + depth * 0.38).toFixed(3)})`;
          card.style.opacity = ((0.35 + depth * 0.65) * (1 - scrollProgress)).toFixed(3);
          card.style.zIndex = String(Math.round(depth * 10));
        });
      };

      measure();
      placeCards(0);
      const resizeObserver = new ResizeObserver(() => {
        measure();
        if (scrollProgress < 1) placeCards(reduced ? 0 : gsap.ticker.time);
      });
      resizeObserver.observe(orbit);
      resizeObserver.observe(content);

      if (reduced) {
        root.classList.add("is-ready");
        return () => resizeObserver.disconnect();
      }

      const tick = (time: number) => {
        if (scrollProgress < 1) placeCards(time);
      };
      gsap.ticker.add(tick);

      // Leaving the hero: rings swell and spin, cards fly outward and fade, content drifts back.
      gsap.to(".orbit-rings", {
        scale: 1.45,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollProgress = self.progress;
        },
      });
      gsap.to(content, {
        yPercent: 24,
        opacity: 0,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "80% top", scrub: true },
      });

      SplitText.create(titleRef.current!, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          // background-clip text doesn't reach into transformed children, so each word gets the gradient.
          self.words.forEach((word) => {
            if (word.closest(".hero-highlight")) word.classList.add("text-gradient-green");
          });
          return gsap.from(self.words, {
            yPercent: 120,
            rotate: 4,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.06,
            delay: 0.25,
          });
        },
      });

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".orbit-card-inner", { scale: 0.4, opacity: 0, duration: 1.6, stagger: 0.05 }, 0)
        .from(".orbit-rings", { opacity: 0, duration: 2 }, 0)
        .from("[data-hero='eyebrow']", { y: -20, opacity: 0, duration: 1 }, 0.1)
        .from("[data-hero='subtitle']", { y: 30, opacity: 0, duration: 1.2 }, 0.7)
        .from("[data-hero='cta']", { y: 30, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.85)
        .from("[data-hero='band']", { yPercent: 100, opacity: 0, duration: 1.2 }, 1);

      root.classList.add("is-ready");

      // Capabilities ticker: steady loop, pushed along by scroll speed.
      const loop = gsap.to(bandRef.current, { xPercent: -100 / 3, ease: "none", duration: 50, repeat: -1 });
      loop.totalTime(loop.duration() * 100);
      playWhileVisible(loop, root);
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
          gsap.to(loop, { timeScale: (boost < 0 ? -1 : 1) * (1 + Math.abs(boost)), duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3, ease: "power2.out" });
        },
      });

      // The whole orbit leans toward the cursor.
      let cleanupPointer = () => {};
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const xTo = gsap.quickTo(orbit, "x", { duration: 1.4, ease: "power3.out" });
        const yTo = gsap.quickTo(orbit, "y", { duration: 1.4, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          xTo((event.clientX / window.innerWidth - 0.5) * -40);
          yTo((event.clientY / window.innerHeight - 0.5) * -28);
        };
        root.addEventListener("pointermove", onMove);
        cleanupPointer = () => root.removeEventListener("pointermove", onMove);
      }

      return () => {
        gsap.ticker.remove(tick);
        resizeObserver.disconnect();
        cleanupPointer();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="hero"
      className="hero-root relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden pb-11 pt-20 lg:pt-24"
    >
      {/* Horizon arc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[calc(100%-150px)] h-[720px] w-[170%] -translate-x-1/2 rounded-[100%] border-t border-green-400/20 bg-[radial-gradient(closest-side,#000_80%,rgba(34,197,94,0.1))] shadow-[0_-40px_140px_-50px_rgba(74,222,128,0.25)] lg:w-[140%]"
      />

      {/* Orbiting screenshots, faded out behind the headline */}
      <div
        ref={orbitRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_46%_40%_at_50%_53%,transparent_48%,#000_100%)] data-[layout=portrait]:[mask-image:linear-gradient(to_bottom,#000_calc(var(--clear-top)-56px),rgb(0_0_0/0.12)_var(--clear-top),rgb(0_0_0/0.12)_var(--clear-bottom),#000_calc(var(--clear-bottom)+56px))]"
      >
        <div className="orbit-rings absolute inset-0">
          {rings.map((ring) => (
            <span
              key={ring.radius}
              className="orbit-ring absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.07]"
              style={{ width: `${ring.radius * 100}vw`, aspectRatio: `1 / ${RING_SQUASH}` }}
            />
          ))}
        </div>

        {orbitCards.map((card, index) => (
          <div
            key={index}
            className="orbit-card absolute left-1/2 top-[53%] will-change-transform"
            style={{ width: card.width, marginLeft: -card.width / 2, marginTop: -card.width * 0.27 }}
          >
            <div className="orbit-card-inner rounded-xl border border-white/10 bg-white/[0.04] p-1 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] max-md:scale-75">
              <Image
                src={card.src}
                alt=""
                width={560}
                height={286}
                sizes={`${card.width}px`}
                loading="eager"
                className="aspect-[39/20] w-full rounded-lg object-cover object-top"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Padding above matches the nav and below matches the ticker, so this centres in the visible space */}
      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
        {eyebrow && (
          <Link
            href={ctaHref}
            data-hero="eyebrow"
            className="glass group mx-auto inline-flex items-center gap-2 rounded-full py-1.5 pl-6 pr-4 text-xs uppercase tracking-[0.18em] text-gray-200 transition-colors hover:text-white sm:text-sm"
          >
            {/* <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="animate-pulse-ring absolute h-2 w-2 rounded-full bg-green-400" />
              <span className="relative h-2 w-2 rounded-full bg-green-400" />
            </span> */}
            {eyebrow}
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}

        <h1
          ref={titleRef}
          data-hero="title"
          className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[1.02] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {renderTitle(title, highlight)}
        </h1>

        <p
          data-hero="subtitle"
          className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-300 md:text-xl"
        >
          {subtitle}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {ctaLabel && (
            <div data-hero="cta" className="w-full sm:w-auto">
              <Link href={ctaHref} className="btn-primary group h-14 w-full px-8 text-base sm:w-auto">
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
          <div data-hero="cta" className="w-full sm:w-auto">
            <Link href="#judging-portal" className="btn-glass h-14 w-full px-8 text-base sm:w-auto">
              Explore our platforms
            </Link>
          </div>
        </div>
      </div>

      {/* Capabilities ticker along the bottom edge */}
      <div
        data-hero="band"
        aria-label="What we build"
        className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-y border-white/[0.08] bg-black/40 backdrop-blur-md"
      >
        <div ref={bandRef} className="flex w-max">
          {[0, 1, 2].map((copy) => (
            <div key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-center">
              {capabilities.map((capability) => (
                <span
                  key={capability}
                  className="flex items-center gap-6 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300"
                >
                  {capability}
                  <span className="h-1 w-1 rounded-full bg-green-400" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
