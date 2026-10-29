"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, playWhileVisible, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

interface Client {
  name: string;
  logo: string;
  website: string;
  alt: string;
  /** For logos made for dark backgrounds (default tile is white). */
  tileClassName?: string;
}

const clients: Client[] = [
  {
    name: "CSSL",
    logo: "/cssl-logo.png",
    website: "https://cssl.lk",
    alt: "Computer Society of Sri Lanka",
  },
  {
    name: "NITC 2025",
    logo: "/NITC-logo.png",
    website: "https://nitc.lk/nitc-2025",
    alt: "National IT Conference 2025",
  },
  {
    name: "NITC 2026",
    logo: "/nitc-2026-logo.png",
    website: "https://nitc.lk",
    alt: "National IT Conference 2026",
    tileClassName: "bg-[#0b2a6b]",
  },
  {
    name: "FITIS",
    logo: "/fitis-logo.svg",
    website: "https://fitis.lk",
    alt: "Federation of Information Technology Industry Sri Lanka",
  },
  {
    name: "DIGITAL EXCELLENCE AWARDS",
    logo: "/digital-excellence-logo.svg",
    website: "https://digitalexecellence.lk",
    alt: "Digital Excellence Awards",
    tileClassName: "bg-black"
  },
  {
    name: "SLANSHEI",
    logo: "/slanshei-logo.png",
    website: "https://www.slanshei.lk",
    alt: "Sri Lanka Association of Non-State Higher Education Institutes",
  },
  {
    name: "Logic Leaf Technologies",
    logo: "/logo-cropped.png",
    website: "https://logicleaftechnologies.com",
    alt: "Logic Leaf Technologies",
  },
  {
    name: "Clayton Family Medical Centre",
    logo: "/clayton-family-medical-centre.png",
    website: "https://claytonfmc.com.au/",
    alt: "Clayton Family Medical Centre",
  },
];

/** The track holds three copies so it can loop seamlessly on wide screens. */
const COPIES = 3;

export function ClientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const loop = gsap.to(track, {
        xPercent: -100 / COPIES,
        ease: "none",
        duration: 45,
        repeat: -1,
      });
      // Start deep into the loop so scrolling up can play it backwards.
      loop.totalTime(loop.duration() * 100);
      playWhileVisible(loop, sectionRef.current!);

      // Scroll speed pushes the marquee along (and backwards when scrolling up).
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
          gsap.to(loop, {
            timeScale: (boost < 0 ? -1 : 1) * (1 + Math.abs(boost)),
            duration: 0.25,
            overwrite: true,
          });
          gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3, ease: "power2.out" });
        },
      });

      const pause = () => gsap.to(loop, { timeScale: 0, duration: 0.6, overwrite: true });
      const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.6, overwrite: true });
      track.addEventListener("pointerenter", pause);
      track.addEventListener("pointerleave", resume);

      return () => {
        track.removeEventListener("pointerenter", pause);
        track.removeEventListener("pointerleave", resume);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="clients" className="relative overflow-hidden py-24">
      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          title={
            <>
              We Work With <span className="text-gradient-green">The Best</span>
            </>
          }
          description="Proud to partner with leading organizations driving innovation."
          className="mb-14 md:mb-16"
        />
      </div>

      <div
        data-reveal="fade"
        className="relative z-20 w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div ref={trackRef} className="flex w-max">
          {Array.from({ length: COPIES }, (_, copy) => (
            <div
              key={copy}
              className="flex items-start gap-6 px-3 md:gap-10 md:px-5"
              aria-hidden={copy > 0}
            >
              {clients.map((client) => (
                <ClientCard key={client.name} client={client} focusable={copy === 0} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientCard({
  client,
  focusable,
}: {
  client: Client;
  focusable: boolean;
}) {
  return (
    <a
      href={client.website}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={focusable ? undefined : -1}
      className="group/logo block w-44 shrink-0 md:w-60"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 group-hover/logo:-translate-y-1 group-hover/logo:border-green-400/40 group-hover/logo:bg-green-500/[0.07] group-hover/logo:shadow-[0_24px_40px_-20px_rgba(74,222,128,0.5)]">
        <div className={cn("relative h-20 overflow-hidden rounded-xl bg-white md:h-24", client.tileClassName)}>
          <Image
            src={client.logo}
            alt={client.alt}
            fill
            sizes="240px"
            className="object-contain p-4 transition-transform duration-500 group-hover/logo:scale-105"
          />
        </div>
      </div>
      <p className="mt-3 truncate px-2 text-center text-[11px] uppercase tracking-[0.16em] text-gray-400 transition-colors group-hover/logo:text-green-300">
        {client.name}
      </p>
    </a>
  );
}
