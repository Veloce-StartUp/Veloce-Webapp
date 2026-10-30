"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  project: Project;
  /** Horizontal layout on large screens, for cards that span two grid columns. */
  wide?: boolean;
  className?: string;
}

export function ProductCard({ project, wide = false, className }: ProductCardProps) {
  const Icon = project.icon;
  const isLive = project.status === "Live";

  return (
    <article
      data-reveal
      data-tilt="4"
      className={cn(
        "glass spotlight group flex flex-col overflow-hidden rounded-[1.75rem]",
        wide && "lg:flex-row",
        className,
      )}
    >
      {/* Project Image */}
      <Link
        href={`/products/${project.slug}`}
        className={cn(
          "relative m-2 block aspect-[39/20] overflow-hidden rounded-[1.25rem] bg-black",
          // Wide cards letterbox the screenshot instead of cropping it to the card's height.
          wide &&
            "lg:flex lg:aspect-auto lg:w-[56%] lg:shrink-0 lg:items-center lg:bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.12),rgba(0,0,0,0.6))] lg:p-5",
        )}
        aria-label={`${project.productName} details`}
      >
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.productName}
          width={1600}
          height={820}
          sizes={
            wide
              ? "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, calc(100vw - 48px)"
              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, calc(100vw - 48px)"
          }
          className={cn(
            "h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105",
            wide && "lg:h-auto lg:rounded-xl lg:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] lg:ring-1 lg:ring-white/10",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        {/* Status */}
        <span className="glass absolute right-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white">
          <span className="relative flex h-2 w-2">
            {isLive && (
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-green-400" />
            )}
            <span className={cn("relative h-2 w-2 rounded-full", isLive ? "bg-green-400" : "bg-amber-400")} />
          </span>
          {project.status}
        </span>

        {/* Platforms */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {project.platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-white/15 bg-black/50 px-2.5 py-0.5 text-[11px] text-gray-200 backdrop-blur-md"
            >
              {platform}
            </span>
          ))}
        </div>
      </Link>

      <div className={cn("flex flex-1 flex-col p-6 pt-4", wide && "lg:p-8")}>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-400/25 bg-green-500/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
            <Icon className="h-5 w-5 text-green-400" />
          </span>
          <span className="text-xs uppercase tracking-[0.14em] text-gray-400">
            {project.category} · {project.year}
          </span>
        </div>

        <Link href={`/products/${project.slug}`}>
          <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-green-300">
            {project.productName}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-medium text-green-400">{project.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-gray-200 transition-colors group-hover:border-green-400/20"
            >
              {feature}
            </span>
          ))}
          {project.features.length > 4 && (
            <span className="rounded-full px-2.5 py-1 text-xs text-gray-400">
              +{project.features.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-6">
          <Link href={`/products/${project.slug}`} className="btn-primary btn-sm group/details flex-1">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover/details:translate-x-1" />
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.productName} website`}
              className="btn-glass btn-sm w-10 px-0"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
