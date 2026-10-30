"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Award, Building2, Maximize2, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/section-heading"
import { gsap, useGSAP } from "@/lib/gsap"

// Rarely opened, so the dialog's code isn't part of the first download.
const RecognitionLightbox = dynamic(
    () => import("@/components/recognition-lightbox").then((module) => module.RecognitionLightbox),
    { ssr: false },
)

const recognitions = [
  {
    year: "2026",
    title: "Technology Partner",
    event: "National IT Conference 2026",
    organizer: "Computer Society of Sri Lanka",
    description:
        "Honoured for the second consecutive year as the official Technology Partner of NITC, Sri Lanka's flagship national IT conference.",
    image: "/Awards/NITC-2026-Technology-Partner.jpg",
    alt: "Veloce Technology receiving the Technology Partner award on stage at NITC 2026",
    latest: false,
  },
  {
    year: "2025",
    title: "Technology Partner",
    event: "National IT Conference 2025",
    organizer: "Computer Society of Sri Lanka",
    description:
        "Named the official Technology Partner of NITC 2025, standing alongside Sri Lanka's leading technology organisations on the national stage.",
    image: "/Awards/NITC-2025-Technology-Partner.jpeg",
    alt: "Veloce team receiving the Technology Partner award on stage at NITC 2025",
    latest: false,
  },
]

export type Recognition = (typeof recognitions)[number]

export function RecognitionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<Recognition | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const openLightbox = (item: Recognition) => {
    setSelected(item)
    setIsLightboxOpen(true)
  }

  // Photos drift inside their frames as the cards scroll past.
  useGSAP(
      () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        gsap.utils.toArray<HTMLElement>(".recognition-photo").forEach((photo) => {
          gsap.fromTo(
              photo,
              { yPercent: -7 },
              {
                yPercent: 7,
                ease: "none",
                scrollTrigger: {
                  trigger: photo.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
          )
        })
      },
      { scope: sectionRef },
  )

  return (
      <section ref={sectionRef} id="recognition" className="relative overflow-hidden py-24 md:py-32">
        <div className="container relative z-20 mx-auto px-4">
          <SectionHeading
              title={
                <>
                  Recognized on the <span className="text-gradient-green">National Stage</span>
                </>
              }
              description="Trusted by the Computer Society of Sri Lanka as the official Technology Partner of the National IT Conference (NITC) - two years in a row."
          />

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
            {recognitions.map((item, index) => (
                <article
                    key={item.year}
                    data-reveal
                    data-reveal-delay={index * 0.1}
                    className="glass spotlight group flex h-full flex-col overflow-hidden rounded-3xl"
                >
                  {/* Award photo */}
                  <button
                      type="button"
                      onClick={() => openLightbox(item)}
                      aria-label={`View photo from ${item.event}`}
                      className="relative m-2 block aspect-[3/2] cursor-zoom-in overflow-hidden rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500"
                  >
                    <div className="recognition-photo absolute -inset-y-[8%] inset-x-0">
                      <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="(min-width: 1024px) 50vw, calc(100vw - 48px)"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-white">
                        <Trophy className="h-3.5 w-3.5 text-green-400" />
                        {item.year}
                      </span>
                      {item.latest && (
                          <Badge className="border-0 bg-green-600 text-white hover:bg-green-700">Latest</Badge>
                      )}
                    </div>

                    <span className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </button>

                  <div className="flex flex-grow flex-col p-6 md:p-8">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-green-400/25 bg-green-500/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/20">
                        <Award className="h-7 w-7 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-green-300 md:text-2xl">
                          {item.title}
                        </h3>
                        <p className="font-medium text-green-400">{item.event}</p>
                      </div>
                    </div>

                    <p className="mb-6 flex-grow text-gray-300 transition-colors group-hover:text-gray-200">
                      {item.description}
                    </p>

                    <div className="flex items-center border-t border-white/[0.08] pt-4 text-sm text-gray-300">
                      <Building2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-400" />
                      Awarded by {item.organizer}
                    </div>
                  </div>
                </article>
            ))}
          </div>
        </div>

        {selected && (
            <RecognitionLightbox item={selected} open={isLightboxOpen} onOpenChange={setIsLightboxOpen} />
        )}
      </section>
  )
}
