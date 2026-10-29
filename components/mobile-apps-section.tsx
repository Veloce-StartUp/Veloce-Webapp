"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  IdCard,
  LayoutDashboard,
  Smartphone,
  UserPlus,
} from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/section-heading";
import { StoreBadges } from "@/components/store-badges";
import { getProjectBySlug } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** How long each screen stays up before the showcase moves on. */
const ROTATE_SECONDS = 6;

/** 720px-wide copies of the store screenshots (the simulator originals are about 1 MB each). */
const SCREEN_DIR = "/Products/Digital-CSSL/app";

const project = getProjectBySlug("digital-cssl-platform");

/** Screens captured on both platforms, in the order a new member meets them. */
const screens = [
  {
    id: "welcome",
    label: "Sign up",
    icon: UserPlus,
    title: "Join in minutes",
    description: "New members create an account with email verification, and existing members sign in securely.",
  },
  {
    id: "membership",
    label: "Membership",
    icon: BadgeCheck,
    title: "Choose a membership",
    description: "Every membership category with its eligibility, benefits and fees, so members apply for the right one.",
  },
  {
    id: "home",
    label: "Dashboard",
    icon: LayoutDashboard,
    title: "Everything at a glance",
    description: "Membership status, renewals and CPD points on one home screen, a tap away from the ID card and payments.",
  },
  {
    id: "digital-id",
    label: "Digital ID",
    icon: IdCard,
    title: "Digital membership card",
    description: "The official CSSL membership card on the phone, with a QR code for instant verification.",
  },
];

const delivered = [
  "iPhone and Android apps from one React Native codebase",
  "One backend shared with the Digital CSSL web platform",
  "Published and maintained on the App Store and Google Play",
];

const alsoInApp = [
  "Renewals & upgrades",
  "Payment history & invoices",
  "Events & conferences",
  "News & announcements",
  "Member portfolios",
  "Push notifications",
];

/**
 * Handsets drawn in CSS. Sizes are in cqw (percent of the phone's width), so each phone scales
 * as one piece; `sizes` is the width its screen is drawn at.
 */
const devices = {
  android: {
    label: "Android",
    frame: "rounded-[11cqw] p-[2.2cqw]",
    screen: "aspect-[9/20] rounded-[7.6cqw]",
    buttons: ["-right-[2.1cqw] top-[20%] h-[7%] rounded-r-[0.6cqw]", "-right-[2.1cqw] top-[30%] h-[12%] rounded-r-[0.6cqw]"],
    sizes: "(min-width: 640px) 220px, 40vw",
  },
  ios: {
    label: "iPhone",
    frame: "rounded-[15cqw] p-[2cqw]",
    screen: "aspect-[1320/2868] rounded-[11.8cqw]",
    buttons: ["-left-[2.1cqw] top-[24%] h-[8%] rounded-l-[0.6cqw]", "-right-[2.1cqw] top-[27%] h-[12%] rounded-r-[0.6cqw]"],
    sizes: "(min-width: 640px) 247px, 45vw",
  },
};

type Platform = keyof typeof devices;

interface PhoneProps {
  platform: Platform;
  appName: string;
  active: number;
  /** Screens after this index are not mounted yet, so their images are not downloaded. */
  mountedUpTo: number;
}

function Phone({ platform, appName, active, mountedUpTo }: PhoneProps) {
  const device = devices[platform];

  return (
    <figure className="@container">
      <div
        className={cn(
          "relative border-[1.2cqw] border-zinc-700 bg-black shadow-[0_40px_80px_-35px_rgba(0,0,0,0.95)] ring-1 ring-white/15",
          device.frame,
        )}
      >
        {device.buttons.map((position) => (
          <span key={position} aria-hidden="true" className={cn("absolute w-[0.9cqw] bg-zinc-700", position)} />
        ))}

        <div className={cn("relative overflow-hidden bg-black", device.screen)}>
          {screens.slice(0, mountedUpTo + 1).map((screen, index) => (
            <Image
              key={screen.id}
              src={`${SCREEN_DIR}/${platform}-${screen.id}.jpg`}
              alt={index === active ? `${appName} on ${device.label}: ${screen.title}` : ""}
              fill
              sizes={device.sizes}
              className={cn(
                "object-cover transition-[opacity,scale] duration-700",
                // The second phone follows a beat later, so the switch reads as two devices.
                platform === "android" && "delay-100",
                index === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
              )}
            />
          ))}

          {platform === "android" && (
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[3.5cqw] h-[3.4cqw] w-[3.4cqw] -translate-x-1/2 rounded-full bg-black ring-[0.5cqw] ring-zinc-800"
            />
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_35%)]"
          />
        </div>
      </div>
      <figcaption className="mt-4 text-center font-mono text-xs tracking-[0.18em] text-gray-400">
        {device.label}
      </figcaption>
    </figure>
  );
}

export function MobileAppsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // One screen ahead of the active one is mounted, so the next fade has its images ready.
  const [mountedUpTo, setMountedUpTo] = useState(1);
  const [inView, setInView] = useState(false);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: showcaseRef.current,
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => setInView(self.isActive),
      });
    },
    { scope: sectionRef },
  );

  const app = project?.app;
  if (!project || !app) return null;

  const select = (index: number) => {
    setActive(index);
    setMountedUpTo((upTo) => Math.max(upTo, Math.min(index + 1, screens.length - 1)));
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (active + step + screens.length) % screens.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section ref={sectionRef} id="mobile-apps" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        data-speed="0.85"
        className="pointer-events-none absolute right-[-15%] top-[25%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.06),transparent)]"
      />

      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          eyebrow="Mobile Apps"
          icon={Smartphone}
          title={
            <>
              Mobile apps, <span className="text-gradient-green">shipped to both stores</span>
            </>
          }
          description="We built Digital CSSL, the official member app of the Computer Society of Sri Lanka, from the first screen to its release on the App Store and Google Play."
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Screens: first on phones, on the right from lg */}
          <div ref={showcaseRef} data-playing={inView ? "" : undefined} className="lg:order-last lg:col-span-7">
            <div
              role="tablist"
              aria-label={`${app.name} app screens`}
              onKeyDown={onTabKeyDown}
              data-reveal="right"
              className="glass mb-6 grid grid-cols-4 gap-1 rounded-2xl p-1.5"
            >
              {screens.map((screen, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={screen.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`mobile-app-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls={`mobile-app-panel-${index}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(index)}
                    className={cn(
                      "relative overflow-hidden rounded-xl px-1 pb-4 pt-3 text-xs font-medium transition-colors duration-300 sm:text-sm",
                      isActive
                        ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-gray-300 hover:text-white",
                    )}
                  >
                    {screen.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-2 h-0.5 overflow-hidden rounded-full bg-white/10 sm:inset-x-4"
                    >
                      {/* Mounted only while active, so the fill restarts on every visit */}
                      {isActive && (
                        <span
                          className="showcase-progress block h-full rounded-full bg-green-400"
                          style={{ animationDuration: `${ROTATE_SECONDS}s` }}
                          onAnimationEnd={() => select((index + 1) % screens.length)}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* The same screen on both platforms */}
            <div data-reveal="right" data-tilt="5" className="relative isolate flex items-start justify-center">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(34,197,94,0.16),transparent)]"
              />
              <div className="-mr-[7%] w-[43%] max-w-[14.75rem]">
                <Phone platform="android" appName={app.name} active={active} mountedUpTo={mountedUpTo} />
              </div>
              <div className="relative z-10 mt-[7%] w-[48%] max-w-[16.5rem]">
                <Phone platform="ios" appName={app.name} active={active} mountedUpTo={mountedUpTo} />
              </div>
            </div>

            {/* All captions stack in one grid cell, so switching screens never changes the height. */}
            <div data-reveal="right" className="glass mt-6 grid rounded-[1.75rem]">
              {screens.map((screen, index) => {
                const Icon = screen.icon;
                const isActive = index === active;
                return (
                  <div
                    key={screen.id}
                    id={`mobile-app-panel-${index}`}
                    role="tabpanel"
                    aria-labelledby={`mobile-app-tab-${index}`}
                    aria-hidden={!isActive}
                    className={cn(
                      "flex items-start gap-4 p-5 transition-[opacity,visibility] duration-500 [grid-area:1/1] md:p-6",
                      isActive ? "visible opacity-100" : "invisible opacity-0",
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-400/25 bg-green-500/10 text-green-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{screen.title}</h3>
                      <p className="mt-1 text-sm text-gray-300">{screen.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* About the app */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div data-reveal="left" className="glass rounded-[1.75rem] p-6 md:p-8">
              <div className="flex items-center gap-4">
                <Image
                  src={`${SCREEN_DIR}/icon.png`}
                  alt={`${app.name} app icon`}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-[1.1rem] ring-1 ring-white/15"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-white">{app.name}</h3>
                  <p className="text-sm text-gray-300">{project.client}</p>
                </div>
                <span className="glass inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  {project.status}
                </span>
              </div>

              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gray-400">What we delivered</p>
              <ul className="mt-4 space-y-3">
                {delivered.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-200">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10">
                      <Check className="h-3.5 w-3.5 text-green-300" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gray-400">Also in the app</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {alsoInApp.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-sm text-gray-200"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <StoreBadges app={app} className="mt-8 border-t border-white/[0.08] pt-6" />
            </div>

            <div data-reveal className="flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact" className="btn-primary group">
                Plan your mobile app
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={`/products/${project.slug}`} className="btn-glass group">
                Case study
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
