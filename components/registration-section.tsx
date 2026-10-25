"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CreditCard,
  ExternalLink,
  Ticket,
} from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/section-heading";
import { getProjectBySlug, type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const editions = ["nitc-2026", "nitc-2025"].flatMap((slug) => {
  const project = getProjectBySlug(slug);
  return project ? [project] : [];
});

const flow = [
  {
    icon: Ticket,
    title: "Choose a package",
    description: "Full conference, inauguration or single-day passes.",
  },
  {
    icon: Building2,
    title: "Individual or corporate",
    description: "One delegate, or a whole team under one invoice.",
  },
  {
    icon: CreditCard,
    title: "Pay online",
    description: "Integrated payment gateway with emailed confirmation.",
  },
  {
    icon: BadgeCheck,
    title: "Badge & entry",
    description: "Attendee records turn into print-ready badges.",
  },
];

const stats = [
  { value: "2", label: "NITC editions delivered" },
  { value: "3", label: "Conference days per edition" },
  { value: "750+", label: "Delegate seats at NITC 2025" },
  { value: "Live", label: "Organiser reporting" },
];

const capabilities = [
  "Delegate registration",
  "Corporate & individual packages",
  "Payment gateway integration",
  "Email confirmations",
  "Badge printing",
  "Real-time reporting",
  "Agenda & speaker management",
  "Sponsor showcase",
];

/** Decorative QR-style pattern for the sample pass (deterministic, so server and client match). */
const QR_SIZE = 21;
const qrCells = (() => {
  const cells: Array<[number, number]> = [];
  let seed = 11;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= QR_SIZE - 8 && y < 8) || (x < 8 && y >= QR_SIZE - 8);

  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      if (!inFinder(x, y) && random() > 0.5) cells.push([x, y]);
    }
  }
  return cells;
})();

const finders: Array<[number, number]> = [
  [0, 0],
  [QR_SIZE - 7, 0],
  [0, QR_SIZE - 7],
];

function QrPattern() {
  return (
    <svg viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} className="h-full w-full" aria-hidden="true">
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" rx="1.2" className="fill-white" />
          <rect x={x + 1} y={y + 1} width="5" height="5" rx="0.8" className="fill-black" />
          <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.5" className="fill-green-400" />
        </g>
      ))}
      {qrCells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx="0.2" className="fill-white/85" />
      ))}
    </svg>
  );
}

function DelegatePass() {
  return (
    <div
      data-reveal="scale"
      data-tilt="8"
      className="spotlight relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/[0.13] via-white/[0.04] to-green-500/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(74,222,128,0.2)] backdrop-blur-2xl"
    >
      <div className="p-6 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-semibold tracking-tight text-white">NITC 2026</p>
            <p className="text-xs text-gray-300">National IT Conference</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-400/30 bg-green-500/15 text-green-300">
            <Ticket className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-green-300">Delegate pass</p>
        <p className="mt-1 text-xl font-medium text-white">Your Name</p>
        <p className="text-sm text-gray-300">Your Organisation</p>
      </div>

      {/* Perforation */}
      <div className="relative flex items-center" aria-hidden="true">
        <span className="absolute -left-3 h-6 w-6 rounded-full border border-white/15 bg-black" />
        <span className="mx-6 w-full border-t border-dashed border-white/20" />
        <span className="absolute -right-3 h-6 w-6 rounded-full border border-white/15 bg-black" />
      </div>

      <div className="flex items-end justify-between gap-5 p-6 pt-5">
        <dl className="grid gap-3 text-xs">
          <div>
            <dt className="text-gray-400">Package</dt>
            <dd className="text-white">Full Conference</dd>
          </div>
          <div>
            <dt className="text-gray-400">Dates</dt>
            <dd className="text-white">14 – 16 Oct 2026</dd>
          </div>
          <div>
            <dt className="text-gray-400">Venue</dt>
            <dd className="text-white">Shangri-La, Colombo</dd>
          </div>
        </dl>
        <div className="w-24 shrink-0 rounded-xl bg-black p-2 ring-1 ring-white/10">
          <QrPattern />
        </div>
      </div>

      <p className="border-t border-white/[0.08] px-6 py-3 text-center text-[10px] uppercase tracking-[0.25em] text-gray-400">
        Sample pass · Registration by Veloce
      </p>
    </div>
  );
}

function EditionCard({ project }: { project: Project }) {
  const shots = [project.image, ...project.gallery];
  const [shot, setShot] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const startCycling = () => {
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setShot((index) => (index + 1) % shots.length), 1400);
  };
  const stopCycling = () => {
    window.clearInterval(timer.current);
    setShot(0);
  };

  useEffect(() => () => window.clearInterval(timer.current), []);

  return (
    <article
      data-reveal
      data-tilt="3"
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      className="glass spotlight group flex flex-col overflow-hidden rounded-[1.75rem]"
    >
      <Link
        href={`/products/${project.slug}`}
        className="relative m-2 block aspect-[39/20] overflow-hidden rounded-[1.25rem] bg-black"
        aria-label={`${project.productName} case study`}
      >
        {shots.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`${project.productName} screenshot ${index + 1}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={cn(
              "object-cover object-top transition-all duration-700",
              index === shot ? "scale-100 opacity-100" : "scale-105 opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-white">
          {project.year}
        </span>
        <div className="absolute bottom-4 left-4 flex gap-1.5" aria-hidden="true">
          {shots.map((src, index) => (
            <span
              key={src}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === shot ? "w-6 bg-green-400" : "w-1.5 bg-white/40",
              )}
            />
          ))}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6 pt-4 md:p-7 md:pt-5">
        <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-green-300">
          {project.productName}
        </h3>
        <p className="mt-1 font-medium text-green-400">{project.title}</p>
        <p className="mt-3 text-gray-300">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-gray-200"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-6">
          <Link href={`/products/${project.slug}`} className="btn-glass btn-sm group/link">
            Case study
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.productName} website`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-200 transition-colors hover:border-green-400/50 hover:text-green-300"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function RegistrationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>(".reg-step");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".reg-line", { scaleX: 1 });
        steps.forEach((step) => step.classList.add("is-active"));
        return;
      }

      // The connector fills left to right and lights each step as it arrives
      // (step i sits at i / (steps - 1) along the line).
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: ".reg-flow", start: "top 75%", end: "bottom 50%", scrub: 1 },
      });
      timeline.fromTo(".reg-line", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length - 1 });
      steps.forEach((step, index) => {
        timeline.call(
          () => step.classList.toggle("is-active", timeline.scrollTrigger!.direction > 0 || index === 0),
          [],
          index,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="event-registration" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        data-speed="0.85"
        className="pointer-events-none absolute left-[-15%] top-[30%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.06),transparent)]"
      />

      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          eyebrow="Event Registration"
          icon={Ticket}
          title={
            <>
              Registration built for <span className="text-gradient-green">national-scale events</span>
            </>
          }
          description="The registration platform behind Sri Lanka's National IT Conference: packages, corporate groups, payments and badges, across two editions."
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Registration flow */}
            <div data-reveal="left" className="reg-flow glass rounded-[1.75rem] p-6 md:p-8">
              <p className="mb-8 text-xs uppercase tracking-[0.2em] text-gray-400">The delegate journey</p>
              <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
                <span
                  aria-hidden="true"
                  className="absolute left-[12.5%] right-[12.5%] top-[1.375rem] hidden h-px bg-white/10 md:block"
                />
                <span
                  aria-hidden="true"
                  className="reg-line absolute left-[12.5%] right-[12.5%] top-[1.375rem] hidden h-px origin-left bg-gradient-to-r from-green-300 to-green-600 shadow-[0_0_12px_rgba(74,222,128,0.8)] md:block"
                  style={{ transform: "scaleX(0)" }}
                />
                {flow.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li
                      key={step.title}
                      className={cn("reg-step relative flex gap-4 md:flex-col md:items-center md:text-center", index === 0 && "is-active")}
                    >
                      <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black text-gray-400 transition-all duration-500 [.is-active_&]:border-green-400/50 [.is-active_&]:bg-green-950 [.is-active_&]:text-green-300 [.is-active_&]:shadow-[0_0_24px_-4px_rgba(74,222,128,0.7)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="md:mt-4">
                        <h3 className="font-semibold text-white/75 transition-colors duration-500 [.is-active_&]:text-white">
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

            <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  data-reveal
                  className="glass flex flex-col-reverse rounded-2xl p-5"
                >
                  <dt className="mt-1 text-xs text-gray-300">{stat.label}</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 m-auto h-72 w-72 rounded-full bg-green-500/10 blur-[90px]"
            />
            <DelegatePass />
          </div>
        </div>

        {/* Editions */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {editions.map((project) => (
            <EditionCard key={project.slug} project={project} />
          ))}
        </div>

        {/* Capabilities + CTA */}
        <div
          data-reveal
          className="glass mt-8 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] p-6 md:p-8 lg:flex-row lg:items-center"
        >
          <div className="flex flex-wrap gap-2">
            {capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-gray-200"
              >
                {capability}
              </span>
            ))}
          </div>
          <Link href="/#contact" className="btn-primary group shrink-0">
            Plan your event registration
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
