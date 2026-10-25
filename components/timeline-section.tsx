"use client"

import { useRef } from "react"
import { ArrowRight, CheckCircle2, Code, FileText, Rocket, TestTube, Users } from "lucide-react"
import { gsap, useGSAP } from "@/lib/gsap"
import { useSmoothReady } from "@/components/motion/smooth-scroll"
import { SectionHeading } from "@/components/section-heading"
import { cn } from "@/lib/utils"

const developmentStages = [
  {
    stage: "01",
    title: "Requirement Gathering",
    description:
        "We start by understanding your vision, goals, and specific requirements through detailed consultations.",
    icon: FileText,
    status: "active",
    details: [
      "Stakeholder interviews",
      "Technical requirements analysis",
      "Project scope definition",
      "Timeline planning",
    ],
    duration: "1-2 weeks",
  },
  {
    stage: "02",
    title: "Design & Planning",
    description: "Creating wireframes, UI/UX designs, and technical architecture for your project.",
    icon: Users,
    status: "active",
    details: ["UI/UX design", "System architecture", "Database design", "Technology stack selection"],
    duration: "2-3 weeks",
  },
  {
    stage: "03",
    title: "Development",
    description: "Our expert developers bring your vision to life using cutting-edge technologies and best practices.",
    icon: Code,
    status: "active",
    details: ["Frontend development", "Backend development", "API integration", "Regular progress updates"],
    duration: "4-8 weeks",
  },
  {
    stage: "04",
    title: "Testing & QA",
    description: "Comprehensive testing to ensure your product is bug-free and performs optimally.",
    icon: TestTube,
    status: "active",
    details: ["Unit testing", "Integration testing", "Performance testing", "Security testing"],
    duration: "1-2 weeks",
  },
  {
    stage: "05",
    title: "Deployment",
    description: "Launching your product to production with proper monitoring and support systems.",
    icon: Rocket,
    status: "active",
    details: ["Production deployment", "Performance monitoring", "Security setup", "Documentation"],
    duration: "1 week",
  },
  {
    stage: "06",
    title: "Support & Maintenance",
    description: "Ongoing support, updates, and maintenance to keep your product running smoothly.",
    icon: CheckCircle2,
    status: "ongoing",
    details: ["24/7 monitoring", "Regular updates", "Bug fixes", "Feature enhancements"],
    duration: "Ongoing",
  },
]

export function TimelineSection() {
  const ready = useSmoothReady()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)

  // Desktop: pin the section and scroll the stages sideways.
  useGSAP(
      () => {
        if (!ready) return

        const mm = gsap.matchMedia()
        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
          const track = trackRef.current!
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

          const slide = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              refreshPriority: 1,
              onUpdate: (self) => {
                progressRef.current?.style.setProperty("transform", `scaleX(${self.progress})`)
              },
            },
          })

          gsap.utils.toArray<HTMLElement>(".process-card").forEach((card) => {
            gsap.fromTo(
                card,
                { opacity: 0.35, scale: 0.94 },
                {
                  opacity: 1,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: slide,
                    start: "left 92%",
                    end: "left 55%",
                    scrub: true,
                  },
                },
            )
          })
        })

        return () => mm.revert()
      },
      { dependencies: [ready], scope: sectionRef },
  )

  return (
      <section ref={sectionRef} id="timeline" className="relative">
        <div
            ref={pinRef}
            className="relative flex flex-col justify-center overflow-hidden py-24 md:py-32 lg:h-screen lg:min-h-[720px] lg:pb-6 lg:pt-24"
        >
          <div className="container relative z-20 mx-auto px-4">
            <SectionHeading
                align="left"
                className="mb-12 md:mb-12 lg:mb-14"
                title={
                  <>
                    Our Development <span className="text-gradient-green">Process</span>
                  </>
                }
                description="From initial concept to final deployment - here's how we transform your ideas into reality."
            />
          </div>

          <div
              ref={trackRef}
              className="relative z-20 flex flex-col gap-5 px-4 lg:w-max lg:flex-row lg:gap-6 lg:pl-[max(1rem,calc(50vw-624px))] lg:pr-[12vw]"
          >
            {developmentStages.map((stage) => {
              const Icon = stage.icon
              return (
                  <div key={stage.stage} data-reveal className="lg:w-[400px] lg:shrink-0">
                    <article className="process-card glass spotlight group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 lg:min-h-[400px]">
                      <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-2 -top-6 select-none text-[8rem] font-semibold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] transition-all duration-500 group-hover:[-webkit-text-stroke:1px_rgba(74,222,128,0.35)]"
                      >
                        {stage.stage}
                      </span>

                      <div className="mb-6 flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-400/25 bg-green-500/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_-4px_rgba(74,222,128,0.6)]">
                          <Icon className="h-6 w-6 text-green-400" />
                        </span>
                        <span
                            className={cn(
                                "rounded-full border px-3 py-1 text-xs",
                                stage.status === "ongoing"
                                    ? "border-green-400/40 bg-green-500/15 text-green-300"
                                    : "border-white/10 bg-white/[0.04] text-gray-200",
                            )}
                        >
                          {stage.status === "ongoing" ? "Ongoing" : `Stage ${stage.stage}`}
                        </span>
                      </div>

                      <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-green-300">
                        {stage.title}
                      </h3>
                      <p className="mt-3 text-gray-300">{stage.description}</p>

                      <ul className="mt-auto grid gap-2 pt-6">
                        {stage.details.map((detail) => (
                            <li key={detail} className="flex items-center text-sm text-gray-300">
                              <ArrowRight className="mr-2 h-3 w-3 flex-shrink-0 text-green-400 transition-transform group-hover:translate-x-1" />
                              {detail}
                            </li>
                        ))}
                      </ul>
                    </article>
                  </div>
              )
            })}
          </div>

          {/* Stage progress for the sideways scroll (desktop) */}
          <div className="container relative z-20 mx-auto mt-10 hidden px-4 lg:block">
            <div className="flex max-w-md items-center gap-4 text-xs uppercase tracking-[0.2em] text-gray-400">
              <span>Stage 01</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                    ref={progressRef}
                    className="block h-full origin-left rounded-full bg-gradient-to-r from-green-500 to-green-300 shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                    style={{ transform: "scaleX(0)" }}
                />
              </div>
              <span>Stage 06</span>
            </div>
          </div>
        </div>
      </section>
  )
}
