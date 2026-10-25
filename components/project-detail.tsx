"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Layers,
  Lock,
  Mail,
  Maximize2,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ProductCard } from "@/components/product-card";
import { getProjectBySlug, getRelatedProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const ctaPromises = [
  { icon: CheckCircle2, label: "Free consultation" },
  { icon: Clock, label: "Replies within 24h" },
  { icon: Sparkles, label: "Tailored proposal" },
];

/** Technologies listed on the CTA's project brief before the rest collapse into "+N". */
const BRIEF_STACK_SIZE = 3;

const platformIcons: Record<string, typeof Globe> = {
  Web: Globe,
  Android: Smartphone,
  iOS: Smartphone,
};

interface ProjectDetailProps {
  slug: string;
}

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const project = getProjectBySlug(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project) return null;

  const Icon = project.icon;
  const relatedProjects = getRelatedProjects(slug);
  const isLive = project.status === "Live";

  const facts = [
    { label: "Client", value: project.client, icon: Building },
    { label: "Category", value: project.category, icon: Layers },
    { label: "Year", value: project.year, icon: CalendarDays },
    { label: "Platforms", value: project.platforms.join(", "), icon: Globe },
  ].filter((fact) => Boolean(fact.value));

  return (
    <div className="relative z-20 pb-20 pt-32">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          data-reveal="fade"
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-400"
        >
          <Link href="/" className="transition-colors hover:text-green-400">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-green-400">
            Projects
          </Link>
          <span>/</span>
          <span className="text-gray-200">{project.productName}</span>
        </nav>

        {/* Hero */}
        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div data-reveal="fade" className="mb-6 flex flex-wrap items-center gap-2">
              <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white">
                <span className={cn("h-2 w-2 rounded-full", isLive ? "bg-green-400" : "bg-amber-400")} />
                {project.status}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-200">
                {project.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-200">
                {project.year}
              </span>
            </div>

            <div className="mb-4 flex items-center gap-4">
              {/* <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-green-400/25 bg-green-500/10 shadow-[0_0_40px_-10px_rgba(74,222,128,0.6)]">
                <Icon className="h-7 w-7 text-green-400" />
              </div> */}
              <h1 data-split className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {project.productName}
              </h1>
            </div>

            <p data-reveal className="mb-6 text-xl font-medium text-green-400 md:text-2xl">
              {project.title}
            </p>
            <p data-reveal className="mb-8 text-pretty text-lg text-gray-300">
              {project.description}
            </p>

            <div data-reveal className="mb-8 flex flex-wrap gap-3">
              {project.platforms.map((platform) => {
                const PlatformIcon = platformIcons[platform] ?? Globe;
                return (
                  <div
                    key={platform}
                    className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-200"
                  >
                    <PlatformIcon className="h-4 w-4 text-green-400" />
                    {platform}
                  </div>
                );
              })}
            </div>

            <div data-reveal className="flex flex-wrap gap-3">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Link href="/products" className="btn-glass group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                All Projects
              </Link>
            </div>
          </div>

          {/* Browser frame */}
          <div data-reveal="right" data-tilt="4" className="glass rounded-[1.75rem] p-2 md:p-3">
            <div className="flex items-center gap-3 px-2 pb-2 md:px-3 md:pb-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </span>
              {project.url && (
                <span className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                  <Lock className="h-3 w-3 shrink-0 text-green-400" />
                  <span className="truncate">{project.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </span>
              )}
            </div>
            <div className="relative overflow-hidden rounded-[1.25rem] bg-black">
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10`} />
              <Image
                src={project.image || "/placeholder.svg"}
                alt={`${project.productName} cover`}
                width={1920}
                height={985}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="relative h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Overview + facts */}
        <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <h2 data-split className="mb-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Project <span className="text-gradient-green">Overview</span>
            </h2>
            {project.overview.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                data-reveal
                className="text-pretty text-lg leading-relaxed text-gray-300"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div data-reveal="right" className="glass h-fit space-y-5 rounded-[1.75rem] p-6">
            <h3 className="text-lg font-semibold text-white">Project Details</h3>
            {facts.map((fact) => {
              const FactIcon = fact.icon;
              return (
                <div key={fact.label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-green-400/20 bg-green-500/10">
                    <FactIcon className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">{fact.label}</div>
                    <div className="text-gray-200">{fact.value}</div>
                  </div>
                </div>
              );
            })}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 break-all border-t border-white/[0.08] pt-4 text-green-400 transition-colors hover:text-green-300"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                {project.url.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div className="mb-20">
            <h2 data-split className="mb-8 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Key <span className="text-gradient-green">Highlights</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {project.highlights.map((highlight) => (
                <div key={highlight.title} data-reveal className="glass spotlight group rounded-[1.75rem] p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-green-400/25 bg-green-500/10 transition-transform duration-500 group-hover:scale-110">
                    <Sparkles className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-green-300">
                    {highlight.title}
                  </h3>
                  <p className="text-pretty text-gray-300">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features + tech stack */}
        <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 data-split className="mb-8 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              What&apos;s <span className="text-gradient-green">Inside</span>
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <div
                  key={feature}
                  data-reveal
                  className="glass flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:border-green-400/40"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 data-split className="mb-8 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Tech <span className="text-gradient-green">Stack</span>
            </h2>
            <div data-reveal className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="glass rounded-full px-4 py-2 text-sm text-gray-200 transition-colors hover:border-green-400/40 hover:text-green-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="mb-20">
            <h2 data-split className="mb-8 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Project <span className="text-gradient-green">Gallery</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {project.gallery.map((shot, index) => (
                <button
                  key={shot}
                  type="button"
                  data-reveal
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Open ${project.productName} screenshot ${index + 1}`}
                  className="glass group relative block cursor-zoom-in overflow-hidden rounded-[1.5rem] p-1.5 text-left transition-colors hover:border-green-400/40"
                >
                  <Image
                    src={shot || "/placeholder.svg"}
                    alt={`${project.productName} screenshot ${index + 1}`}
                    width={1200}
                    height={615}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="h-56 w-full rounded-[1.1rem] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <section
          data-reveal
          aria-labelledby="project-cta-title"
          className="glass-strong spotlight relative mb-20 overflow-hidden rounded-[2.5rem]"
        >
          {/* A lit top edge, a grid field and a glow behind the brief */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-green-300/70 to-transparent" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_55%_75%_at_78%_50%,#000,transparent)]" />
            <div className="absolute -right-20 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-green-500/10 blur-[110px]" />
          </div>

          <div className="relative grid items-center gap-12 px-6 py-12 md:px-14 md:py-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_10px_2px_rgba(74,222,128,0.7)]" />
                Inspired by {project.productName}?
              </span>
              <h2
                id="project-cta-title"
                className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl"
              >
                Have a similar project <span className="text-gradient-green">in mind?</span>
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-lg text-gray-300">
                Tell us what you are building and we will map out how to get it
                designed, built and shipped.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="btn-primary group h-14 px-8 text-base">
                  Start a conversation
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <a href="mailto:build.veloce@gmail.com" className="btn-glass h-14 px-8 text-base">
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-300">
                {ctaPromises.map(({ icon: PromiseIcon, label }) => (
                  <li key={label} className="inline-flex items-center gap-2">
                    <PromiseIcon className="h-4 w-4 text-green-400" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* A brief for "something like this", pre-filled from the project */}
            <div className="lg:col-span-5">
              <div
                data-tilt="4"
                className="relative rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Project brief</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-500/10 px-2.5 py-0.5 text-[11px] font-medium text-green-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                    Draft
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-400/30 bg-green-500/10">
                    <Icon className="h-5 w-5 text-green-300" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400">Something like</p>
                    <p className="font-semibold text-white">{project.productName}</p>
                  </div>
                </div>

                <dl className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08] text-sm">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-gray-400">Category</dt>
                    <dd className="text-right text-gray-100">{project.category}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-gray-400">Platforms</dt>
                    <dd className="text-right text-gray-100">{project.platforms.join(" · ")}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-gray-400">Stack</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, BRIEF_STACK_SIZE).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs text-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > BRIEF_STACK_SIZE && (
                        <span className="rounded-full border border-green-400/25 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-300">
                          +{project.techStack.length - BRIEF_STACK_SIZE}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 text-xs text-gray-400">Your idea</p>
                <Link
                  href="/contact"
                  className="mt-2 flex h-12 items-center rounded-xl border border-dashed border-green-400/30 bg-green-500/[0.04] px-4 text-sm text-gray-300 transition-colors duration-300 hover:border-green-400/60 hover:bg-green-500/10 hover:text-white"
                >
                  Tell us what you want to build
                  <span aria-hidden="true" className="caret ml-1 w-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 data-split className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                More <span className="text-gradient-green">Projects</span>
              </h2>
              <Link
                href="/products"
                className="inline-flex items-center text-green-400 transition-colors hover:text-green-300"
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {relatedProjects.map((related) => (
                <ProductCard key={related.slug} project={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="glass-strong gap-0 overflow-hidden rounded-3xl border-white/10 bg-black/70 p-0 text-white sm:max-w-6xl [&>button]:rounded-full [&>button]:bg-black/60 [&>button]:p-2 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-green-600">
          {lightboxIndex !== null && (
            <>
              <Image
                src={project.gallery[lightboxIndex]}
                alt={`${project.productName} screenshot ${lightboxIndex + 1}`}
                width={1920}
                height={985}
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="h-auto max-h-[78vh] w-full bg-black object-contain"
              />
              <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] p-4 md:px-6">
                <div>
                  <DialogTitle className="text-white">{project.productName}</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Screenshot {lightboxIndex + 1} of {project.gallery.length}
                  </DialogDescription>
                </div>
                <div className="flex gap-2">
                  {project.gallery.map((shot, index) => (
                    <button
                      key={shot}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`Show screenshot ${index + 1}`}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        index === lightboxIndex ? "w-6 bg-green-400" : "w-2 bg-white/30 hover:bg-white/60",
                      )}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
