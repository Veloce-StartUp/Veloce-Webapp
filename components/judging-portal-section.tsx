"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ClipboardList,
  FileUp,
  Gavel,
  Layers,
  ListChecks,
  Lock,
  Scale,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/section-heading";
import { getProjectBySlug } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** How long each platform stays on screen before the showcase moves on. */
const ROTATE_SECONDS = 7;

const platforms = [
  { slug: "digital-excellence-awards", label: "DEX" },
  { slug: "slanshei-higher-education-awards", label: "SLANSHEI" },
  { slug: "cssl-national-cio-list", label: "CIO List" },
  { slug: "cssl-awards", label: "CSSL Awards" },
].flatMap(({ slug, label }) => {
  const project = getProjectBySlug(slug);
  return project ? [{ label, project }] : [];
});

const workflow = [
  {
    icon: UserCheck,
    title: "Verified submissions",
    description: "Applicants verify their details, save drafts and upload evidence against each award.",
  },
  {
    icon: Users,
    title: "Panel assignment",
    description: "Entries reach the right judging panels, with conflicts and progress tracked in one place.",
  },
  {
    icon: Scale,
    title: "Criteria-based scoring",
    description: "Judges score in their own workspace, with every mark tied to a defined criterion.",
  },
  {
    icon: Trophy,
    title: "Automated results",
    description: "Scores roll up into category results, ready for the committee to review.",
  },
];

const capabilities = [
  {
    icon: BadgeCheck,
    title: "Verified applicants",
    description: "Email and mobile verification before anything is saved.",
  },
  {
    icon: FileUp,
    title: "Evidence uploads",
    description: "Documents, media, signatures and official stamps.",
  },
  {
    icon: Layers,
    title: "Custom awards",
    description: "Categories, questions and criteria configured by admins.",
  },
  {
    icon: Gavel,
    title: "Judge workspace",
    description: "Judges see only the entries assigned to them.",
  },
  {
    icon: ListChecks,
    title: "Auditable scoring",
    description: "Every score tied to a criterion and a judge.",
  },
  {
    icon: ClipboardList,
    title: "Status tracking",
    description: "Applicants follow each entry from draft to result.",
  },
];

function hostname(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function JudgingPortalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // One screenshot ahead of the active one is mounted, so the next fade has its image ready.
  const [mountedUpTo, setMountedUpTo] = useState(1);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const active = platforms[activeIndex];
  const isPlaying = inView && !isHovered;

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: showcaseRef.current,
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => setInView(self.isActive),
      });

      const steps = gsap.utils.toArray<HTMLElement>(".workflow-step");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".workflow-line", { scaleY: 1 });
        steps.forEach((step) => step.classList.add("is-active"));
        return;
      }

      // Each connector fills while scrolling from its step to the next; each step lights up on arrival.
      steps.forEach((step, index) => {
        const next = steps[index + 1];
        const line = step.querySelector(".workflow-line");
        if (!next || !line) return;
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: step, start: "top 68%", endTrigger: next, end: "top 68%", scrub: true },
          },
        );
      });
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 68%",
          onEnter: () => step.classList.add("is-active"),
          onLeaveBack: () => step.classList.remove("is-active"),
        });
      });
    },
    { scope: sectionRef },
  );

  // Each tab owns a progress bar; when it fills, the showcase moves to the next platform.
  useGSAP(
    () => {
      const bar = barRefs.current[activeIndex];
      if (!bar) return;

      progressTween.current = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: ROTATE_SECONDS,
          ease: "none",
          paused: true,
          onComplete: () => setActiveIndex((index) => (index + 1) % platforms.length),
        },
      );

      gsap.fromTo(
        `#judging-panel-${activeIndex} [data-showcase-item]`,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.05 },
      );
    },
    { dependencies: [activeIndex], scope: showcaseRef, revertOnUpdate: true },
  );

  useEffect(() => {
    setMountedUpTo((upTo) => Math.max(upTo, Math.min(activeIndex + 1, platforms.length - 1)));
  }, [activeIndex]);

  useEffect(() => {
    const tween = progressTween.current;
    if (!tween) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isPlaying && !reduced) tween.play();
    else tween.pause();
  }, [isPlaying, activeIndex]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + step + platforms.length) % platforms.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  if (!active) return null;

  return (
    <section ref={sectionRef} id="judging-portal" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        data-speed="0.85"
        className="pointer-events-none absolute right-[-15%] top-[20%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.06),transparent)]"
      />

      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          eyebrow="Judging Portal"
          icon={Gavel}
          title={
            <>
              Awards judging, <span className="text-gradient-green">without the spreadsheets</span>
            </>
          }
          description="One platform for the full awards cycle: verified entries, judge panels, criteria-based scoring and automated results. Already trusted by four awards programmes in Sri Lanka."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* How it works */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div data-reveal="left" className="workflow glass rounded-[1.75rem] p-6 md:p-8">
              <p className="mb-8 text-xs uppercase tracking-[0.2em] text-gray-400">How it works</p>
              <ol className="space-y-8">
                {workflow.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === workflow.length - 1;
                  return (
                    <li key={step.title} className="workflow-step relative flex gap-5">
                      {/* Connector from this icon down to the next one (the gap is the list's 2rem spacing) */}
                      {!isLast && (
                        <span aria-hidden="true" className="absolute -bottom-8 left-[1.375rem] top-11 w-px bg-white/10">
                          <span
                            className="workflow-line absolute inset-0 origin-top bg-gradient-to-b from-green-300 to-green-600 shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                            style={{ transform: "scaleY(0)" }}
                          />
                        </span>
                      )}
                      <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black text-gray-400 transition-all duration-500 [.is-active_&]:border-green-400/50 [.is-active_&]:bg-green-950 [.is-active_&]:text-green-300 [.is-active_&]:shadow-[0_0_24px_-4px_rgba(74,222,128,0.7)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="pt-1">
                        <p className="font-mono text-xs text-gray-500 transition-colors duration-500 [.is-active_&]:text-green-400">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-white/75 transition-colors duration-500 [.is-active_&]:text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400 transition-colors duration-500 [.is-active_&]:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div data-reveal className="flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact" className="btn-primary group">
                Book a demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/products" className="btn-glass">
                See all projects
              </Link>
            </div>
          </div>

          {/* Platform showcase */}
          <div
            ref={showcaseRef}
            className="lg:col-span-7"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              role="tablist"
              aria-label="Judging portal case studies"
              onKeyDown={onTabKeyDown}
              data-reveal="right"
              className="glass mb-4 grid grid-cols-4 gap-1 rounded-2xl p-1.5"
            >
              {platforms.map((platform, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={platform.label}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`judging-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls={`judging-panel-${index}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative overflow-hidden rounded-xl px-1 pb-4 pt-3 text-xs font-medium transition-colors duration-300 sm:text-sm",
                      isActive
                        ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-gray-300 hover:text-white",
                    )}
                  >
                    {platform.label}
                    <span className="absolute inset-x-3 bottom-2 h-0.5 overflow-hidden rounded-full bg-white/10 sm:inset-x-4">
                      <span
                        ref={(el) => {
                          barRefs.current[index] = el;
                        }}
                        className="block h-full origin-left rounded-full bg-green-400"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Browser frame */}
            <div data-reveal="right" data-tilt="4" className="glass rounded-[1.75rem] p-2 md:p-3">
              <div className="flex items-center gap-3 px-2 pb-2 md:px-3 md:pb-3">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </span>
                <span className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                  <Lock className="h-3 w-3 shrink-0 text-green-400" />
                  <span className="truncate">{hostname(active.project.url)}</span>
                </span>
              </div>
              <div className="relative aspect-[39/20] overflow-hidden rounded-[1.25rem] bg-black">
                {platforms.slice(0, mountedUpTo + 1).map((platform, index) => (
                  <Image
                    key={platform.label}
                    src={platform.project.image}
                    alt={`${platform.project.productName} screenshot`}
                    fill
                    sizes="(min-width: 1024px) 58vw, calc(100vw - 48px)"
                    className={cn(
                      "object-cover object-top transition-all duration-700",
                      index === activeIndex ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* All the details stack in one grid cell, so rotating platforms never changes the height. */}
            <div data-reveal="right" className="glass mt-4 grid rounded-[1.75rem]">
              {platforms.map((platform, index) => {
                const { project } = platform;
                const isActive = index === activeIndex;
                return (
                  <div
                    key={platform.label}
                    id={`judging-panel-${index}`}
                    role="tabpanel"
                    aria-labelledby={`judging-tab-${index}`}
                    aria-hidden={!isActive}
                    className={cn(
                      "p-6 transition-[opacity,visibility] duration-500 [grid-area:1/1] md:p-7",
                      isActive ? "visible opacity-100" : "invisible opacity-0",
                    )}
                  >
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                      <div className="min-w-0 flex-1">
                        <p
                          data-showcase-item
                          className="text-xs uppercase tracking-[0.16em] text-green-300"
                        >
                          {project.year} · {project.category}
                        </p>
                        <h3 data-showcase-item className="mt-2 text-2xl font-semibold text-white">
                          {project.productName}
                        </h3>
                        <p data-showcase-item className="mt-1 text-gray-300">
                          {project.client}
                        </p>
                      </div>
                      <Link
                        data-showcase-item
                        href={`/products/${project.slug}`}
                        className="btn-glass btn-sm group shrink-0"
                      >
                        Case study
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                    <p data-showcase-item className="mt-4 text-gray-200">
                      {project.description}
                    </p>
                    <div data-showcase-item className="mt-5 flex flex-wrap gap-2">
                      {project.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-green-400/20 bg-green-500/[0.07] px-3 py-1 text-xs text-green-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-5">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <div
                key={capability.title}
                data-reveal
                className="glass spotlight group flex items-start gap-4 rounded-2xl p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-400/25 bg-green-500/10 text-green-300 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{capability.title}</h3>
                  <p className="mt-1 text-sm text-gray-300">{capability.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
