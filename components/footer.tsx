"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, Heart, Mail, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { gsap, useGSAP } from "@/lib/gsap";
import { socialProfiles } from "@/lib/social";

// three.js is large, so the dotted surface loads only once the footer approaches the viewport.
const DottedSurface = dynamic(
  () => import("@/components/ui/dotted-surface").then((module) => module.DottedSurface),
  { ssr: false },
);

const SURFACE_LOAD_DELAY = 400;

const promises = [
  { icon: CheckCircle2, title: "Free consultation", text: "Talk your idea through with our team." },
  { icon: Clock, title: "Replies within 24h", text: "Every enquiry gets a quick, real answer." },
  { icon: Sparkles, title: "Tailored proposal", text: "A plan shaped around your project." },
];

const linkGroups = [
  {
    title: "Solutions",
    links: [
      { label: "Judging Portal", href: "/#judging-portal" },
      { label: "Event Registration", href: "/#event-registration" },
      { label: "Web Development", href: "/#services" },
      { label: "Mobile Apps", href: "/#mobile-apps" },
      { label: "Cloud & AI", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Veloce", href: "/#features" },
      { label: "Products", href: "/products" },
      { label: "Our Process", href: "/timeline" },
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [showSurface, setShowSurface] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Parsing three.js holds up the page for a moment, so leave a beat for the scroll to settle.
        timer = window.setTimeout(() => setShowSurface(true), SURFACE_LOAD_DELAY);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // The wordmark rises into place as the footer scrolls in.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".footer-wordmark", {
        yPercent: 60,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".footer-wordmark",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className="relative overflow-hidden text-white">
      {/* Dotted Surface Background: as tall as the original footer, so the wave keeps its low profile */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[420px]">
        {showSurface && <DottedSurface dotColor="white" className="size-full" />}
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-16">
        {/* Call to action */}
        <div data-reveal className="glass-strong relative overflow-hidden rounded-[2.5rem]">
          {/* Light travelling around the border, a dotted field and a low glow */}
          <span aria-hidden="true" className="border-beam" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,#fff_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_90%_at_15%_50%,#000,transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-green-500/10 blur-[100px]"
          />

          <div className="relative grid items-center gap-12 px-6 py-12 md:px-14 md:py-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_10px_2px_rgba(74,222,128,0.7)]" />
                Build Tomorrow, Today.
              </span>
              <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Have a project in <span className="text-gradient-green">mind?</span> Let&apos;s build it together.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-gray-300">
                Tell us what you are building and we will map out how to get it designed, built and shipped.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/#contact" className="btn-primary group h-14 px-8 text-base">
                  Start a project
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <a href="mailto:build.veloce@gmail.com" className="btn-glass h-14 px-8 text-base">
                  <Mail className="h-4 w-4" />
                  build.veloce@gmail.com
                </a>
              </div>
            </div>

            <ul className="grid gap-3 lg:col-span-5">
              {promises.map((promise) => {
                const Icon = promise.icon;
                return (
                  <li
                    key={promise.title}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors duration-300 hover:border-green-400/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-400/25 bg-green-500/10 text-green-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{promise.title}</span>
                      <span className="block text-sm text-gray-300">{promise.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Company Info */}
          <div className="space-y-5 lg:col-span-4">
            <Link href="/" aria-label="Veloce-Technology home" className="block w-32">
              <Image
                src="/Veloce-Logo_White-Without-Name.png"
                alt="Veloce-Technology Logo"
                width={96}
                height={96}
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-gray-300">
              Innovating the future of technology with cutting-edge solutions
              that transform businesses and drive digital innovation forward.
            </p>
            <div className="flex gap-2">
              {socialProfiles.map((profile) => {
                const Icon = profile.icon;
                return (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Veloce on ${profile.label}`}
                    title={profile.label}
                    className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-200 transition-colors hover:border-green-400/50 hover:text-green-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
              <a
                href="mailto:build.veloce@gmail.com"
                aria-label="Email Veloce"
                title="Email"
                className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-200 transition-colors hover:border-green-400/50 hover:text-green-300"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title} className="space-y-4 lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">{group.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-gray-300 transition-colors hover:text-green-300"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-4 md:col-span-2 lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-green-400">Stay Updated</h3>
            <p className="text-sm text-gray-300">
              Subscribe to our newsletter for the latest tech insights and
              company updates.
            </p>
            <div className="glass flex items-center gap-2 rounded-full p-1.5">
              <Input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-10 flex-1 rounded-full border-0 bg-transparent px-4 text-white shadow-none placeholder:text-gray-400 focus-visible:ring-0"
              />
              <button type="button" className="btn-primary btn-sm shrink-0">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] py-8 md:flex-row">
          <p className="text-center text-sm text-gray-400 md:text-left">
            © {currentYear} Veloce Technology (PVT) Limited. Made with{" "}
            <Heart className="mx-0.5 inline h-4 w-4 animate-pulse align-[-3px] text-green-500" /> for innovation.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy-policy" className="text-gray-400 transition-colors hover:text-green-400">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 transition-colors hover:text-green-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="relative z-20 overflow-hidden">
        <p className="footer-wordmark select-none bg-gradient-to-b from-green-400/25 via-green-500/[0.07] to-transparent bg-clip-text text-center text-[22vw] font-semibold leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(74,222,128,0.4)] md:text-[19vw]">
          VELOCE
        </p>
      </div>
    </footer>
  );
}
