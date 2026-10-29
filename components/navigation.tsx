"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Gavel, Menu, Smartphone, Ticket, X } from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  /** Section id on the home page; also used to mark the link active. */
  id: string;
  /** Overrides the default `#id` link, e.g. for full pages. */
  href?: string;
}

const solutions = [
  {
    label: "Judging Portal",
    id: "judging-portal",
    description: "Awards entries, judge panels and scoring",
    icon: Gavel,
  },
  {
    label: "Event Registration",
    id: "event-registration",
    description: "Delegate registration, payments and badges",
    icon: Ticket,
  },
  {
    label: "Mobile Apps",
    id: "mobile-apps",
    description: "iOS and Android apps, live on both stores",
    icon: Smartphone,
  },
];

/** Links shown after the Solutions dropdown (Services sits before it). */
const navItems: NavItem[] = [
  { label: "Products", id: "products", href: "/products" },
  { label: "Process", id: "timeline" },
  { label: "Team", id: "team" },
  { label: "Contact", id: "contact" },
];

const trackedSections = [
  "services",
  ...solutions.map((item) => item.id),
  "products",
  "timeline",
  "team",
  "contact",
];

export function Navigation() {
  const headerRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const isSolutionActive = solutions.some((item) => item.id === activeSection);

  // Transparent over the top of the page, glass once it scrolls.
  useGSAP(() => {
    // A refresh (e.g. when a section changes height) can report a temporary scroll
    // position while it measures, which would flash the bar transparent.
    let isRefreshing = false;
    const onRefreshStart = () => {
      isRefreshing = true;
    };
    const onRefreshEnd = () => {
      isRefreshing = false;
    };
    ScrollTrigger.addEventListener("refreshInit", onRefreshStart);
    ScrollTrigger.addEventListener("refresh", onRefreshEnd);

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const header = headerRef.current;
        if (!header || isRefreshing) return;
        const scrolled = String(self.scroll() > 40);
        // Runs every scroll frame, so only touch the DOM when the state flips.
        if (header.dataset.scrolled !== scrolled) header.dataset.scrolled = scrolled;
      },
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", onRefreshStart);
      ScrollTrigger.removeEventListener("refresh", onRefreshEnd);
    };
  });

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.dataset.menuOpen = String(isMobileMenuOpen);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveSection(pathname.startsWith("/products") ? "products" : null);
    if (!isHome) return;

    let triggers: ScrollTrigger[] = [];
    const frame = requestAnimationFrame(() => {
      triggers = trackedSections.flatMap((id) => {
        const section = document.getElementById(id);
        if (!section) return [];
        return ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) =>
            setActiveSection((current) =>
              self.isActive ? id : current === id ? null : current,
            ),
        });
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [pathname, isHome]);

  const linkClass = (active: boolean) =>
    cn(
      "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
      active
        ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        : "text-gray-200 hover:text-green-300",
    );

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className="group/header fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-[padding] duration-500 ease-out sm:px-5 sm:pt-4 sm:data-[scrolled=false]:pt-6"
    >
      <nav
        aria-label="Main"
        className="relative isolate mx-auto flex h-16 max-w-6xl items-center justify-between pl-4 pr-2 transition-[max-width,height] duration-500 ease-out group-data-[scrolled=false]/header:max-w-7xl lg:group-data-[scrolled=false]/header:h-[4.5rem]"
      >
        {/* The bar's glass lives on its own layer: a backdrop-filter on <nav> itself would stop
            the Solutions dropdown from blurring the page behind it. It stays invisible over the
            top of the page and fades in once the page scrolls (or the mobile menu opens). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-white/[0.12] bg-black/60 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500 group-data-[menu-open=true]/header:opacity-100 group-data-[scrolled=true]/header:opacity-100"
        />

        <Link href="/" aria-label="Veloce-Technology home" className="relative h-14 w-24 shrink-0">
          <Image
            src="/Veloce-Logo_White-Without-Name.png"
            alt="Veloce-Technology Logo"
            fill
            sizes="90px"
            className="object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link href={sectionHref("services")} className={linkClass(activeSection === "services")}>
            Services
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setIsSolutionsOpen(true)}
            onMouseLeave={() => setIsSolutionsOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsSolutionsOpen(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsSolutionsOpen(false);
            }}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isSolutionsOpen}
              aria-controls="solutions-menu"
              onClick={() => setIsSolutionsOpen((open) => !open)}
              className={cn(linkClass(isSolutionActive), "inline-flex items-center gap-1")}
            >
              Solutions
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  isSolutionsOpen && "rotate-180",
                )}
              />
            </button>

            <div
              id="solutions-menu"
              className={cn(
                "absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3 transition-all duration-300",
                isSolutionsOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
              )}
            >
              <div className="glass-strong rounded-2xl p-2">
                {solutions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={sectionHref(item.id)}
                      onClick={() => setIsSolutionsOpen(false)}
                      className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-500/25 bg-green-500/10 text-green-300 transition-colors group-hover/item:bg-green-500/20">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-white group-hover/item:text-green-300">
                          {item.label}
                        </span>
                        <span className="block text-xs text-gray-300">{item.description}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href ?? sectionHref(item.id)}
              className={linkClass(activeSection === item.id)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href={sectionHref("contact")} className="btn-primary btn-sm hidden sm:inline-flex sm:mr-4">
            Get Started
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 hover:text-green-300 lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="glass-strong mx-auto mt-2 max-w-6xl rounded-2xl p-3 duration-300 animate-in fade-in slide-in-from-top-2 lg:hidden">
          <div className="grid gap-1">
            <Link
              href={sectionHref("services")}
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-gray-200 transition-colors hover:bg-white/[0.06] hover:text-green-300"
            >
              Services
            </Link>

            <div className="grid grid-cols-1 gap-2 py-1 sm:grid-cols-2">
              {solutions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={sectionHref(item.id)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 transition-colors hover:border-green-500/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-white">{item.label}</span>
                      <span className="block text-xs text-gray-300">{item.description}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href ?? sectionHref(item.id)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-gray-200 transition-colors hover:bg-white/[0.06] hover:text-green-300"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={sectionHref("contact")}
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary mt-2 w-full sm:hidden"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
