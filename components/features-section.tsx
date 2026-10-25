"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { Code, Gauge, IterationCw, Lock, Rocket, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { gsap, playWhileVisible, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { SectionHeading } from "@/components/section-heading"
import { cn } from "@/lib/utils"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  details: string[]
  /** Bento placement */
  className: string
  visual?: "code" | "performance" | "pipeline" | "team"
}

const features: Feature[] = [
  {
    icon: Code,
    title: "Cutting-Edge Tech",
    description: "Tailored solutions built with cutting-edge technologies that perfectly fit your business needs.",
    details: ["React, Next.js, & etc", "Java, Node.js, Python & etc", "Cloud Architecture", "API Development"],
    className: "md:col-span-2 lg:row-span-2",
    visual: "code",
  },
  {
    icon: Gauge,
    title: "High Performance",
    description: "Optimized performance for exceptional user experiences with blazing-fast load times.",
    details: ["Performance Optimization", "CDN Integration", "Caching Strategies", "Speed Monitoring"],
    className: "lg:col-span-2",
    visual: "performance",
  },
  {
    icon: IterationCw,
    title: "Agile & Adaptive",
    description: "Flexible development approach that adapts to changing requirements and market conditions.",
    details: ["Agile Methodology", "Adaptive Planning", "Quick Pivots", "Continuous Improvement"],
    className: "",
  },
  {
    icon: Lock,
    title: "Quality & Security",
    description: "Rigorous quality assurance processes combined with robust security measures for reliable and safe applications.",
    details: ["Quality Assurance", "Security Testing", "Code Reviews", "Vulnerability Scanning"],
    className: "",
  },
  {
    icon: Rocket,
    title: "Rapid Deployment",
    description: "From concept to production in record time with our streamlined development process.",
    details: ["CI/CD Pipelines", "Automated Testing", "Quick Iterations", "Fast Time-to-Market"],
    className: "lg:col-span-2",
    visual: "pipeline",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Dedicated team of senior developers and designers committed to your success.",
    details: ["Senior Developers", "UI/UX Designers", "DevOps Engineers", "24/7 Support"],
    className: "md:col-span-2",
    visual: "team",
  },
]

interface CodeToken {
  text: string
  className?: string
}

/** The snippet typed out in the "Cutting-Edge Tech" card, as syntax-coloured tokens per line. */
const codeLines: { indent: number; tokens: CodeToken[] }[] = [
  { indent: 0, tokens: [{ text: "const", className: "text-emerald-400" }, { text: " " }, { text: "stack", className: "text-white" }, { text: " = {" }] },
  { indent: 1, tokens: [{ text: "frontend: [" }, { text: '"React"', className: "text-green-300" }, { text: ", " }, { text: '"Next.js"', className: "text-green-300" }, { text: "]," }] },
  { indent: 1, tokens: [{ text: "backend: [" }, { text: '"Java"', className: "text-green-300" }, { text: ", " }, { text: '"Node.js"', className: "text-green-300" }, { text: ", " }, { text: '"Python"', className: "text-green-300" }, { text: "]," }] },
  { indent: 1, tokens: [{ text: "cloud: " }, { text: '"AWS · Azure · GCP"', className: "text-green-300" }, { text: "," }] },
  { indent: 1, tokens: [{ text: "apis: " }, { text: "true", className: "text-emerald-400" }, { text: "," }] },
  { indent: 0, tokens: [{ text: "}" }] },
  { indent: 0, tokens: [{ text: "await", className: "text-emerald-400" }, { text: " " }, { text: "ship", className: "text-white" }, { text: "(stack) " }, { text: "// ✓ production", className: "text-gray-400" }] },
]

const lineLengths = codeLines.map((line) => line.tokens.reduce((sum, token) => sum + token.text.length, 0))
/** Character offset at which each line starts. */
const lineStarts = lineLengths.map((_, index) => lineLengths.slice(0, index).reduce((sum, length) => sum + length, 0))
const CODE_LENGTH = lineLengths.reduce((sum, length) => sum + length, 0)
const CODE_TEXT = codeLines
    .map((line) => "  ".repeat(line.indent) + line.tokens.map((token) => token.text).join(""))
    .join("\n")

/** Typing rhythm, in ms. */
const TYPE_DELAY = 32
const TYPE_JITTER = 45
const LINE_PAUSE = 260
const HOLD_DELAY = 2600
const DELETE_DELAY = 12
const RESTART_DELAY = 600

/** One line with its first `count` characters typed; the rest stays invisible so the layout never shifts. */
function CodeLine({ tokens, count, caret }: { tokens: CodeToken[]; count: number; caret: ReactNode }) {
  const typed: ReactNode[] = []
  const rest: ReactNode[] = []
  let remaining = count

  tokens.forEach((token, index) => {
    const shown = token.text.slice(0, Math.max(remaining, 0))
    const hidden = token.text.slice(shown.length)
    remaining -= token.text.length
    if (shown) typed.push(<span key={index} className={token.className}>{shown}</span>)
    if (hidden) rest.push(<span key={index}>{hidden}</span>)
  })

  return (
      <>
        {typed}
        {caret}
        <span className="invisible">{rest}</span>
      </>
  )
}

/** Types the snippet, holds it, erases it and starts again, for as long as it is on screen. */
function TypingCode() {
  const ref = useRef<HTMLDivElement>(null)
  const loop = useRef({ count: 0, deleting: false })
  const [typed, setTyped] = useState(0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(CODE_LENGTH)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return

    const state = loop.current
    let timer = 0

    const tick = () => {
      let delay: number
      if (!state.deleting) {
        state.count += 1
        if (state.count >= CODE_LENGTH) {
          state.deleting = true
          delay = HOLD_DELAY
        } else {
          delay = lineStarts.includes(state.count) ? LINE_PAUSE : TYPE_DELAY + Math.random() * TYPE_JITTER
        }
      } else {
        state.count -= 1
        if (state.count <= 0) {
          state.deleting = false
          delay = RESTART_DELAY
        } else {
          delay = DELETE_DELAY
        }
      }

      setTyped(state.count)
      timer = window.setTimeout(tick, delay)
    }

    timer = window.setTimeout(tick, state.count === CODE_LENGTH ? HOLD_DELAY : RESTART_DELAY)
    return () => window.clearTimeout(timer)
  }, [inView])

  // The caret blinks while idle and stays solid while typing or erasing.
  const idle = typed === 0 || typed === CODE_LENGTH
  const caret = (
      <span className="inline-block w-0">
        <span className={cn("caret", !idle && "is-typing")} />
      </span>
  )

  return (
      <div ref={ref}>
        <pre className="sr-only">{CODE_TEXT}</pre>
        <div aria-hidden="true">
          {codeLines.map((line, index) => {
            const start = lineStarts[index]
            const isLast = index === codeLines.length - 1
            const hasCaret = typed >= start && (typed < start + lineLengths[index] || isLast)
            return (
                <div
                    key={index}
                    className="min-h-6 whitespace-pre-wrap md:min-h-7"
                    style={{ paddingLeft: `${line.indent * 1.25}rem` }}
                >
                  <CodeLine tokens={line.tokens} count={typed - start} caret={hasCaret ? caret : null} />
                </div>
            )
          })}
        </div>
      </div>
  )
}

const meterHeights = [38, 52, 44, 68, 60, 76, 70, 88, 82, 94, 90, 100]

const pipeline = ["Commit", "Build", "Test", "Deploy"]

const teamAvatars = ["/yohan-athukorala.png", "/kumud-perera.png", "/Salomi-Franciscus.jpeg"]

function FeatureVisual({ visual, details }: { visual: Feature["visual"]; details: string[] }) {
  if (visual === "code") {
    return (
      <div className="mt-8 flex h-full flex-col rounded-2xl border border-white/[0.08] bg-black/40 p-4 font-mono text-xs leading-6 text-gray-300 md:p-5 md:text-sm md:leading-7">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <TypingCode />
        <div className="mt-auto flex flex-wrap gap-2 pt-5 font-sans">
          {details.map((detail) => (
            <span
              key={detail}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-gray-300"
            >
              {detail}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (visual === "performance") {
    return (
      <div className="feature-meter mt-6 flex h-20 items-end gap-1.5" aria-hidden="true">
        {meterHeights.map((height, index) => (
          <span
            key={index}
            className="feature-meter-bar w-full origin-bottom rounded-t-md bg-gradient-to-t from-green-600/40 to-green-300/90"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    )
  }

  if (visual === "pipeline") {
    return (
      <div className="relative mt-6" aria-hidden="true">
        <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-green-500/10 via-green-400/60 to-green-500/10" />
        <span className="feature-pipeline-dot absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-green-300 shadow-[0_0_14px_4px_rgba(74,222,128,0.8)]" />
        <div className="relative flex justify-between gap-2">
          {pipeline.map((step) => (
            <span
              key={step}
              className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-gray-200 backdrop-blur"
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (visual === "team") {
    return (
      <div className="mt-6 flex items-center gap-4" aria-hidden="true">
        <div className="flex -space-x-3">
          {teamAvatars.map((src) => (
            <span
              key={src}
              className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-black ring-1 ring-green-400/40"
            >
              <Image src={src} alt="" fill sizes="44px" className="object-cover" />
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-300">Senior engineers, designers and DevOps — one team.</span>
      </div>
    )
  }

  return null
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
      () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        gsap.from(".feature-meter-bar", {
          scaleY: 0.1,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".feature-meter", start: "top 85%", once: true },
        })

        // Moved with a transform (not `left`), so it never triggers layout; the distance is
        // re-measured whenever ScrollTrigger refreshes after a resize.
        const dot = sectionRef.current!.querySelector<HTMLElement>(".feature-pipeline-dot")
        if (dot) {
          const pipelineRun = gsap.fromTo(
              dot,
              { x: 0 },
              {
                x: () => dot.parentElement!.offsetWidth - 40,
                duration: 2.6,
                ease: "power1.inOut",
                repeat: -1,
                repeatDelay: 0.4,
              },
          )
          const remeasure = () => pipelineRun.invalidate()
          ScrollTrigger.addEventListener("refreshInit", remeasure)
          playWhileVisible(pipelineRun, dot)
          return () => ScrollTrigger.removeEventListener("refreshInit", remeasure)
        }
      },
      { scope: sectionRef },
  )

  return (
      <section ref={sectionRef} id="features" className="relative py-24 md:py-32">
        <div className="container relative z-20 mx-auto px-4">
          <SectionHeading
              title={
                <>
                  Why Choose <span className="text-gradient-green">Veloce</span>
                </>
              }
              description="We're not just developers - we're your technology partners committed to delivering excellence."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                  <article
                      key={feature.title}
                      data-reveal
                      className={cn(
                          "glass spotlight group flex flex-col rounded-3xl p-6 md:p-8",
                          feature.className,
                      )}
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-green-400/25 bg-green-500/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-green-500/20 group-hover:shadow-[0_0_30px_-4px_rgba(74,222,128,0.6)]">
                      <Icon className="h-6 w-6 text-green-400" />
                    </div>

                    <h3 className="mb-3 text-xl font-semibold text-white transition-colors group-hover:text-green-300 md:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 transition-colors group-hover:text-gray-200">
                      {feature.description}
                    </p>

                    {feature.visual === "code" ? (
                        <div className="flex flex-1 flex-col">
                          <FeatureVisual visual={feature.visual} details={feature.details} />
                        </div>
                    ) : feature.visual ? (
                        <div className="mt-auto">
                          <FeatureVisual visual={feature.visual} details={feature.details} />
                        </div>
                    ) : (
                        <ul className="mt-6 space-y-2">
                          {feature.details.map((detail) => (
                              <li key={detail} className="flex items-center text-sm text-gray-300">
                                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-400 transition-transform group-hover:scale-150" />
                                {detail}
                              </li>
                          ))}
                        </ul>
                    )}

                    {feature.visual && feature.visual !== "code" && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {feature.details.map((detail) => (
                              <span
                                  key={detail}
                                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-gray-300"
                              >
                                {detail}
                              </span>
                          ))}
                        </div>
                    )}
                  </article>
              )
            })}
          </div>
        </div>
      </section>
  )
}
