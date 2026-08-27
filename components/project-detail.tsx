"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Mail,
  MessageSquare,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getProjectBySlug, getRelatedProjects } from "@/lib/projects";

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

  if (!project) return null;

  const Icon = project.icon;
  const relatedProjects = getRelatedProjects(slug);

  const facts = [
    { label: "Client", value: project.client, icon: Building },
    { label: "Category", value: project.category, icon: Layers },
    { label: "Year", value: project.year, icon: CalendarDays },
    { label: "Platforms", value: project.platforms.join(", "), icon: Globe },
  ].filter((fact) => Boolean(fact.value));

  return (
    <div className="relative z-20 pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in-up"
        >
          <Link href="/" className="hover:text-green-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-green-400 transition-colors"
          >
            Projects
          </Link>
          <span>/</span>
          <span className="text-gray-300">{project.productName}</span>
        </nav>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in-left">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge
                className={
                  project.status === "Live"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-500 hover:bg-orange-600"
                }
              >
                {project.status}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-800 text-gray-300 hover:bg-gray-800"
              >
                {project.category}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-800 text-gray-300 hover:bg-gray-800"
              >
                {project.year}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 shrink-0 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Icon className="h-6 w-6 text-green-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white text-balance">
                {project.productName}
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-green-400 font-medium mb-6">
              {project.title}
            </p>
            <p className="text-lg text-gray-400 text-pretty mb-8">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {project.platforms.map((platform) => {
                const PlatformIcon = platformIcons[platform] ?? Globe;
                return (
                  <div
                    key={platform}
                    className="flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/70 px-4 py-2 text-sm text-gray-300"
                  >
                    <PlatformIcon className="h-4 w-4 text-green-400" />
                    {platform}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="group modern-button-hover bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-300"
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="group border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  All Projects
                </Button>
              </Link>
            </div>
          </div>

          <div className="animate-fade-in-right">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10`}
              />
              <img
                src={project.image || "/placeholder.svg"}
                alt={`${project.productName} cover`}
                className="w-full h-full object-cover relative"
              />
            </div>
          </div>
        </div>

        {/* Overview + facts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold text-white mb-4">
              Project <span className="text-green-400">Overview</span>
            </h2>
            {project.overview.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-gray-400 text-lg leading-relaxed text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Card className="border border-gray-800 bg-gray-900/80 backdrop-blur-sm h-fit">
            <CardContent className="p-6 space-y-5">
              <h3 className="text-lg font-semibold text-white">
                Project Details
              </h3>
              {facts.map((fact) => {
                const FactIcon = fact.icon;
                return (
                  <div key={fact.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 bg-green-500/15 rounded-lg flex items-center justify-center">
                      <FactIcon className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        {fact.label}
                      </div>
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
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors pt-2 break-all"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  {project.url.replace(/^https?:\/\//, "")}
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">
              Key <span className="text-green-400">Highlights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.highlights.map((highlight, index) => (
                <Card
                  key={highlight.title}
                  className="group modern-card-hover border border-gray-800 bg-gray-900/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                      <Sparkles className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-400 text-pretty">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features + tech stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-8">
              What&apos;s <span className="text-green-400">Inside</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3 hover:border-green-500/40 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Tech <span className="text-green-400">Stack</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-gray-800 text-gray-300 hover:bg-green-500/20 hover:text-green-300 transition-colors px-3 py-1.5 text-sm"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">
              Project <span className="text-green-400">Gallery</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.gallery.map((shot, index) => (
                <div
                  key={shot}
                  className="group relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900/60 hover:border-green-500/50 transition-colors"
                >
                  <img
                    src={shot || "/placeholder.svg"}
                    alt={`${project.productName} screenshot ${index + 1}`}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-gray-900 via-gray-900 to-green-950/30 mb-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-500/10 rounded-full blur-3xl float-animation" />
            <div
              className="absolute -bottom-24 -right-24 w-72 h-72 bg-green-400/10 rounded-full blur-3xl float-animation"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative z-10 px-6 py-16 md:py-20 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 mb-6">
              <MessageSquare className="h-7 w-7 text-green-400" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
              Have a similar project in mind?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 text-pretty">
              Tell us what you are building and we will map out how to get it
              designed, built and shipped.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="group modern-button-hover bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-300"
                >
                  Start a Conversation
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="mailto:build.veloce@gmail.com">
                <Button
                  size="lg"
                  variant="outline"
                  className="group border-green-500/40 text-green-400 hover:bg-green-600 hover:text-white bg-transparent hover:scale-105 transition-all duration-300"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Free consultation
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-400" />
                Replies within 24h
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-400" />
                Tailored proposal
              </span>
            </div>
          </div>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-white">
                More <span className="text-green-400">Projects</span>
              </h2>
              <Link
                href="/products"
                className="text-green-400 hover:text-green-300 transition-colors inline-flex items-center"
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((related, index) => (
                <ProductCard
                  key={related.slug}
                  project={related}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
