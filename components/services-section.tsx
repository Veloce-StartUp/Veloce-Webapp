"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Check, Cloud, Cpu, Database, Globe, Shield, Smartphone } from "lucide-react"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { useSmoothReady } from "@/components/motion/smooth-scroll"
import { SectionHeading } from "@/components/section-heading"
import { cn } from "@/lib/utils"

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Modern, responsive websites and web applications built with the latest technologies.",
    features: ["React, Next.js, Java, Node.js, Python & etc", "E-commerce Solutions", "Progressive Web Apps", "CMS Integration"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    features: ["React Native", "Flutter", "Native iOS/Android", "App Store Optimization"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and deployment solutions.",
    features: ["AWS/Azure/GCP", "DevOps & CI/CD", "Microservices", "Container Orchestration"],
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Database,
    title: "Data Engineering",
    description: "Big data processing, analytics, and machine learning solutions.",
    features: ["Data Pipelines", "ML/AI Integration", "Real-time Analytics", "Data Visualization"],
    color: "from-green-600 to-green-400",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive security solutions to protect your digital assets.",
    features: ["Security Audits", "Penetration Testing", "Compliance", "Incident Response"],
    color: "from-emerald-600 to-emerald-400",
  },
  {
    icon: Cpu,
    title: "AI & Automation",
    description: "Intelligent automation and AI-powered solutions for business optimization.",
    features: ["Process Automation", "Chatbots & AI", "Computer Vision", "Predictive Analytics"],
    color: "from-teal-600 to-teal-400",
  },
]

/** Where the first stacked card stops (below the nav), and how far each later card sits beneath it. */
const STACK_TOP = 128
const STACK_STEP = 22
/** How much smaller each card behind the front one ends up, so the finished stack reads as a deck. */
const STACK_SCALE_STEP = 0.03

export function ServicesSection() {
  const ready = useSmoothReady()
  const sectionRef = useRef<HTMLElement>(null)

  // Desktop: each card holds near the top while the next one slides over it.
  useGSAP(
      () => {
        if (!ready) return

        const mm = gsap.matchMedia()
        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
          const cards = gsap.utils.toArray<HTMLElement>(".service-card")
          const last = cards[cards.length - 1]
          const lastTop = STACK_TOP + (cards.length - 1) * STACK_STEP

          cards.forEach((card, index) => {
            if (card === last) return
            ScrollTrigger.create({
              trigger: card,
              start: `top ${STACK_TOP + index * STACK_STEP}px`,
              endTrigger: last,
              end: `top ${lastTop}px`,
              pin: true,
              pinSpacing: false,
            })

            // Recede while the later cards arrive: shrunk from the top edge, so every card keeps
            // the same visible step above the next, and smaller the deeper it ends up in the stack.
            gsap.to(card.querySelector(".service-card-body"), {
              scale: 1 - (cards.length - 1 - index) * STACK_SCALE_STEP,
              transformOrigin: "50% 0%",
              ease: "none",
              scrollTrigger: {
                trigger: cards[index + 1],
                start: "top bottom",
                endTrigger: last,
                end: `top ${lastTop}px`,
                scrub: true,
              },
            })

            // Darken as the next card covers this one.
            gsap.to(card.querySelector(".service-card-shade"), {
              opacity: 0.55,
              ease: "none",
              scrollTrigger: {
                trigger: cards[index + 1],
                start: "top bottom",
                end: `top ${STACK_TOP + (index + 1) * STACK_STEP}px`,
                scrub: true,
              },
            })
          })
        })

        return () => mm.revert()
      },
      { dependencies: [ready], scope: sectionRef },
  )

  return (
      <section ref={sectionRef} id="services" className="relative py-24 md:py-32">
        <div className="container relative z-20 mx-auto px-4">
          <SectionHeading
              title={
                <>
                  Our <span className="text-gradient-green">Services</span>
                </>
              }
              description="We don’t just build software. We build the future of your business."
          />

          <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:gap-10">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                  // Pinned wrapper > revealed wrapper > scaled card, so the three motions never fight.
                  <div key={service.title} className="service-card">
                    <div data-reveal>
                    <article className="service-card-body glass-strong relative overflow-hidden rounded-[2rem] lg:min-h-[440px]">
                      <div
                          aria-hidden="true"
                          className={cn(
                              "pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br opacity-[0.14] blur-3xl",
                              service.color,
                          )}
                      />
                      <Icon
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-16 -left-10 h-72 w-72 text-white/[0.03]"
                          strokeWidth={1}
                      />

                      <div className="relative grid gap-10 p-7 md:p-12 lg:grid-cols-12 lg:gap-12">
                        <div className="flex flex-col lg:col-span-7">
                          <div className="flex items-center gap-4 font-mono text-sm">
                            <span className="text-green-400">{String(index + 1).padStart(2, "0")}</span>
                            <span className="h-px w-10 bg-white/20" />
                            <span className="text-gray-400">{String(services.length).padStart(2, "0")}</span>
                          </div>

                          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/30 bg-green-500/10 shadow-[0_0_40px_-12px_rgba(74,222,128,0.5)]">
                            <Icon className="h-7 w-7 text-green-300" />
                          </div>

                          <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                            {service.title}
                          </h3>
                          <p className="mt-4 max-w-md text-lg leading-relaxed text-gray-300">
                            {service.description}
                          </p>

                          <Link href="/#contact" className="btn-glass btn-sm group mt-6 self-start lg:mt-6">
                            Discuss your project
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </Link>
                        </div>

                        <div className="lg:col-span-5 lg:pt-1">
                          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
                            What&apos;s included
                          </p>
                          <ul className="mt-4 border-t border-white/[0.08]">
                            {service.features.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-center gap-4 border-b border-white/[0.08] py-4 text-gray-200"
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10">
                                    <Check className="h-3.5 w-3.5 text-green-300" />
                                  </span>
                                  {feature}
                                </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div
                          aria-hidden="true"
                          className="service-card-shade pointer-events-none absolute inset-0 rounded-[2rem] bg-black opacity-0"
                      />
                    </article>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
      </section>
  )
}
